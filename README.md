# Couch Clash

Free arcade party games for 2–4 players. The TV is the console, phones are the controllers.

**Play:** https://is.gd/couchclash (short link to https://mistadean.github.io/couch-clash/)

1. Open the link on the TV or laptop. It opens the host screen automatically (add `?menu` to see the menu).
2. Everyone scans the QR code and enters a name. The first phone becomes the 👑 leader.
3. The leader's phone controls everything: game choice, bots, sound, music, TV screen size, start, restart, quit.
4. Anyone can pause from their phone (⏸). Press P on a keyboard to pause too.

Modes:
- **Party Cup**: Goal Guard, Ice Sumo and Tile Takeover back to back (or play any one on its own).
- **Battle Arena**: floating-platform brawl. A = punch, B = character ability. Stats matter: speed, power, weight.
  Rumble: Horn Charge · Nova: Warp Step · Zip: Jet Burst · Glorp: Goo Trap. 3 lives, last one standing.
  Controls (switch in the lobby): **Gestures** (default): the right half of the phone is one gesture pad, no need to look:
  tap = jab · hold + release = heavy · swipe ↑ = jump · swipe ↓ + hold = block · swipe ← → = dash attack · double-tap = special ·
  jab, jab, heavy = combo. Or **Buttons**: A = punch, B = special.

Keyboard players: WASD + Space (A) + E (B), Arrows + Right Shift (A) + / (B).

Characters: Rumble, Nova, Zip and Glorp. Pick yours on your phone in the lobby (keyboard players: ◀ ▶). The roster lives in `ROSTER` in index.html; art in `assets/`.

Connections use PeerJS (WebRTC); game data goes straight between devices.
