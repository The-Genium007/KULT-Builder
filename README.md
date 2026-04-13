# KULT Character Builder

> A dark, immersive character creation tool for **KULT: Divinity Lost** — the tabletop RPG where reality is an illusion and humanity is trapped in a prison of lies.

Built with **Nuxt 4**, **Vue 3**, **Tailwind CSS v4**, and **Pinia**. All character data stays **private in your browser** via `localStorage` — no server, no shared database, no peeking at other players' sheets.

---

## Features

- **Guided wizard** — step-by-step creation: Archetype, Dark Secret, Advantages/Disadvantages, Attributes, Skills, Identity, Equipment, Relations, and Summary
- **20 archetypes** with thematic SVG icons, GM counsel, suggested occupations, and atmosphere guidance
- **Smart filtering** — advantages, disadvantages, and dark secrets are filtered by selected archetype
- **Attribute pool validation** — passive (Endurance, Reflex, Willpower) and active (Soul, Charisma, Intuition, Logic, Perception, Composure, Violence) attributes enforce the official point-buy pools
- **Local-only storage** — characters are saved to `localStorage`. Each player's data is private and never leaves their browser
- **Import / Export** — download character sheets as JSON files or import them back. Share builds between devices without a server
- **Draft auto-save** — your work-in-progress is automatically persisted. Close the tab, come back later, and pick up where you left off
- **Dark occult UI** — custom color palette (`ink`, `blood`, `ash`, `iron`, `ember`), glow effects, Playfair Display + Space Grotesk typography
- **Fully responsive** — mobile-first design with progressive breakpoints, touch-friendly targets (44px minimum), and bottom-sheet modals on small screens

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start forging your character.

## Build & Deploy

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview

# Static export (optional — outputs to .output/public)
npm run generate
```

### Deployment (Nixpacks / Railway / Render)

The project works out of the box with Nixpacks auto-detection. Optionally, configure with a `.nixpacks.toml`:

```toml
[phases.setup]
node_version = "20"

[phases.install]
cmd = "npm ci"

[phases.build]
cmd = "npm run build"

[start]
cmd = "npm run preview"
```

## Project Structure

```
app/
  assets/css/main.css       # Tailwind v4 theme (CSS-based config)
  composables/               # Archetype icon SVGs
  layouts/default.vue        # Shell layout (header + footer)
  pages/index.vue            # Main builder UI + character list
  stores/builder.ts          # Pinia store (wizard state + draft persistence)
  types/kult.ts              # TypeScript interfaces
server/
  api/                       # Nitro API routes (read-only game data)
  data/resources.json        # Archetypes, advantages, disadvantages, dark secrets, disciplines
  validators/character.ts    # Zod schema for character payloads
  utils/                     # Resource loader + character store utilities
```

## Game Data

All KULT game reference data lives in [`server/data/resources.json`](server/data/resources.json):
- **Archetypes** (20) — with taglines, guidance, suggested attributes, and equipment
- **Advantages** — with costs, descriptions, and archetype restrictions
- **Disadvantages** — with penalties, triggers, and archetype restrictions
- **Dark Secrets** — with hooks and archetype restrictions
- **Disciplines** — spheres, tiers, effects, and risks

This data is served as read-only via Nitro API routes (`/api/archetypes`, `/api/advantages`, etc.).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | [Vue 3](https://vuejs.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-based config) |
| State | [Pinia](https://pinia.vuejs.org) |
| Validation | [Zod](https://zod.dev) |
| Server | [Nitro](https://nitro.build) (Nuxt server engine) |
| Storage | `localStorage` (browser-only, private per user) |

## Privacy

All character data is stored **exclusively in your browser's localStorage**. Nothing is sent to a server. Nothing is shared between users. If you clear your browser data, your characters are gone — so use the **Export** button to keep backups.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE) - Luca Gisa ([lucagisa.com](https://lucagisa.com))

---

*"A veil shrouds our eyes."* — KULT: Divinity Lost
