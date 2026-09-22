#!/usr/bin/env python3
"""WCAG 2.1 contrast for every colour pair the page actually uses.
AA needs 4.5:1 for body text, 3:1 for large text (>=24px, or >=18.7px bold) and for
UI boundaries. Opacity is not a free pass: a colour set at 62% opacity composites
against its background first, so it is checked at its COMPOSITED value, not its token."""
import sys

def srgb(c):
    c = c.lstrip('#')
    if len(c) == 3: c = ''.join(ch*2 for ch in c)
    return tuple(int(c[i:i+2], 16)/255 for i in (0, 2, 4))

def lum(rgb):
    f = lambda v: v/12.92 if v <= 0.04045 else ((v+0.055)/1.055)**2.4
    r, g, b = (f(v) for v in rgb)
    return 0.2126*r + 0.7152*g + 0.0722*b

def ratio(fg, bg):
    a, b = lum(srgb(fg)), lum(srgb(bg))
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)

def over(fg, bg, alpha):
    """composite fg at `alpha` over bg — what the eye actually receives"""
    f, b = srgb(fg), srgb(bg)
    out = tuple(f[i]*alpha + b[i]*(1-alpha) for i in range(3))
    return '#' + ''.join('%02X' % round(v*255) for v in out)

PAIRS = [
    # label, fg, bg, needed ratio
    ("body text — ink on paper",              "#0B1410", "#F2F2ED", 4.5),
    ("secondary text — ink-2 on paper",       "#39433E", "#F2F2ED", 4.5),
    ("meta text — muted on paper",            "#5A6360", "#F2F2ED", 4.5),
    ("eyebrow accent on paper",               "#00662B", "#F2F2ED", 4.5),
    ("eyebrow accent on white",               "#00662B", "#FFFFFF", 4.5),
    ("ink on volt (hero)",                    "#0B1410", "#00E05A", 4.5),
    ("hero sub on volt",                      "#123322", "#00E05A", 4.5),
    ("hero stat label on volt",               "#1B3A28", "#00E05A", 4.5),
    ("ink on gold",                           "#0B1410", "#FFD100", 4.5),
    ("step body on gold",                     "#4A3B00", "#FFD100", 4.5),
    ("step number on gold",                   "#6B5500", "#FFD100", 4.5),
    ("white on red",                          "#FFFFFF", "#E4002B", 4.5),
    ("white on ink",                          "#FFFFFF", "#0B1410", 4.5),
    ("smoke on ink",                          "#8FA396", "#0B1410", 4.5),
    ("smoke on deep",                         "#8FA396", "#08100C", 4.5),
    ("mint on deep",                          "#9FE8BC", "#08100C", 4.5),
    ("volt perf number on ink",               "#00E05A", "#0B1410", 4.5),
    ("pill nat",                              "#0A6B33", "#E2FBEC", 4.5),
    ("pill jeune",                            "#6B5500", "#FFF4C2", 4.5),
    ("volt on ink (pill intl)",               "#00E05A", "#0B1410", 4.5),
    ("footer link on deep",                   "#A9B8AF", "#08100C", 4.5),
    # large text / UI only (3:1)
    ("poster headline ink on paper",          "#0B1410", "#F2F2ED", 3.0),
    ("line on paper (UI border)",             "#C6C9BF", "#F2F2ED", 3.0),
]

# things dimmed with opacity — checked at the composited value
COMPOSITED = [
    ("marquee label, gold ground @62%",  "#0B1410", "#FFD100", 0.62, 4.5),
    ("tab label, ink ground @62%",       "#FFFFFF", "#0B1410", 0.62, 4.5),
    ("vlabel on volt @60%",              "#0B1410", "#00E05A", 0.60, 4.5),
]

fails = []
print(f"{'':<42}{'ratio':>7}  {'need':>5}")
print("-"*62)
for label, fg, bg, need in PAIRS:
    r = ratio(fg, bg)
    ok = r >= need
    if not ok: fails.append((label, fg, bg, r, need))
    print(f"{label:<42}{r:>6.2f}:1  {need:>4}  {'OK' if ok else 'FAIL'}")

print()
print("composited (opacity applied before measuring)")
print("-"*62)
for label, fg, bg, a, need in COMPOSITED:
    eff = over(fg, bg, a)
    r = ratio(eff, bg)
    ok = r >= need
    if not ok: fails.append((label, eff, bg, r, need))
    print(f"{label:<42}{r:>6.2f}:1  {need:>4}  {'OK' if ok else 'FAIL'}   -> {eff}")

print()
if fails:
    print(f"{len(fails)} FAILING PAIR(S):")
    for label, fg, bg, r, need in fails:
        print(f"  {label}: {fg} on {bg} = {r:.2f}:1, needs {need}")
    sys.exit(1)
print("every pair passes")
