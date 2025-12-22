<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import type { ArchetypeDoc, AdvantageDoc, DisadvantageDoc, DarkSecretDoc, CharacterResponse } from '~/types/kult'

const builder = useBuilderStore()
const {
  step,
  name,
  archetypeId,
  darkSecretId,
  appearance,
  attributes,
  keySkills,
  advantages,
  disadvantages,
  equipment,
  relations,
  notes,
  canSave,
  attributesReady
} = storeToRefs(builder)

const maxAdvantages = 3
const maxDisadvantagesBase = 3
const maxSkills = 6
const keySkillInput = ref('')
const equipmentInput = ref('')
const relationInput = ref('')
const message = ref('')
const messageTone = ref<'success' | 'error' | ''>('')
const saving = ref(false)
const importing = ref(false)
const subStep = ref(0)
const adviceModalOpen = ref(false)
const adviceArchetype = ref<ArchetypeDoc | null>(null)
const importInput = ref<HTMLInputElement | null>(null)
const archetypeCounsel: Record<
  string,
  {
    summary: string
    occupations: string[]
  }
> = {
  'arch-agent': {
    summary:
      "Protecteur froid qui traite tout le monde comme une ressource. Analyse vite, agit sans états d’âme et paie un coût moral énorme quand les innocents disparaissent.",
    occupations: [
      'Officier open source',
      'Policier',
      'Analyste antiterrorisme',
      'Agent spécial',
      'Professionnel de la sécurité',
      'Officier du renseignement',
      'Agent infiltré',
      'Espion',
      'Agent dormant'
    ]
  },
  'arch-artiste': {
    summary:
      "Créateur obsédé qui donne corps et âme à son art, capte les âmes des autres et s’abîme dans le processus. Chaque œuvre a un prix payé en esprit ou en chair.",
    occupations: [
      'Auteur',
      'Danseur',
      'Acteur',
      'Peintre',
      'Vidéographe',
      'Photographe',
      'Styliste',
      'Modèle',
      'Musicien',
      'Chanteur',
      'Coach personnel',
      'Maquilleur',
      'Présentateur TV',
      'Réalisateur',
      'Journaliste',
      'Blogueur'
    ]
  },
  'arch-carrieriste': {
    summary:
      "Grimpeur de hiérarchie prêt à poignarder pour avancer. Vit dans les couloirs corporate, mène une lutte darwinienne et sacrifie tout pour sa promotion.",
    occupations: [
      'Avocat',
      'Cadre',
      'Chef de projet',
      'PDG',
      'Consultant',
      'Fonctionnaire',
      'Politicien',
      'Jet-setter',
      'Commercial',
      'Stagiaire',
      'Aristocrate'
    ]
  },
  'arch-condamne': {
    summary:
      "Vit à crédit après un pacte ou une malédiction. Le sablier s’écoule et il est prêt à tout pour repousser la sentence, même sacrifier d’autres vies.",
    occupations: [
      'Occultiste',
      'Échappé d’une secte',
      'Officier de police',
      'PDG',
      'Détective',
      'Officier militaire',
      'Gangster',
      'Politicien',
      'Handicapé',
      'Magicien amateur',
      'Célébrité',
      'Récidiviste',
      'Play-boy',
      'Réfugié',
      'Chercheur',
      'Influenceur'
    ]
  },
  'arch-criminel': {
    summary:
      "Voleurs, gangs et tueurs mues par l’argent et la violence. Quelques-uns s’enrichissent, la plupart grattent les miettes jusqu’à ce qu’un plus dur les écrase.",
    occupations: [
      'Voleur',
      'Cambrioleur',
      'Dealer',
      'Membre de gang',
      'Sans-abri',
      'Boxeur',
      'Flic corrompu',
      'Homme de main',
      'Proprio de club',
      'Maître chanteur',
      'Tueur à gages',
      'Conducteur go fast',
      'Escroc',
      'Gangster'
    ]
  },
  'arch-dement': {
    summary:
      "Esprit brisé après avoir vu derrière l’Illusion. Hanté par des visions, perçoit des vérités mais doute de ses propres sens.",
    occupations: [
      'Sans-abri',
      'Échappé d’asile',
      'Vendeur à la sauvette',
      'Artiste de rue',
      'Receleur',
      'Voleur',
      'Policier',
      'Dealer',
      'Journaliste freelance',
      'Tatoueur',
      'Survivant d’abus'
    ]
  },
  'arch-descendant': {
    summary:
      "Héritier d’un pouvoir ou d’une faute ancestrale. Traqué par le passé, les pactes obscurs et les violences familiales.",
    occupations: [
      'Antiquaire',
      'Aristocrate',
      'Auteur',
      'Tatoueur',
      'Occultiste',
      'Prêtre',
      'Rentier',
      'Employé de bureau',
      'Artisan',
      'Garde forestier'
    ]
  },
  'arch-detective': {
    summary:
      "Obsédé par les réponses, sacrifiant tout le reste. Suivre les pistes l’emmène dans une spirale de solitude et d’addictions.",
    occupations: [
      'Flic de quartier',
      'Détective privé',
      'Avocat',
      'Enquêteur',
      'Agent de sécurité',
      'Journaliste enquêteur',
      'Agent du renseignement',
      'Médium',
      'Pirate informatique',
      'Conspirationniste'
    ]
  },
  'arch-escroc': {
    summary:
      "Manipulateur qui se fait aimer pour mieux dépouiller. Maître de la dissimulation, laisse derrière lui un sillage d’ennemis et d’arnaques.",
    occupations: [
      'Mannequin',
      'Escort',
      'Rentier',
      'Jet-setter',
      'Secrétaire',
      'Organisateur de fêtes',
      'Arnaqueur',
      'Gigolo',
      'Informateur',
      'Star du porno'
    ]
  },
  'arch-facilitateur': {
    summary:
      "Courtier en tout (drogues, armes, infos) qui prend sa part. Multiplie succès et ennemis, prêt à tout tant qu’il y a de l’argent.",
    occupations: [
      'Parrain de mafia',
      'Homme d’affaires',
      'Agent immobilier',
      'Dealer',
      'Patron de club',
      'Receleur',
      'Bookmaker',
      'Extorqueur',
      'Conseiller',
      'Consigliere'
    ]
  },
  'arch-investigateur': {
    summary:
      "Explorateur des mythes urbains, démêle le vrai du faux en ligne et dans les rumeurs. Prêt à tout pour exposer la Vérité.",
    occupations: [
      'Étudiant',
      'Blogueur',
      'Pirate informatique',
      'Activiste',
      'Chercheur',
      'Parapsychologue',
      'Auteur',
      'Journaliste',
      'Médium',
      'Conspirationniste'
    ]
  },
  'arch-jouet': {
    summary:
      "Existence de soumission et de dépendance. Veut briser ses chaînes mais reste l’objet des autres, ballotté entre vide et espoirs brisés.",
    occupations: [
      'Mannequin',
      'Strip-teaseur',
      'Trophée',
      'Gigolo',
      'Acteur',
      'Échappé d’expérience',
      'Influenceur',
      'Escort',
      'Survivant d’abus',
      'Victime de trafic humain'
    ]
  },
  'arch-nettoyeur': {
    summary:
      "Résout les problèmes par des moyens radicaux. Aucune empathie, aucune erreur permise. Une fois lancé en chasse, rien ne l’arrête.",
    occupations: [
      'Tueur à gages',
      'Homme de main',
      'Agent spécial',
      'Flic d’intervention',
      'Militaire',
      'Tireur d’élite'
    ]
  },
  'arch-occultiste': {
    summary:
      "Cherche à maîtriser des forces occultes qu’il comprend mal. La magie a un prix et la dette se rapproche.",
    occupations: [
      'Antiquaire',
      'Médium',
      'Exorciste',
      'Linguiste',
      'Professeur',
      'Employé de morgue',
      'Étudiant',
      'Bouquiniste',
      'Mystique'
    ]
  },
  'arch-prophete': {
    summary:
      "Chef religieux ou sectaire, baignant dans le pouvoir communautaire et ses ombres (abus, doctrine pervertie).",
    occupations: [
      'Prêtre',
      'Pasteur',
      'Imam',
      'Rabbin',
      'Gourou',
      'Membre ou rescapé de secte',
      'Voyant',
      'Missionnaire',
      'Oracle'
    ]
  },
  'arch-scientifique': {
    summary:
      "Expérimente aux frontières du réel pour trouver la vérité. Ses essais déchirent le voile et ont des retombées dramatiques.",
    occupations: ['Docteur', 'Psychologue', 'Chirurgien', 'Inventeur', 'Ingénieur', 'Technicien', 'Physicien', 'Thérapeute']
  },
  'arch-universitaire': {
    summary:
      "Intellectuel persuadé qu’une autre vérité se cache derrière les modèles établis. Risque la disgrâce pour ses recherches alternatives.",
    occupations: [
      'Professeur',
      'Étudiant',
      'Doctorant',
      'Enseignant',
      'Conseiller',
      'Politicien',
      'Auteur',
      'Présentateur',
      'Chercheur',
      'Psychologue',
      'Archéologue'
    ]
  },
  'arch-vagabond': {
    summary:
      "Toujours sur la route pour fuir ses origines ou ses poursuivants. Vit avec peu, dans des abris de fortune, sans attaches.",
    occupations: [
      'Sans-abri',
      'Nomade',
      'Témoin sous protection',
      'Routard',
      'Réfugié',
      'Évadé de prison',
      'Vendeur itinérant',
      'Coursier',
      'Travailleur saisonnier'
    ]
  },
  'arch-vengeur': {
    summary:
      "Tout perdre l’a poussé à chercher le sang pour compenser. La vengeance est son moteur, quoi qu’il en coûte.",
    occupations: [
      'Homme ou femme au foyer',
      'Officier de police',
      'Mendiant',
      'Étudiant',
      'Criminel',
      'Conspirationniste',
      'Réfugié',
      'Boxeur',
      'Homme d’affaires ruiné'
    ]
  },
  'arch-veteran': {
    summary:
      "A survécu aux champs de bataille et porte ses cicatrices. Habitué à la guerre, reconverti en sécurité ou mercenariat.",
    occupations: [
      'Agent spécial',
      'Soldat',
      'Mercenaire',
      'Combattant MMA',
      'Officier militaire',
      'Agent de sécurité',
      'Garde du corps',
      'Réfugié de guerre',
      'Police militaire'
    ]
  },
  'arch-dormeur': {
    summary:
      "Vit dans une bulle confortable de distractions, ignorant l’Illusion. Plus faible que les autres archétypes, il devra se réveiller pour choisir sa voie.",
    occupations: ['Libre : aucune restriction, choisis ce qui te plaît']
  }
}
const subStepLabels: Record<number, string[]> = {
  1: ['Secret', 'Avantages', 'Désavantages'],
  2: ['Attributs', 'Compétences'],
  3: ['Identité', 'Équipement', 'Relations & notes']
}

