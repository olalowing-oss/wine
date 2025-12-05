export interface Wine {
  id: string
  user_id: string
  vecka: number
  vin_namn: string
  typ: string
  datum_tillagd: string
  producent: string
  ursprung: string
  druva: string
  taggar: string
  pris: number | null
  betyg: number | null
  systembolaget_nr: string | null
  serv_temperatur: string | null
  systembolaget_lank: string | null
  plats: string | null
  latitude: number | null
  longitude: number | null
  adress: string | null
  beskrivning: string | null
  smakanteckningar: string | null
  servering_info: string | null
  ovrigt: string | null
  ar_hemma: boolean
  ai_recommendations: string | null
  recommendation_date: string | null
  user_image_url_1: string | null
  user_image_url_2: string | null
  user_image_url_3: string | null
  created_at: string
  updated_at: string
}

export interface WineInfo {
  name: string
  type: string
  country: string
  region: string | null
  grapes: string | null
  vintage: number | null
  alcoholContent: number | null
  description: string | null
  tastingNotes: string | null
  servingTemperature: string | null
  foodPairing: string | null
  producer: string | null
  category: string | null
  appearance: string | null
  aromaProfile: string | null
  tasteProfile: string | null
  servingSuggestions: string | null
  suggestedVenue: string | null
}

export type WineType = 'Rött' | 'Vitt' | 'Rosé' | 'Mousserande' | 'Annat'

export interface MenuPairing {
  id: string
  user_id: string
  restaurant_name: string
  menu_image_url: string | null
  menu_text: string | null
  analysis_result: any | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ImageUpload {
  file: File
  preview: string
}
