import { supabase } from '../lib/supabase'

// Leaderboard system with real user rankings

// League tiers
export const leagues = [
  { id: 'bronze', name: 'Bronze League', minXP: 0, color: '#CD7F32', icon: '🥉' },
  { id: 'silver', name: 'Silver League', minXP: 500, color: '#C0C0C0', icon: '🥈' },
  { id: 'gold', name: 'Gold League', minXP: 1500, color: '#FFD700', icon: '🥇' },
  { id: 'sapphire', name: 'Sapphire League', minXP: 3000, color: '#0F52BA', icon: '💎' },
  { id: 'ruby', name: 'Ruby League', minXP: 5000, color: '#E0115F', icon: '💎' },
  { id: 'emerald', name: 'Emerald League', minXP: 8000, color: '#50C878', icon: '💎' },
  { id: 'diamond', name: 'Diamond League', minXP: 12000, color: '#B9F2FF', icon: '💎' },
  { id: 'obsidian', name: 'Obsidian League', minXP: 20000, color: '#3B3C36', icon: '💎' },
  { id: 'pearl', name: 'Pearl League', minXP: 30000, color: '#F0EAD6', icon: '💎' },
  { id: 'legendary', name: 'Legendary League', minXP: 50000, color: '#FFD700', icon: '⭐' },
]

// Get user's league based on XP
export const getUserLeague = (xp) => {
  for (let i = leagues.length - 1; i >= 0; i--) {
    if (xp >= leagues[i].minXP) {
      return leagues[i]
    }
  }
  return leagues[0]
}

// Get next league
export const getNextLeague = (currentLeague) => {
  const currentIndex = leagues.findIndex(l => l.id === currentLeague.id)
  if (currentIndex < leagues.length - 1) {
    return leagues[currentIndex + 1]
  }
  return null
}

// Calculate XP needed for next league
export const getXPToNextLeague = (xp) => {
  const currentLeague = getUserLeague(xp)
  const nextLeague = getNextLeague(currentLeague)

  if (nextLeague) {
    return nextLeague.minXP - xp
  }
  return 0
}

// Leaderboard types
export const leaderboardTypes = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ALL_TIME: 'all_time',
  FRIENDS: 'friends',
  LEAGUE: 'league'
}

// Fetch real leaderboard data from Supabase
export const fetchRealLeaderboard = async (currentUserId) => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, xp, streak, avatar_url')
      .order('xp', { ascending: false })
      .limit(50)

    if (error) throw error

    return profiles.map((profile, index) => ({
      rank: index + 1,
      username: profile.username || 'Anonymous',
      xp: profile.xp || 0,
      streak: profile.streak || 0,
      isCurrentUser: profile.id === currentUserId,
      avatar: profile.avatar_url || ['👨', '👩', '🧑', '👦', '👧'][index % 5],
      league: getUserLeague(profile.xp || 0).id
    }))
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

// Generate mock leaderboard data (fallback)
export const generateMockLeaderboard = (userXP, userName = 'You', count = 30) => {
  const users = []

  // Add current user
  const userRank = Math.floor(Math.random() * count) + 1

  // Generate other users
  const names = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
    'Skylar', 'Rowan', 'Sage', 'River', 'Phoenix', 'Dakota', 'Kai', 'Reese',
    'Charlie', 'Sam', 'Jamie', 'Drew', 'Blake', 'Cameron', 'Emerson', 'Finley',
    'Hayden', 'Logan', 'Parker', 'Peyton', 'Sawyer', 'Spencer'
  ]

  for (let i = 1; i <= count; i++) {
    if (i === userRank) {
      users.push({
        rank: i,
        username: userName,
        xp: userXP,
        streak: Math.floor(Math.random() * 100),
        isCurrentUser: true,
        avatar: '👤',
        league: getUserLeague(userXP).id
      })
    } else {
      const randomXP = Math.max(0, userXP + (Math.random() - 0.5) * 1000)
      users.push({
        rank: i,
        username: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
        xp: Math.floor(randomXP),
        streak: Math.floor(Math.random() * 100),
        isCurrentUser: false,
        avatar: ['👨', '👩', '🧑', '👦', '👧'][Math.floor(Math.random() * 5)],
        league: getUserLeague(randomXP).id
      })
    }
  }

  // Sort by XP
  users.sort((a, b) => b.xp - a.xp)

  // Update ranks
  users.forEach((user, index) => {
    user.rank = index + 1
  })

  return users
}

// Get top 3 users
export const getTopThree = (leaderboard) => {
  return leaderboard.slice(0, 3)
}

// Get user's position in leaderboard
export const getUserPosition = (leaderboard, username) => {
  return leaderboard.findIndex(user => user.username === username) + 1
}

// Calculate promotion/demotion zones
export const getLeagueZones = (leaderboard) => {
  const total = leaderboard.length
  const promotionZone = Math.ceil(total * 0.2) // Top 20% get promoted
  const demotionZone = Math.floor(total * 0.8) // Bottom 20% get demoted

  return {
    promotion: promotionZone,
    safe: demotionZone,
    demotion: total
  }
}

// Check if user is in promotion zone
export const isInPromotionZone = (rank, total) => {
  const zones = getLeagueZones({ length: total })
  return rank <= zones.promotion
}

// Check if user is in demotion zone
export const isInDemotionZone = (rank, total) => {
  const zones = getLeagueZones({ length: total })
  return rank > zones.safe
}

// Get league rewards
export const getLeagueRewards = (league, rank) => {
  const baseReward = {
    bronze: { xp: 50, gems: 5 },
    silver: { xp: 100, gems: 10 },
    gold: { xp: 200, gems: 20 },
    sapphire: { xp: 300, gems: 30 },
    ruby: { xp: 400, gems: 40 },
    emerald: { xp: 500, gems: 50 },
    diamond: { xp: 750, gems: 75 },
    obsidian: { xp: 1000, gems: 100 },
    pearl: { xp: 1500, gems: 150 },
    legendary: { xp: 2000, gems: 200 }
  }

  const reward = baseReward[league.id] || baseReward.bronze

  // Bonus for top 3
  if (rank === 1) {
    return { xp: reward.xp * 3, gems: reward.gems * 3 }
  } else if (rank === 2) {
    return { xp: reward.xp * 2, gems: reward.gems * 2 }
  } else if (rank === 3) {
    return { xp: Math.floor(reward.xp * 1.5), gems: Math.floor(reward.gems * 1.5) }
  }

  return reward
}
