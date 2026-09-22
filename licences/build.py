"""Concatenate src/ into ONE shareable HTML file (artifact / BlueLine). python3 build.py"""
import pathlib
src=pathlib.Path('src');out=pathlib.Path('dist');out.mkdir(exist_ok=True)
parts=['01-head.html','02-data.js','02b-images.js','02c-wolof.js','03-core.js','04-pages-licences.js','05-pages-comp.js','05b-stats.js','06-admin-boot.js']
html='\n'.join((src/p).read_text() for p in parts)
(out/'fedesa-licences.html').write_text(html)
print('built',len(html)//1024,'KB')
