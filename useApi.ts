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
          user_image_url_2,
          user_image_url_3
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

export function useMenuPairing(id: string | undefined) {
  return useQuery({
    queryKey: ['menuPairings', id],
    queryFn: async () => {
      if (!id) throw new Error('Inget ID angivet')

      const { data, error } = await supabase
        .from('menu_pairings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as MenuPairing
    },
    enabled: !!id,
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

export function useUpdateMenuPairing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MenuPairing> }) => {
      const { data, error } = await supabase
        .from('menu_pairings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as MenuPairing
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menuPairings'] })
      queryClient.invalidateQueries({ queryKey: ['menuPairings', variables.id] })
      toast.success('Menyanalys uppdaterad!')
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

// Menu Image Upload
export async function uploadMenuImage(file: File, pairingId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `public/${pairingId}/${Date.now()}.${fileExt}`

  console.log('Uploading menu image:', { fileName, fileSize: file.size, fileType: file.type })

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error(`Bilduppladdning misslyckades: ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName)

  console.log('Image uploaded successfully:', data.publicUrl)
  return data.publicUrl
}

export async function deleteMenuImage(imageUrl: string) {
  const path = imageUrl.split('/menu-images/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('menu-images')
    .remove([path])

  if (error) throw error
}
