import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { loadResources, type Resources } from './resources'

export interface PassiveAttributes {
  [key: string]: number | null
  endurance: number | null
  reflexe: number | null
  volonte: number | null
}

export interface ActiveAttributes {
  [key: string]: number | null
  ame: number | null
  charisme: number | null
  intuition: number | null
  logique: number | null
  perception: number | null
  sangFroid: number | null
  violence: number | null
}

export interface AttributeBlock {
  passive: PassiveAttributes
  active: ActiveAttributes
}

export interface CharacterPayload {
  name: string
  archetype: string
  darkSecret: string
  attributes: AttributeBlock
  keySkills: string[]
  advantages: string[]
  disadvantages: string[]
  disciplines?: string[]
  equipment: string[]
  relations: string[]
  appearance?: string
  notes?: string
}

export interface StoredCharacter extends CharacterPayload {
  _id: string
  createdAt: string
  updatedAt: string
}

const charactersPath = join(process.cwd(), 'server/data/characters.json')

async function ensureFile() {
  await mkdir(dirname(charactersPath), { recursive: true })
  if (!existsSync(charactersPath)) {
    await writeFile(charactersPath, '[]', 'utf8')
  }
}

async function readCharacters(): Promise<StoredCharacter[]> {
  await ensureFile()
  const raw = await readFile(charactersPath, 'utf8')
  return JSON.parse(raw)
}

async function writeCharacters(chars: StoredCharacter[]) {
  await writeFile(charactersPath, JSON.stringify(chars, null, 2))
}

function hydrate(character: StoredCharacter, resources: Resources) {
  return {
    ...character,
    relations: character.relations || [],
    appearance: character.appearance,
    archetype: resources.archetypes.find((a) => a._id === character.archetype) || null,
    darkSecret: resources.secrets.find((s) => s._id === character.darkSecret) || null,
    advantages: character.advantages
      .map((id) => resources.advantages.find((a) => a._id === id))
      .filter(Boolean),
    disadvantages: character.disadvantages
      .map((id) => resources.disadvantages.find((d) => d._id === id))
      .filter(Boolean),
    disciplines: (character.disciplines || [])
      .map((id) => resources.disciplines.find((d) => d._id === id))
      .filter(Boolean)
  }
}

export async function listCharacters() {
  const [chars, resources] = await Promise.all([readCharacters(), loadResources()])
  return chars.map((c) => hydrate(c, resources))
}

export async function getCharacter(id: string) {
  const [chars, resources] = await Promise.all([readCharacters(), loadResources()])
  const found = chars.find((c) => c._id === id)
  if (!found) return null
  return hydrate(found, resources)
}

export async function createCharacter(payload: CharacterPayload) {
  const [chars, resources] = await Promise.all([readCharacters(), loadResources()])
  const now = new Date().toISOString()
  const created: StoredCharacter = {
    ...payload,
    relations: payload.relations || [],
    equipment: payload.equipment || [],
    appearance: payload.appearance,
    disciplines: payload.disciplines || [],
    _id: randomUUID(),
    createdAt: now,
    updatedAt: now
  }

  chars.unshift(created)
  await writeCharacters(chars)
  return hydrate(created, resources)
}

export async function updateCharacter(id: string, payload: CharacterPayload) {
  const [chars, resources] = await Promise.all([readCharacters(), loadResources()])
  const index = chars.findIndex((c) => c._id === id)
  if (index === -1) return null

  const updated: StoredCharacter = {
    ...chars[index],
    ...payload,
    relations: payload.relations || [],
    equipment: payload.equipment || [],
    appearance: payload.appearance,
    disciplines: payload.disciplines || [],
    updatedAt: new Date().toISOString()
  }

  chars[index] = updated
  await writeCharacters(chars)
  return hydrate(updated, resources)
}
