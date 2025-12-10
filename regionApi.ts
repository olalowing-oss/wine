import { supabase } from './supabaseClient'

export interface Region {
  id: string
  name: string
  alternative_names: string[] | null
  country: string
  parent_region: string | null
  region_type: 'country' | 'region' | 'subregion' | 'appellation'
  climate: string
  description: string
  key_grapes: string
  wine_styles: string
  notable_appellations: string | null
  classification_system: string | null
  characteristics: string
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface RegionFormData {
  id: string
  name: string
  alternativeNames: string[]
  country: string
  parentRegion: string
  regionType: 'country' | 'region' | 'subregion' | 'appellation'
  climate: string
  description: string
  keyGrapes: string
  wineStyles: string
  notableAppellations: string
  classificationSystem: string
  characteristics: string
}

export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching regions:', error)
    throw error
  }

  return data || []
}

export async function createRegion(region: RegionFormData): Promise<Region> {
  // Get the max display_order and add 1
  const { data: maxOrderData } = await supabase
    .from('regions')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = maxOrderData && maxOrderData.length > 0
    ? (maxOrderData[0].display_order || 0) + 1
    : 0

  const { data, error } = await supabase
    .from('regions')
    .insert([{
      id: region.id,
      name: region.name,
      alternative_names: region.alternativeNames.length > 0 ? region.alternativeNames : null,
      country: region.country,
      parent_region: region.parentRegion || null,
      region_type: region.regionType,
      climate: region.climate,
      description: region.description,
      key_grapes: region.keyGrapes,
      wine_styles: region.wineStyles,
      notable_appellations: region.notableAppellations || null,
      classification_system: region.classificationSystem || null,
      characteristics: region.characteristics,
      display_order: nextOrder
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating region:', error)
    throw error
  }

  return data
}

export async function updateRegion(id: string, updates: Partial<RegionFormData>): Promise<Region> {
  // Map form field names to database column names
  const dbUpdates: any = {}

  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.alternativeNames !== undefined) {
    dbUpdates.alternative_names = updates.alternativeNames.length > 0 ? updates.alternativeNames : null
  }
  if (updates.country !== undefined) dbUpdates.country = updates.country
  if (updates.parentRegion !== undefined) dbUpdates.parent_region = updates.parentRegion || null
  if (updates.regionType !== undefined) dbUpdates.region_type = updates.regionType
  if (updates.climate !== undefined) dbUpdates.climate = updates.climate
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.keyGrapes !== undefined) dbUpdates.key_grapes = updates.keyGrapes
  if (updates.wineStyles !== undefined) dbUpdates.wine_styles = updates.wineStyles
  if (updates.notableAppellations !== undefined) {
    dbUpdates.notable_appellations = updates.notableAppellations || null
  }
  if (updates.classificationSystem !== undefined) {
    dbUpdates.classification_system = updates.classificationSystem || null
  }
  if (updates.characteristics !== undefined) dbUpdates.characteristics = updates.characteristics

  const { data, error } = await supabase
    .from('regions')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating region:', error)
    throw error
  }

  return data
}

export async function deleteRegion(id: string): Promise<void> {
  const { error } = await supabase
    .from('regions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting region:', error)
    throw error
  }
}
