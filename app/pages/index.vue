<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, computed } from 'vue'
import { useBuilderStore } from '~/stores/builder'
import type { ArchetypeDoc, AdvantageDoc, DisadvantageDoc, DarkSecretDoc, CharacterResponse } from '~/types/kult'
import { getArchetypeIcon } from '~/composables/useArchetypeIcons'

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
      "Protecteur froid qui traite tout le monde comme une ressource. Analyse vite, agit sans états d'âme et paie un coût moral énorme quand les innocents disparaissent.",
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
      "Créateur obsédé qui donne corps et âme à son art, capte les âmes des autres et s'abîme dans le processus. Chaque œuvre a un prix payé en esprit ou en chair.",
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
      "Vit à crédit après un pacte ou une malédiction. Le sablier s'écoule et il est prêt à tout pour repousser la sentence, même sacrifier d'autres vies.",
    occupations: [
      'Occultiste',
      "Échappé d'une secte",
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
      "Voleurs, gangs et tueurs mues par l'argent et la violence. Quelques-uns s'enrichissent, la plupart grattent les miettes jusqu'à ce qu'un plus dur les écrase.",
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
      "Esprit brisé après avoir vu derrière l'Illusion. Hanté par des visions, perçoit des vérités mais doute de ses propres sens.",
    occupations: [
      'Sans-abri',
      "Échappé d'asile",
      'Vendeur à la sauvette',
      'Artiste de rue',
      'Receleur',
      'Voleur',
      'Policier',
      'Dealer',
      'Journaliste freelance',
      'Tatoueur',
      "Survivant d'abus"
    ]
  },
  'arch-descendant': {
    summary:
      "Héritier d'un pouvoir ou d'une faute ancestrale. Traqué par le passé, les pactes obscurs et les violences familiales.",
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
      "Obsédé par les réponses, sacrifiant tout le reste. Suivre les pistes l'emmène dans une spirale de solitude et d'addictions.",
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
      "Manipulateur qui se fait aimer pour mieux dépouiller. Maître de la dissimulation, laisse derrière lui un sillage d'ennemis et d'arnaques.",
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
      "Courtier en tout (drogues, armes, infos) qui prend sa part. Multiplie succès et ennemis, prêt à tout tant qu'il y a de l'argent.",
    occupations: [
      'Parrain de mafia',
      "Homme d'affaires",
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
      "Existence de soumission et de dépendance. Veut briser ses chaînes mais reste l'objet des autres, ballotté entre vide et espoirs brisés.",
    occupations: [
      'Mannequin',
      'Strip-teaseur',
      'Trophée',
      'Gigolo',
      'Acteur',
      "Échappé d'expérience",
      'Influenceur',
      'Escort',
      "Survivant d'abus",
      'Victime de trafic humain'
    ]
  },
  'arch-nettoyeur': {
    summary:
      "Résout les problèmes par des moyens radicaux. Aucune empathie, aucune erreur permise. Une fois lancé en chasse, rien ne l'arrête.",
    occupations: [
      'Tueur à gages',
      'Homme de main',
      'Agent spécial',
      "Flic d'intervention",
      'Militaire',
      "Tireur d'élite"
    ]
  },
  'arch-occultiste': {
    summary:
      "Cherche à maîtriser des forces occultes qu'il comprend mal. La magie a un prix et la dette se rapproche.",
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
      "Intellectuel persuadé qu'une autre vérité se cache derrière les modèles établis. Risque la disgrâce pour ses recherches alternatives.",
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
      "Tout perdre l'a poussé à chercher le sang pour compenser. La vengeance est son moteur, quoi qu'il en coûte.",
    occupations: [
      "Homme ou femme au foyer",
      'Officier de police',
      'Mendiant',
      'Étudiant',
      'Criminel',
      'Conspirationniste',
      'Réfugié',
      'Boxeur',
      "Homme d'affaires ruiné"
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
      "Vit dans une bulle confortable de distractions, ignorant l'Illusion. Plus faible que les autres archétypes, il devra se réveiller pour choisir sa voie.",
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

const { data: archetypeData } = await useFetch<ArchetypeDoc[]>('/api/archetypes')
const { data: advantageData } = await useFetch<AdvantageDoc[]>('/api/advantages')
const { data: disadvantageData } = await useFetch<DisadvantageDoc[]>('/api/disadvantages')
const { data: secretData } = await useFetch<DarkSecretDoc[]>('/api/secrets')
const LOCAL_CHARACTERS_KEY = 'kult-characters'
const characters = ref<CharacterResponse[]>([])
const charactersLoading = ref(false)

function loadLocalCharacters() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(LOCAL_CHARACTERS_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) characters.value = parsed as CharacterResponse[]
  } catch (err) {
    console.warn('Failed to load local characters', err)
  }
}

function persistLocalCharacters() {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_CHARACTERS_KEY, JSON.stringify(characters.value))
}

