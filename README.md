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

Every player has a seat colour (P1 red, P2 blue, P3 yellow, P4 green) shown as a ring under their character, on name tags and in gameplay (goals, tiles, HUD).

- **Fighters** (side-view, one engine, three rule sets):
  - **Sky Brawl** (Smash-style, 2–4): damage % builds up, launch rivals off the screen, 3 stocks.
  - **Duel** (Tekken-style, 1v1): health bars, best of 3 rounds. Hold back to block, crouch to duck highs, crouch-block lows.
  - **Tag Team** (Marvel-style, 2v2): one fighter per team on screen; the benched partner taps TAG IN on their phone.
  Joystick moves and aims (↑ = up attacks, ↓ = low attacks). Tap = light, hold + release = heavy, swipe ↑ = jump (double jump),
  swipe ↓ + hold = crouch, swipe toward = dash, swipe away + hold = block, double-tap = special.

- **Racing** (3D kart racing, Sunset Circuit, 3 laps): split-screen for every player on the couch (2 = top/bottom, 3 = quarters with a live track map, 4 = quarters).
  Turn the phone sideways and tilt it like a steering wheel. Right thumb = gas, left thumb = brake / reverse, hold both = use your item.
  Items from ? boxes: Turbo, Homing Missile, Goo Slick, Shield, Thunder. Arrow pads boost you; off-road slows you down.
  Re-centre and Invert buttons on the phone; iPhones need one tap on "Enable tilt steering". No tilt sensor? Drag left/right on GAS.
  Needs a browser with WebGL (most laptops and recent smart TVs).

3D characters (pilot: Zip): made with free tools only. Reference art from ChatGPT (T-pose), 3D model from Tencent Hunyuan 3D (free daily generations, GLB download), rigged in Blender with Mixamo-named bones, animated with Mixamo motion capture retargeted in Blender. Rigged models live in `models/` (`models/src/` keeps the raw Hunyuan output). Zip is 3D everywhere: lobby, all party games, Battle Arena, Fighters (run, punch, jump, hit, knockdown), Racing (drive, hit, victory) and the podium (dance). Characters without a model yet keep their 2D art.

Roster (8): Rumble, Nova, Zip, Glorp, Shell (Plasma Shot), Vex (Vanish), Moxie (Pogo Stomp), Frost (Ice Wall).

Keyboard players: WASD + Space (A) + E (B), Arrows + Right Shift (A) + / (B).

Characters: pick yours on your phone in the lobby (keyboard players: ◀ ▶). The roster lives in `ROSTER` in index.html; art in `assets/`.

Connections use PeerJS (WebRTC); game data goes straight between devices.
