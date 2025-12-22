import { getCharacter } from '../../utils/characterStore'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid character id' })
  }

  const character = await getCharacter(id)

  if (!character) {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }

  return character
})
