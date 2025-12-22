import { defineStore } from 'pinia'
import type { AttributeBlock, CharacterPayload, CharacterResponse } from '~/types/kult'

const DRAFT_KEY = 'kult-builder-draft'

const PASSIVE_POOL: Record<number, number> = { 2: 1, 1: 1, 0: 1 }
const ACTIVE_POOL: Record<number, number> = { 3: 1, 2: 1, 1: 2, 0: 1, [-1]: 1, [-2]: 1 }

function matchesPool(values: (number | null)[], pool: Record<number, number>) {
  const counts = values.reduce<Record<number, number>>((acc, val) => {
    if (val === null) return acc
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).every(([key, used]) => used <= (pool[Number(key)] || 0))
}

function defaultAttributes(): AttributeBlock {
  return {
    passive: {
      endurance: null,
      reflexe: null,
      volonte: null
    },
    active: {
      ame: null,
      charisme: null,
      intuition: null,
      logique: null,
      perception: null,
      sangFroid: null,
      violence: null
    }
  }
}

export const useBuilderStore = defineStore('builder', {
  state: () => ({
    step: 0,
    name: '',
    archetypeId: '',
    darkSecretId: '',
    attributes: defaultAttributes(),
    keySkills: [] as string[],
    advantages: [] as string[],
    disadvantages: [] as string[],
    equipment: [] as string[],
    appearance: '',
    relations: [] as string[],
    notes: ''
  }),
  getters: {
    attributesReady(state): boolean {
      const passive = Object.values(state.attributes.passive)
      const active = Object.values(state.attributes.active)
      const filled = passive.every((v) => v !== null) && active.every((v) => v !== null)
      if (!filled) return false
      return matchesPool(passive, PASSIVE_POOL) && matchesPool(active, ACTIVE_POOL)
    },
    canSave(): boolean {
      return (
        !!this.name &&
        !!this.archetypeId &&
        !!this.darkSecretId &&
        this.attributesReady
      )
    }
  },
  actions: {
    toPayload(): CharacterPayload {
      return {
        name: this.name,
        archetype: this.archetypeId,
        darkSecret: this.darkSecretId,
        attributes: this.attributes,
        keySkills: this.keySkills,
        advantages: this.advantages,
        disadvantages: this.disadvantages,
        disciplines: [],
        equipment: this.equipment,
        appearance: this.appearance,
        relations: this.relations,
        notes: this.notes
      }
    },
    reset() {
      this.step = 0
      this.name = ''
      this.archetypeId = ''
      this.darkSecretId = ''
      this.attributes = defaultAttributes()
      this.keySkills = []
      this.advantages = []
      this.disadvantages = []
      this.equipment = []
      this.appearance = ''
      this.relations = []
      this.notes = ''
      this.persistDraft()
    },
    loadDraft() {
      if (typeof window === 'undefined') return
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (!parsed.attributes?.passive || !parsed.attributes?.active) {
            parsed.attributes = defaultAttributes()
          }
          Object.assign(this.$state, parsed)
        } catch (err) {
          console.warn('Failed to load draft', err)
        }
      }
    },
    persistDraft() {
      if (typeof window === 'undefined') return
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...this.$state,
          step: 0
        })
      )
    },
    loadFromCharacter(char: CharacterResponse) {
      this.name = char.name
      this.archetypeId = char.archetype._id
      this.darkSecretId = char.darkSecret._id
      this.attributes = char.attributes || defaultAttributes()
      this.keySkills = char.keySkills || []
      this.advantages = (char.advantages || []).map((a) => a._id)
      this.disadvantages = (char.disadvantages || []).map((d) => d._id)
      this.equipment = char.equipment || []
      this.appearance = char.appearance || ''
      this.relations = char.relations || []
      this.notes = char.notes || ''
      this.step = 0
      this.persistDraft()
    },
    setStep(step: number) {
      this.step = step
      this.persistDraft()
    }
  }
})
