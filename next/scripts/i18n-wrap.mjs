// Habillage bilingue par l'AST TypeScript : JsxText non vide → {t("…")}, attributs alt/title/aria-label/placeholder → {t("…")}.
import ts from "typescript"; import fs from "fs";
const ATTRS = new Set(["alt", "title", "aria-label", "placeholder"]);
const skip = (s) => !/[A-Za-zÀ-ÿ]/.test(s) || s.length < 2;
const all = new Set();
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, "utf8"); const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const walk = (n) => {
    if (ts.isJsxText(n)) { const raw = n.getText(); const core = raw.replace(/\s+/g, " ").trim(); if (core && !skip(core)) { const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0]; const txt = core.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " "); all.add(txt); edits.push([n.getStart(), n.getEnd(), lead + "{t(" + JSON.stringify(txt) + ")}" + trail]); } }
    if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer) && ATTRS.has(n.name.getText())) { const v = n.initializer.text; if (!skip(v)) { all.add(v); edits.push([n.initializer.getStart(), n.initializer.getEnd(), "{t(" + JSON.stringify(v) + ")}"]); } }
    ts.forEachChild(n, walk);
  };
  walk(sf);
  let out = src; edits.sort((a, b) => b[0] - a[0]).forEach(([s, e, r]) => { out = out.slice(0, s) + r + out.slice(e); });
  fs.writeFileSync(file, out);
}
fs.writeFileSync(process.env.OUT ?? "/dev/null", JSON.stringify([...all].sort(), null, 0));
console.log("fichiers :", process.argv.length - 2, "chaînes :", all.size);
