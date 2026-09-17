#!/usr/bin/env python3
"""
Trace नमस्ते into the single SVG path used by components/namaste.tsx.

The site ships no Devanagari font. This one-time trace shapes the word with
HarfBuzz (so the conjunct स्ते and the matra are the font's own) and extracts
the outlines from Noto Serif Devanagari (SIL Open Font License) at the
regular instance. Re-run only if the word or the font changes.

  python3 -m venv .venv && .venv/bin/pip install fonttools uharfbuzz
  curl -L -o NotoSerifDevanagari.ttf \
    "https://github.com/google/fonts/raw/main/ofl/notoserifdevanagari/NotoSerifDevanagari%5Bwdth%2Cwght%5D.ttf"
  .venv/bin/python scripts/trace-namaste.py NotoSerifDevanagari.ttf

Prints the viewBox and the path `d`; paste both into components/namaste.tsx.
"""

import sys

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

TEXT = "नमस्ते"
source = sys.argv[1] if len(sys.argv) > 1 else "NotoSerifDevanagari.ttf"

font = instantiateVariableFont(TTFont(source), {"wght": 400, "wdth": 100})
instance = "NotoSerifDevanagari-Regular-instance.ttf"
font.save(instance)

face = hb.Face(hb.Blob.from_file_path(instance))
buffer = hb.Buffer()
buffer.add_str(TEXT)
buffer.guess_segment_properties()
hb.shape(hb.Font(face), buffer)

order = font.getGlyphOrder()
glyphs = font.getGlyphSet()
placed = []
x = 0
for info, pos in zip(buffer.glyph_infos, buffer.glyph_positions):
    placed.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
    x += pos.x_advance

bounds = BoundsPen(glyphs)
for name, gx, gy in placed:
    glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, gx, gy)))
xmin, ymin, xmax, ymax = bounds.bounds

# Emit y-down coordinates in a tight viewBox, one decimal place.
pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
for name, gx, gy in placed:
    glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, gx - xmin, ymax + gy)))

print(f'viewBox="0 0 {xmax - xmin} {ymax - ymin}"')
print(pen.getCommands())
