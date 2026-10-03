# Regenerates assets/*.png (needs Pillow). Edit colours/glyph here to restyle the app icon.
from PIL import Image, ImageDraw, ImageFont
import os
G, Y, K = (15, 61, 52), (242, 177, 52), (20, 35, 31)
def icon(s):
    im = Image.new('RGB', (s, s), G); d = ImageDraw.Draw(im); c = s / 2; r = s * .30
    d.ellipse([c-r, c-r, c+r, c+r], fill=Y); r2 = r * .82
    d.ellipse([c-r2, c-r2, c+r2, c+r2], outline=K, width=max(2, int(s*.015)))
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(s*.34))
    except OSError: f = None
    if f: d.text((c, c), 'M', font=f, fill=K, anchor='mm')
    return im
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
for n, s in [('icon-192.png',192),('icon-512.png',512),('apple-touch-icon.png',180),('favicon.png',64)]: icon(s).save(os.path.join(out, n))
