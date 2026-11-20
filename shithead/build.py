# Builds shithead/index.html from the main Couch Clash page, so the app is always the exact same game.
# Run from the repo root:  python3 shithead/build.py
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'index.html').read_text()
def rep(a, b):
    global s
    assert a in s, a
    s = s.replace(a, b, 1)
rep('<head>', '<head>\n<base href="../">\n<script>window.SH_APP = 1;</script>')
rep('<title>Couch Clash</title>', '<title>Shithead</title>')
rep('<meta name="apple-mobile-web-app-title" content="Couch Clash">', '<meta name="apple-mobile-web-app-title" content="Shithead">')
rep('<link rel="manifest" href="manifest.webmanifest">', '<link rel="manifest" href="shithead/manifest.webmanifest">')
rep('<link rel="apple-touch-icon" href="assets/icon-180.png">', '<link rel="apple-touch-icon" href="shithead/icons/apple-touch-icon.png">')
(root / 'shithead' / 'index.html').write_text(s)
print('built shithead/index.html', len(s), 'bytes')