const passiveAttributeList = [
  { key: 'endurance', label: 'Endurance' },
  { key: 'reflexe', label: 'Réflexe' },
  { key: 'volonte', label: 'Volonté' }
] as const
const activeAttributeList = [
  { key: 'ame', label: 'Âme' },
  { key: 'charisme', label: 'Charisme' },
  { key: 'intuition', label: 'Intuition' },
  { key: 'logique', label: 'Logique' },
  { key: 'perception', label: 'Perception' },
  { key: 'sangFroid', label: 'Sang-froid' },
  { key: 'violence', label: 'Violence' }
] as const

const passivePool: Record<number, number> = { 2: 1, 1: 1, 0: 1 }
const activePool: Record<number, number> = { 3: 1, 2: 1, 1: 2, 0: 1, [-1]: 1, [-2]: 1 }
const passiveValueChoices = [2, 1, 0]
const activeValueChoices = [3, 2, 1, 0, -1, -2]

function allowedArchetypeList(item: { archetypes?: string[]; allowedArchetypes?: string[] } | null | undefined) {
  if (!item) return []
  if (item.allowedArchetypes?.length) return item.allowedArchetypes
  if (item.archetypes?.length) return item.archetypes
  return []
}

function isAllowedForArchetype(item: { archetypes?: string[]; allowedArchetypes?: string[] } | null | undefined) {
  const list = allowedArchetypeList(item)
  if (!list.length) return false
  if (!archetypeId.value) return false
  return list.includes(archetypeId.value)
}

