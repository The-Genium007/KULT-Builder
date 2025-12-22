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

export interface ArchetypeDoc {
  _id: string
  name: string
  tagline: string
  guidance: string
  suggestedAttributes: string[]
  suggestedAdvantages: string[]
  suggestedDisadvantages: string[]
  equipment: string[]
  vibe: string
}

export interface AdvantageDoc {
  _id: string
  name: string
  description: string
  cost: number
  restriction?: string
  tags?: string[]
  archetypes?: string[]
  allowedArchetypes?: string[]
}

export interface DisadvantageDoc {
  _id: string
  name: string
  description: string
  penalty: number
  trigger?: string
  tags?: string[]
  archetypes?: string[]
  allowedArchetypes?: string[]
}

export interface DisciplineDoc {
  _id: string
  name: string
  sphere: string
  tier: number
  effect: string
  risk?: string
}

export interface DarkSecretDoc {
  _id: string
  name: string
  description: string
  hook: string
  archetypes?: string[]
  allowedArchetypes?: string[]
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

export interface CharacterResponse extends Omit<CharacterPayload, 'archetype' | 'darkSecret' | 'advantages' | 'disadvantages'> {
  _id: string
  archetype: ArchetypeDoc
  darkSecret: DarkSecretDoc
  advantages: AdvantageDoc[]
  disadvantages: DisadvantageDoc[]
  disciplines?: DisciplineDoc[]
  createdAt: string
  updatedAt: string
}
