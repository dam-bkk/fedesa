# Site FEDESA (Next.js)

Site public de la Fédération Sénégalaise d'Athlétisme, construit sur le système de design de la maquette v3 (`../v3`). Les sections statiques sont générées depuis la maquette (`components/parts/*`, ne pas éditer à la main — relancer le convertisseur), les sections vivantes lisent l'API publique de la plateforme (`lib/api.ts`) : calendrier, résultats publiés, bilans, records, clubs (carte), tarifs, statistiques.

```bash
npm ci && FEDESA_API=https://appfedesa.damien.asia npm run dev
```
Déploiement : `docker compose up -d --build` sur la VM, Caddy `fedesa.damien.asia → 172.18.0.1:3031`.
