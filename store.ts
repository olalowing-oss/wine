import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface FilterState {
  searchQuery: string
  selectedType: string
  selectedTags: string[]
  showOnlyHome: boolean
  setSearchQuery: (query: string) => void
  setSelectedType: (type: string) => void
  setSelectedTags: (tags: string[]) => void
  setShowOnlyHome: (show: boolean) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>()((set) => ({
  searchQuery: '',
  selectedType: '',
  selectedTags: [],
  showOnlyHome: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setShowOnlyHome: (show) => set({ showOnlyHome: show }),
  clearFilters: () => set({
    searchQuery: '',
    selectedType: '',
    selectedTags: [],
    showOnlyHome: false
  }),
}))
