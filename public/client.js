/* =========================================================
   UNDERCOVER — client.js
   Thin view layer over the authoritative server. The server owns
   all game state; this file only renders it and forwards intents.
   ========================================================= */

// Category id -> display name (word pairs themselves stay server-side/secret)
const CATEGORY_LIST = [
  ['football', 'Football (Soccer) Legends'],
  ['bollywood', 'Bollywood Actors'],
  ['indian_politics', 'Indian Politicians'],
  ['hollywood', 'Hollywood Actors'],
  ['influential', 'Influential Figures'],
  ['music', 'Music Icons'],
  ['heroes', 'Superheroes'],
  ['food', 'World Foods'],
  ['animals', 'Wild Animals'],
  ['history', 'Historical Figures'],
];
const ALL_CAT_KEYS = CATEGORY_LIST.map(c => c[0]);

const MAX_PLAYERS = 9;
const MAX_IMPOSTERS = 3;

const SESSION_KEY = 'undercover_session';
function saveSession(data){ try{ localStorage.setItem(SESSION_KEY, JSON.stringify(data)); }catch(e){} }
function loadSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; } }
function clearSession(){ try{ localStorage.removeItem(SESSION_KEY); }catch(e){} }

function esc(s){ const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

let socket = null;
let connected = false;

let state = {
  screen: 'landing',      // landing | create | join | lobby | clue | voting | reveal
  code: null,
  myId: null,
  room: null,
  error: null,
  howOpen: false,
  hintDraft: '',
  createCats: [...ALL_CAT_KEYS],
  joinCodeDraft: '',
  joinNameDraft: '',
  createNameDraft: '',
  busy: false,
  reconnecting: false,
};

function setState(patch){ state = { ...state, ...patch }; render(); }

function screenForStatus(status){
  if (status === 'lobby') return 'lobby';
  if (status === 'clue') return 'clue';
  if (status === 'voting') return 'voting';
  if (status === 'reveal') return 'reveal';
  return 'lobby';
}

/* ---------------- socket setup ---------------- */
function initSocket(){
  socket = io({ reconnection: true, reconnectionDelay: 800, reconnectionDelayMax: 4000 });

  socket.on('connect', () => {
    connected = true;
    render();
    // attempt auto-rejoin if we have a stored session and aren't already in a room in memory
    const sess = loadSession();
    if (sess && sess.code && sess.playerId && !state.room) {
      setState({ reconnecting: true });
      socket.emit('rejoin-room', { code: sess.code, playerId: sess.playerId }, (res) => {
        if (res && res.ok) {
          state.code = res.code;
          state.myId = res.playerId;
          state.room = res.room;
          state.screen = screenForStatus(res.room.status);
          state.reconnecting = false;
          render();
        } else {
          clearSession();
          setState({ reconnecting: false });
        }
      });
    }
  });

  socket.on('disconnect', () => { connected = false; render(); });

  socket.on('room-update', (room) => {
    if (state.code && room.code === state.code) {
      setState({ room, screen: screenForStatus(room.status) });
    }
  });

  socket.on('error-msg', (msg) => { setState({ error: msg }); });
}

/* ---------------- actions ---------------- */
function goCreate(){ setState({ screen: 'create', error: null }); }
function goJoin(){ setState({ screen: 'join', error: null }); }
function goLanding(){ setState({ screen: 'landing', error: null }); }

function doCreateRoom(){
  const name = state.createNameDraft.trim();
  if (!name) return setState({ error: 'Enter a name so the others know who you are.' });
  if (state.createCats.length === 0) return setState({ error: 'Pick at least one category.' });
  setState({ busy: true, error: null });
  socket.emit('create-room', { name, categories: state.createCats }, (res) => {
    setState({ busy: false });
    if (!res || !res.ok) return setState({ error: (res && res.error) || 'Could not create the room.' });
    state.code = res.code;
    state.myId = res.playerId;
    saveSession({ code: res.code, playerId: res.playerId });
    setState({ screen: 'lobby' });
  });
}

function doJoinRoom(){
  const code = state.joinCodeDraft.trim().toUpperCase();
  const name = state.joinNameDraft.trim();
  if (!code || code.length < 4) return setState({ error: 'Enter the 5-character case code.' });
  if (!name) return setState({ error: 'Enter a name so the others know who you are.' });
  setState({ busy: true, error: null });
  socket.emit('join-room', { code, name }, (res) => {
    setState({ busy: false });
    if (!res || !res.ok) return setState({ error: (res && res.error) || 'Could not join that room.' });
    state.code = res.code;
    state.myId = res.playerId;
    saveSession({ code: res.code, playerId: res.playerId });
    setState({ screen: 'lobby' });
  });
}

function leaveToLanding(){
  socket.emit('leave-room');
  clearSession();
  state = { ...state, screen: 'landing', code: null, room: null, myId: null, error: null };
  render();
}

function toggleCategoryLive(key){ socket.emit('toggle-category', { category: key }); }
function setImposterCount(delta){ socket.emit('set-imposter-count', { delta }); }
function setMaxRounds(delta){ socket.emit('set-max-rounds', { delta }); }
function startGame(){ socket.emit('start-game'); }
function submitHint(){
  const text = state.hintDraft.trim();
  if (!text) return;
  socket.emit('submit-hint', { text });
  setState({ hintDraft: '' });
}
function hostSkipToVoting(){ socket.emit('skip-to-voting'); }
function hostSkipToNextRound(){ socket.emit('skip-to-next-round'); }
function submitVote(targetId){ socket.emit('submit-vote', { targetId }); }
function playAgain(){ socket.emit('play-again'); }

/* ---------------- render ---------------- */
function isHost(room){ return room && room.hostId === state.myId; }

function render(){
  const app = document.getElementById('app');
  app.innerHTML = header() + body();
  bindEvents();
}

function header(){
  const connBit = `<span class="conn-label"><span class="conn-dot ${connected ? 'on' : 'off'}"></span>${connected ? 'connected' : 'reconnecting…'}</span>`;
  return `
    <div class="brand">
      <div>
        <div class="brand-title"><span class="dot"></span>UNDERCOVER</div>
        <div class="brand-tag">${state.screen === 'landing' ? 'a game of doubt' : ('case ' + (state.code || ''))}</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        ${connBit}
        ${state.code && state.screen !== 'landing' ? `<button class="link-btn" data-action="leave">Leave case</button>` : ''}
      </div>
    </div>
  `;
}

function body(){
  const errHtml = state.error ? `<div class="error-msg">${esc(state.error)}</div>` : '';
  if (state.reconnecting) return errHtml + `<div class="card center">Rejoining your case…</div>`;
  switch (state.screen){
    case 'landing': return errHtml + landingScreen();
    case 'create': return errHtml + createScreen();
    case 'join': return errHtml + joinScreen();
    case 'lobby': return errHtml + lobbyScreen();
    case 'clue': return errHtml + clueScreen();
    case 'voting': return errHtml + votingScreen();
    case 'reveal': return errHtml + revealScreen();
    default: return errHtml + landingScreen();
  }
}

function landingScreen(){
  return `
    <div class="hero">
      <div class="stamp-mark">CLASSIFIED</div>
      <h1>UNDERCOVER</h1>
      <p>Everyone gets a secret word. Almost everyone gets the <i>same</i> one. One or more players get something close — close enough that even they might not be sure it's them.</p>
    </div>
    <div class="landing-grid">
      <div class="card center">
        <div class="card-title">Start a Case</div>
        <div class="card-sub">Create a room, pick your topics, invite friends with a code.</div>
        <button class="btn btn-primary btn-block" data-action="go-create">Create Room</button>
      </div>
      <div class="card center">
        <div class="card-title">Join a Case</div>
        <div class="card-sub">Got a 5-character code from a friend? Jump in.</div>
        <button class="btn btn-dark btn-block" data-action="go-join">Join Room</button>
      </div>
    </div>
    <div class="how-toggle">
      <button class="link-btn" data-action="toggle-how">${state.howOpen ? 'Hide how it works' : 'How does this work?'}</button>
    </div>
    ${state.howOpen ? `
    <div class="how-box">
      <p><b>1. Everyone gets a word.</b> Pick a category and most players receive the same secret word.</p>
      <p><b>2. One or more players get a decoy instead.</b> It's something closely related to the real word (Messi / Neymar, Lion / Tiger). Nobody is told who has the decoy, so that player genuinely might not know for sure.</p>
      <p><b>3. Everyone gives short clues</b> about their word, in turns, over a couple of rounds.</p>
      <p><b>4. Vote.</b> The group votes on who has the odd word out. Catch the imposter and honest players score; blend in and the imposter scores instead.</p>
    </div>` : ''}
    <div class="footer-note">Play from separate phones or laptops — this runs on a real-time server, so everyone stays in sync instantly. Up to 9 players per case.</div>
  `;
}

function createScreen(){
  const cats = CATEGORY_LIST.map(([key, name]) => `
    <label class="cat-chip ${state.createCats.includes(key) ? 'on' : ''}">
      <input type="checkbox" ${state.createCats.includes(key) ? 'checked' : ''} data-cat-toggle="${key}" />
      ${esc(name)}
    </label>
  `).join('');
  return `
    <div class="card">
      <div class="card-title">Create a Room</div>
      <div class="card-sub">You'll be the host — you control when the round starts.</div>
      <div class="field">
        <label class="field-label">Your name</label>
        <input type="text" id="createName" placeholder="e.g. Alex" value="${esc(state.createNameDraft)}" maxlength="24" />
      </div>
      <div class="field">
        <label class="field-label">Categories in play</label>
        <div class="cat-grid">${cats}</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="submit-create" ${state.busy ? 'disabled' : ''}>${state.busy ? 'Creating…' : 'Create Room'}</button>
        <button class="btn btn-outline" data-action="go-landing">Back</button>
      </div>
    </div>
  `;
}

function joinScreen(){
  return `
    <div class="card">
      <div class="card-title">Join a Room</div>
      <div class="card-sub">Ask the host for their 5-character case code.</div>
      <div class="field">
        <label class="field-label">Case code</label>
        <input type="text" id="joinCode" class="code-input" placeholder="XXXXX" maxlength="6" value="${esc(state.joinCodeDraft)}" />
      </div>
      <div class="field">
        <label class="field-label">Your name</label>
        <input type="text" id="joinName" placeholder="e.g. Priya" value="${esc(state.joinNameDraft)}" maxlength="24" />
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="submit-join" ${state.busy ? 'disabled' : ''}>${state.busy ? 'Joining…' : 'Join Room'}</button>
        <button class="btn btn-outline" data-action="go-landing">Back</button>
      </div>
    </div>
  `;
}

function lobbyScreen(){
  const room = state.room;
  if (!room) return `<div class="card center">Loading room…</div>`;
  const host = isHost(room);
  const players = room.players.map(p => `
    <li><span><span class="avatar-dot"></span>${esc(p.name)}</span>
      <span>
        ${p.id === room.hostId ? '<span class="player-tag host">HOST</span>' : ''}
        ${p.id === state.myId ? '<span class="player-tag">YOU</span>' : ''}
        ${!p.connected ? '<span class="player-tag offline">OFFLINE</span>' : ''}
      </span>
    </li>
  `).join('');

  const catsHtml = CATEGORY_LIST.map(([key, name]) => {
    const on = room.settings.categories.includes(key);
    return `<label class="cat-chip ${on ? 'on' : ''}" ${host ? `data-cat-live="${key}"` : ''} style="${host ? '' : 'opacity:0.7;cursor:default;'}">
      <input type="checkbox" ${on ? 'checked' : ''} ${host ? '' : 'disabled'} />
      ${esc(name)}
    </label>`;
  }).join('');

  const maxImp = Math.max(1, Math.min(MAX_IMPOSTERS, room.players.length - 2));
  const canStart = room.players.length >= 3 && room.settings.categories.length > 0;

  return `
    <div class="room-code-box">
      <div><div class="lbl">Case Code</div><div class="code">${room.code}</div></div>
      <button class="btn btn-outline btn-small" data-action="copy-code">Copy</button>
    </div>

    <div class="card">
      <div class="card-title">Players (${room.players.length}/${MAX_PLAYERS})</div>
      <ul class="player-list">${players}</ul>
      ${room.players.length < 3 ? `<div class="waiting-note">Need at least 3 players to start.</div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">Categories</div>
      <div class="card-sub">${host ? 'Tap to include or exclude a topic.' : 'Set by the host.'}</div>
      <div class="cat-grid">${catsHtml}</div>
    </div>

    <div class="card">
      <div class="card-title">Settings</div>
      <div class="row-between" style="margin-bottom:14px;">
        <div class="card-sub" style="margin:0;">Number of imposters</div>
        ${host ? `
        <div class="stepper">
          <button data-action="imp-minus">−</button>
          <span class="val">${room.settings.imposterCount}</span>
          <button data-action="imp-plus">+</button>
        </div>` : `<span class="mono">${room.settings.imposterCount}</span>`}
      </div>
      <div class="row-between">
        <div class="card-sub" style="margin:0;">Clue rounds</div>
        ${host ? `
        <div class="stepper">
          <button data-action="rounds-minus">−</button>
          <span class="val">${room.settings.maxRounds}</span>
          <button data-action="rounds-plus">+</button>
        </div>` : `<span class="mono">${room.settings.maxRounds}</span>`}
      </div>
      <div class="small-muted" style="margin-top:10px;">Max imposters for this group: ${maxImp}</div>
    </div>

    ${host ? `
    <button class="btn btn-primary btn-block" data-action="start-game" ${(!canStart || state.busy) ? 'disabled' : ''}>Start the Case</button>
    ${!canStart ? `<div class="waiting-note center">Need 3+ players and at least one category.</div>` : ''}
    ` : `<div class="card center"><div class="card-sub" style="margin:0;">Waiting for the host to start the round…</div></div>`}
  `;
}

function myRoleInfo(room){
  const rd = room.round;
  const amImposter = rd.imposterIds.includes(state.myId);
  const word = amImposter ? rd.imposterWord : rd.majorityWord;
  return { amImposter, word };
}

function clueScreen(){
  const room = state.room;
  if (!room || !room.round) return `<div class="card center">Loading round…</div>`;
  const rd = room.round;
  const { word } = myRoleInfo(room);
  const nameById = Object.fromEntries(room.players.map(p => [p.id, p.name]));
  const curPid = rd.turnOrder[rd.currentTurnIndex];
  const myTurn = curPid === state.myId;

  const hintsHtml = rd.hints.slice().reverse().map(h => `
    <li class="hint-item"><span class="who">${esc(nameById[h.playerId] || '???')}</span><span class="text">${esc(h.text)}</span></li>
  `).join('') || `<div class="small-muted">No clues yet — the first one is about to drop.</div>`;

  return `
    <div class="classified">
      <div class="stamp-corner">EYES ONLY</div>
      <div class="role-hint">Your secret word</div>
      <div class="word">${esc(word)}</div>
      <div class="category">Category: ${esc(rd.categoryName)}</div>
      <div class="doubt">Give a clue about your word without saying it. Somebody nearby may have a word that's close, but not quite the same as yours.</div>
    </div>

    <div class="turn-banner ${myTurn ? '' : 'wait'}" style="margin-top:18px;">
      ${myTurn ? `<span class="pulse"></span> It's your turn — give a clue` : `Waiting on ${esc(nameById[curPid] || '…')}`}
    </div>

    ${myTurn ? `
    <div class="card">
      <div class="field" style="margin-bottom:10px;">
        <input type="text" id="hintInput" placeholder="One short clue…" maxlength="80" value="${esc(state.hintDraft)}" />
      </div>
      <button class="btn btn-primary btn-block" data-action="submit-hint">Send Clue</button>
    </div>` : ''}

    <div class="round-label">Round ${Math.min(rd.currentRoundNumber, rd.maxRounds)} of ${rd.maxRounds} · clues so far</div>
    <div class="card"><ul class="hint-feed">${hintsHtml}</ul></div>

    ${isHost(room) ? `
    <div class="center" style="margin-top:14px;display:flex;flex-direction:column;gap:10px;align-items:center;">
      <button class="link-btn" data-action="skip-voting">Skip straight to voting</button>
      ${rd.currentRoundNumber < rd.maxRounds ? `<button class="link-btn" data-action="skip-next-round">Skip to next round</button>` : ''}
    </div>` : ''}
  `;
}

function votingScreen(){
  const room = state.room;
  if (!room) return `<div class="card center">Loading…</div>`;
  const myVote = room.votes[state.myId];
  const votedCount = Object.keys(room.votes).length;
  const cards = room.players.map(p => {
    const disabled = p.id === state.myId;
    const picked = myVote === p.id;
    return `<div class="vote-card ${picked ? 'picked' : ''} ${disabled ? 'disabled' : ''}" ${disabled ? '' : `data-vote="${p.id}"`}>
      ${esc(p.name)} ${disabled ? '(you)' : ''}
    </div>`;
  }).join('');
  return `
    <div class="card">
      <div class="card-title">Who's the imposter?</div>
      <div class="card-sub">Vote for the player you think received the odd word out.</div>
      <div class="vote-grid">${cards}</div>
      <div class="vote-status">${votedCount}/${room.players.length} players have voted${myVote ? ' · your vote is locked in' : ''}</div>
    </div>
  `;
}

function revealScreen(){
  const room = state.room;
  if (!room || !room.round || !room.lastResult) return `<div class="card center">Tallying votes…</div>`;
  const rd = room.round;
  const res = room.lastResult;
  const nameById = Object.fromEntries(room.players.map(p => [p.id, p.name]));
  const imposterNames = rd.imposterIds.map(id => nameById[id] || '(left the game)').join(', ');
  const topName = res.topId ? (nameById[res.topId] || '(left the game)') : '—';

  const scoreRows = room.players.slice().sort((a, b) => (b.score || 0) - (a.score || 0)).map(p => `
    <div class="score-row"><span>${esc(p.name)}${rd.imposterIds.includes(p.id) ? ' 🕵️' : ''}</span><span class="pts">${p.score || 0} pts</span></div>
  `).join('');

  return `
    <div class="card">
      <div class="verdict ${res.imposterCaught ? 'majority' : 'imposters'}">
        <div class="small-muted">The group voted for ${esc(topName)}${res.tie ? ' (tie — no clear majority)' : ''}</div>
        <div class="big">${res.imposterCaught ? 'THE IMPOSTER WAS CAUGHT' : 'THE IMPOSTER GOT AWAY'}</div>
      </div>
      <div class="reveal-words">
        <div class="reveal-word-box"><div class="lbl">Majority word</div><div class="w">${esc(rd.majorityWord)}</div></div>
        <div class="reveal-word-box"><div class="lbl">Imposter word</div><div class="w">${esc(rd.imposterWord)}</div></div>
      </div>
      <div class="imposter-list">Playing the imposter${rd.imposterIds.length > 1 ? 's' : ''}: <b>${esc(imposterNames)}</b></div>
    </div>

    <div class="card">
      <div class="card-title">Scoreboard</div>
      ${scoreRows}
    </div>

    ${isHost(room) ? `
    <button class="btn btn-primary btn-block" data-action="play-again">Start Next Round</button>
    ` : `<div class="card center"><div class="card-sub" style="margin:0;">Waiting for the host to start the next round…</div></div>`}
  `;
}

/* ---------------- events ---------------- */
function bindEvents(){
  const app = document.getElementById('app');

  app.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.getAttribute('data-action');
      switch (action){
        case 'go-create': goCreate(); break;
        case 'go-join': goJoin(); break;
        case 'go-landing': goLanding(); break;
        case 'toggle-how': setState({ howOpen: !state.howOpen }); break;
        case 'leave': leaveToLanding(); break;
        case 'submit-create': doCreateRoom(); break;
        case 'submit-join': doJoinRoom(); break;
        case 'copy-code':
          navigator.clipboard.writeText(state.room.code).then(() => {
            el.textContent = 'Copied!';
            setTimeout(() => { el.textContent = 'Copy'; }, 1200);
          }).catch(() => {});
          break;
        case 'imp-minus': setImposterCount(-1); break;
        case 'imp-plus': setImposterCount(1); break;
        case 'rounds-minus': setMaxRounds(-1); break;
        case 'rounds-plus': setMaxRounds(1); break;
        case 'start-game': startGame(); break;
        case 'submit-hint': submitHint(); break;
        case 'skip-voting': hostSkipToVoting(); break;
        case 'skip-next-round': hostSkipToNextRound(); break;
        case 'play-again': playAgain(); break;
      }
    });
  });

  app.querySelectorAll('[data-cat-toggle]').forEach(el => {
    el.addEventListener('change', () => {
      const key = el.getAttribute('data-cat-toggle');
      const set = new Set(state.createCats);
      if (set.has(key)) set.delete(key); else set.add(key);
      state.createCats = [...set];
      setState({});
    });
  });

  app.querySelectorAll('[data-cat-live]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCategoryLive(el.getAttribute('data-cat-live'));
    });
  });

  app.querySelectorAll('[data-vote]').forEach(el => {
    el.addEventListener('click', () => submitVote(el.getAttribute('data-vote')));
  });

  const createName = document.getElementById('createName');
  if (createName) createName.addEventListener('input', e => { state.createNameDraft = e.target.value; });

  const joinCode = document.getElementById('joinCode');
  if (joinCode) joinCode.addEventListener('input', e => { state.joinCodeDraft = e.target.value; });

  const joinName = document.getElementById('joinName');
  if (joinName) joinName.addEventListener('input', e => { state.joinNameDraft = e.target.value; });

  const hintInput = document.getElementById('hintInput');
  if (hintInput){
    hintInput.addEventListener('input', e => { state.hintDraft = e.target.value; });
    hintInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitHint(); });
    hintInput.focus();
  }
}

/* ---------------- boot ---------------- */
initSocket();
render();
