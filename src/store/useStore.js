import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateDailyQuests, generateMonthlyChallenge } from '../data/questsData'
import { supabase } from '../lib/supabase'

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
      populateStore: (profileData) => {
        const today = new Date().toISOString().split('T')[0]
        const currentMonth = new Date().getMonth()
        const state = get()

        let update = {
          user: profileData.id ? { id: profileData.id, email: profileData.email } : null,
          xp: profileData.xp || 0,
          streak: profileData.streak || 0,
          hearts: profileData.hearts || 20,
          gems: profileData.gems || 150,
          currentLearningLanguage: profileData.learning_language,
          learningLanguage: profileData.learning_language,
          learningLanguages: profileData.language_progress || [],
          bio: profileData.bio || '',
          league_id: profileData.league_id || 1
        }

        // Check for unlimited hearts from subscription
        if (profileData.user_subscriptions && profileData.user_subscriptions.length > 0) {
          const sub = profileData.user_subscriptions[0]
          // Check if subscription has a tier with unlimited hearts
          if ((sub.status === 'active' || sub.status === 'trialing') && sub.tier && sub.tier.has_unlimited_hearts) {
            update.unlimitedHearts = true;
            // Set far future expiry (1 year)
            update.unlimitedHeartsExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
            update.hearts = 20; // Max hearts
          }
        }

        // Fix: If we have a current language but empty progress array, create a default entry
        // This prevents the "language selected but not visible" bug
        if (update.currentLearningLanguage && (!update.learningLanguages || update.learningLanguages.length === 0)) {
          update.learningLanguages = [{
            code: update.currentLearningLanguage,
            progress: 0,
            currentSection: 0,
            lastAccessed: new Date().toISOString()
          }]
        }

        // Daily Quest Generation
        if (state.lastQuestDate !== today) {
          update.activeQuests = generateDailyQuests(profileData.id)
          update.lastQuestDate = today
        }

        // Monthly Challenge Generation
        if (state.lastMonthReset !== currentMonth || !state.monthlyChallenge) {
          update.monthlyChallenge = generateMonthlyChallenge(profileData.id)
          update.lastMonthReset = currentMonth
        }

        set(update)
      },
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
      switchLearningLanguage: (langCode) => {
        set({ currentLearningLanguage: langCode, learningLanguage: langCode })
        // After switching, we might want to trigger a sync or a reload of state for that language if we split it further
      },
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
      hearts: 20,
      lastHeartUpdate: null,
      gems: 150,
      followers: 42,
      following: 12,
      league_id: 1,
      bio: '',

      // Update XP
      addXp: (amount) => {
        set((state) => ({ xp: state.xp + amount }))
        get().syncUserStats()
      },

      // Hearts & Unlimited Hearts Logic
      unlimitedHearts: false,
      unlimitedHeartsExpiry: null,

      enableUnlimitedHearts: (durationHours = 24) => set((state) => {
        const now = new Date();
        const expiry = new Date(now.getTime() + durationHours * 60 * 60 * 1000).toISOString();
        return {
          unlimitedHearts: true,
          unlimitedHeartsExpiry: expiry,
          hearts: 20 // Also refill to max
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
          // Expired, clear it
          const newHeartsValue = Math.max(0, state.hearts - 1);
          setTimeout(() => get().syncUserStats(), 100)
          return {
            hearts: newHeartsValue,
            unlimitedHearts: false,
            unlimitedHeartsExpiry: null,
            lastHeartUpdate: state.lastHeartUpdate || (newHeartsValue < 20 ? new Date().toISOString() : null)
          };
        }

        const newHearts = Math.max(0, state.hearts - 1);
        setTimeout(() => get().syncUserStats(), 100)
        return {
          hearts: newHearts,
          lastHeartUpdate: state.lastHeartUpdate || (newHearts < 20 ? new Date().toISOString() : null)
        };
      }),
      refillHearts: () => {
        set({ hearts: 20, lastHeartUpdate: null })
        get().syncUserStats()
      },

      regenerateHearts: () => set((state) => {
        if (state.hearts >= 20) {
          if (state.lastHeartUpdate) return { lastHeartUpdate: null };
          return {};
        }

        const now = new Date();
        // If we don't have an update time but we need one, set it now
        if (!state.lastHeartUpdate) {
          return { lastHeartUpdate: now.toISOString() };
        }

        const lastUpdate = new Date(state.lastHeartUpdate);
        const diffInMs = now - lastUpdate;
        const msPerHeart = 5 * 60 * 1000;

        const heartsToAdd = Math.floor(diffInMs / msPerHeart);

        if (heartsToAdd > 0) {
          const newHeartsValue = Math.min(20, state.hearts + heartsToAdd);
          const newLastUpdate = newHeartsValue === 20
            ? null
            : new Date(lastUpdate.getTime() + (heartsToAdd * msPerHeart)).toISOString();

          return {
            hearts: newHeartsValue,
            lastHeartUpdate: newLastUpdate
          };
        }

        return {};
      }),

      // Update gems
      addGems: (amount) => {
        set((state) => ({ gems: state.gems + amount }))
        get().syncUserStats()
      },
      spendGems: (amount) => set((state) => {
        if (state.gems >= amount) {
          const newState = { gems: state.gems - amount }
          setTimeout(() => get().syncUserStats(), 100)
          return newState
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

      lastQuestDate: null,
      lastMonthReset: null,
      monthlyChallenge: null,
      activeQuests: [],
      completedQuests: [],
      setActiveQuests: (quests) => set({ activeQuests: quests }),
      updateQuestProgress: (questId, amount) => set((state) => ({
        activeQuests: state.activeQuests.map(q =>
          q.id === questId ? { ...q, progress: Math.min(q.target, q.progress + amount) } : q
        )
      })),
      completeQuest: (questId) => set((state) => {
        const quest = state.activeQuests.find(q => q.id === questId)
        if (quest && !quest.completed) {
          // If it's a daily quest, increment monthly challenge progress
          let monthlyChallenge = state.monthlyChallenge
          if (monthlyChallenge && !quest.isMonthly) {
            monthlyChallenge = {
              ...monthlyChallenge,
              progress: Math.min(monthlyChallenge.progress + 1, monthlyChallenge.target)
            }
          }

          return {
            activeQuests: state.activeQuests.map(q =>
              q.id === questId ? { ...q, completed: true } : q
            ),
            completedQuests: [...state.completedQuests, { ...quest, completedAt: Date.now() }],
            monthlyChallenge
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
        hearts: 20,
        lastHeartUpdate: null,
        gems: 150,
        followers: 42,
        following: 12,
        league_id: 1,
        bio: '',
        completedLessons: [],
        inventory: [],
        activeQuests: [],
        completedQuests: [],
      }),

      // Profile updates
      setProfileDetails: (details) => set((state) => ({
        ...state,
        ...details
      })),

      // Sync user stats to Supabase
      syncUserStats: async () => {
        const { hearts, gems, xp, streak, user } = get()
        if (!user?.id || !supabase) return

        try {
          await supabase
            .from('profiles')
            .update({
              hearts,
              gems,
              xp,
              streak,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
        } catch (err) {
          console.error('Error syncing user stats:', err)
        }
      },

      // Sync language progress to Supabase
      syncLanguageProgress: async (userId) => {
        const { learningLanguages } = get()
        if (!userId || !supabase) return

        try {
          await supabase
            .from('profiles')
            .update({ language_progress: learningLanguages })
            .eq('id', userId)
        } catch (err) {
          console.error('Error syncing language progress:', err)
        }
      },

    }),
    {
      name: 'adewe-storage',
    }
  )
)

export default useStore
