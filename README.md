# UNDERCOVER — online imposter word game

A real-time, up-to-9-player party game with a twist: most players get the
same secret word, but one or more "imposters" get a *closely related*
decoy word instead (Messi / Neymar, Lion / Tiger, Iron Man / Batman…).
Nobody is told who has the decoy — so the imposter often isn't sure
themselves.

This version has a proper backend: **Node + Express + Socket.io**. The
server is the single source of truth for every room, so there's no
polling lag and no race conditions between players' devices — it's the
"bulletproof" version.

## What's inside

```
undercover-server/
  server.js          ← the backend (rooms, game logic, sockets)
  categories.js      ← ALL the word pairs (edit this to add more!)
  package.json
  public/
    index.html        ← page shell
    styles.css         ← visual design
    client.js           ← frontend logic (talks to the server over websockets)
```

Ten categories ship by default, each with 60–100+ word pairs: Football
(Soccer) Legends, Bollywood Actors, Indian Politicians, Hollywood
Actors, Influential Figures, Music Icons, Superheroes, World Foods, Wild
Animals, Historical Figures.

**Adding more pairs is easy:** open `categories.js`, find the category,
and add a new line like `Luka Modrić / Toni Kroos`. That's it — duplicates
(even reversed ones) are removed automatically. To add a brand-new
category, add a block in `categories.js` plus its `[id, name]` in
`CATEGORY_LIST` at the top of `public/client.js`.

**Game limits:** 3–9 players, 1–3 imposters (always leaving at least 2
regular players), 1–4 clue rounds. The host can also skip straight to
voting, or skip ahead to the next clue round, during the clue phase.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd undercover-server
npm install
npm start
```

Then open `http://localhost:3000`. To test multiplayer, open that same
URL in a few browser tabs (or on your phone via your computer's local
IP, e.g. `http://192.168.1.23:3000`, as long as your phone is on the
same Wi‑Fi).

## Deploying it permanently, on your own domain

You need somewhere that keeps a Node process running and supports
WebSockets (this rules out static hosts like plain GitHub Pages). Any of
these work well and all support custom domains on their free/cheap
tiers:

- **[Render](https://render.com)** — easiest option, free tier available, WebSockets supported out of the box.
- **[Railway](https://railway.app)** — similar simplicity, usage-based pricing.
- **[Fly.io](https://fly.io)** — great if you want the server close to your players geographically.
- A basic **VPS** (DigitalOcean, Linode, etc.) if you want full control — run it behind `pm2` and Nginx.

### Steps (using Render as the example — Railway/Fly are nearly identical)

1. **Push this project to a GitHub repo.**
   ```bash
   git init
   git add .
   git commit -m "Undercover game"
   git branch -M main
   git remote add origin https://github.com/<you>/undercover-game.git
   git push -u origin main
   ```

2. **Create the service.** On Render: New → Web Service → connect your
   repo. Set:
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: free tier is fine to start

3. **Deploy.** Render gives you a URL like
   `https://undercover-game.onrender.com` immediately — the game is
   already live and playable at that address.

4. **Point your own domain at it.**
   - In Render: open your service → Settings → **Custom Domains** → add
     `play.yourdomain.com` (a subdomain is simplest) or your root domain.
   - Render shows you the exact DNS record to add — usually a **CNAME**
     record for a subdomain (`play` → `undercover-game.onrender.com`),
     or an **A record** if you're pointing the root domain.
   - Go to wherever you bought your domain (Namecheap, GoDaddy, Google
     Domains, Cloudflare, etc.), open DNS settings, and add that record.
   - DNS changes can take a few minutes up to ~24 hours to propagate.
     Render automatically issues a free HTTPS certificate for your
     domain once it verifies.

5. **Tighten CORS.** In `server.js`, change:
   ```js
   const io = new Server(server, { cors: { origin: '*' } });
   ```
   to your real domain once it's live:
   ```js
   const io = new Server(server, { cors: { origin: 'https://play.yourdomain.com' } });
   ```

That's it — from then on, anyone who visits your domain can create or
join a room, and it'll stay reachable indefinitely (subject to your
host's uptime).

## Notes on how it behaves

- **State lives in server memory.** Rooms disappear if the server
  restarts (e.g. a redeploy) — expected for a casual party game. If you
  ever want rooms to survive restarts, swap the `Map()` in `server.js`
  for Redis; the room-mutation functions are already isolated so that's
  a contained change.
- **Reconnects work.** If someone's phone drops signal or they refresh
  the page, their browser stores a small session token and automatically
  rejoins the same room and seat when it reconnects (3-minute grace
  window before they're dropped from the room).
- **Idle rooms are swept** after 6 hours of inactivity so memory doesn't
  grow unbounded on a long-running server.
- Free tiers on Render/Railway typically spin the server down after a
  period with no traffic and take a few seconds to wake back up on the
  next visit — worth knowing if a room sits idle mid-game. Paid tiers
  avoid this.