const { data: archetypeData, pending: archetypesLoading, error: archetypesError } = await useFetch<ArchetypeDoc[]>(
  '/api/archetypes'
)
const { data: advantageData, pending: advantagesLoading, error: advantagesError } = await useFetch<AdvantageDoc[]>(
  '/api/advantages'
)
const {
  data: disadvantageData,
  pending: disadvantagesLoading,
  error: disadvantagesError
} = await useFetch<DisadvantageDoc[]>('/api/disadvantages')
const { data: secretData, pending: secretsLoading, error: secretsError } = await useFetch<DarkSecretDoc[]>('/api/secrets')
const {
  data: characters,
  pending: charactersLoading,
  error: charactersError,
  refresh: refreshCharacters
} = await useFetch<CharacterResponse[]>('/api/characters')

const LOCAL_CHARACTERS_KEY = 'kult-characters-cache'
const localCharacters = ref<CharacterResponse[]>([])

const apiOnline = computed(
  () => !archetypesError.value && !advantagesError.value && !disadvantagesError.value && !secretsError.value
)

const steps = [
  { id: 0, title: 'Archétype', detail: 'Choisis ta voie initiale.' },
  { id: 1, title: 'Traits', detail: 'Avantages, désavantages et sombre secret.' },
  { id: 2, title: 'Attributs & compétences', detail: 'Répartis tes points.' },
  { id: 3, title: 'Identité & relations', detail: 'Nom, apparence, équipement, liens.' },
  { id: 4, title: 'Résumé', detail: 'Relis avant de briser l’Illusion.' }
]

const selectedArchetype = computed(() => archetypeData.value?.find((a) => a._id === archetypeId.value))
const selectedSecret = computed(() => secretData.value?.find((s) => s._id === darkSecretId.value))
const availableSecrets = computed(() => (secretData.value || []).filter((s) => isAllowedForArchetype(s)))
const availableAdvantages = computed(() => (advantageData.value || []).filter((s) => isAllowedForArchetype(s)))
const availableDisadvantages = computed(() => (disadvantageData.value || []).filter((s) => isAllowedForArchetype(s)))
const displayedCharacters = computed(() => {
  if (characters.value && characters.value.length > 0) return characters.value
  return localCharacters.value || []
})
const currentMaxDisadvantages = computed(() => {
  const twoCap = [
    'arch-agent',
    'arch-artiste',
    'arch-carrieriste',
    'arch-condamne',
    'arch-criminel',
    'arch-dement',
  'arch-demon',
  'arch-detective',
  'arch-descendant',
  'arch-escroc',
  'arch-facilitateur',
  'arch-investigateur',
  'arch-jouet',
  'arch-nettoyeur',
  'arch-occultiste',
  'arch-prophete',
  'arch-scientifique',
  'arch-universitaire',
  'arch-vagabond',
  'arch-vengeur',
  'arch-veteran',
  'arch-dormeur'
  ]
  if (twoCap.includes(archetypeId.value)) return 2
  return maxDisadvantagesBase
})

function goToStep(id: number) {
  step.value = id
  subStep.value = 0
}

function maxSubStepFor(stepId: number) {
  return Math.max((subStepLabels[stepId]?.length || 1) - 1, 0)
}

