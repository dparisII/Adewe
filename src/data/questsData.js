// 100 different quest types with random generation

export const questTypes = [
  // Daily Practice Quests (1-20)
  { id: 1, type: 'lessons', title: 'Complete {count} lessons', description: 'Practice makes perfect', xpReward: 50, gemReward: 5, targetRange: [1, 5] },
  { id: 2, type: 'exercises', title: 'Complete {count} exercises', description: 'Keep learning', xpReward: 30, gemReward: 3, targetRange: [5, 20] },
  { id: 3, type: 'perfect_lessons', title: 'Complete {count} lessons with no mistakes', description: 'Perfection is key', xpReward: 100, gemReward: 10, targetRange: [1, 3] },
  { id: 4, type: 'streak', title: 'Maintain a {count}-day streak', description: 'Consistency wins', xpReward: 150, gemReward: 15, targetRange: [3, 7] },
  { id: 5, type: 'early_bird', title: 'Complete a lesson before 9 AM', description: 'Rise and shine', xpReward: 75, gemReward: 8, targetRange: [1, 1] },
  { id: 6, type: 'night_owl', title: 'Complete a lesson after 10 PM', description: 'Burn the midnight oil', xpReward: 75, gemReward: 8, targetRange: [1, 1] },
  { id: 7, type: 'weekend_warrior', title: 'Complete {count} lessons on weekend', description: 'Weekend dedication', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 8, type: 'speed_demon', title: 'Complete a lesson in under 2 minutes', description: 'Fast and accurate', xpReward: 80, gemReward: 8, targetRange: [1, 1] },
  { id: 9, type: 'marathon', title: 'Study for {count} minutes straight', description: 'Endurance training', xpReward: 120, gemReward: 12, targetRange: [15, 60] },
  { id: 10, type: 'variety', title: 'Complete lessons from {count} different units', description: 'Explore variety', xpReward: 90, gemReward: 9, targetRange: [3, 5] },
  { id: 11, type: 'review', title: 'Review {count} completed lessons', description: 'Refresh your memory', xpReward: 60, gemReward: 6, targetRange: [3, 10] },
  { id: 12, type: 'new_content', title: 'Unlock {count} new lessons', description: 'Explore new horizons', xpReward: 100, gemReward: 10, targetRange: [1, 5] },
  { id: 13, type: 'daily_goal', title: 'Earn {count} XP today', description: 'Reach your daily goal', xpReward: 50, gemReward: 5, targetRange: [50, 200] },
  { id: 14, type: 'no_mistakes', title: 'Complete {count} exercises without mistakes', description: 'Flawless execution', xpReward: 120, gemReward: 12, targetRange: [10, 30] },
  { id: 15, type: 'translation', title: 'Complete {count} translation exercises', description: 'Master translation', xpReward: 70, gemReward: 7, targetRange: [5, 15] },
  { id: 16, type: 'listening', title: 'Complete {count} listening exercises', description: 'Train your ear', xpReward: 70, gemReward: 7, targetRange: [5, 15] },
  { id: 17, type: 'speaking', title: 'Complete {count} speaking exercises', description: 'Practice pronunciation', xpReward: 70, gemReward: 7, targetRange: [5, 15] },
  { id: 18, type: 'matching', title: 'Complete {count} matching exercises', description: 'Connect the dots', xpReward: 60, gemReward: 6, targetRange: [5, 15] },
  { id: 19, type: 'fill_blank', title: 'Complete {count} fill-in-the-blank exercises', description: 'Fill in the gaps', xpReward: 60, gemReward: 6, targetRange: [5, 15] },
  { id: 20, type: 'multiple_choice', title: 'Complete {count} multiple choice exercises', description: 'Choose wisely', xpReward: 60, gemReward: 6, targetRange: [5, 15] },

  // Skill Building Quests (21-40)
  { id: 21, type: 'vocabulary', title: 'Learn {count} new words', description: 'Expand your vocabulary', xpReward: 80, gemReward: 8, targetRange: [10, 50] },
  { id: 22, type: 'grammar', title: 'Master {count} grammar concepts', description: 'Grammar guru', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 23, type: 'pronunciation', title: 'Practice pronunciation {count} times', description: 'Sound like a native', xpReward: 70, gemReward: 7, targetRange: [5, 20] },
  { id: 24, type: 'conversation', title: 'Complete {count} conversation lessons', description: 'Real-world practice', xpReward: 90, gemReward: 9, targetRange: [2, 5] },
  { id: 25, type: 'reading', title: 'Read {count} passages', description: 'Improve comprehension', xpReward: 80, gemReward: 8, targetRange: [3, 10] },
  { id: 26, type: 'writing', title: 'Write {count} sentences', description: 'Express yourself', xpReward: 90, gemReward: 9, targetRange: [5, 20] },
  { id: 27, type: 'idioms', title: 'Learn {count} idioms', description: 'Cultural expressions', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 28, type: 'verbs', title: 'Conjugate {count} verbs', description: 'Verb mastery', xpReward: 85, gemReward: 8, targetRange: [5, 20] },
  { id: 29, type: 'adjectives', title: 'Use {count} different adjectives', description: 'Descriptive language', xpReward: 75, gemReward: 7, targetRange: [10, 30] },
  { id: 30, type: 'numbers', title: 'Practice numbers {count} times', description: 'Count on it', xpReward: 60, gemReward: 6, targetRange: [5, 15] },
  { id: 31, type: 'colors', title: 'Learn {count} color words', description: 'Paint with words', xpReward: 50, gemReward: 5, targetRange: [5, 15] },
  { id: 32, type: 'family', title: 'Master {count} family terms', description: 'Family matters', xpReward: 60, gemReward: 6, targetRange: [5, 15] },
  { id: 33, type: 'food', title: 'Learn {count} food vocabulary', description: 'Culinary language', xpReward: 70, gemReward: 7, targetRange: [10, 30] },
  { id: 34, type: 'travel', title: 'Master {count} travel phrases', description: 'Wanderlust words', xpReward: 80, gemReward: 8, targetRange: [5, 20] },
  { id: 35, type: 'business', title: 'Learn {count} business terms', description: 'Professional vocabulary', xpReward: 90, gemReward: 9, targetRange: [5, 20] },
  { id: 36, type: 'emotions', title: 'Express {count} different emotions', description: 'Emotional intelligence', xpReward: 70, gemReward: 7, targetRange: [5, 15] },
  { id: 37, type: 'weather', title: 'Describe weather {count} times', description: 'Weather talk', xpReward: 60, gemRereward: 6, targetRange: [3, 10] },
  { id: 38, type: 'directions', title: 'Give directions {count} times', description: 'Navigate language', xpReward: 75, gemReward: 7, targetRange: [3, 10] },
  { id: 39, type: 'time', title: 'Tell time {count} times', description: 'Time management', xpReward: 65, gemReward: 6, targetRange: [5, 15] },
  { id: 40, type: 'questions', title: 'Ask {count} questions', description: 'Curious learner', xpReward: 70, gemReward: 7, targetRange: [5, 20] },

  // Achievement Quests (41-60)
  { id: 41, type: 'section_complete', title: 'Complete an entire section', description: 'Section master', xpReward: 200, gemReward: 20, targetRange: [1, 1] },
  { id: 42, type: 'unit_complete', title: 'Complete {count} units', description: 'Unit champion', xpReward: 150, gemReward: 15, targetRange: [1, 5] },
  { id: 43, type: 'level_up', title: 'Reach level {count}', description: 'Level up', xpReward: 100, gemReward: 10, targetRange: [5, 20] },
  { id: 44, type: 'xp_milestone', title: 'Earn {count} total XP', description: 'XP collector', xpReward: 150, gemReward: 15, targetRange: [500, 5000] },
  { id: 45, type: 'gem_collector', title: 'Collect {count} gems', description: 'Gem hunter', xpReward: 100, gemReward: 0, targetRange: [10, 50] },
  { id: 46, type: 'perfect_week', title: 'Complete 7 days without mistakes', description: 'Perfect week', xpReward: 250, gemReward: 25, targetRange: [1, 1] },
  { id: 47, type: 'comeback', title: 'Restore your streak after losing it', description: 'Comeback kid', xpReward: 100, gemReward: 10, targetRange: [1, 1] },
  { id: 48, type: 'early_adopter', title: 'Try a new feature', description: 'Innovation explorer', xpReward: 75, gemReward: 7, targetRange: [1, 1] },
  { id: 49, type: 'social', title: 'Add {count} friends', description: 'Social butterfly', xpReward: 80, gemReward: 8, targetRange: [1, 10] },
  { id: 50, type: 'competitor', title: 'Beat {count} friends in XP', description: 'Competitive spirit', xpReward: 120, gemReward: 12, targetRange: [1, 5] },
  { id: 51, type: 'teacher', title: 'Help {count} other learners', description: 'Pay it forward', xpReward: 100, gemReward: 10, targetRange: [1, 5] },
  { id: 52, type: 'reviewer', title: 'Leave {count} lesson reviews', description: 'Feedback provider', xpReward: 60, gemReward: 6, targetRange: [3, 10] },
  { id: 53, type: 'explorer', title: 'Try {count} different languages', description: 'Polyglot path', xpReward: 150, gemReward: 15, targetRange: [2, 5] },
  { id: 54, type: 'dedicated', title: 'Study {count} days in a row', description: 'Dedication award', xpReward: 200, gemReward: 20, targetRange: [7, 30] },
  { id: 55, type: 'overachiever', title: 'Exceed daily goal by {count}%', description: 'Go beyond', xpReward: 100, gemReward: 10, targetRange: [50, 200] },
  { id: 56, type: 'completionist', title: 'Get 100% on {count} lessons', description: 'Perfectionist', xpReward: 150, gemReward: 15, targetRange: [5, 20] },
  { id: 57, type: 'speed_learner', title: 'Complete {count} lessons in one day', description: 'Speed learner', xpReward: 120, gemReward: 12, targetRange: [5, 15] },
  { id: 58, type: 'night_streak', title: 'Study {count} nights in a row', description: 'Night dedication', xpReward: 100, gemReward: 10, targetRange: [3, 7] },
  { id: 59, type: 'morning_streak', title: 'Study {count} mornings in a row', description: 'Morning routine', xpReward: 100, gemReward: 10, targetRange: [3, 7] },
  { id: 60, type: 'weekend_streak', title: 'Study {count} weekends in a row', description: 'Weekend warrior', xpReward: 120, gemReward: 12, targetRange: [2, 4] },

  // Challenge Quests (61-80)
  { id: 61, type: 'time_trial', title: 'Complete {count} lessons in under 5 minutes each', description: 'Time challenge', xpReward: 150, gemReward: 15, targetRange: [3, 10] },
  { id: 62, type: 'no_hints', title: 'Complete {count} lessons without using hints', description: 'Independent learner', xpReward: 130, gemReward: 13, targetRange: [3, 10] },
  { id: 63, type: 'hard_mode', title: 'Complete {count} lessons on hard mode', description: 'Challenge accepted', xpReward: 180, gemReward: 18, targetRange: [3, 10] },
  { id: 64, type: 'no_skips', title: 'Complete {count} lessons without skipping', description: 'No shortcuts', xpReward: 100, gemReward: 10, targetRange: [5, 15] },
  { id: 65, type: 'bonus_round', title: 'Complete {count} bonus lessons', description: 'Extra credit', xpReward: 120, gemReward: 12, targetRange: [3, 10] },
  { id: 66, type: 'timed_practice', title: 'Complete timed practice {count} times', description: 'Beat the clock', xpReward: 90, gemReward: 9, targetRange: [3, 10] },
  { id: 67, type: 'strength_training', title: 'Strengthen {count} weak skills', description: 'Skill reinforcement', xpReward: 110, gemReward: 11, targetRange: [3, 10] },
  { id: 68, type: 'test_out', title: 'Test out of {count} units', description: 'Skip ahead', xpReward: 200, gemReward: 20, targetRange: [1, 3] },
  { id: 69, type: 'placement_test', title: 'Take a placement test', description: 'Find your level', xpReward: 100, gemReward: 10, targetRange: [1, 1] },
  { id: 70, type: 'certification', title: 'Complete a certification test', description: 'Prove your skills', xpReward: 300, gemReward: 30, targetRange: [1, 1] },
  { id: 71, type: 'story_mode', title: 'Complete {count} story lessons', description: 'Story time', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 72, type: 'podcast', title: 'Listen to {count} podcast lessons', description: 'Audio learner', xpReward: 90, gemReward: 9, targetRange: [3, 10] },
  { id: 73, type: 'video', title: 'Watch {count} video lessons', description: 'Visual learner', xpReward: 90, gemReward: 9, targetRange: [3, 10] },
  { id: 74, type: 'interactive', title: 'Complete {count} interactive lessons', description: 'Hands-on learning', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 75, type: 'game_mode', title: 'Play {count} language games', description: 'Gamified learning', xpReward: 80, gemReward: 8, targetRange: [5, 15] },
  { id: 76, type: 'flashcards', title: 'Review {count} flashcards', description: 'Memory training', xpReward: 60, gemReward: 6, targetRange: [20, 100] },
  { id: 77, type: 'quiz', title: 'Take {count} quizzes', description: 'Test yourself', xpReward: 80, gemReward: 8, targetRange: [3, 10] },
  { id: 78, type: 'practice_hub', title: 'Use practice hub {count} times', description: 'Targeted practice', xpReward: 70, gemReward: 7, targetRange: [3, 10] },
  { id: 79, type: 'mistake_review', title: 'Review {count} past mistakes', description: 'Learn from errors', xpReward: 90, gemReward: 9, targetRange: [5, 20] },
  { id: 80, type: 'weak_skills', title: 'Practice {count} weak skills', description: 'Improve weaknesses', xpReward: 100, gemReward: 10, targetRange: [3, 10] },

  // Special Quests (81-100)
  { id: 81, type: 'holiday', title: 'Complete a holiday special lesson', description: 'Festive learning', xpReward: 150, gemReward: 15, targetRange: [1, 1] },
  { id: 82, type: 'cultural', title: 'Learn about {count} cultural topics', description: 'Cultural explorer', xpReward: 100, gemReward: 10, targetRange: [3, 10] },
  { id: 83, type: 'current_events', title: 'Study {count} current event lessons', description: 'Stay informed', xpReward: 90, gemReward: 9, targetRange: [3, 10] },
  { id: 84, type: 'themed_week', title: 'Complete themed week challenge', description: 'Weekly theme', xpReward: 200, gemReward: 20, targetRange: [1, 1] },
  { id: 85, type: 'community', title: 'Participate in {count} community events', description: 'Community member', xpReward: 120, gemReward: 12, targetRange: [1, 5] },
  { id: 86, type: 'tournament', title: 'Join a learning tournament', description: 'Competitive learning', xpReward: 250, gemReward: 25, targetRange: [1, 1] },
  { id: 87, type: 'team_challenge', title: 'Complete team challenge', description: 'Teamwork', xpReward: 180, gemReward: 18, targetRange: [1, 1] },
  { id: 88, type: 'monthly_goal', title: 'Reach monthly XP goal', description: 'Monthly achievement', xpReward: 300, gemReward: 30, targetRange: [1, 1] },
  { id: 89, type: 'yearly_goal', title: 'Reach yearly XP goal', description: 'Annual achievement', xpReward: 1000, gemReward: 100, targetRange: [1, 1] },
  { id: 90, type: 'milestone', title: 'Reach {count} lesson milestone', description: 'Major milestone', xpReward: 200, gemReward: 20, targetRange: [50, 500] },
  { id: 91, type: 'diversity', title: 'Study {count} different topics', description: 'Diverse learner', xpReward: 100, gemReward: 10, targetRange: [5, 20] },
  { id: 92, type: 'consistency', title: 'Study same time {count} days', description: 'Routine builder', xpReward: 120, gemReward: 12, targetRange: [5, 14] },
  { id: 93, type: 'early_riser', title: 'Study before 7 AM {count} times', description: 'Early bird', xpReward: 100, gemReward: 10, targetRange: [3, 7] },
  { id: 94, type: 'lunch_learner', title: 'Study during lunch {count} times', description: 'Lunch break learning', xpReward: 80, gemReward: 8, targetRange: [3, 7] },
  { id: 95, type: 'commute', title: 'Study during commute {count} times', description: 'Mobile learner', xpReward: 90, gemReward: 9, targetRange: [5, 15] },
  { id: 96, type: 'micro_learning', title: 'Complete {count} 5-minute sessions', description: 'Bite-sized learning', xpReward: 70, gemReward: 7, targetRange: [10, 30] },
  { id: 97, type: 'deep_dive', title: 'Study for {count} minutes non-stop', description: 'Deep focus', xpReward: 150, gemReward: 15, targetRange: [30, 120] },
  { id: 98, type: 'variety_pack', title: 'Try all exercise types', description: 'Well-rounded', xpReward: 120, gemReward: 12, targetRange: [1, 1] },
  { id: 99, type: 'comeback_king', title: 'Restore streak {count} times', description: 'Never give up', xpReward: 150, gemReward: 15, targetRange: [3, 10] },
  { id: 100, type: 'legend', title: 'Become a language legend', description: 'Ultimate achievement', xpReward: 500, gemReward: 50, targetRange: [1, 1] },
]

