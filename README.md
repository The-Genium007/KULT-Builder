# Kult Character Builder (Nuxt 4 + JSON)

Petit builder local pour Kult : archétypes, avantages/désavantages, disciplines, secret sombre et sauvegarde dans des JSON locaux (aucune base à installer).

## Installation & lancement

```bash
npm install
npm run dev               # http://localhost:3000
```

## Scripts utiles

- `npm run dev` : Nuxt en mode dev.
- `npm run build` / `npm run preview` : build et prévisualisation.

## Données

- Ressources (archétypes, avantages, désavantages, disciplines, secrets) : `server/data/resources.json`.
- Personnages persistés : `server/data/characters.json` (écrit/lu par l’API). Tu peux éditer ou vider ce fichier si besoin.

## API (Nuxt server routes, JSON)

- `GET /api/archetypes`, `/api/advantages`, `/api/disadvantages`, `/api/disciplines`, `/api/secrets`
- `GET /api/characters` — liste peuplée
- `GET /api/characters/:id`
- `POST /api/characters` — crée un personnage (payload validé côté serveur)
- `PATCH /api/characters/:id` — met à jour un personnage

## Structure

- `app/pages/index.vue` : UI principale (wizard, ressources, fiches sauvegardées).
- `app/stores/builder.ts` : état du builder (Pinia) + persistance locale.
- `server/data/*.json` : données de base et personnages.
- `server/api/*` : routes Nuxt/API.

Palette sombre inspirée de Kult, polices Playfair Display + Space Grotesk. Astuces et validations légères intégrées au wizard.
