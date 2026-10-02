"""Assemble index.html (fragment publié en artifact) en page autonome pour le site : ../../next/public/brief/"""
import pathlib, re, shutil
root = pathlib.Path(__file__).parent
out = root.parent.parent / "next" / "public" / "brief"
src = (root / "index.html").read_text(encoding="utf-8")
# la CSP du site n'autorise que ses propres ressources : pas de Google Fonts, police système
src = re.sub(r'<link [^>]*fonts\.g[^>]*>\n', "", src)
assert "fonts.googleapis" not in src
src = src.replace('src="img/', 'src="/brief/img/')
head, body = src.split("</style>", 1)
page = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<meta name="robots" content="noindex">\n<style>img{max-width:100%}[hidden]{display:none!important}</style>\n'
        + head + "</style>\n</head>\n<body>" + body + "</body>\n</html>\n")
(out / "img").mkdir(parents=True, exist_ok=True)
(out / "index.html").write_text(page, encoding="utf-8")
for n in re.findall(r'/brief/img/(\w+\.(?:avif|jpg))', page):
    shutil.copy(root.parent / "img" / n, out / "img" / n)
print(len(page) // 1024, "KB ->", out)