// Seeded random generator
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Generate random quests for a user
export const generateDailyQuests = (userId = 'guest', count = 3) => {
  const today = new Date().toISOString().split('T')[0]
  const seedBase = `${userId}-${today}`
  let seed = 0
  for (let i = 0; i < seedBase.length; i++) {
    seed += seedBase.charCodeAt(i)
  }

  // Only pick from "Daily Practice" and "Skill Building" for daily quests (IDs 1-40)
  const dailyPool = questTypes.filter(q => q.id <= 40)
  const shuffled = [...dailyPool].sort(() => seededRandom(seed++) - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map(quest => {
    const target = Math.floor(
      seededRandom(seed++) * (quest.targetRange[1] - quest.targetRange[0] + 1) + quest.targetRange[0]
    )

    return {
      id: `quest-${today}-${quest.id}`,
      ...quest,
      title: quest.title.replace('{count}', target),
      target,
      progress: 0,
      expiresAt: new Date().setHours(23, 59, 59, 999), // End of today
      createdAt: Date.now(),
      category: quest.id <= 20 ? 'daily_practice' : quest.id <= 40 ? 'skill_building' : quest.id <= 60 ? 'achievements' : quest.id <= 80 ? 'challenges' : 'special'
    }
  })
}

// Generate weekly quests (harder, better rewards)
export const generateWeeklyQuests = (userId = 'guest', count = 2) => {
  const now = new Date()
  const year = now.getFullYear()
  const weekNumber = Math.ceil((((now - new Date(year, 0, 1)) / 86400000) + 1) / 7)
  const seedBase = `${userId}-week-${year}-${weekNumber}`

  let seed = 0
  for (let i = 0; i < seedBase.length; i++) {
    seed += seedBase.charCodeAt(i)
  }

  const weeklyTypes = questTypes.filter(q =>
    ['section_complete', 'perfect_week', 'dedicated', 'xp_milestone', 'tournament', 'monthly_goal'].includes(q.type)
  )

  const shuffled = [...weeklyTypes].sort(() => seededRandom(seed++) - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map(quest => {
    const target = Math.floor(
      seededRandom(seed++) * (quest.targetRange[1] - quest.targetRange[0] + 1) + quest.targetRange[0]
    )

    return {
      id: `weekly-${year}-${weekNumber}-${quest.id}`,
      ...quest,
      title: quest.title.replace('{count}', target),
      target,
      progress: 0,
      xpReward: quest.xpReward * 2,
      gemReward: quest.gemReward * 2,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
      isWeekly: true,
      category: 'challenges'
    }
  })
}

// Check if quest should be completed based on progress
export const checkQuestCompletion = (quest) => {
  return quest.progress >= quest.target
}

// Update quest progress based on user action
export const updateQuestProgressByAction = (quests, action, value = 1) => {
  return quests.map(quest => {
    if (quest.type === action) {
      return {
        ...quest,
        progress: Math.min(quest.progress + value, quest.target)
      }
    }
    return quest
  })
}

// Generate monthly challenge (very hard, huge rewards)
export const generateMonthlyChallenge = (userId = 'guest') => {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const seedBase = `${userId}-month-${year}-${month}`

  let seed = 0
  for (let i = 0; i < seedBase.length; i++) {
    seed += seedBase.charCodeAt(i)
  }

  // Monthly goal: complete X daily quests
  return {
    id: `monthly-${year}-${month}`,
    type: 'monthly_challenge',
    title: `${now.toLocaleString('default', { month: 'long' })} Challenge`,
    description: `Complete 30 daily quests this month to earn the ${now.toLocaleString('default', { month: 'long' })} badge!`,
    target: 30,
    progress: 0,
    xpReward: 1000,
    gemReward: 100,
    icon: '🏆',
    expiresAt: new Date(year, month + 1, 0, 23, 59, 59, 999).getTime(),
    createdAt: Date.now(),
    isMonthly: true,
    category: 'special'
  }
}
