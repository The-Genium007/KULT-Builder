import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface Resources {
  archetypes: any[]
  advantages: any[]
  disadvantages: any[]
  disciplines: any[]
  secrets: any[]
}

const resourcesPath = join(process.cwd(), 'server/data/resources.json')

export async function loadResources(): Promise<Resources> {
  const raw = await readFile(resourcesPath, 'utf8')
  return JSON.parse(raw)
}
