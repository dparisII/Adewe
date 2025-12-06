import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Selected languages
      nativeLanguage: 'english',
      learningLanguage: null,
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setLearningLanguage: (lang) => set({ learningLanguage: lang }),
      
      // Progress tracking
      progress: {},
      xp: 0,
      streak: 0,
      hearts: 5,
      gems: 100,
      
      // Update XP
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      
      // Update hearts
      loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
      refillHearts: () => set({ hearts: 5 }),
      
      // Update gems
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      spendGems: (amount) => set((state) => ({ gems: Math.max(0, state.gems - amount) })),
      
      // Update streak
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      resetStreak: () => set({ streak: 0 }),
      
      // Lesson progress
      completedLessons: [],
      completeLesson: (lessonId, languageCode) => set((state) => {
        const key = `${languageCode}-${lessonId}`
        if (!state.completedLessons.includes(key)) {
          return { completedLessons: [...state.completedLessons, key] }
        }
        return state
      }),
      
      isLessonCompleted: (lessonId, languageCode) => {
        const state = get()
        return state.completedLessons.includes(`${languageCode}-${lessonId}`)
      },
      
      // Unit progress
      getUnitProgress: (unitId, languageCode) => {
        const state = get()
        const unitLessons = state.completedLessons.filter(
          (l) => l.startsWith(`${languageCode}-${unitId}`)
        )
        return unitLessons.length
      },
      
      // Reset progress
      resetProgress: () => set({
        progress: {},
        xp: 0,
        streak: 0,
        hearts: 5,
        gems: 100,
        completedLessons: [],
      }),
    }),
    {
      name: 'polyglot-ethiopia-storage',
    }
  )
)

export default useStore
