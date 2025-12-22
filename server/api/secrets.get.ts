import { loadResources } from '../utils/resources'

export default defineEventHandler(async () => {
  const data = await loadResources()
  return data.secrets
})
