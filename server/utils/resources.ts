import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface Resources {
  archetypes: any[]
  advantages: any[]
  disadvantages: any[]
  disciplines: any[]
  secrets: any[]
}

// Résout le chemin depuis la racine du projet (pas le cwd) pour éviter les 500 quand
// l'app est lancée depuis un autre répertoire dans le runtime. Deux niveaux au-dessus
// du bundle `.output/server` ramènent à la racine du projet.
const projectRoot = fileURLToPath(new URL('../..', import.meta.url))
const resourcesPath = join(projectRoot, 'server/data/resources.json')

export async function loadResources(): Promise<Resources> {
  const raw = await readFile(resourcesPath, 'utf8')
  return JSON.parse(raw)
}
