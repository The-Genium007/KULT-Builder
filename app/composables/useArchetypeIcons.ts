/**
 * SVG icon paths for each KULT archetype.
 * All icons use a 24x24 viewBox and a single `d` path string.
 */
const archetypeIcons: Record<string, string> = {
  // Agent — shield / badge
  'arch-agent':
    'M12 2L3 7v6c0 5.25 3.85 10.15 9 11.25C17.15 23.15 21 18.25 21 13V7l-9-5zm0 2.18L19 8.3v4.7c0 4.2-3.03 8.12-7 9.22-3.97-1.1-7-5.02-7-9.22V8.3L12 4.18z',
  // Artiste — palette / brush
  'arch-artiste':
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1 0-.28-.11-.53-.29-.71a1.49 1.49 0 01-.3-.73c0-.82.68-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
  // Carriériste — briefcase
  'arch-carrieriste':
    'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z',
  // Condamné — hourglass
  'arch-condamne':
    'M6 2v6l4 4-4 4v6h12v-6l-4-4 4-4V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z',
  // Criminel — mask
  'arch-criminel':
    'M12 2C6.48 2 2 6.48 2 12c0 2.72 1.07 5.18 2.81 7h14.38A9.96 9.96 0 0022 12c0-5.52-4.48-10-10-10zm-3 13a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4z',
  // Dément — broken mind
  'arch-dement':
    'M13 2v2.05A8.01 8.01 0 0120 12a8 8 0 01-8 8 8 8 0 01-8-8 8.01 8.01 0 017-7.95V2h2zm-1 4a6 6 0 100 12 6 6 0 000-12zm1 2v5l3.5 2.1-.75 1.23L12 15V8h1z',
  // Descendant — tree / heritage
  'arch-descendant':
    'M17 2H7v2h4v3.1A5.01 5.01 0 007 12c0 2.76 2.24 5 5 5s5-2.24 5-5a5.01 5.01 0 00-4-4.9V4h4V2zm-5 13a3 3 0 110-6 3 3 0 010 6zm0 3c-3.87 0-7 1.34-7 3v1h14v-1c0-1.66-3.13-3-7-3z',
  // Détective — magnifying glass
  'arch-detective':
    'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  // Escroc — masks / drama
  'arch-escroc':
    'M12 2C6.48 2 2 5.64 2 10.2c0 2.49 1.28 4.72 3.29 6.24L4 22l3.79-1.52A11.4 11.4 0 0012 21c5.52 0 10-3.64 10-8.2V10.2C22 5.64 17.52 2 12 2zm-3.5 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z',
  // Facilitateur — handshake / network
  'arch-facilitateur':
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  // Investigateur — compass / search
  'arch-investigateur':
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z',
  // Jouet — puppet / marionette
  'arch-jouet':
    'M12 2a3 3 0 00-3 3c0 1.3.84 2.4 2 2.82V9H7v2h2v2H7v2h2v2.18A3.01 3.01 0 0012 22a3 3 0 002.82-2H17v-2h-2v-2h2v-2h-2V9h-2V7.82A3.01 3.01 0 0012 2zm0 2a1 1 0 110 2 1 1 0 010-2zm0 15a1 1 0 110-2 1 1 0 010 2z',
  // Nettoyeur — crosshair / target
  'arch-nettoyeur':
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z',
  // Occultiste — pentacle / eye
  'arch-occultiste':
    'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z',
  // Prophète — flame
  'arch-prophete':
    'M13.5 1c-.3.3-2 2.1-2 4.5C11.5 7.43 13.07 9 15 9c.38 0 .74-.08 1.08-.2a5.97 5.97 0 01-1.58 5.53c-.39.4-.62.66-.99 1.17H10.5c-.38-.52-.61-.78-1-1.18a5.98 5.98 0 01-1.5-5V9a3 3 0 003-3v-.35A8.96 8.96 0 0012 2c-.47-.37-.97-.71-1.5-1h3zM12 22a5 5 0 01-5-5h2a3 3 0 006 0h2a5 5 0 01-5 5z',
  // Scientifique — atom / flask
  'arch-scientifique':
    'M13 3c0-.55-.45-1-1-1s-1 .45-1 1v6.3l-4.06 7.02A3.99 3.99 0 0010.7 21h2.6a3.99 3.99 0 003.76-4.68L13 9.3V3zM9 17l3-5.2L15 17H9z',
  // Universitaire — book / graduation
  'arch-universitaire':
    'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
  // Vagabond — road / compass
  'arch-vagabond':
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  // Vengeur — flame / fist
  'arch-vengeur':
    'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z',
  // Vétéran — medal / dog tags
  'arch-veteran':
    'M12 1L9 4.26l.01 1.73L12 3.27l2.99 2.72.01-1.73L12 1zM5.5 6.28L2 9v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9l-3.5-2.72L12 11.44 5.5 6.28zM20 21H4V9.87l8 5.33 8-5.33V21z',
  // Dormeur — moon / sleep
  'arch-dormeur':
    'M12.43 2.3c-2.38-.59-4.68-.27-6.63.64-.35.16-.41.64-.1.86C8.3 5.6 10 8.6 10 12c0 3.4-1.7 6.4-4.3 8.2-.32.22-.26.7.09.86 1.28.6 2.71.94 4.21.94 6.05 0 10.85-5.38 9.87-11.6-.61-3.92-3.59-6.9-7.44-8.1z'
}

export function useArchetypeIcon(archetypeId: string): string {
  return archetypeIcons[archetypeId] || archetypeIcons['arch-dormeur']
}

export function getArchetypeIcon(archetypeId: string): string {
  return archetypeIcons[archetypeId] || archetypeIcons['arch-dormeur']
}
