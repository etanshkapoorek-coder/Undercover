/**
 * UNDERCOVER — server.js
 * Authoritative Node/Express/Socket.io backend.
 * All game state lives here (in-memory); clients are just a view.
 * This removes the race conditions / polling lag of a client-driven,
 * shared-storage approach — every mutation happens in one place.
 */

const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // tighten this to your real domain once deployed, see README
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (req, res) => res.status(200).send('ok'));

const PORT = process.env.PORT || 3000;

/* ============================================================
   Category / word-pair data (lives in categories.js)
   ============================================================ */
const CATEGORIES = require('./categories');

/* Game limits */
const MAX_PLAYERS = 9;
const MAX_IMPOSTERS = 3;
/** At least 2 "majority" players must remain, and never more than MAX_IMPOSTERS imposters. */
function maxImpostersFor(playerCount) {
  return Math.max(1, Math.min(MAX_IMPOSTERS, playerCount - 2));
}

/* ============================================================
   In-memory room store
   ============================================================ */
const rooms = new Map(); // code -> room object
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1
const DISCONNECT_GRACE_MS = 3 * 60 * 1000; // 3 min to reconnect before being dropped
const ROOM_IDLE_CLEANUP_MS = 6 * 60 * 60 * 1000; // sweep rooms idle 6h+

function genCode() {
  let code;
  do {
    code = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  } while (rooms.has(code));
  return code;
}
function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function newRoom(code, hostId, hostName, categories) {
  return {
    code,
    hostId,
    players: [{ id: hostId, name: hostName, score: 0, connected: true, disconnectAt: null }],
    status: 'lobby', // lobby | clue | voting | reveal
    settings: { imposterCount: 1, maxRounds: 2, categories: categories && categories.length ? categories : Object.keys(CATEGORIES) },
    round: null,
    votes: {},
    lastResult: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** Strip internal-only fields (socketId isn't stored on player anyway) before sending to clients. */
function publicRoom(room) {
  return room; // nothing sensitive server-side currently beyond what players should see
}

function broadcast(code) {
  const room = rooms.get(code);
  if (!room) return;
  room.updatedAt = Date.now();
  io.to(code).emit('room-update', publicRoom(room));
}

function findPlayer(room, playerId) {
  return room.players.find(p => p.id === playerId);
}

function removePlayerCompletely(room, playerId) {
  room.players = room.players.filter(p => p.id !== playerId);
  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
  }
  if (room.round) {
    const idx = room.round.turnOrder.indexOf(playerId);
    if (idx !== -1) {
      room.round.turnOrder.splice(idx, 1);
      if (room.round.currentTurnIndex >= room.round.turnOrder.length) {
        room.round.currentTurnIndex = 0;
      }
    }
  }
  if (room.votes && room.votes[playerId] !== undefined) delete room.votes[playerId];
  if (room.settings) {
    room.settings.imposterCount = Math.min(room.settings.imposterCount, maxImpostersFor(room.players.length));
  }
}

/** Recompute whether all remaining (connected-or-not, they already voted) players have voted. */
function maybeFinishVoting(room) {
  if (room.status !== 'voting') return;
  if (room.players.length > 0 && Object.keys(room.votes).length >= room.players.length) {
    computeReveal(room);
    room.status = 'reveal';
  }
}

function computeReveal(room) {
  const tally = {};
  Object.values(room.votes).forEach(t => { tally[t] = (tally[t] || 0) + 1; });
  let topId = null, topCount = -1, tie = false;
  Object.entries(tally).forEach(([id, c]) => {
    if (c > topCount) { topCount = c; topId = id; tie = false; }
    else if (c === topCount) { tie = true; }
  });
  const imposterCaught = !tie && topId && room.round.imposterIds.includes(topId);
  room.players.forEach(p => {
    const isImposter = room.round.imposterIds.includes(p.id);
    if (imposterCaught) {
      if (!isImposter && room.votes[p.id] && room.round.imposterIds.includes(room.votes[p.id])) {
        p.score = (p.score || 0) + 1;
      }
    } else {
      if (isImposter) p.score = (p.score || 0) + 2;
    }
  });
  room.lastResult = { tally, topId, tie, imposterCaught };
}

/**
 * Deal a brand-new round: new category/word pair, new imposters, new turn order.
 * Used by both "Start the Case" (from the lobby) and the host's "Skip to next round"
 * (mid-game, which abandons the current round without voting or scoring).
 * Returns an error message string if it can't start, otherwise null.
 */
function beginNewRound(room) {
  if (room.players.length < 3) return 'Need at least 3 players to start.';
  const catKeys = room.settings.categories.filter(k => CATEGORIES[k]);
  if (catKeys.length === 0) return 'Pick at least one category.';

  const catId = pick(catKeys);
  const pair = pick(CATEGORIES[catId].pairs);
  const flip = Math.random() < 0.5;
  const majorityWord = flip ? pair[0] : pair[1];
  const imposterWord = flip ? pair[1] : pair[0];
  const impCount = Math.max(1, Math.min(maxImpostersFor(room.players.length), room.settings.imposterCount));
  const imposterIds = shuffle(room.players.map(p => p.id)).slice(0, impCount);
  const turnOrder = shuffle(room.players.map(p => p.id));

  room.round = {
    categoryName: CATEGORIES[catId].name,
    majorityWord, imposterWord, imposterIds,
    turnOrder, currentTurnIndex: 0, currentRoundNumber: 1,
    maxRounds: room.settings.maxRounds,
    hints: [],
  };
  room.votes = {};
  room.lastResult = null;
  room.status = 'clue';
  return null;
}

/* ============================================================
   Periodic cleanup
   ============================================================ */
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    // drop players who've been disconnected past the grace period
    let changed = false;
    room.players.forEach(p => {
      if (!p.connected && p.disconnectAt && now - p.disconnectAt > DISCONNECT_GRACE_MS) {
        removePlayerCompletely(room, p.id);
        changed = true;
      }
    });
    if (room.players.length === 0 || now - room.updatedAt > ROOM_IDLE_CLEANUP_MS) {
      rooms.delete(code);
      continue;
    }
    if (changed) broadcast(code);
  }
}, 30 * 1000);

