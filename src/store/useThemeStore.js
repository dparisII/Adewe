import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        return { theme: newTheme }
      }),
      setTheme: (theme) => {
        set({ theme })
      },
    }),
    {
      name: 'adewe-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on initial load
        if (state?.theme) {
          const root = document.documentElement
          root.classList.remove('dark', 'light')
          root.classList.add(state.theme)
          document.body.classList.remove('dark', 'light')
          document.body.classList.add(state.theme)
        }
      },
    }
  )
)

export default useThemeStore
