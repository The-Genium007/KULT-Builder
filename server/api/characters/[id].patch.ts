import { ZodError } from 'zod'
import { updateCharacter } from '../../utils/characterStore'
import { loadResources } from '../../utils/resources'
import { parseCharacterPayload } from '../../validators/character'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid character id' })
  }

  const body = await readBody(event)

  try {
    const payload = parseCharacterPayload(body)
    const resources = await loadResources()
    validateReferences(payload, resources)
    const updated = await updateCharacter(id, {
      ...payload,
      advantages: payload.advantages || [],
      disadvantages: payload.disadvantages || [],
      disciplines: payload.disciplines || [],
      keySkills: payload.keySkills || [],
      equipment: payload.equipment || [],
      relations: payload.relations || [],
      appearance: payload.appearance
    })

    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: 'Character not found' })
    }

    return updated
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payload',
        message: err.errors.map((e) => e.message).join(', ')
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update character',
      message: (err as Error).message
    })
  }
})

function validateReferences(
  payload: ReturnType<typeof parseCharacterPayload>,
  resources: Awaited<ReturnType<typeof loadResources>>
) {
  const missing: string[] = []
  if (!resources.archetypes.find((a) => a._id === payload.archetype)) missing.push('archetype')
  if (!resources.secrets.find((s) => s._id === payload.darkSecret)) missing.push('darkSecret')
  if (payload.advantages.some((id) => !resources.advantages.find((a) => a._id === id))) missing.push('advantages')
  if (payload.disadvantages.some((id) => !resources.disadvantages.find((d) => d._id === id)))
    missing.push('disadvantages')
  if (payload.disciplines.some((id) => !resources.disciplines.find((d) => d._id === id))) missing.push('disciplines')

  if (missing.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unknown references',
      message: `Invalid ids for: ${missing.join(', ')}`
    })
  }
}
