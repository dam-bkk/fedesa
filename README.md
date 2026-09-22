# FEDESA — Fédération Sénégalaise d'Athlétisme

Maquettes et prototypes réalisés pour la refonte numérique de la fédération.

## Contenu

| Dossier | Ce que c'est |
|---|---|
| `app/` | **Application licences** — prototype complet en un fichier : dépôt et instruction des demandes, registre des licenciés, compétitions, bilans, administration. Multi-rôles (fédération, ligue, club, officiel, athlète), FR / EN / WO. |
| `v3/` | **Site public — direction affiche.** Vert volt, typo Anton, méga-menu plein écran, bento des épreuves avec fiches détaillées, fonds illustrés. Version retenue. |
| `site/` | **Site public — direction produit.** Geist, filets 1px, recherche ⌘K, chrono au défilement. Contenu repris de fedesa.sn. |
| `v2/`, `v4/`, `licences/` | Itérations antérieures, conservées pour référence. |
| `hero.png` | Visuel d'origine du hero (départ sur piste). |
| `index.html`, `index-light.html` | Toute première maquette (mai 2026). |

## Construire et publier

`site/` et `v3/` référencent leurs images en relatif. Pour BlueLine, qui ne sert qu'un
fichier, un script d'assemblage inline les visuels en data URI :

```bash
cd site && python3 build.py          # produit dist/index.html autonome
```

Publication sur l'instance BlueLine personnelle :

```bash
export BLUELINE_URL=https://blueline.damienfleury.workers.dev
export BLUELINE_TOKEN=$(cat ~/.config/blueline/token.perso)
~/projects/blueline/scripts/blueline push fedesa-site site/dist/index.html "libellé de version"
```

## Contenu et sources

Les textes, noms de dirigeants, contacts et bureaux des ligues proviennent du site
officiel fedesa.sn. Les performances et athlètes de la saison en cours sont fictifs :
ils servent à peupler les maquettes et doivent être remplacés par les données réelles
de la fédération. Les records historiques cités (Amy Mbacké Thiam, Amadou Dia Ba) et les
records du monde sont authentiques.

Les logos World Athletics, Orange et Sonatel proviennent de Wikimedia Commons. Les autres
marques partenaires sont des symboles de substitution dessinés pour la maquette, à
remplacer par les fichiers officiels.
