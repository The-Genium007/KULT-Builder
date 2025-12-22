import { z } from 'zod'

const passivePool: Record<number, number> = { 2: 1, 1: 1, 0: 1 }
const activePool: Record<number, number> = { 3: 1, 2: 1, 1: 2, 0: 1, [-1]: 1, [-2]: 1 }

const passiveValues = z.union([z.literal(2), z.literal(1), z.literal(0)])
const activeValues = z.union([z.literal(3), z.literal(2), z.literal(1), z.literal(0), z.literal(-1), z.literal(-2)])

function validatePool(values: number[], pool: Record<number, number>) {
  const counts = values.reduce<Record<number, number>>((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

  const extra = Object.keys(counts).some((key) => pool[Number(key)] === undefined)
  if (extra) return false

  return Object.entries(pool).every(([key, allowed]) => (counts[Number(key)] || 0) === allowed)
}

export const attributeSchema = z
  .object({
    passive: z.object({
      endurance: passiveValues,
      reflexe: passiveValues,
      volonte: passiveValues
    }),
    active: z.object({
      ame: activeValues,
      charisme: activeValues,
      intuition: activeValues,
      logique: activeValues,
      perception: activeValues,
      sangFroid: activeValues,
      violence: activeValues
    })
  })
  .superRefine((attrs, ctx) => {
    const passiveList = Object.values(attrs.passive)
    const activeList = Object.values(attrs.active)

    if (!validatePool(passiveList, passivePool)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Répartition des caractéristiques passives invalide'
      })
    }

    if (!validatePool(activeList, activePool)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Répartition des caractéristiques actives invalide'
      })
    }
  })

export const characterSchema = z.object({
  name: z.string().min(2).max(120),
  archetype: z.string().min(2, 'Archetype id is required'),
  darkSecret: z.string().min(2, 'Dark secret id is required'),
  attributes: attributeSchema,
  keySkills: z.array(z.string().min(1)).max(8).default([]),
  advantages: z.array(z.string().min(2)).max(4).default([]),
  disadvantages: z.array(z.string().min(2)).max(4).default([]),
  disciplines: z.array(z.string().min(2)).max(6).default([]),
  equipment: z.array(z.string().min(1)).max(12).default([]),
  relations: z.array(z.string().min(1)).max(10).default([]),
  appearance: z.string().max(240).optional(),
  notes: z.string().max(800).optional()
})

export type CharacterInput = z.infer<typeof characterSchema>

export function parseCharacterPayload(body: unknown) {
  return characterSchema.parse(body)
}