/* ============================================================
   Socket handlers
   ============================================================ */
io.on('connection', (socket) => {
  let joinedCode = null;
  let myPlayerId = null;

  function fail(msg) { socket.emit('error-msg', msg); }

  socket.on('create-room', ({ name, categories }, ack) => {
    name = (name || '').trim().slice(0, 24);
    if (!name) return ack && ack({ ok: false, error: 'Enter a name.' });
    const validCats = (categories || []).filter(c => CATEGORIES[c]);
    const code = genCode();
    const hostId = genId();
    const room = newRoom(code, hostId, name, validCats);
    rooms.set(code, room);

    joinedCode = code;
    myPlayerId = hostId;
    socket.join(code);
    ack && ack({ ok: true, code, playerId: hostId });
    broadcast(code);
  });

  socket.on('join-room', ({ code, name }, ack) => {
    code = (code || '').trim().toUpperCase();
    name = (name || '').trim().slice(0, 24);
    const room = rooms.get(code);
    if (!room) return ack && ack({ ok: false, error: "No case found with that code." });
    if (!name) return ack && ack({ ok: false, error: 'Enter a name.' });
    if (room.players.length >= MAX_PLAYERS) return ack && ack({ ok: false, error: `This room is full (${MAX_PLAYERS}/${MAX_PLAYERS}).` });
    if (room.status !== 'lobby') return ack && ack({ ok: false, error: 'This case is already underway.' });

    const playerId = genId();
    room.players.push({ id: playerId, name, score: 0, connected: true, disconnectAt: null });

    joinedCode = code;
    myPlayerId = playerId;
    socket.join(code);
    ack && ack({ ok: true, code, playerId });
    broadcast(code);
  });

  socket.on('rejoin-room', ({ code, playerId }, ack) => {
    code = (code || '').trim().toUpperCase();
    const room = rooms.get(code);
    if (!room) return ack && ack({ ok: false, error: 'That case no longer exists.' });
    const player = findPlayer(room, playerId);
    if (!player) return ack && ack({ ok: false, error: 'You are not part of that case anymore.' });
    player.connected = true;
    player.disconnectAt = null;
    joinedCode = code;
    myPlayerId = playerId;
    socket.join(code);
    ack && ack({ ok: true, code, playerId, room: publicRoom(room) });
    broadcast(code);
  });

  socket.on('leave-room', () => {
    if (joinedCode && myPlayerId) {
      const room = rooms.get(joinedCode);
      if (room) {
        removePlayerCompletely(room, myPlayerId);
        if (room.players.length === 0) rooms.delete(joinedCode);
        else broadcast(joinedCode);
      }
      socket.leave(joinedCode);
    }
    joinedCode = null;
    myPlayerId = null;
  });

  socket.on('disconnect', () => {
    if (joinedCode && myPlayerId) {
      const room = rooms.get(joinedCode);
      if (room) {
        const player = findPlayer(room, myPlayerId);
        if (player) {
          player.connected = false;
          player.disconnectAt = Date.now();
          broadcast(joinedCode);
        }
      }
    }
  });

  function requireRoom() {
    if (!joinedCode) return null;
    return rooms.get(joinedCode) || null;
  }
  function requireHost(room) {
    return room && room.hostId === myPlayerId;
  }

  socket.on('toggle-category', ({ category }) => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'lobby') return;
    if (!CATEGORIES[category]) return;
    const set = new Set(room.settings.categories);
    if (set.has(category)) set.delete(category); else set.add(category);
    room.settings.categories = [...set];
    broadcast(joinedCode);
  });

  socket.on('set-imposter-count', ({ delta }) => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'lobby') return;
    const maxAllowed = maxImpostersFor(room.players.length);
    room.settings.imposterCount = Math.max(1, Math.min(maxAllowed, room.settings.imposterCount + delta));
    broadcast(joinedCode);
  });

  socket.on('set-max-rounds', ({ delta }) => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'lobby') return;
    room.settings.maxRounds = Math.max(1, Math.min(4, room.settings.maxRounds + delta));
    broadcast(joinedCode);
  });

  socket.on('start-game', () => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'lobby') return;
    const err = beginNewRound(room);
    if (err) return fail(err);
    broadcast(joinedCode);
  });

  socket.on('submit-hint', ({ text }) => {
    const room = requireRoom();
    if (!room || room.status !== 'clue' || !room.round) return;
    text = (text || '').trim().slice(0, 80);
    if (!text) return;
    const rd = room.round;
    const curPid = rd.turnOrder[rd.currentTurnIndex];
    if (curPid !== myPlayerId) return; // not your turn — ignore silently
    rd.hints.push({ playerId: myPlayerId, text, round: rd.currentRoundNumber });
    rd.currentTurnIndex++;
    if (rd.currentTurnIndex >= rd.turnOrder.length) {
      rd.currentTurnIndex = 0;
      rd.currentRoundNumber++;
      if (rd.currentRoundNumber > rd.maxRounds) {
        room.status = 'voting';
      }
    }
    broadcast(joinedCode);
  });

  socket.on('skip-to-voting', () => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'clue') return;
    room.status = 'voting';
    broadcast(joinedCode);
  });

  // Host abandons the current round (no voting, no points) and immediately deals a fresh one.
  socket.on('skip-to-next-round', () => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'clue' || !room.round) return;
    const err = beginNewRound(room);
    if (err) return fail(err);
    broadcast(joinedCode);
  });

  socket.on('submit-vote', ({ targetId }) => {
    const room = requireRoom();
    if (!room || room.status !== 'voting') return;
    if (!findPlayer(room, targetId)) return;
    room.votes[myPlayerId] = targetId;
    maybeFinishVoting(room);
    broadcast(joinedCode);
  });

  socket.on('play-again', () => {
    const room = requireRoom();
    if (!room || !requireHost(room) || room.status !== 'reveal') return;
    room.status = 'lobby';
    room.round = null;
    room.votes = {};
    broadcast(joinedCode);
  });
});

server.listen(PORT, () => {
  console.log(`UNDERCOVER server listening on port ${PORT}`);
});
