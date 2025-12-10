import { supabase } from './supabase'

export interface Grape {
  id: string
  name: string
  alternative_names: string[] | null
  color: 'red' | 'white'
  style: string
  aromas: string
  origin: string
  styles: string
  aging: string
  food_pairing: string
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface GrapeFormData {
  id: string
  name: string
  alternativeNames?: string[]
  color: 'red' | 'white'
  style: string
  aromas: string
  origin: string
  styles: string
  aging: string
  foodPairing: string
}

// Fetch all grapes
export async function fetchGrapes(): Promise<Grape[]> {
  const { data, error } = await supabase
    .from('grapes')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching grapes:', error)
    throw new Error('Failed to fetch grapes')
  }

  return data || []
}

// Create a new grape
export async function createGrape(grape: GrapeFormData): Promise<Grape> {
  // Get the highest display_order to append new grape at the end
  const { data: maxOrderData } = await supabase
    .from('grapes')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrderData?.display_order ?? 0) + 1

  const { data, error } = await supabase
    .from('grapes')
    .insert({
      id: grape.id,
      name: grape.name,
      alternative_names: grape.alternativeNames || null,
      color: grape.color,
      style: grape.style,
      aromas: grape.aromas,
      origin: grape.origin,
      styles: grape.styles,
      aging: grape.aging,
      food_pairing: grape.foodPairing,
      display_order: nextOrder
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating grape:', error)
    throw new Error('Failed to create grape')
  }

  return data
}

// Update an existing grape
export async function updateGrape(id: string, updates: Partial<GrapeFormData>): Promise<Grape> {
  const dbUpdates: any = {}

  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.alternativeNames !== undefined) dbUpdates.alternative_names = updates.alternativeNames
  if (updates.color !== undefined) dbUpdates.color = updates.color
  if (updates.style !== undefined) dbUpdates.style = updates.style
  if (updates.aromas !== undefined) dbUpdates.aromas = updates.aromas
  if (updates.origin !== undefined) dbUpdates.origin = updates.origin
  if (updates.styles !== undefined) dbUpdates.styles = updates.styles
  if (updates.aging !== undefined) dbUpdates.aging = updates.aging
  if (updates.foodPairing !== undefined) dbUpdates.food_pairing = updates.foodPairing

  const { data, error } = await supabase
    .from('grapes')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating grape:', error)
    throw new Error('Failed to update grape')
  }

  return data
}

// Delete a grape
export async function deleteGrape(id: string): Promise<void> {
  const { error } = await supabase
    .from('grapes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting grape:', error)
    throw new Error('Failed to delete grape')
  }
}

// Reorder grapes
export async function reorderGrapes(grapeIds: string[]): Promise<void> {
  // Update display_order for each grape based on array index
  const updates = grapeIds.map((id, index) => ({
    id,
    display_order: index
  }))

  for (const update of updates) {
    await supabase
      .from('grapes')
      .update({ display_order: update.display_order })
      .eq('id', update.id)
  }
}
