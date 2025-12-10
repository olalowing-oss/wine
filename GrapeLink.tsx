import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

// List of all grape names and their IDs for linking
const grapeNameMap: Record<string, string> = {
  // Red grapes
  'cabernet sauvignon': 'cabernet-sauvignon',
  'merlot': 'merlot',
  'pinot noir': 'pinot-noir',
  'syrah': 'syrah',
  'shiraz': 'syrah',
  'grenache': 'grenache',
  'garnacha': 'grenache',
  'tempranillo': 'tempranillo',
  'sangiovese': 'sangiovese',
  'nebbiolo': 'nebbiolo',
  'barbera': 'barbera',
  'malbec': 'malbec',
  'zinfandel': 'zinfandel',
  'primitivo': 'zinfandel',
  'cabernet franc': 'cabernet-franc',
  'gamay': 'gamay',
  'mourvèdre': 'mourvedre',
  'mourvedre': 'mourvedre',
  'monastrell': 'mourvedre',
  'pinotage': 'pinotage',
  'carignan': 'carignan',
  'cinsault': 'cinsault',
  'touriga nacional': 'touriga-nacional',
  'corvina': 'corvina',
  'nero d\'avola': 'nero-davola',
  'nero davola': 'nero-davola',
  'dolcetto': 'dolcetto',
  'bobal': 'bobal',
  'tannat': 'tannat',
  'aglianico': 'aglianico',
  'pinot meunier': 'pinot-meunier',

  // White grapes
  'chardonnay': 'chardonnay',
  'sauvignon blanc': 'sauvignon-blanc',
  'riesling': 'riesling',
  'pinot grigio': 'pinot-grigio',
  'pinot gris': 'pinot-grigio',
  'chenin blanc': 'chenin-blanc',
  'gewürztraminer': 'gewurztraminer',
  'gewurztraminer': 'gewurztraminer',
  'viognier': 'viognier',
  'sémillon': 'semillon',
  'semillon': 'semillon',
  'albariño': 'albarino',
  'albarino': 'albarino',
  'alvarinho': 'albarino',
  'verdejo': 'verdejo',
  'grüner veltliner': 'gruner-veltliner',
  'gruner veltliner': 'gruner-veltliner',
  'moscato': 'moscato',
  'muscat': 'moscato',
  'glera': 'glera',
  'trebbiano': 'trebbiano',
  'ugni blanc': 'trebbiano',
  'garganega': 'garganega',
  'verdicchio': 'verdicchio',
  'fiano': 'fiano',
  'vermentino': 'vermentino',
  'torrontés': 'torrontes',
  'torrontes': 'torrontes',
  'godello': 'godello',
  'cortese': 'cortese',
  'marsanne': 'marsanne',
  'roussanne': 'roussanne',
  'airén': 'airen',
  'airen': 'airen',
  'palomino fino': 'palomino-fino',
}

/**
 * Converts text containing grape names into React elements with links to the grape guide
 * @param text The text that may contain grape names
 * @returns An array of React nodes with grape names converted to links
 */
export function linkifyGrapeNames(text: string): ReactNode[] {
  if (!text) return []

  // Create a regex pattern that matches all grape names (case insensitive)
  const grapeNames = Object.keys(grapeNameMap).sort((a, b) => b.length - a.length) // Sort by length descending to match longer names first
  const pattern = new RegExp(`\\b(${grapeNames.join('|')})\\b`, 'gi')

  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the grape name as a link
    const grapeName = match[1]
    const grapeId = grapeNameMap[grapeName.toLowerCase()]

    parts.push(
      <Link
        key={`${match.index}-${grapeId}`}
        to={`/info#${grapeId}`}
        className="text-purple-600 hover:text-purple-700 underline decoration-dotted"
      >
        {grapeName}
      </Link>
    )

    lastIndex = pattern.lastIndex
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

/**
 * Component that renders text with grape names as clickable links
 */
export function GrapeLinkedText({ text, className }: { text: string; className?: string }) {
  const linkedContent = linkifyGrapeNames(text)

  return (
    <span className={className}>
      {linkedContent}
    </span>
  )
}
