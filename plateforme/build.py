"""Inline img/*.avif as data URIs into index.src.html -> dist/dossard.html"""
import base64, pathlib, re
root = pathlib.Path(__file__).parent
src = (root / "index.src.html").read_text()
def sub(m):
    p = root / "img" / f"{m.group(1)}.avif"
    return "data:image/avif;base64," + base64.b64encode(p.read_bytes()).decode()
out = re.sub(r"\{\{(\w+)\}\}", sub, src)
assert "{{" not in out
(root / "dist" / "dossard.html").write_text(out)
print(len(out) // 1024, "KB")
