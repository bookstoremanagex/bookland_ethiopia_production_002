import { create } from 'zustand'

interface SidebarState {
  isMounted: boolean
  activePath: string
  setMounted: (status: boolean) => void
  setActivePath: (path: string) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isMounted: false,
  activePath: '',
  setMounted: (status) => set({ isMounted: status }),
  setActivePath: (path) => set({ activePath: path }),
}))
