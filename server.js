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
   Category / word-pair data
   ============================================================ */
const CATEGORIES = {
  football: { name: 'Football (Soccer) Legends', pairs: [
    ['Lionel Messi', 'Neymar Jr.'],
    ['Cristiano Ronaldo', 'Robert Lewandowski'],
    ['Kylian Mbappé', 'Erling Haaland'],
    ['Xavi Hernández', 'Andrés Iniesta'],
    ['Ronaldinho', 'Robinho'],
    ['Pelé', 'Garrincha'],
    ['Diego Maradona', 'Lionel Messi'],
    ['Thierry Henry', 'Dennis Bergkamp'],
    ['Zinedine Zidane', 'Andrea Pirlo'],
    ['David Beckham', 'Steven Gerrard'],
    ['Sergio Ramos', 'Gerard Piqué'],
  ]},
  bollywood: { name: 'Bollywood Actors', pairs: [
    ['Shah Rukh Khan', 'Aamir Khan'],
    ['Salman Khan', 'Akshay Kumar'],
    ['Ranbir Kapoor', 'Ranveer Singh'],
    ['Amitabh Bachchan', 'Dharmendra'],
    ['Priyanka Chopra', 'Deepika Padukone'],
    ['Kareena Kapoor', 'Katrina Kaif'],
    ['Hrithik Roshan', 'Tiger Shroff'],
    ['Alia Bhatt', 'Kiara Advani'],
    ['Vicky Kaushal', 'Ayushmann Khurrana'],
  ]},
  indian_politics: { name: 'Indian Politicians', pairs: [
    ['Jawaharlal Nehru', 'Lal Bahadur Shastri'],
    ['Indira Gandhi', 'Sonia Gandhi'],
    ['Atal Bihari Vajpayee', 'L. K. Advani'],
    ['Narendra Modi', 'Amit Shah'],
    ['Rahul Gandhi', 'Priyanka Gandhi Vadra'],
    ['Mamata Banerjee', 'Jayalalithaa'],
    ['Arvind Kejriwal', 'Manish Sisodia'],
    ['Manmohan Singh', 'P. V. Narasimha Rao'],
  ]},
  hollywood: { name: 'Hollywood Actors', pairs: [
    ['Leonardo DiCaprio', 'Brad Pitt'],
    ['Tom Cruise', 'Tom Hanks'],
    ['Robert Downey Jr.', 'Chris Evans'],
    ['Dwayne Johnson', 'Jason Statham'],
    ['Will Smith', 'Denzel Washington'],
    ['Scarlett Johansson', 'Jennifer Lawrence'],
    ['Johnny Depp', 'Christian Bale'],
    ['Ryan Reynolds', 'Ryan Gosling'],
    ['Margot Robbie', 'Emma Stone'],
  ]},
  influential: { name: 'Influential Figures', pairs: [
    ['Elon Musk', 'Jeff Bezos'],
    ['Bill Gates', 'Steve Jobs'],
    ['Mahatma Gandhi', 'Nelson Mandela'],
    ['Martin Luther King Jr.', 'Malcolm X'],
    ['Marie Curie', 'Albert Einstein'],
    ['Oprah Winfrey', 'Ellen DeGeneres'],
    ['Barack Obama', 'Bill Clinton'],
    ['Warren Buffett', 'Charlie Munger'],
  ]},
  music: { name: 'Music Icons', pairs: [
    ['Michael Jackson', 'Prince'],
    ['Beyoncé', 'Rihanna'],
    ['Ariana Grande', 'Selena Gomez'],
    ['Taylor Swift', 'Katy Perry'],
    ['Drake', 'Kanye West'],
    ['Ed Sheeran', 'Shawn Mendes'],
    ['Adele', 'Sam Smith'],
    ['Freddie Mercury', 'Robert Plant'],
  ]},
  heroes: { name: 'Superheroes', pairs: [
    ['Iron Man', 'Batman'],
    ['Spider-Man', 'Miles Morales'],
    ['Superman', 'Captain Marvel'],
    ['Wolverine', 'Deadpool'],
    ['Thor', 'Hercules'],
    ['The Flash', 'Quicksilver'],
    ['Black Widow', 'Hawkeye'],
  ]},
  food: { name: 'World Foods', pairs: [
    ['Pizza', 'Calzone'],
    ['Sushi', 'Sashimi'],
    ['Burger', 'Sandwich'],
    ['Tacos', 'Burritos'],
    ['Ramen', 'Udon'],
    ['Croissant', 'Danish Pastry'],
    ['Pasta', 'Rice Noodles'],
    ['Samosa', 'Empanada'],
  ]},
  animals: { name: 'Wild Animals', pairs: [
    ['Lion', 'Tiger'],
    ['Alligator', 'Crocodile'],
    ['Dolphin', 'Porpoise'],
    ['Cheetah', 'Leopard'],
    ['Frog', 'Toad'],
    ['Wolf', 'Fox'],
    ['Butterfly', 'Moth'],
    ['Camel', 'Llama'],
  ]},
  history: { name: 'Historical Figures', pairs: [
    ['Napoleon Bonaparte', 'Julius Caesar'],
    ['Cleopatra', 'Nefertiti'],
    ['Abraham Lincoln', 'George Washington'],
    ['Leonardo da Vinci', 'Michelangelo'],
    ['Genghis Khan', 'Alexander the Great'],
    ['Winston Churchill', 'Franklin D. Roosevelt'],
  ]},
};

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
    if (room.players.length >= 6) return ack && ack({ ok: false, error: 'This room is full (6/6).' });
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
    const maxAllowed = Math.max(1, room.players.length - 2);
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
    if (room.players.length < 3) return fail('Need at least 3 players to start.');
    const catKeys = room.settings.categories.filter(k => CATEGORIES[k]);
    if (catKeys.length === 0) return fail('Pick at least one category.');

    const catId = pick(catKeys);
    const pair = pick(CATEGORIES[catId].pairs);
    const flip = Math.random() < 0.5;
    const majorityWord = flip ? pair[0] : pair[1];
    const imposterWord = flip ? pair[1] : pair[0];
    const impCount = Math.max(1, Math.min(room.players.length - 2, room.settings.imposterCount));
    const shuffledIds = shuffle(room.players.map(p => p.id));
    const imposterIds = shuffledIds.slice(0, impCount);
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
