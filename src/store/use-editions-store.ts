import { create } from 'zustand'

interface EditionsStore {
  editions: any[]
  setEditions: (editions: any[]) => void
  addEdition: (edition: any) => void
  removeEdition: (id: number) => void
}

export const useEditionsStore = create<EditionsStore>((set) => ({
  editions: [],
  setEditions: (editions) => set({ editions }),
  addEdition: (edition) => set((state) => ({ editions: [...state.editions, edition] })),
  removeEdition: (id) => set((state) => ({ editions: state.editions.filter((e: any) => e.id !== id) })),
}))
