import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

export interface Resources {
  archetypes: any[]
  advantages: any[]
  disadvantages: any[]
  disciplines: any[]
  secrets: any[]
}

let cachedResources: Resources | null = null

function resolveResourcesPath(): string {
  // Try multiple possible paths (dev, build, generate contexts)
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    join(__dirname, '../data/resources.json'),         // dev: server/utils -> server/data
    join(__dirname, '../../server/data/resources.json'), // build: .output/server/chunks -> project root
    join(process.cwd(), 'server/data/resources.json'),   // fallback: cwd
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return candidates[0]
}

export async function loadResources(): Promise<Resources> {
  if (cachedResources) return cachedResources
  const raw = await readFile(resolveResourcesPath(), 'utf8')
  cachedResources = JSON.parse(raw)
  return cachedResources!
}
