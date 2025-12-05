import type { Wine } from '../types/wine.types'

export function generateSystembolagetLink(vinNamn: string): string {
  if (!vinNamn) return 'https://www.systembolaget.se'
  
  let result = vinNamn
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/&/g, 'and')
    .replace(/%/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  const encoded = encodeURIComponent(result)
  return `https://www.systembolaget.se/sortiment/?q=${encoded}`
}

export function getTagsArray(taggar: string): string[] {
  if (!taggar) return []
  return taggar
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

export function getDisplayTags(taggar: string): string[] {
  return getTagsArray(taggar).map(tag => 
    tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
  )
}

export function hasTag(wine: Wine, tag: string): boolean {
  const cleanTag = tag.trim().toLowerCase()
  const wineTags = getTagsArray(wine.taggar).map(t => t.toLowerCase())
  return wineTags.includes(cleanTag)
}

export function addTag(currentTags: string, newTag: string): string {
  const tags = getTagsArray(currentTags)
  const cleanTag = newTag.trim().toLowerCase()
  
  if (!cleanTag || tags.map(t => t.toLowerCase()).includes(cleanTag)) {
    return currentTags
  }
  
  return [...tags, cleanTag].join(', ')
}

export function removeTag(currentTags: string, tagToRemove: string): string {
  const cleanTag = tagToRemove.trim().toLowerCase()
  const tags = getTagsArray(currentTags)
    .filter(tag => tag.toLowerCase() !== cleanTag)
  
  return tags.join(', ')
}

export function getAllUserImages(wine: Wine): string[] {
  const images: string[] = []
  if (wine.user_image_url_1) images.push(wine.user_image_url_1)
  if (wine.user_image_url_2) images.push(wine.user_image_url_2)
  if (wine.user_image_url_3) images.push(wine.user_image_url_3)
  return images
}

export function getPrimaryImageURL(wine: Wine): string | null {
  return wine.user_image_url_1 || null
}

export function canAddMoreImages(wine: Wine): boolean {
  return getAllUserImages(wine).length < 3
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function formatPrice(price: number | null | undefined): string {
  if (!price) return '-'
  return `${Math.round(price)} kr`
}

export function formatRating(rating: number | null | undefined): string {
  if (!rating) return '-'
  return `${rating}/5`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getCurrentWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.floor(diff / oneWeek) + 1
}

export function filterWines(
  wines: Wine[],
  searchQuery: string,
  selectedType: string | null,
  selectedTags: string[],
  showOnlyHome: boolean
): Wine[] {
  return wines.filter(wine => {
    // Sökfilter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matches = 
        wine.vin_namn.toLowerCase().includes(query) ||
        wine.producent.toLowerCase().includes(query) ||
        wine.ursprung.toLowerCase().includes(query) ||
        wine.druva.toLowerCase().includes(query)
      
      if (!matches) return false
    }

    // Typfilter
    if (selectedType && wine.typ !== selectedType) {
      return false
    }

    // Taggfilter
    if (selectedTags.length > 0) {
      const wineTags = getTagsArray(wine.taggar).map(t => t.toLowerCase())
      const hasAllTags = selectedTags.every(tag => 
        wineTags.includes(tag.toLowerCase())
      )
      if (!hasAllTags) return false
    }

    // Hemma-filter
    if (showOnlyHome && !wine.ar_hemma) {
      return false
    }

    return true
  })
}

export function getAllTags(wines: Wine[]): string[] {
  const tagSet = new Set<string>()
  
  wines.forEach(wine => {
    getDisplayTags(wine.taggar).forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

export function getWineTypes(): string[] {
  return ['Rött', 'Vitt', 'Rosé', 'Mousserande', 'Annat']
}
