import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Selected languages - support multiple learning languages
      nativeLanguage: 'english',
      learningLanguages: [], // Array of language objects: { code, progress, currentSection }
      currentLearningLanguage: null, // Currently active language
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      addLearningLanguage: (langCode) => set((state) => {
        if (!state.learningLanguages.find(l => l.code === langCode)) {
          return {
            learningLanguages: [...state.learningLanguages, { code: langCode, progress: 0, currentSection: 0 }],
            currentLearningLanguage: langCode,
            learningLanguage: langCode
          }
        }
        return { currentLearningLanguage: langCode, learningLanguage: langCode }
      }),
      switchLearningLanguage: (langCode) => set({ currentLearningLanguage: langCode, learningLanguage: langCode }),
      removeLearningLanguage: (langCode) => set((state) => ({
        learningLanguages: state.learningLanguages.filter(l => l.code !== langCode),
        currentLearningLanguage: state.currentLearningLanguage === langCode ? state.learningLanguages[0]?.code || null : state.currentLearningLanguage
      })),
      setCurrentSection: (langCode, sectionIndex) => set((state) => ({
        learningLanguages: state.learningLanguages.map(l =>
          l.code === langCode ? { ...l, currentSection: sectionIndex } : l
        )
      })),
      // Legacy support
      learningLanguage: null,
      setLearningLanguage: (lang) => set((state) => {
        if (!state.learningLanguages.find(l => l.code === lang)) {
          return {
            learningLanguages: [...state.learningLanguages, { code: lang, progress: 0, currentSection: 0 }],
            currentLearningLanguage: lang,
            learningLanguage: lang
          }
        }
        return { currentLearningLanguage: lang, learningLanguage: lang }
      }),

      // Progress tracking
      progress: {},
      xp: 0,
      streak: 0,
      lastActivityDate: null,
      hearts: 5,
      gems: 100,

      // Update XP
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      // Hearts & Unlimited Hearts Logic
      unlimitedHearts: false,
      unlimitedHeartsExpiry: null,

      enableUnlimitedHearts: (durationHours = 24) => set((state) => {
        const now = new Date();
        const expiry = new Date(now.getTime() + durationHours * 60 * 60 * 1000).toISOString();
        return {
          unlimitedHearts: true,
          unlimitedHeartsExpiry: expiry,
          hearts: 5 // Also refill to max
        };
      }),

      checkUnlimitedHeartsExpiry: () => set((state) => {
        if (state.unlimitedHearts && state.unlimitedHeartsExpiry) {
          const now = new Date();
          const expiry = new Date(state.unlimitedHeartsExpiry);
          if (now > expiry) {
            return { unlimitedHearts: false, unlimitedHeartsExpiry: null };
          }
        }
        return {};
      }),


      // Update hearts
      loseHeart: () => set((state) => {
        // Check if unlimited hearts are active
        if (state.unlimitedHearts) {
          const now = new Date();
          const expiry = state.unlimitedHeartsExpiry ? new Date(state.unlimitedHeartsExpiry) : null;

          if (expiry && now < expiry) {
            return {}; // Do not lose heart
          }
          // Expired, clear it (will be handled by checkUnlimitedHeartsExpiry too, but good safety)
          return { hearts: Math.max(0, state.hearts - 1), unlimitedHearts: false, unlimitedHeartsExpiry: null };
        }
        return { hearts: Math.max(0, state.hearts - 1) };
      }),
      refillHearts: () => set({ hearts: 5 }),

      // Update gems
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      spendGems: (amount) => set((state) => {
        if (state.gems >= amount) {
          return { gems: state.gems - amount }
        }
        return state
      }),
      canAfford: (amount) => get().gems >= amount,

      // Update streak
      incrementStreak: () => set((state) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        const lastDate = state.lastActivityDate ? new Date(state.lastActivityDate) : null
        const lastDay = lastDate ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime() : null

        if (!lastDay) {
          // First activity ever
          return { streak: 1, lastActivityDate: now.toISOString() }
        }

        const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Consecutive day
          return { streak: state.streak + 1, lastActivityDate: now.toISOString() }
        } else if (diffDays > 1) {
          // Streak broken
          return { streak: 1, lastActivityDate: now.toISOString() }
        } else {
          // Already active today
          return { lastActivityDate: now.toISOString() }
        }
      }),
      resetStreak: () => set({ streak: 0, lastActivityDate: null }),

      // Leagues
      currentLeague: 1, // Start at Bronze (ID 1)
      previousLeagueRank: null,
      setCurrentLeague: (leagueId) => set({ currentLeague: leagueId }),


      // Lesson progress
      completedLessons: [],
      completeLesson: (lessonId, languageCode) => set((state) => {
        const key = `${languageCode}-${lessonId}`
        if (!state.completedLessons.includes(key)) {
          return { completedLessons: [...state.completedLessons, key] }
        }
        return state
      }),

      // Inventory for shop items
      inventory: [],
      addToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, { ...item, purchasedAt: Date.now() }]
      })),
      hasItem: (itemId) => get().inventory.some(item => item.id === itemId),

      // Active quests
      activeQuests: [],
      completedQuests: [],
      setActiveQuests: (quests) => set({ activeQuests: quests }),
      updateQuestProgress: (questId, progress) => set((state) => ({
        activeQuests: state.activeQuests.map(q =>
          q.id === questId ? { ...q, progress } : q
        )
      })),
      completeQuest: (questId) => set((state) => {
        const quest = state.activeQuests.find(q => q.id === questId)
        if (quest) {
          return {
            activeQuests: state.activeQuests.map(q =>
              q.id === questId ? { ...q, completed: true } : q
            ),
            completedQuests: [...state.completedQuests, { ...quest, completedAt: Date.now() }]
          }
        }
        return state
      }),

      // Error Tracking
      recentMistakes: [],
      recordMistake: (mistakeData) => set((state) => ({
        recentMistakes: [{ ...mistakeData, timestamp: Date.now() }, ...state.recentMistakes].slice(0, 50)
      })),

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
        inventory: [],
        activeQuests: [],
        completedQuests: [],
      }),
    }),
    {
      name: 'adewe-storage',
    }
  )
)

export default useStore