function refreshCharacters() {
  loadLocalCharacters()
}

function hydratePayload(payload: any): CharacterResponse {
  const resources = {
    archetypes: archetypeData.value || [],
    secrets: secretData.value || [],
    advantages: advantageData.value || [],
    disadvantages: disadvantageData.value || []
  }
  const archetypeRef = typeof payload.archetype === 'string'
    ? resources.archetypes.find((a) => a._id === payload.archetype) || { _id: payload.archetype, name: payload.archetype }
    : payload.archetype
  const secretRef = typeof payload.darkSecret === 'string'
    ? resources.secrets.find((s) => s._id === payload.darkSecret) || { _id: payload.darkSecret, name: payload.darkSecret }
    : payload.darkSecret
  const advantageRefs = (payload.advantages || []).map((a: any) => {
    if (typeof a === 'string') return resources.advantages.find((x) => x._id === a) || { _id: a, name: a }
    return a
  })
  const disadvantageRefs = (payload.disadvantages || []).map((d: any) => {
    if (typeof d === 'string') return resources.disadvantages.find((x) => x._id === d) || { _id: d, name: d }
    return d
  })

  return {
    ...payload,
    _id: payload._id || crypto.randomUUID(),
    archetype: archetypeRef,
    darkSecret: secretRef,
    advantages: advantageRefs,
    disadvantages: disadvantageRefs,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}


const steps = [
  { id: 0, title: 'Archétype', detail: 'Choisis ta voie initiale.' },
  { id: 1, title: 'Traits', detail: 'Avantages, désavantages et sombre secret.' },
  { id: 2, title: 'Attributs & compétences', detail: 'Répartis tes points.' },
  { id: 3, title: 'Identité & relations', detail: 'Nom, apparence, équipement, liens.' },
  { id: 4, title: 'Résumé', detail: "Relis avant de briser l'Illusion." }
]

const selectedArchetype = computed(() => archetypeData.value?.find((a) => a._id === archetypeId.value))
const selectedSecret = computed(() => secretData.value?.find((s) => s._id === darkSecretId.value))
const availableSecrets = computed(() => (secretData.value || []).filter((s) => isAllowedForArchetype(s)))
const availableAdvantages = computed(() => (advantageData.value || []).filter((s) => isAllowedForArchetype(s)))
const availableDisadvantages = computed(() => (disadvantageData.value || []).filter((s) => isAllowedForArchetype(s)))
const displayedCharacters = computed(() => characters.value || [])
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

const lastSubStep = ref<Record<number, number>>({})

function goToStep(id: number) {
  lastSubStep.value[step.value] = subStep.value
  step.value = id
  subStep.value = lastSubStep.value[id] ?? 0
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

/* ── Step completion tracking ── */
const stepCompletionDetails = computed(() => [
  {
    label: 'Archétype',
    done: !!archetypeId.value,
    summary: archetypeId.value
      ? (archetypeData.value?.find((a) => a._id === archetypeId.value)?.name || '—')
      : null
  },
  {
    label: 'Traits',
    done: !!darkSecretId.value && advantages.value.length > 0 && disadvantages.value.length >= currentMaxDisadvantages.value,
    summary: darkSecretId.value
      ? `Secret + ${advantages.value.length} av. + ${disadvantages.value.length} dés.`
      : null
  },
  {
    label: 'Attributs',
    done: attributesStepReady.value && keySkills.value.length > 0,
    summary: attributesStepReady.value ? `${keySkills.value.length} compétences` : null
  },
  {
    label: 'Identité',
    done: !!name.value && !!appearance.value && equipment.value.length > 0,
    summary: name.value || null
  },
  {
    label: 'Résumé',
    done: false,
    summary: null
  }
])


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

const stepBlockerMessage = computed(() => {
  if (canAdvanceCurrentStep.value) return ''
  switch (step.value) {
    case 0: return 'Sélectionne un archétype pour continuer.'
    case 1:
      if (subStep.value === 0) return 'Choisis un sombre secret.'
      if (subStep.value === 1) return 'Sélectionne au moins 1 avantage.'
      return `Sélectionne ${currentMaxDisadvantages.value} désavantage(s) (${disadvantages.value.length}/${currentMaxDisadvantages.value}).`
    case 2:
      if (subStep.value === 0) return 'Répartis toutes les valeurs d\'attributs.'
      return 'Ajoute au moins 1 compétence clé.'
    case 3:
      if (subStep.value === 0) return 'Renseigne le nom et l\'apparence du personnage.'
      if (subStep.value === 1) return 'Ajoute au moins 1 équipement.'
      return 'Ajoute une relation ou une note.'
    default: return ''
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

function saveCharacter() {
  if (!canSave.value) {
    messageTone.value = 'error'
    message.value = 'Complète les champs obligatoires et répartis tous les points.'
    return
  }

  saving.value = true
  message.value = ''
  messageTone.value = ''

  try {
    const hydrated = hydratePayload(builder.toPayload())
    characters.value = [hydrated, ...characters.value]
    persistLocalCharacters()
    messageTone.value = 'success'
    message.value = 'Personnage sauvegardé. Les Archontes frémissent.'
    builder.reset()
    keySkillInput.value = ''
    equipmentInput.value = ''
    relationInput.value = ''
    step.value = 0
    subStep.value = 0
  } catch (err: any) {
    messageTone.value = 'error'
    message.value = err?.message || 'Impossible de sauvegarder.'
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

function deleteCharacter(id: string) {
  if (!confirm('Supprimer ce personnage ? Cette action est irréversible.')) return
  characters.value = characters.value.filter((c) => c._id !== id)
  persistLocalCharacters()
  messageTone.value = 'success'
  message.value = 'Personnage supprimé.'
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
    const imported: CharacterResponse[] = []
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
      imported.push(hydratePayload(payload))
    }
    characters.value = [...imported, ...characters.value]
    persistLocalCharacters()
    messageTone.value = 'success'
    message.value = `${imported.length} personnage(s) importé(s) avec succès.`
  } catch (err: any) {
    console.error(err)
    messageTone.value = 'error'
    message.value = 'Import JSON impossible : vérifie le format du fichier.'
  } finally {
    importing.value = false
    if (importInput.value) importInput.value.value = ''
  }
}

let messageDismissTimer: ReturnType<typeof setTimeout> | null = null
watch(message, (val) => {
  if (messageDismissTimer) clearTimeout(messageDismissTimer)
  if (val) messageDismissTimer = setTimeout(() => { message.value = '' }, 5000)
})

onMounted(() => {
  builder.loadDraft()
  loadLocalCharacters()
  watch(
    () => ({ ...builder.$state }),
    () => builder.persistDraft(),
    { deep: true }
  )
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
    <p class="text-xs text-ash leading-relaxed">
      <span class="uppercase tracking-[0.3em] font-medium">KULT, Divinité perdue</span> —
      Crée ta fiche : archétype, traits, attributs, identité, équipement et relations. Tout est sauvegardé localement dans ton navigateur.
    </p>

    <section id="builder" class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="section-title">Forge du personnage</h2>
          <button
            class="px-3 py-2 rounded-sm border border-iron-light text-bone hover:bg-iron-light disabled:opacity-50 text-sm"
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

      <!-- ── Progress tracker — brutalist segmented bar ── -->
      <div class="space-y-0">
        <!-- Segmented bar: one block per step -->
        <div class="grid grid-cols-5 h-1.5">
          <div
            v-for="(detail, idx) in stepCompletionDetails"
            :key="'bar-'+idx"
            class="transition-colors duration-300"
            :class="{
              'bg-blood': step === idx,
              'bg-bone/40': detail.done && step !== idx,
              'bg-iron-light': !detail.done && step !== idx
            }"
          ></div>
        </div>

        <!-- Step tabs — hard rectangles, no rounding -->
        <div class="grid grid-cols-5 border border-iron-light border-t-0">
          <button
            v-for="(detail, idx) in stepCompletionDetails"
            :key="'step-'+idx"
            class="relative py-2.5 sm:py-3 text-center text-[10px] sm:text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
            :class="{
              'bg-blood/10 text-white border-b-2 border-blood': step === idx,
              'bg-iron/30 text-bone/70 hover:bg-iron/50 hover:text-bone': detail.done && step !== idx,
              'bg-ink/40 text-ash/50 hover:bg-iron/30 hover:text-ash': !detail.done && step !== idx,
              'border-r border-iron-light': idx < stepCompletionDetails.length - 1
            }"
            @click="goToStep(idx)"
          >
            <span class="block text-[9px] sm:text-[10px] text-ash/50 font-mono">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span>{{ detail.label }}</span>
            <!-- Completed marker -->
            <span v-if="detail.done && step !== idx" class="absolute top-1 right-1.5 w-1 h-1 bg-bone/50"></span>
          </button>
        </div>

        <!-- Current step context line -->
        <div class="border border-iron-light border-t-0 px-3 py-2 flex items-center gap-2 text-xs bg-iron/20">
          <span class="text-blood font-mono font-bold text-[10px]">{{ String(step + 1).padStart(2, '0') }}</span>
          <span class="w-px h-3 bg-iron-light"></span>
          <span class="text-ash">
            <strong class="text-bone">{{ steps[step]?.title }}</strong> — {{ steps[step]?.detail }}
            <template v-if="stepCompletionDetails[step]?.summary">
              · <span class="text-ember">{{ stepCompletionDetails[step]?.summary }}</span>
            </template>
          </span>
        </div>
      </div>

      <div class="card p-4 sm:p-6 space-y-6">

        <div v-if="message" class="p-4 rounded-sm flex items-center justify-between gap-3" :class="messageTone === 'success' ? 'bg-iron-light border-l-2 border-bone/30' : 'bg-blood/10 border-l-2 border-blood/60'">
          <span class="text-sm">{{ message }}</span>
          <button @click="message = ''" class="text-bone/50 hover:text-bone text-lg shrink-0 leading-none">&times;</button>
        </div>

        <div v-if="step === 0" class="space-y-4">
          <p class="text-sm text-bone mb-2">Choisis ton archétype — il définit ta nature et tes options.</p>
          <div v-if="!archetypeData || archetypeData.length === 0" class="text-ash text-sm py-8 text-center">
            Chargement des archétypes...
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              v-for="arch in archetypeData"
              :key="arch._id"
              class="border border-iron-light rounded-sm p-3 sm:p-4 cursor-pointer hover:border-blood/50 transition"
              :class="{ 'border-blood bg-blood/5': archetypeId === arch._id }"
              @click="archetypeId = arch._id"
            >
              <div class="flex items-start gap-3">
                <svg class="w-8 h-8 shrink-0 text-blood/70 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path :d="getArchetypeIcon(arch._id)" />
                </svg>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="text-sm font-serif text-white tracking-[0.12em] uppercase truncate">{{ arch.name }}</h4>
                    <button
                      class="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-iron-light text-ash/60 hover:border-blood/60 hover:text-blood transition-colors"
                      type="button"
                      title="Conseil du MJ"
                      @click.stop="openAdvice(arch)"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    </button>
                  </div>
                  <p class="text-xs text-bone/70 mt-1 italic">{{ arch.tagline }}</p>
                  <p class="text-xs text-ash/60 mt-0.5">{{ arch.guidance }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="step === 1" class="space-y-4">
          <div class="flex flex-wrap gap-2" v-if="subStepLabels[1]">
            <button
              v-for="(label, idx) in subStepLabels[1]"
              :key="label"
              class="px-2 py-1.5 text-xs font-medium border-b-2 transition-colors"
              :class="subStep === idx ? 'border-blood text-white' : 'border-transparent text-ash hover:text-bone hover:border-ash/30'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-3">
            <label class="text-sm text-bone">Sombre Secret (obligatoire)</label>
            <p class="text-xs text-ash">Choisis le secret qui hante ton personnage. Les options dépendent de ton archétype.</p>
            <div v-if="!availableSecrets.length" class="text-ash text-sm py-6 text-center border border-iron-light rounded-sm">
              Sélectionne d'abord un archétype pour voir les secrets disponibles.
            </div>
            <div v-else class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="secret in availableSecrets"
                :key="secret._id"
                class="border border-iron-light rounded-sm p-3 hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood bg-blood/5': darkSecretId === secret._id }"
                @click="darkSecretId = secret._id"
              >
                <p class="text-bone font-semibold">{{ secret.name }}</p>
                <p class="text-ash text-sm">{{ secret.description }}</p>
                <p class="text-ash/80 text-xs mt-1">Hook : {{ secret.hook }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="subStep === 1" class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-serif text-white">Avantages</h4>
              <span class="pill text-xs">{{ advantages.length }} / {{ maxAdvantages }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                v-for="adv in availableAdvantages"
                :key="adv._id"
                class="flex items-start gap-3 p-3 border border-iron-light rounded-sm hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood bg-blood/5': advantages.includes(adv._id) }"
              >
                <input
                  :checked="advantages.includes(adv._id)"
                  type="checkbox"
                  class="mt-1 text-blood bg-iron border-iron/50 rounded"
                  :disabled="!advantages.includes(adv._id) && advantages.length >= maxAdvantages"
                  @change="toggleAdvantage(adv._id)"
                />
                <div>
                  <p class="text-bone font-semibold">{{ adv.name }} <span class="text-xs text-ash/80">(+{{ adv.cost }})</span></p>
                  <p class="text-sm text-ash/70">{{ adv.description }}</p>
                </div>
              </label>
            </div>
          </div>
          <div v-else class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-serif text-white">Désavantages</h4>
              <span class="pill text-xs">{{ disadvantages.length }} / {{ currentMaxDisadvantages }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                v-for="dis in availableDisadvantages"
                :key="dis._id"
                class="flex items-start gap-3 p-3 border border-iron-light rounded-sm hover:border-blood/50 cursor-pointer"
                :class="{ 'border-blood bg-blood/5': disadvantages.includes(dis._id) }"
              >
                <input
                  :checked="disadvantages.includes(dis._id)"
                  type="checkbox"
                  class="mt-1 text-blood bg-iron border-iron/50 rounded"
                  :disabled="!disadvantages.includes(dis._id) && disadvantages.length >= currentMaxDisadvantages"
                  @change="toggleDisadvantage(dis._id)"
                />
                <div>
                  <p class="text-bone font-semibold">
                    {{ dis.name }} <span class="text-xs text-ash/80">({{ dis.penalty }})</span>
                  </p>
                  <p class="text-sm text-ash/70">{{ dis.description }}</p>
                  <p class="text-xs text-ash/80">Déclencheur : {{ dis.trigger }}</p>
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
              class="px-2 py-1.5 text-xs font-medium border-b-2 transition-colors"
              :class="subStep === idx ? 'border-blood text-white' : 'border-transparent text-ash hover:text-bone hover:border-ash/30'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-6">
            <p class="text-xs text-ash leading-relaxed">
              Répartis les valeurs entre tes attributs. Chaque valeur du pool ne peut être attribuée qu'un nombre limité de fois (indiqué à droite). Quand le compteur est à 0, la valeur n'est plus disponible.
            </p>
            <div class="space-y-2">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p class="text-sm text-bone">Caractéristiques passives</p>
                <div class="flex flex-wrap gap-2 text-xs text-ash/80">
                  <span
                    v-for="rem in passiveRemaining"
                    :key="`passive-${rem.value}`"
                    class="px-2 py-1 rounded-full border border-iron/50"
                  >
                    {{ rem.value > 0 ? `+${rem.value}` : rem.value }} : {{ rem.remaining }} restant(s)
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div
                  v-for="attr in passiveAttributeList"
                  :key="attr.key"
                  class="border border-iron-light rounded-sm p-3 space-y-2 bg-iron/40"
                >
                  <label class="text-bone text-sm">{{ attr.label }}</label>
                  <select
                    v-model="(attributes.passive as any)[attr.key]"
                    class="w-full rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
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
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p class="text-sm text-bone">Caractéristiques actives</p>
                <div class="flex flex-wrap gap-2 text-xs text-ash/80">
                  <span
                    v-for="rem in activeRemaining"
                    :key="`active-${rem.value}`"
                    class="px-2 py-1 rounded-full border border-iron/50"
                  >
                    {{ rem.value > 0 ? `+${rem.value}` : rem.value }} : {{ rem.remaining }} restant(s)
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div
                  v-for="attr in activeAttributeList"
                  :key="attr.key"
                  class="border border-iron-light rounded-sm p-3 space-y-2 bg-iron/40"
                >
                  <label class="text-bone text-sm">{{ attr.label }}</label>
                  <select
                    v-model="(attributes.active as any)[attr.key]"
                    class="w-full rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
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
            <label class="text-sm text-bone">Compétences clés (max {{ maxSkills }})</label>
            <div class="flex gap-2 mt-2">
              <input
                v-model="keySkillInput"
                type="text"
                placeholder="Observation, Improvisation..."
                class="flex-1 rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
                @keyup.enter="addKeySkill"
              />
              <button class="px-3 rounded-sm bg-blood/30 border border-blood/40" type="button" @click="addKeySkill">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="skill in keySkills"
                :key="skill"
                class="pill cursor-pointer group hover:bg-blood/20 hover:border-blood/50 transition-colors"
                @click="removeSkill(skill)"
              >
                {{ skill }} <span class="text-ash/70 group-hover:text-blood ml-0.5">&times;</span>
              </span>
            </div>
          </div>
        </div>

          <div v-else-if="step === 3" class="space-y-4">
          <div class="flex flex-wrap gap-2" v-if="subStepLabels[3]">
            <button
              v-for="(label, idx) in subStepLabels[3]"
              :key="label"
              class="px-2 py-1.5 text-xs font-medium border-b-2 transition-colors"
              :class="subStep === idx ? 'border-blood text-white' : 'border-transparent text-ash hover:text-bone hover:border-ash/30'"
              @click="subStep = idx"
            >
              {{ label }}
            </button>
          </div>
          <div v-if="subStep === 0" class="space-y-3">
            <label class="text-sm text-bone">Identité</label>
            <div>
              <input
                v-model="name"
                type="text"
                placeholder="Nom du personnage"
                class="w-full rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm text-bone">Apparence</label>
              <textarea
                v-model="appearance"
                rows="3"
                placeholder="Silhouette, vêtements, attitudes..."
                class="w-full rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
              ></textarea>
            </div>
          </div>
          <div v-else-if="subStep === 1" class="space-y-2">
            <label class="text-sm text-bone">Équipement</label>
            <div class="flex gap-2 mt-2">
              <input
                v-model="equipmentInput"
                type="text"
                placeholder="Lampe tempête, pendentif..."
                class="flex-1 rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
                @keyup.enter="addEquipment"
              />
              <button class="px-3 rounded-sm bg-blood/30 border border-blood/40" type="button" @click="addEquipment">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="item in equipment"
                :key="item"
                class="pill cursor-pointer group hover:bg-blood/20 hover:border-blood/50 transition-colors"
                @click="removeEquipment(item)"
              >
                {{ item }} <span class="text-ash/70 group-hover:text-blood ml-0.5">&times;</span>
              </span>
            </div>
          </div>
          <div v-else class="space-y-3">
            <label class="text-sm text-bone">Relations & ressorts dramatiques</label>
            <div class="flex gap-2">
              <input
                v-model="relationInput"
                type="text"
                placeholder="Ex : Cousin détective, collègue suspicieux, contact de rue..."
                class="flex-1 rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
                @keyup.enter="addRelation"
              />
              <button class="px-3 rounded-sm bg-blood/30 border border-blood/40" type="button" @click="addRelation">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="rel in relations" :key="rel" class="pill cursor-pointer group hover:bg-blood/20 hover:border-blood/50 transition-colors" @click="removeRelation(rel)">
                {{ rel }} <span class="text-ash/70 group-hover:text-blood ml-0.5">&times;</span>
              </span>
            </div>
            <label class="text-sm text-bone">Notes</label>
            <textarea
              v-model="notes"
              rows="4"
              class="mt-1 w-full rounded-sm bg-iron/70 border border-iron-light text-bone focus:border-blood focus:ring-blood/50"
              placeholder="Accroches, motivations, détails supplémentaires..."
            ></textarea>
          </div>
        </div>

        <div v-else-if="step === 4" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card-ghost p-4 space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70">Identité</p>
              <p :class="name ? 'text-white text-lg font-serif tracking-wide' : 'text-blood/60 text-lg font-serif italic'">{{ name || 'Nom manquant' }}</p>
              <p class="text-bone/80">Archétype : <span class="text-bone">{{ selectedArchetype?.name || '—' }}</span></p>
              <p class="text-bone/80">Secret : <span class="text-bone">{{ selectedSecret?.name || '—' }}</span></p>
              <p class="text-bone/80">Apparence : <span class="text-bone">{{ appearance || '—' }}</span></p>
            </div>
            <div class="card-ghost p-4 space-y-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70">Caractéristiques passives</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-sm">
                <span>Endurance : {{ formatAttribute(attributes.passive.endurance) }}</span>
                <span>Réflexe : {{ formatAttribute(attributes.passive.reflexe) }}</span>
                <span>Volonté : {{ formatAttribute(attributes.passive.volonte) }}</span>
              </div>
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70">Caractéristiques actives</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 text-sm">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mb-1">Compétences</p>
              <p class="text-bone/80">{{ keySkills.join(', ') || '—' }}</p>
            </div>
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mb-1">Avantages</p>
              <p class="text-bone/80">
                {{
                  advantages
                    .map((id) => advantageData?.find((a) => a._id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || '—'
                }}
              </p>
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mt-2 mb-1">Désavantages</p>
              <p class="text-bone/80">
                {{
                  disadvantages
                    .map((id) => disadvantageData?.find((a) => a._id === id)?.name)
                    .filter(Boolean)
                    .join(', ') || '—'
                }}
              </p>
            </div>
            <div class="card-ghost p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mb-1">Relations</p>
              <p class="text-bone/80">
                {{ relations.join(', ') || '—' }}
              </p>
            </div>
          </div>
          <div class="card-ghost p-3 text-sm text-bone">
            <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mb-1">Équipement</p>
            <p>{{ equipment.join(', ') || '—' }}</p>
            <p class="text-xs uppercase tracking-[0.2em] text-ash/70 mt-2 mb-1">Notes</p>
            <p>{{ notes || '—' }}</p>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <button
              class="px-5 py-3 rounded-sm bg-blood/30 border border-blood/60 text-white shadow-glow disabled:opacity-50 text-sm sm:text-base"
              :disabled="saving"
              type="button"
              @click="saveCharacter"
            >
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
            <button
              class="px-4 py-3 rounded-sm border border-iron/70 text-bone hover:bg-iron-light text-sm sm:text-base"
              type="button"
              @click="handleReset"
            >
              Réinitialiser
            </button>
            <p class="text-xs text-ash/80">
              Sauvegarde possible quand nom, archétype, secret sont définis et que les points sont répartis.
            </p>
          </div>
        </div>

        <div class="sticky bottom-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-iron/95 backdrop-blur border-t border-iron-light rounded-b-sm space-y-2">
          <p v-if="stepBlockerMessage && step < steps.length - 1" class="text-xs text-ember flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ stepBlockerMessage }}
          </p>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              v-if="canGoPrev"
              class="px-4 py-2.5 rounded-sm border border-iron-light text-bone hover:bg-iron-light cursor-pointer text-sm transition-colors"
              type="button"
              @click="goPrev"
            >
              Étape précédente
            </button>
            <div v-else></div>
            <div class="flex items-center justify-between sm:justify-end gap-3">
              <span v-if="maxSubStepFor(step) > 0" class="text-xs text-ash/70">Sous-étape {{ subStep + 1 }} / {{ maxSubStepFor(step) + 1 }}</span>
              <button
                class="px-4 py-2.5 rounded-sm bg-blood/30 border border-blood/40 text-white shadow-glow disabled:opacity-40 cursor-pointer text-sm transition-colors"
                type="button"
                :disabled="step >= steps.length - 1 || !canAdvanceCurrentStep"
                @click="goNext"
              >
                Étape suivante
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="section-divider" />

    <section id="characters" class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 class="section-title">Personnages sauvegardés</h2>
        <button
          class="px-4 py-2 rounded-sm border border-iron-light text-bone hover:bg-iron-light text-sm"
          type="button"
          @click="() => refreshCharacters()"
        >
          Rafraîchir
        </button>
      </div>
      <div v-if="charactersLoading" class="text-ash text-sm">Chargement...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="char in displayedCharacters" :key="char._id" class="card p-4 space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div class="flex items-center gap-3 min-w-0">
              <svg class="w-7 h-7 shrink-0 text-blood/60" viewBox="0 0 24 24" fill="currentColor">
                <path :d="getArchetypeIcon(char.archetype?._id || '')" />
              </svg>
              <div class="min-w-0">
                <p class="text-xs uppercase tracking-[0.2em] text-ash/70">Personnage</p>
                <h4 class="text-lg sm:text-xl font-serif text-white truncate">{{ char.name }}</h4>
              </div>
            </div>
            <button
              class="px-3 py-2 rounded-sm border border-blood/50 text-bone hover:bg-blood/20 text-sm whitespace-nowrap shrink-0"
              type="button"
              @click="loadCharacterToBuilder(char)"
            >
              Charger dans le builder
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1 rounded-sm border border-iron/50 text-bone hover:border-blood/50 text-xs"
              type="button"
              @click="copyCharacterJson(char)"
            >
              Copier JSON
            </button>
            <button
              class="px-3 py-1 rounded-sm border border-iron/50 text-bone hover:border-blood/50 text-xs"
              type="button"
              @click="downloadCharacterJson(char)"
            >
              Télécharger JSON
            </button>
            <button
              class="px-3 py-1 rounded-sm border border-blood/50 text-blood hover:bg-blood/20 text-xs"
              type="button"
              @click="deleteCharacter(char._id)"
            >
              Supprimer
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.15em] text-ash/70 font-medium">Identité</p>
              <p class="text-bone">{{ char.archetype?.name }} · {{ char.darkSecret?.name }}</p>
              <p class="text-ash">{{ char.appearance || '—' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.15em] text-ash/70 font-medium">Traits</p>
              <p class="text-bone">{{ char.advantages.map((a: any) => a.name).join(', ') || '—' }}</p>
              <p class="text-ash">{{ char.disadvantages.map((d: any) => d.name).join(', ') || '—' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t border-iron-light pt-3">
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.15em] text-ash/70 font-medium">Attributs passifs</p>
              <p class="text-bone">End. {{ formatAttribute(char.attributes?.passive?.endurance ?? null) }} · Réf. {{ formatAttribute(char.attributes?.passive?.reflexe ?? null) }} · Vol. {{ formatAttribute(char.attributes?.passive?.volonte ?? null) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.15em] text-ash/70 font-medium">Attributs actifs</p>
              <p class="text-bone text-xs leading-relaxed">Âme {{ formatAttribute(char.attributes?.active?.ame ?? null) }} · Cha {{ formatAttribute(char.attributes?.active?.charisme ?? null) }} · Int {{ formatAttribute(char.attributes?.active?.intuition ?? null) }} · Log {{ formatAttribute(char.attributes?.active?.logique ?? null) }} · Per {{ formatAttribute(char.attributes?.active?.perception ?? null) }} · SF {{ formatAttribute(char.attributes?.active?.sangFroid ?? null) }} · Vio {{ formatAttribute(char.attributes?.active?.violence ?? null) }}</p>
            </div>
          </div>
          <div v-if="char.relations?.length || char.equipment?.length || char.notes" class="text-sm border-t border-iron-light pt-3 space-y-1">
            <p v-if="char.equipment?.length" class="text-ash"><span class="text-ash/70">Équip.</span> {{ char.equipment.join(', ') }}</p>
            <p v-if="char.relations?.length" class="text-ash"><span class="text-ash/70">Relations</span> {{ char.relations.join(', ') }}</p>
            <p v-if="char.notes" class="text-ash/80 text-xs max-h-12 overflow-hidden">{{ char.notes }}</p>
          </div>
        </div>
      </div>
      <div v-if="!displayedCharacters?.length && !charactersLoading" class="text-ash text-sm">
        Aucune fiche pour le moment. Crée un personnage et sauvegarde-le.
      </div>
    </section>
  </div>

  <div
    v-if="adviceModalOpen"
    role="dialog"
    aria-modal="true"
    aria-labelledby="advice-title"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
    @click="closeAdvice"
    @keydown.escape="closeAdvice"
  >
    <div
      class="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-iron/95 border border-iron/70 rounded-none shadow-xl p-4 sm:p-5 space-y-3 text-bone"
      @click.stop
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-ash/70">Conseil archétype</p>
          <h3 id="advice-title" class="text-xl font-serif text-white tracking-wide">{{ adviceArchetype?.name || '—' }}</h3>
        </div>
        <button
          class="px-3 py-1 rounded-sm border border-iron-light hover:border-blood/60 hover:text-blood"
          type="button"
          @click="closeAdvice"
        >
          Fermer
        </button>
      </div>
      <div class="space-y-2 text-sm">
        <p class="text-ash font-medium">Tonalité</p>
        <p class="text-bone">{{ adviceArchetype?.vibe || 'Pas de tonalité renseignée.' }}</p>
      </div>
      <div v-if="adviceArchetype && archetypeCounsel[adviceArchetype._id]" class="space-y-2 text-sm">
        <p class="text-ash font-medium">Conseil du MJ</p>
        <p class="text-bone">{{ archetypeCounsel[adviceArchetype._id]?.summary }}</p>
        <p class="text-ash font-medium">Occupations possibles</p>
        <p class="text-bone">{{ archetypeCounsel[adviceArchetype._id]?.occupations.join(', ') }}</p>
      </div>
      <p class="text-xs text-ash/70">D'autres informations pourront être ajoutées ici plus tard.</p>
    </div>
  </div>
</template>