function remainingPool(pool: Record<number, number>, group: Record<string, number | null>) {
  const counts = Object.values(group).reduce<Record<number, number>>((acc, val) => {
    if (val === null) return acc
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

  return Object.entries(pool).map(([value, allowed]) => ({
    value: Number(value),
    remaining: allowed - (counts[Number(value)] || 0)
  }))
}

function isOptionDisabled(group: Record<string, number | null>, pool: Record<number, number>, key: string, value: number) {
  const counts = Object.entries(group).reduce<Record<number, number>>((acc, [k, val]) => {
    if (val === null) return acc
    if (k === key && val === value) return acc
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
  return (counts[value] || 0) >= (pool[value] || 0)
}

function formatAttribute(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return value > 0 ? `+${value}` : `${value}`
}

const attributesStepReady = computed(() => attributesReady.value)
const passiveRemaining = computed(() => remainingPool(passivePool, attributes.value.passive))
const activeRemaining = computed(() => remainingPool(activePool, attributes.value.active))

const canAdvanceCurrentStep = computed(() => {
  if (step.value >= steps.length - 1) return false
  switch (step.value) {
    case 0:
      return !!archetypeId.value
    case 1:
      if (subStep.value === 0) return !!darkSecretId.value
      if (subStep.value === 1) return advantages.value.length > 0
      return disadvantages.value.length >= currentMaxDisadvantages.value
    case 2:
      if (subStep.value === 0) return attributesStepReady.value
      return keySkills.value.length > 0
    case 3:
      if (subStep.value === 0) return !!name.value && !!appearance.value
      if (subStep.value === 1) return equipment.value.length > 0
      return relations.value.length > 0 || (!!notes.value && notes.value.trim().length > 0)
    default:
      return false
  }
})

const canGoPrev = computed(() => !(step.value === 0 && subStep.value === 0))

function goPrev() {
  if (!canGoPrev.value) return
  if (subStep.value > 0) {
    subStep.value -= 1
    return
  }
  if (step.value > 0) {
    step.value -= 1
    subStep.value = maxSubStepFor(step.value)
  }
}

function goNext() {
  if (!canAdvanceCurrentStep.value) return
  const maxSub = maxSubStepFor(step.value)
  if (subStep.value < maxSub) {
    subStep.value += 1
    return
  }
  if (step.value < steps.length - 1) {
    step.value += 1
    subStep.value = 0
  }
}

watch(
  () => availableSecrets.value.map((s) => s._id),
  (ids) => {
    if (!secretData.value || !secretData.value.length) return
    if (darkSecretId.value && !ids.includes(darkSecretId.value)) {
      darkSecretId.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => availableAdvantages.value.map((s) => s._id),
  (ids) => {
    if (!advantageData.value || !advantageData.value.length) return
    const allowed = new Set(ids)
    advantages.value = advantages.value.filter((id) => allowed.has(id))
  },
  { immediate: true }
)

watch(
  () => availableDisadvantages.value.map((s) => s._id),
  (ids) => {
    if (!disadvantageData.value || !disadvantageData.value.length) return
    const allowed = new Set(ids)
    disadvantages.value = disadvantages.value.filter((id) => allowed.has(id))
  },
  { immediate: true }
)

function toggleSelection(target: string[], id: string, limit: number) {
  if (target.includes(id)) {
    return target.filter((x) => x !== id)
  }
  if (target.length >= limit) return target
  return [...target, id]
}

function toggleAdvantage(id: string) {
  advantages.value = toggleSelection(advantages.value, id, maxAdvantages)
}

function toggleDisadvantage(id: string) {
  disadvantages.value = toggleSelection(disadvantages.value, id, currentMaxDisadvantages.value)
}

function addKeySkill() {
  const val = keySkillInput.value.trim()
  if (!val) return
  if (keySkills.value.includes(val)) return
  if (keySkills.value.length >= maxSkills) return
  keySkills.value = [...keySkills.value, val]
  keySkillInput.value = ''
}

function removeSkill(skill: string) {
  keySkills.value = keySkills.value.filter((s) => s !== skill)
}

function addEquipment() {
  const val = equipmentInput.value.trim()
  if (!val) return
  equipment.value = [...equipment.value, val]
  equipmentInput.value = ''
}

function removeEquipment(item: string) {
  equipment.value = equipment.value.filter((s) => s !== item)
}

function addRelation() {
  const val = relationInput.value.trim()
  if (!val) return
  if (relations.value.includes(val)) return
  relations.value = [...relations.value, val]
  relationInput.value = ''
}

function removeRelation(item: string) {
  relations.value = relations.value.filter((s) => s !== item)
}

async function saveCharacter() {
  if (!apiOnline.value) {
    messageTone.value = 'error'
    message.value = 'API hors ligne : vérifie les JSON (server/data) et relance le serveur.'
    return
  }

  if (!canSave.value) {
    messageTone.value = 'error'
    message.value = 'Complète les champs obligatoires et répartis tous les points.'
    return
  }

  saving.value = true
  message.value = ''
  messageTone.value = ''

  try {
    await $fetch('/api/characters', {
      method: 'POST',
      body: builder.toPayload()
    })
    messageTone.value = 'success'
    message.value = 'Personnage sauvegardé. Les Archontes frémissent.'
    await refreshCharacters()
    builder.reset()
    keySkillInput.value = ''
    equipmentInput.value = ''
    relationInput.value = ''
    step.value = 0
    subStep.value = 0
  } catch (err: any) {
    messageTone.value = 'error'
    message.value = err?.data?.message || err?.message || 'Impossible de sauvegarder.'
  } finally {
    saving.value = false
  }
}

function loadCharacterToBuilder(char: CharacterResponse) {
  builder.loadFromCharacter(char)
  step.value = 0
  subStep.value = 0
}

function handleReset() {
  builder.reset()
  keySkillInput.value = ''
  equipmentInput.value = ''
  relationInput.value = ''
  subStep.value = 0
  step.value = 0
}

function openAdvice(arch: ArchetypeDoc) {
  adviceArchetype.value = arch
  adviceModalOpen.value = true
}

function closeAdvice() {
  adviceModalOpen.value = false
}

function loadLocalCharacters() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(LOCAL_CHARACTERS_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      localCharacters.value = parsed as CharacterResponse[]
    }
  } catch (err) {
    console.warn('Failed to load local characters', err)
  }
}

function persistLocalCharacters(list: CharacterResponse[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_CHARACTERS_KEY, JSON.stringify(list))
}

async function copyCharacterJson(char: CharacterResponse) {
  const payload = JSON.stringify(char, null, 2)
  try {
    await navigator.clipboard.writeText(payload)
    messageTone.value = 'success'
    message.value = 'Personnage copié en JSON dans le presse-papiers.'
  } catch (err: any) {
    messageTone.value = 'error'
    message.value = 'Impossible de copier dans le presse-papiers.'
    console.error(err)
  }
}

function downloadCharacterJson(char: CharacterResponse) {
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${char.name || 'personnage'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  importInput.value?.click()
}

async function handleImport(evt: Event) {
  const file = (evt.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  try {
    importing.value = true
    const raw = await file.text()
    const parsed = JSON.parse(raw)
    const list = Array.isArray(parsed) ? parsed : [parsed]
    for (const item of list) {
      const payload = {
        name: item.name,
        archetype: item.archetype?._id || item.archetype,
        darkSecret: item.darkSecret?._id || item.darkSecret,
        attributes: item.attributes,
        keySkills: item.keySkills || [],
        advantages: (item.advantages || []).map((a: any) => (a?._id ? a._id : a)),
        disadvantages: (item.disadvantages || []).map((d: any) => (d?._id ? d._id : d)),
        disciplines: (item.disciplines || []).map((d: any) => (d?._id ? d._id : d)),
        equipment: item.equipment || [],
        relations: item.relations || [],
        appearance: item.appearance || '',
        notes: item.notes || ''
      }
      await $fetch('/api/characters', { method: 'POST', body: payload })
    }
    messageTone.value = 'success'
    message.value = 'Import JSON effectué. Rafraîchis la liste pour voir les nouveaux personnages.'
    await refreshCharacters()
  } catch (err: any) {
    console.error(err)
    messageTone.value = 'error'
    message.value = 'Import JSON impossible : vérifie le format du fichier.'
  } finally {
    importing.value = false
    if (importInput.value) importInput.value.value = ''
  }
}

onMounted(() => {
  builder.loadDraft()
  loadLocalCharacters()
  watch(
    () => ({ ...builder.$state }),
    () => builder.persistDraft(),
    { deep: true }
  )
})

watch(characters, (val) => {
  if (val && val.length) {
    persistLocalCharacters(val as CharacterResponse[])
    localCharacters.value = val as CharacterResponse[]
  }
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-10 space-y-10">
    <section class="space-y-2">
      <p class="uppercase tracking-[0.2em] text-xs text-ash/60">KULT, Divinité perdue</p>
      <h1 class="text-3xl font-serif text-ash">Conseil du maitre du jeu</h1>
      <p class="text-ash/80">
        Concentre-toi sur la création : archétype, traits, attributs, identité, équipement et relations. Sauvegarde puis
        recharge en un clic.
      </p>
    </section>

    <section id="builder" class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="section-title">Forge du personnage</h2>
          <button
            class="px-3 py-2 rounded-lg border border-iron/60 text-ash hover:bg-iron disabled:opacity-50"
            type="button"
            :disabled="importing"
            @click="triggerImport"
          >
            Import JSON
          </button>
          <input
            ref="importInput"
            type="file"
            accept="application/json"
            class="hidden"
            @change="handleImport"
          />
        </div>
      </div>
      <div class="card p-6 space-y-6">
        <div class="grid gap-3 md:grid-cols-6">
          <button
            v-for="s in steps"
            :key="s.id"
            class="text-left rounded-xl border border-iron/60 bg-iron/70 p-3 hover:border-blood/50 transition"
            :class="{
              'border-blood/70 shadow-glow': step === s.id,
              'border-blood bg-blood/25 text-ash': step > s.id,
              'opacity-80': step !== s.id
            }"
            @click="goToStep(s.id)"
          >
            <p class="text-xs uppercase tracking-[0.15em] text-ash/60">Étape {{ s.id + 1 }}</p>
            <p class="text-ash font-semibold">{{ s.title }}</p>
            <p class="text-ash/60 text-xs">{{ s.detail }}</p>
          </button>
        </div>

        <div v-if="message" class="p-4 rounded-xl" :class="messageTone === 'success' ? 'bg-emerald-700/30' : 'bg-blood/20'">
          {{ message }}
        </div>

        <div v-if="step === 0" class="space-y-4">
          <p class="text-sm text-ash/80 mb-2">Archétype</p>
          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="arch in archetypeData"
              :key="arch._id"
              class="border border-iron/60 rounded-xl p-4 cursor-pointer hover:border-blood/50 transition"
              :class="{ 'border-blood shadow-glow': archetypeId === arch._id }"
              @click="archetypeId = arch._id"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-serif text-ash">{{ arch.name }}</h4>
                <button
                  class="pill text-xs hover:border-blood/70"
                  type="button"
                  @click.stop="openAdvice(arch)"
                >
                  Conseil
                </button>
              </div>
              <p class="text-sm text-ash/70">{{ arch.tagline }}</p>
              <p class="text-xs text-ash/60 mt-1">{{ arch.guidance }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="step === 1" class="space-y-4">
          <div class="flex flex-wrap gap-2" v-if="subStepLabels[1]">
            <button
              v-for="(label, idx) in subStepLabels[1]"
              :key="label"
              class="px-3 py-1 rounded-full border border-iron/60 text-xs"
              :class="subStep === idx ? 'border-blood text-ash shadow-glow' : 'text-ash/70'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-3">
            <label class="text-sm text-ash/80">Dark Secret (obligatoire)</label>
            <div class="mt-2 grid gap-2 md:grid-cols-2">
              <div
                v-for="secret in availableSecrets"
                :key="secret._id"
                class="border border-iron/60 rounded-lg p-3 hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood shadow-glow': darkSecretId === secret._id }"
                @click="darkSecretId = secret._id"
              >
                <p class="text-ash font-semibold">{{ secret.name }}</p>
                <p class="text-ash/70 text-sm">{{ secret.description }}</p>
                <p class="text-ash/60 text-xs mt-1">Hook : {{ secret.hook }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="subStep === 1" class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-serif text-ash">Avantages</h4>
              <span class="pill text-xs">{{ advantages.length }} / {{ maxAdvantages }}</span>
            </div>
            <div class="grid gap-2 md:grid-cols-2">
              <label
                v-for="adv in availableAdvantages"
                :key="adv._id"
                class="flex items-start gap-3 p-3 border border-iron/60 rounded-lg hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood shadow-glow': advantages.includes(adv._id) }"
              >
                <input
                  :checked="advantages.includes(adv._id)"
                  type="checkbox"
                  class="mt-1 text-blood bg-iron border-iron/50 rounded"
                  :disabled="!advantages.includes(adv._id) && advantages.length >= maxAdvantages"
                  @change="toggleAdvantage(adv._id)"
                />
                <div>
                  <p class="text-ash font-semibold">{{ adv.name }} <span class="text-xs text-ash/60">(+{{ adv.cost }})</span></p>
                  <p class="text-sm text-ash/70">{{ adv.description }}</p>
                </div>
              </label>
            </div>
          </div>
          <div v-else class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-serif text-ash">Désavantages</h4>
              <span class="pill text-xs">{{ disadvantages.length }} / {{ currentMaxDisadvantages }}</span>
            </div>
            <div class="grid gap-2 md:grid-cols-2">
              <label
                v-for="dis in availableDisadvantages"
                :key="dis._id"
                class="flex items-start gap-3 p-3 border border-iron/60 rounded-lg hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood shadow-glow': disadvantages.includes(dis._id) }"
              >
                <input
                  :checked="disadvantages.includes(dis._id)"
                  type="checkbox"
                  class="mt-1 text-blood bg-iron border-iron/50 rounded"
                  :disabled="!disadvantages.includes(dis._id) && disadvantages.length >= currentMaxDisadvantages"
                  @change="toggleDisadvantage(dis._id)"
                />
                <div>
                  <p class="text-ash font-semibold">
                    {{ dis.name }} <span class="text-xs text-ash/60">({{ dis.penalty }})</span>
                  </p>
                  <p class="text-sm text-ash/70">{{ dis.description }}</p>
                  <p class="text-xs text-ash/60">Déclencheur : {{ dis.trigger }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div v-else-if="step === 2" class="space-y-4">
          <div class="flex flex-wrap gap-2" v-if="subStepLabels[2]">
            <button
              v-for="(label, idx) in subStepLabels[2]"
              :key="label"
              class="px-3 py-1 rounded-full border border-iron/60 text-xs"
              :class="subStep === idx ? 'border-blood text-ash shadow-glow' : 'text-ash/70'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-6">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-sm text-ash/80">Caractéristiques passives</p>
                <div class="flex flex-wrap gap-2 text-xs text-ash/60">
                  <span
                    v-for="rem in passiveRemaining"
                    :key="`passive-${rem.value}`"
                    class="px-2 py-1 rounded-full border border-iron/50"
                  >
                    {{ rem.value > 0 ? `+${rem.value}` : rem.value }} : {{ rem.remaining }} restant(s)
                  </span>
                </div>
              </div>
              <div class="grid md:grid-cols-3 gap-4">
                <div
                  v-for="attr in passiveAttributeList"
                  :key="attr.key"
                  class="border border-iron/60 rounded-xl p-3 space-y-2 bg-iron/40"
                >
                  <label class="text-ash/80 text-sm">{{ attr.label }}</label>
                  <select
                    v-model="(attributes.passive as any)[attr.key]"
                    class="w-full rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
                  >
                    <option :value="null" disabled>Choisir une valeur</option>
                    <option
                      v-for="opt in passiveValueChoices"
                      :key="opt"
                      :value="opt"
                      :disabled="isOptionDisabled(attributes.passive as any, passivePool, attr.key, opt)"
                    >
                      {{ opt > 0 ? `+${opt}` : opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-sm text-ash/80">Caractéristiques actives</p>
                <div class="flex flex-wrap gap-2 text-xs text-ash/60">
                  <span
                    v-for="rem in activeRemaining"
                    :key="`active-${rem.value}`"
                    class="px-2 py-1 rounded-full border border-iron/50"
                  >
                    {{ rem.value > 0 ? `+${rem.value}` : rem.value }} : {{ rem.remaining }} restant(s)
                  </span>
                </div>
              </div>
              <div class="grid md:grid-cols-3 gap-4">
                <div
                  v-for="attr in activeAttributeList"
                  :key="attr.key"
                  class="border border-iron/60 rounded-xl p-3 space-y-2 bg-iron/40"
                >
                  <label class="text-ash/80 text-sm">{{ attr.label }}</label>
                  <select
                    v-model="(attributes.active as any)[attr.key]"
                    class="w-full rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
                  >
                    <option :value="null" disabled>Choisir une valeur</option>
                    <option
                      v-for="opt in activeValueChoices"
                      :key="opt"
                      :value="opt"
                      :disabled="isOptionDisabled(attributes.active as any, activePool, attr.key, opt)"
                    >
                      {{ opt > 0 ? `+${opt}` : opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="space-y-2">
            <label class="text-sm text-ash/80">Compétences clés (max {{ maxSkills }})</label>
            <div class="flex gap-2 mt-2">
              <input
                v-model="keySkillInput"
                type="text"
                placeholder="Observation, Improvisation..."
                class="flex-1 rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
                @keyup.enter="addKeySkill"
              />
              <button class="px-3 rounded-lg bg-blood/30 border border-blood/40" type="button" @click="addKeySkill">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="skill in keySkills"
                :key="skill"
                class="pill cursor-pointer"
                @click="removeSkill(skill)"
              >
                {{ skill }} ✕
              </span>
            </div>
          </div>
        </div>

          <div v-else-if="step === 3" class="space-y-4">
          <div class="flex flex-wrap gap-2" v-if="subStepLabels[3]">
            <button
              v-for="(label, idx) in subStepLabels[3]"
              :key="label"
              class="px-3 py-1 rounded-full border border-iron/60 text-xs"
              :class="subStep === idx ? 'border-blood text-ash shadow-glow' : 'text-ash/70'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-3">
            <label class="text-sm text-ash/80">Identité</label>
            <div>
              <input
                v-model="name"
                type="text"
                placeholder="Nom du personnage"
                class="w-full rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm text-ash/80">Apparence</label>
              <textarea
                v-model="appearance"
                rows="3"
                placeholder="Silhouette, vêtements, attitudes..."
                class="w-full rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
              ></textarea>
            </div>
          </div>
          <div v-else-if="subStep === 1" class="space-y-2">
            <label class="text-sm text-ash/80">Équipement</label>
            <div class="flex gap-2 mt-2">
              <input
                v-model="equipmentInput"
                type="text"
                placeholder="Lampe tempête, pendentif..."
                class="flex-1 rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
                @keyup.enter="addEquipment"
              />
              <button class="px-3 rounded-lg bg-blood/30 border border-blood/40" type="button" @click="addEquipment">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="item in equipment"
                :key="item"
                class="pill cursor-pointer"
                @click="removeEquipment(item)"
              >
                {{ item }} ✕
              </span>
            </div>
          </div>
          <div v-else class="space-y-3">
            <label class="text-sm text-ash/80">Relations & ressorts dramatiques</label>
            <div class="flex gap-2">
              <input
                v-model="relationInput"
                type="text"
                placeholder="Ex : Cousin détective, collègue suspicieux, contact de rue..."
                class="flex-1 rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
                @keyup.enter="addRelation"
              />
              <button class="px-3 rounded-lg bg-blood/30 border border-blood/40" type="button" @click="addRelation">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="rel in relations" :key="rel" class="pill cursor-pointer" @click="removeRelation(rel)">
                {{ rel }} ✕
              </span>
            </div>
            <label class="text-sm text-ash/80">Notes</label>
            <textarea
              v-model="notes"
              rows="4"
              class="mt-1 w-full rounded-lg bg-iron/70 border border-iron/40 text-ash focus:border-blood focus:ring-blood"
              placeholder="Accroches, motivations, détails supplémentaires..."
            ></textarea>
          </div>
        </div>

        <div v-else-if="step === 4" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="card-ghost p-4 space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60">Identité</p>
              <p class="text-ash text-lg font-serif">{{ name || 'Sans nom' }}</p>
              <p class="text-ash/70">Archétype : {{ selectedArchetype?.name || '—' }}</p>
              <p class="text-ash/70">Secret : {{ selectedSecret?.name || '—' }}</p>
              <p class="text-ash/70">Apparence : {{ appearance || '—' }}</p>
            </div>
            <div class="card-ghost p-4 space-y-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60">Caractéristiques passives</p>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <span>Endurance : {{ formatAttribute(attributes.passive.endurance) }}</span>
                <span>Réflexe : {{ formatAttribute(attributes.passive.reflexe) }}</span>
                <span>Volonté : {{ formatAttribute(attributes.passive.volonte) }}</span>
              </div>
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60">Caractéristiques actives</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <span>Âme : {{ formatAttribute(attributes.active.ame) }}</span>
                <span>Charisme : {{ formatAttribute(attributes.active.charisme) }}</span>
                <span>Intuition : {{ formatAttribute(attributes.active.intuition) }}</span>
                <span>Logique : {{ formatAttribute(attributes.active.logique) }}</span>
                <span>Perception : {{ formatAttribute(attributes.active.perception) }}</span>
                <span>Sang-froid : {{ formatAttribute(attributes.active.sangFroid) }}</span>
                <span>Violence : {{ formatAttribute(attributes.active.violence) }}</span>
              </div>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-3 text-sm">
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mb-1">Compétences</p>
              <p class="text-ash/80">{{ keySkills.join(', ') || '—' }}</p>
            </div>
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mb-1">Avantages</p>
              <p class="text-ash/80">
                {{
                  advantages
                    .map((id) => advantageData?.find((a) => a._id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || '—'
                }}
              </p>
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mt-2 mb-1">Désavantages</p>
              <p class="text-ash/80">
                {{
                  disadvantages
                    .map((id) => disadvantageData?.find((a) => a._id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || '—'
                }}
              </p>
            </div>
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mb-1">Relations</p>
              <p class="text-ash/80">
                {{ relations.join(', ') || '—' }}
              </p>
            </div>
          </div>
          <div class="card-ghost p-3 text-sm text-ash/80">
            <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mb-1">Équipement</p>
            <p>{{ equipment.join(', ') || '—' }}</p>
            <p class="text-xs uppercase tracking-[0.2em] text-ash/60 mt-2 mb-1">Notes</p>
            <p>{{ notes || '—' }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="px-5 py-3 rounded-xl bg-blood/30 border border-blood/60 text-ash shadow-glow disabled:opacity-50"
              :disabled="saving"
              type="button"
              @click="saveCharacter"
            >
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
            <button
              class="px-4 py-3 rounded-xl border border-iron/70 text-ash hover:bg-iron"
              type="button"
              @click="handleReset"
            >
              Réinitialiser
            </button>
            <p class="text-xs text-ash/60">
              Sauvegarde possible quand nom, archétype, secret sont définis et que les points sont répartis.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-iron/60">
          <button
            class="px-4 py-2 rounded-lg border border-iron/60 text-ash hover:bg-iron disabled:opacity-50"
            type="button"
            :disabled="!canGoPrev"
            @click="goPrev"
          >
            Étape précédente
          </button>
          <div class="flex items-center gap-3">
            <span class="text-xs text-ash/60">Sous-étape {{ subStep + 1 }} / {{ maxSubStepFor(step) + 1 }}</span>
            <button
              class="px-4 py-2 rounded-lg bg-blood/30 border border-blood/40 text-ash shadow-glow disabled:opacity-50"
              type="button"
              :disabled="step >= steps.length - 1 || !canAdvanceCurrentStep"
              @click="goNext"
            >
              Étape suivante
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="characters" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="section-title">Personnages sauvegardées</h2>
        <button
          class="px-4 py-2 rounded-lg border border-iron/60 text-ash hover:bg-iron"
          type="button"
          @click="() => refreshCharacters()"
        >
          Rafraîchir
        </button>
      </div>
      <div v-if="charactersError" class="text-blood text-sm">
        Impossible de charger les personnages. Vérifie le fichier <code>server/data/characters.json</code>.
      </div>
      <div v-else-if="charactersLoading" class="text-ash/70 text-sm">Chargement...</div>
      <div v-else class="grid md:grid-cols-2 gap-4">
        <div v-for="char in displayedCharacters" :key="char._id" class="card p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-ash/60">Personnage</p>
              <h4 class="text-xl font-serif text-ash">{{ char.name }}</h4>
            </div>
            <button
              class="px-3 py-2 rounded-lg border border-blood/50 text-ash hover:bg-blood/20"
              type="button"
              @click="loadCharacterToBuilder(char)"
            >
              Charger dans le builder
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1 rounded-lg border border-iron/50 text-ash hover:border-blood/50 text-xs"
              type="button"
              @click="copyCharacterJson(char)"
            >
              Copier JSON
            </button>
            <button
              class="px-3 py-1 rounded-lg border border-iron/50 text-ash hover:border-blood/50 text-xs"
              type="button"
              @click="downloadCharacterJson(char)"
            >
              Télécharger JSON
            </button>
          </div>
          <p class="text-ash/70 text-sm">Archétype : {{ char.archetype?.name }}</p>
          <p class="text-ash/70 text-sm">Secret : {{ char.darkSecret?.name }}</p>
          <p class="text-ash/70 text-sm">Apparence : {{ char.appearance || '—' }}</p>
          <p class="text-ash/70 text-sm">
            Passives :
            Endurance {{ formatAttribute(char.attributes?.passive?.endurance ?? null) }},
            Réflexe {{ formatAttribute(char.attributes?.passive?.reflexe ?? null) }},
            Volonté {{ formatAttribute(char.attributes?.passive?.volonte ?? null) }}
          </p>
          <p class="text-ash/70 text-sm">
            Actives :
            Âme {{ formatAttribute(char.attributes?.active?.ame ?? null) }},
            Charisme {{ formatAttribute(char.attributes?.active?.charisme ?? null) }},
            Intuition {{ formatAttribute(char.attributes?.active?.intuition ?? null) }},
            Logique {{ formatAttribute(char.attributes?.active?.logique ?? null) }},
            Perception {{ formatAttribute(char.attributes?.active?.perception ?? null) }},
            Sang-froid {{ formatAttribute(char.attributes?.active?.sangFroid ?? null) }},
            Violence {{ formatAttribute(char.attributes?.active?.violence ?? null) }}
          </p>
          <p class="text-ash/70 text-sm">Avantages : {{ char.advantages.map((a) => a.name).join(', ') || '—' }}</p>
          <p class="text-ash/70 text-sm">Désavantages : {{ char.disadvantages.map((d) => d.name).join(', ') || '—' }}</p>
          <p class="text-ash/70 text-sm">Relations : {{ char.relations?.join(', ') || '—' }}</p>
          <p class="text-ash/70 text-sm">Équipement : {{ char.equipment?.join(', ') || '—' }}</p>
          <p class="text-ash/60 text-xs max-h-12 overflow-hidden">Notes : {{ char.notes || '—' }}</p>
        </div>
      </div>
      <div v-if="!displayedCharacters?.length && !charactersLoading" class="text-ash/70 text-sm">
        Aucune fiche pour le moment. Crée un personnage et sauvegarde-le.
      </div>
    </section>
  </div>

  <div
    v-if="adviceModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    @click="closeAdvice"
  >
    <div
      class="max-w-lg w-full bg-iron/90 border border-iron/70 rounded-xl shadow-xl p-5 space-y-3 text-ash"
      @click.stop
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-ash/60">Conseil archétype</p>
          <h3 class="text-xl font-serif">{{ adviceArchetype?.name || '—' }}</h3>
        </div>
        <button
          class="px-3 py-1 rounded-lg border border-iron/60 hover:border-blood/60 hover:text-blood"
          type="button"
          @click="closeAdvice"
        >
          Fermer
        </button>
      </div>
      <div class="space-y-2 text-sm">
        <p class="text-ash/70">Tonalité</p>
        <p class="text-ash">{{ adviceArchetype?.vibe || 'Pas de tonalité renseignée.' }}</p>
      </div>
      <div v-if="adviceArchetype && archetypeCounsel[adviceArchetype._id]" class="space-y-2 text-sm">
        <p class="text-ash/70">Conseil du MJ</p>
        <p class="text-ash">{{ archetypeCounsel[adviceArchetype._id]?.summary }}</p>
        <p class="text-ash/70">Occupations possibles</p>
        <p class="text-ash">{{ archetypeCounsel[adviceArchetype._id]?.occupations.join(', ') }}</p>
      </div>
      <p class="text-xs text-ash/60">D’autres informations pourront être ajoutées ici plus tard.</p>
    </div>
  </div>
</template>
