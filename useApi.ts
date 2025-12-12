import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Wine, MenuPairing } from './wine.types'
import { toast } from 'react-hot-toast'

// Wine Queries
export function useWines() {
  return useQuery({
    queryKey: ['wines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wines')
        .select(`
          id,
          vin_namn,
          typ,
          producent,
          land,
          ursprung,
          region,
          druva,
          pris,
          betyg,
          ar_hemma,
          taggar,
          systembolaget_nr,
          plats,
          datum_tillagd,
          user_image_url_1,
          systembolaget_img
        `)
        .order('datum_tillagd', { ascending: false })

      if (error) throw error
      return data as Wine[]
    },
  })
}

export function useWine(id: string | undefined) {
  return useQuery({
    queryKey: ['wines', id],
    queryFn: async () => {
      if (!id) throw new Error('Inget ID angivet')
      
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Wine
    },
    enabled: !!id,
  })
}

export function useCreateWine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (wine: Partial<Wine>) => {
      const { data, error } = await supabase
        .from('wines')
        .insert([wine])
        .select()
        .single()

      if (error) throw error
      return data as Wine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
      toast.success('Vin tillagt!')
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`)
    },
  })
}

export function useUpdateWine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Wine> }) => {
      const { data, error } = await supabase
        .from('wines')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Wine
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
      queryClient.invalidateQueries({ queryKey: ['wines', variables.id] })
      toast.success('Vin uppdaterat!')
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`)
    },
  })
}

export function useDeleteWine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
      toast.success('Vin raderat!')
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`)
    },
  })
}

// Menu Pairing Queries
export function useMenuPairings() {
  return useQuery({
    queryKey: ['menuPairings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_pairings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as MenuPairing[]
    },
  })
}

export function useCreateMenuPairing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (pairing: Partial<MenuPairing>) => {
      const { data, error } = await supabase
        .from('menu_pairings')
        .insert([pairing])
        .select()
        .single()

      if (error) throw error
      return data as MenuPairing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPairings'] })
      toast.success('Menyanalys skapad!')
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`)
    },
  })
}

// Image Upload
export async function uploadWineImage(file: File, wineId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `public/${wineId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('wine-images')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('wine-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteWineImage(imageUrl: string) {
  const path = imageUrl.split('/wine-images/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('wine-images')
    .remove([path])

  if (error) throw error
}
