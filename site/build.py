#!/usr/bin/env python3
"""Construit dist/index.html : un seul fichier autonome (visuels AVIF en data URI) pour BlueLine."""
import base64, pathlib, re
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
cache = {}
def uri(name):
    if name not in cache:
        data = (root / "img" / name).read_bytes()
        cache[name] = "data:image/avif;base64," + base64.b64encode(data).decode()
    return cache[name]
html = re.sub(r'(src|data-src)="img/([^"]+\.avif)"', lambda m: f'{m.group(1)}="{uri(m.group(2))}"', html)
out = root / "dist"; out.mkdir(exist_ok=True)
(out / "index.html").write_text(html, encoding="utf-8")
print(f"dist/index.html — {len(html)/1024:.0f} Ko, {len(cache)} visuels inlinés")
