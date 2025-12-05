export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wines: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          vecka?: number
          vin_namn: string
          typ: string
          datum_tillagd?: string
          producent?: string
          ursprung?: string
          druva?: string
          taggar?: string
          pris?: number | null
          betyg?: number | null
          systembolaget_nr?: string | null
          serv_temperatur?: string | null
          systembolaget_lank?: string | null
          plats?: string | null
          latitude?: number | null
          longitude?: number | null
          adress?: string | null
          beskrivning?: string | null
          smakanteckningar?: string | null
          servering_info?: string | null
          ovrigt?: string | null
          ar_hemma?: boolean
          ai_recommendations?: string | null
          recommendation_date?: string | null
          user_image_url_1?: string | null
          user_image_url_2?: string | null
          user_image_url_3?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vecka?: number
          vin_namn?: string
          typ?: string
          datum_tillagd?: string
          producent?: string
          ursprung?: string
          druva?: string
          taggar?: string
          pris?: number | null
          betyg?: number | null
          systembolaget_nr?: string | null
          serv_temperatur?: string | null
          systembolaget_lank?: string | null
          plats?: string | null
          latitude?: number | null
          longitude?: number | null
          adress?: string | null
          beskrivning?: string | null
          smakanteckningar?: string | null
          servering_info?: string | null
          ovrigt?: string | null
          ar_hemma?: boolean
          ai_recommendations?: string | null
          recommendation_date?: string | null
          user_image_url_1?: string | null
          user_image_url_2?: string | null
          user_image_url_3?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_pairings: {
        Row: {
          id: string
          user_id: string
          restaurant_name: string
          menu_image_url: string | null
          menu_text: string | null
          analysis_result: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_name: string
          menu_image_url?: string | null
          menu_text?: string | null
          analysis_result?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_name?: string
          menu_image_url?: string | null
          menu_text?: string | null
          analysis_result?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
