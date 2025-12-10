import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

// Map of region names and their IDs for linking
// This will be dynamically built from the database, but here's a starter mapping
const regionNameMap: Record<string, string> = {
  // Frankrike
  'bordeaux': 'bordeaux',
  'bourgogne': 'bourgogne',
  'burgundy': 'bourgogne',
  'champagne': 'champagne',
  'rhône': 'rhone',
  'rhone': 'rhone',
  'loire': 'loire',
  'alsace': 'alsace',
  'médoc': 'medoc',
  'medoc': 'medoc',
  'pauillac': 'pauillac',
  'margaux': 'margaux',
  'saint-émilion': 'saint-emilion',
  'saint-emilion': 'saint-emilion',
  'pomerol': 'pomerol',
  'chablis': 'chablis',
  'côte de nuits': 'cote-de-nuits',
  'cote de nuits': 'cote-de-nuits',
  'côte de beaune': 'cote-de-beaune',
  'cote de beaune': 'cote-de-beaune',
  'beaujolais': 'beaujolais',
  'châteauneuf-du-pape': 'chateauneuf-du-pape',
  'chateauneuf-du-pape': 'chateauneuf-du-pape',
  'hermitage': 'hermitage',
  'côte-rôtie': 'cote-rotie',
  'cote-rotie': 'cote-rotie',
  'sancerre': 'sancerre',
  'pouilly-fumé': 'pouilly-fume',
  'pouilly-fume': 'pouilly-fume',
  'vouvray': 'vouvray',

  // Italien
  'piemonte': 'piemonte',
  'piedmont': 'piemonte',
  'toscana': 'toscana',
  'tuscany': 'toscana',
  'veneto': 'veneto',
  'barolo': 'barolo',
  'barbaresco': 'barbaresco',
  'chianti': 'chianti',
  'chianti classico': 'chianti-classico',
  'brunello di montalcino': 'brunello-di-montalcino',
  'valpolicella': 'valpolicella',
  'amarone': 'amarone',
  'soave': 'soave',
  'prosecco': 'prosecco',

  // Spanien
  'rioja': 'rioja',
  'ribera del duero': 'ribera-del-duero',
  'priorat': 'priorat',
  'rías baixas': 'rias-baixas',
  'rias baixas': 'rias-baixas',
  'jerez': 'jerez',
  'sherry': 'jerez',

  // Portugal
  'douro': 'douro',
  'vinho verde': 'vinho-verde',
  'porto': 'douro',
  'port': 'douro',

  // Tyskland
  'rheingau': 'rheingau',
  'mosel': 'mosel',
  'pfalz': 'pfalz',

  // USA
  'napa valley': 'napa-valley',
  'napa': 'napa-valley',
  'sonoma': 'sonoma',
  'sonoma county': 'sonoma',
  'russian river valley': 'russian-river-valley',
  'willamette valley': 'willamette-valley',
  'columbia valley': 'columbia-valley',

  // Sydamerika
  'mendoza': 'mendoza',
  'maipo valley': 'maipo-valley',
  'colchagua valley': 'colchagua-valley',
  'casablanca valley': 'casablanca-valley',

  // Australien
  'barossa valley': 'barossa-valley',
  'barossa': 'barossa-valley',
  'mclaren vale': 'mclaren-vale',
  'margaret river': 'margaret-river',
  'hunter valley': 'hunter-valley',
  'yarra valley': 'yarra-valley',

  // Nya Zeeland
  'marlborough': 'marlborough',
  'central otago': 'central-otago',
  'hawke\'s bay': 'hawkes-bay',
  'hawkes bay': 'hawkes-bay',

  // Sydafrika
  'stellenbosch': 'stellenbosch',
  'constantia': 'constantia',
  'swartland': 'swartland'
}

/**
 * Converts text containing region names into React elements with links to the region guide
 * @param text The text that may contain region names
 * @returns An array of React nodes with region names converted to links
 */
export function linkifyRegionNames(text: string): ReactNode[] {
  if (!text) return []

  // Create a regex pattern that matches all region names (case insensitive)
  const regionNames = Object.keys(regionNameMap).sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`\\b(${regionNames.join('|')})\\b`, 'gi')

  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the region name as a link
    const regionName = match[1]
    const regionId = regionNameMap[regionName.toLowerCase()]

    parts.push(
      <Link
        key={`${match.index}-${regionId}`}
        to={`/regions#${regionId}`}
        className="text-blue-600 hover:text-blue-700 underline decoration-dotted"
        onClick={(e) => {
          // If we're already on the regions page, handle scroll manually
          if (window.location.pathname === '/regions') {
            e.preventDefault()
            const element = document.getElementById(regionId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              window.location.hash = regionId
            }
          }
        }}
      >
        {regionName}
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
 * Component that renders text with region names as clickable links
 */
export function RegionLinkedText({ text, className }: { text: string; className?: string }) {
  const linkedContent = linkifyRegionNames(text)

  return (
    <span className={className}>
      {linkedContent}
    </span>
  )
}
