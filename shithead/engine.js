/* Shithead rules engine (Dean's house rules). Pure logic, no UI.
   2 resets · 7 mirrors the card underneath · 10 bombs the pile · four of a kind bombs
   4 face-down, 4 face-up, 4 in hand · swap time · same-rank multi plays · pick up any time
   Works in the browser (window.SH) and in Node (module.exports) for testing. */
(function (root) {
  'use strict';
  const SUITS = ['♦', '♣', '♥', '♠'];
  const RN = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  const rankName = r => RN[r] || String(r);
  const cardName = c => rankName(c.r) + SUITS[c.s];
  const isSpecial = c => c.r === 2 || c.r === 7 || c.r === 10;
  const byR = (a, b) => a.r - b.r || a.s - b.s;
  const MAX_PLAYERS = 8;

  function minDecks(n) { return n <= 4 ? 1 : n <= 8 ? 2 : 3; }
  function defaultDecks(n) { return minDecks(n); }

  function makeDeck(n, rng) {
    const d = [];
    for (let k = 0; k < n; k++) for (let s = 0; s < 4; s++) for (let r = 2; r <= 14; r++) d.push({ r, s, id: k * 100 + s * 20 + r });
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    return d;
  }

  // players: [{ id, name, bot }]; opts: { decks, rng }
  function createGame(players, opts = {}) {
    const rng = opts.rng || Math.random;
    const decks = Math.max(minDecks(players.length), opts.decks || defaultDecks(players.length));
    const deck = makeDeck(decks, rng);
    const g = {
      phase: 'swap', decks, deck, pile: [], burnt: 0, turn: 0, out: [], loser: null,
      evs: [], evN: 0, turnStart: 0, rng,
      ps: players.map((p, i) => ({ id: p.id, name: p.name, bot: !!p.bot, seat: i, hand: [], up: [], down: [], done: false, ready: !!p.bot, place: 0, picks: 0, bombs: 0, maxPick: 0 }))
    };
    for (const o of g.ps) { o.down = deck.splice(0, 4); o.up = deck.splice(0, 4); o.hand = deck.splice(0, 4).sort(byR); }
    for (const o of g.ps) if (o.bot) botSwap(o);
    g.turn = Math.floor(rng() * g.ps.length);
    ev(g, { type: 'deal' });
    return g;
  }

  function ev(g, e) { e.n = ++g.evN; g.evs.push(e); if (g.evs.length > 24) g.evs.shift(); }

  function effTop(g) { for (let i = g.pile.length - 1; i >= 0; i--) if (g.pile[i].r !== 7) return g.pile[i]; return null; }
  function canPlay(g, c) { if (isSpecial(c)) return true; const t = effTop(g); return !t || t.r === 2 || c.r >= t.r; }
  function src(o) { return o.hand.length ? 'hand' : o.up.length ? 'up' : o.down.length ? 'down' : null; }
  function cardsLeft(o) { return o.hand.length + o.up.length + o.down.length; }

  function nextTurn(g) {
    const n = g.ps.length;
    for (let k = 1; k <= n; k++) { const j = (g.turn + k) % n; if (!g.ps[j].done) { g.turn = j; break; } }
    g.turnStart = Date.now();
  }

  function finishCheck(g, o) {
    if (o.done || cardsLeft(o)) return false;
    o.done = true; g.out.push(o.seat); o.place = g.out.length;
    ev(g, { type: 'out', seat: o.seat, place: o.place });
    const alive = g.ps.filter(x => !x.done);
    if (alive.length <= 1) {
      g.phase = 'over';
      if (alive[0]) { g.loser = alive[0].seat; alive[0].place = g.ps.length; g.out.push(alive[0].seat); }
      ev(g, { type: 'over', loser: g.loser });
      return true;
    }
    return false;
  }

  function startPlay(g) { g.phase = 'play'; g.turnStart = Date.now(); for (const o of g.ps) o.hand.sort(byR); ev(g, { type: 'start', seat: g.turn }); }

  // play cards (array of card objects) from a source; returns nothing, mutates g
  function doPlay(g, o, cs, from) {
    for (const c of cs) { const arr = o[from]; arr.splice(arr.indexOf(c), 1); g.pile.push(c); }
    const c = cs[cs.length - 1];
    if (from === 'hand') { while (o.hand.length < 4 && g.deck.length) o.hand.push(g.deck.pop()); o.hand.sort(byR); }
    const top4 = g.pile.slice(-4), four = top4.length === 4 && top4.every(x => x.r === top4[0].r);
    ev(g, { type: 'play', seat: o.seat, cards: cs.slice(), from });
    if (c.r === 10 || four) {
      const n = g.pile.length; g.burnt += n; g.pile = []; o.bombs++;
      ev(g, { type: 'bomb', seat: o.seat, count: n, four: c.r !== 10 });
      if (finishCheck(g, o)) return;
      if (o.done) { nextTurn(g); return; }
      g.turnStart = Date.now(); // bomber goes again
      return;
    }
    if (c.r === 2) ev(g, { type: 'reset', seat: o.seat });
    else if (c.r === 7) { const t = effTop(g); ev(g, { type: 'mirror', seat: o.seat, under: t ? t.r : 0 }); }
    if (finishCheck(g, o)) return;
    nextTurn(g);
  }

  function doPickup(g, o, extra) {
    const n = g.pile.length + (extra ? 1 : 0);
    o.hand.push(...g.pile); if (extra) o.hand.push(extra); g.pile = []; o.hand.sort(byR);
    o.picks++; o.maxPick = Math.max(o.maxPick, n);
    ev(g, { type: 'pickup', seat: o.seat, count: n });
    nextTurn(g);
  }

  // action: {type:'swap',h,u} | {type:'ready'} | {type:'play',from,idx:[...]} | {type:'blind',i} | {type:'pickup'}
  function act(g, seat, a) {
    const o = g.ps[seat]; if (!o || !a) return 'bad';
    if (g.phase === 'swap') {
      if (a.type === 'swap') { const h = o.hand[a.h], u = o.up[a.u]; if (!h || !u) return 'bad'; o.hand[a.h] = u; o.up[a.u] = h; o.hand.sort(byR); o.ready = false; return null; }
      if (a.type === 'ready') { o.ready = a.v !== false; if (g.ps.every(p => p.ready)) startPlay(g); return null; }
      return 'Swap time';
    }
    if (g.phase !== 'play') return 'Game over';
    if (g.turn !== seat) return 'Not your turn';
    const s = src(o);
    if (a.type === 'pickup') { if (!g.pile.length) return 'Pile is empty'; doPickup(g, o); return null; }
    if (a.type === 'play') {
      if (a.from !== s || s === 'down') return 'Play from your ' + s;
      const idx = [...new Set(a.idx || [])]; const cs = idx.map(i => o[s][i]).filter(Boolean);
      if (!cs.length || cs.length !== idx.length) return 'bad';
      if (!cs.every(c => c.r === cs[0].r)) return 'Cards must match';
      if (!canPlay(g, cs[0])) return 'Too low';
      doPlay(g, o, cs, s); return null;
    }
    if (a.type === 'blind') {
      if (s !== 'down') return 'Not yet';
      const c = o.down[a.i]; if (!c) return 'bad';
      const ok = canPlay(g, c);
      ev(g, { type: 'flip', seat: o.seat, card: c, ok });
      if (ok) doPlay(g, o, [c], 'down');
      else { o.down.splice(a.i, 1); doPickup(g, o, c); }
      return null;
    }
    return 'bad';
  }

  /* ---------- bots ---------- */
  const keep = c => isSpecial(c) ? 20 + (c.r === 10 ? 3 : c.r === 2 ? 2 : 1) : c.r;
  function botSwap(o) { const all = o.hand.concat(o.up).sort((a, b) => keep(b) - keep(a)); o.up = all.slice(0, 4); o.hand = all.slice(4).sort(byR); o.ready = true; }
  function botMove(g, seat) {
    const o = g.ps[seat];
    if (g.phase === 'swap') return o.ready ? null : { type: 'ready' };
    const s = src(o); if (!s) return null;
    if (s === 'down') return { type: 'blind', i: Math.floor(g.rng() * o.down.length) };
    const arr = o[s], opts = arr.filter(c => canPlay(g, c));
    if (!opts.length) return { type: 'pickup' };
    const normal = opts.filter(c => !isSpecial(c)).sort(byR);
    // next player nearly out? hold them back with something high
    const nxt = g.ps.find((p, k) => !p.done && k !== seat && (k - seat + g.ps.length) % g.ps.length === nextOffset(g, seat));
    let pick;
    if (normal.length) pick = g.rng() < 0.15 ? normal[Math.floor(g.rng() * normal.length)] : nxt && cardsLeft(nxt) <= 2 && normal.length > 1 ? normal[normal.length - 1] : normal[0];
    else if (g.pile.length >= 6 && opts.find(c => c.r === 10)) pick = opts.find(c => c.r === 10);
    else pick = opts.find(c => c.r === 7) || opts.find(c => c.r === 2) || opts[0];
    let same = arr.map((c, i) => [c, i]).filter(([c]) => c.r === pick.r).map(([, i]) => i);
    if (pick.r === 10) same = same.slice(0, 1);
    // if hand play while deck remains, dumping all copies is fine
    return { type: 'play', from: s, idx: same };
  }
  function nextOffset(g, seat) { const n = g.ps.length; for (let k = 1; k <= n; k++) if (!g.ps[(seat + k) % n].done) return k; return 1; }

  /* ---------- per-seat view (what one player is allowed to see) ---------- */
  function view(g, seat) {
    const me = g.ps[seat], t = effTop(g), s = me ? src(me) : null;
    return {
      phase: g.phase, decks: g.decks, deckCount: g.deck.length, burnt: g.burnt,
      pile: g.pile.slice(-7), pileCount: g.pile.length, top: t, turn: g.turn, you: seat,
      out: g.out.slice(), loser: g.loser, evs: g.evs.slice(), turnStart: g.turnStart,
      players: g.ps.map(o => ({ name: o.name, bot: o.bot, hand: o.hand.length, up: o.up.slice(), down: o.down.length, done: o.done, place: o.place, ready: o.ready, picks: o.picks, bombs: o.bombs, maxPick: o.maxPick })),
      hand: me ? me.hand.slice() : [], src: s,
      playable: me && g.phase === 'play' && g.turn === seat && s && s !== 'down' ? me[s].map(c => canPlay(g, c)) : [],
      // at the end everyone sees every hand
      reveal: g.phase === 'over' ? g.ps.map(o => o.hand.concat(o.up, o.down)) : null
    };
  }

  const API = { createGame, act, botMove, view, canPlay, effTop, src, cardsLeft, rankName, cardName, SUITS, minDecks, defaultDecks, MAX_PLAYERS, isSpecial };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.SH = API;
})(typeof window !== 'undefined' ? window : globalThis);
