import { listCharacters } from '../../utils/characterStore'

export default defineEventHandler(async () => {
  return listCharacters()
})
