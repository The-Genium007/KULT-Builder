# Kult Character Builder

Nuxt 4 + Tailwind. Création de personnages Kult : archétypes, sombres secrets, avantages/désavantages, attributs, identité. Sauvegarde locale (JSON) + export/import.

## Ce que fait l’app
- Wizard complet pour les fiches (archétype → traits → attributs → identité → résumé).
- Filtrage des listes par archétype (secrets/avantages/désavantages).
- Sauvegarde/chargement : fichier JSON local (`server/data/characters.json`) et cache navigateur (localStorage) + export/import JSON (copier/télécharger/importer).
- Conseils d’archétype dans une modale (tonalité + occupations).

## Installation & lancement
```bash
npm install
npm run dev      # http://localhost:3000
```

### Build / preview
```bash
npm run build
npm run preview
```

### Static (option)
```bash
npm run generate
# contenu dans .output/public
```

## Scripts
- `npm run dev` : dev server.
- `npm run build` : build Nuxt.
- `npm run preview` : sert la build.
- `npm run generate` : export statique.

## Données
- Ressources (archétypes, avantages, désavantages, secrets, disciplines) : `server/data/resources.json`.
- Personnages : `server/data/characters.json` (écrit/lu par les routes server) + cache navigateur (fallback offline).
- Import/export JSON : depuis l’UI (boutons Copier/Télécharger/Importer sur la liste des personnages).

## Déploiement (Nixpacks)
Un `.nixpacks.toml` n’est pas requis, mais recommandé :
```toml
[phases.setup]
node_version = "18"

[phases.install]
cmd = "npm ci"

[phases.build]
cmd = "npm run build"

[start]
cmd = "npm run preview"
```
Sinon, Nixpacks autodétecte Nuxt/Node et peut appeler `npm run build && npm run preview`.

## Structure rapide
- `app/pages/index.vue` : UI du builder + modales + import/export.
- `app/stores/builder.ts` : état Pinia + draft local.
- `server/data/*.json` : ressources + fiches.
- `server/api/*` : routes Nuxt server (CRUD personnages / ressources).
- `app/assets/css/main.css` : styles Tailwind + thèmes.
