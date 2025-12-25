// Shop items with prices and effects

export const shopItems = [
  // Power-ups (1-10)
  {
    id: 'refill_hearts',
    name: 'Refill Hearts',
    description: 'Instantly refill all your hearts',
    price: 350,
    type: 'consumable',
    icon: '❤️',
    effect: 'refill_hearts',
    category: 'power-ups'
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for 1 day',
    price: 200,
    type: 'consumable',
    icon: '🧊',
    effect: 'streak_freeze',
    category: 'power-ups'
  },
  {
    id: 'double_xp',
    name: 'Double XP',
    description: 'Earn 2x XP for 15 minutes',
    price: 500,
    type: 'consumable',
    icon: '⚡',
    effect: 'double_xp',
    duration: 900000, // 15 minutes
    category: 'power-ups'
  },
  {
    id: 'heart_refill_unlimited',
    name: 'Unlimited Hearts',
    description: 'Unlimited hearts for 1 hour',
    price: 800,
    type: 'consumable',
    icon: '💖',
    effect: 'unlimited_hearts',
    duration: 3600000, // 1 hour
    category: 'power-ups'
  },
  {
    id: 'xp_boost',
    name: 'XP Boost',
    description: '+50 XP bonus',
    price: 150,
    type: 'consumable',
    icon: '🌟',
    effect: 'xp_boost',
    value: 50,
    category: 'power-ups'
  },
  {
    id: 'gem_boost',
    name: 'Gem Boost',
    description: '+20 gems bonus',
    price: 100,
    type: 'consumable',
    icon: '💎',
    effect: 'gem_boost',
    value: 20,
    category: 'power-ups'
  },
  {
    id: 'skip_lesson',
    name: 'Lesson Skip',
    description: 'Skip one lesson',
    price: 400,
    type: 'consumable',
    icon: '⏭️',
    effect: 'skip_lesson',
    category: 'power-ups'
  },
  {
    id: 'hint_pack',
    name: 'Hint Pack',
    description: '5 free hints',
    price: 250,
    type: 'consumable',
    icon: '💡',
    effect: 'hint_pack',
    value: 5,
    category: 'power-ups'
  },
  {
    id: 'time_freeze',
    name: 'Time Freeze',
    description: 'Pause timer for timed practice',
    price: 300,
    type: 'consumable',
    icon: '⏸️',
    effect: 'time_freeze',
    category: 'power-ups'
  },
  {
    id: 'mistake_eraser',
    name: 'Mistake Eraser',
    description: 'Undo last mistake',
    price: 450,
    type: 'consumable',
    icon: '↩️',
    effect: 'mistake_eraser',
    category: 'power-ups'
  },

  // Cosmetics (11-25)
  {
    id: 'owl_hat_red',
    name: 'Red Hat',
    description: 'Stylish red hat for your owl',
    price: 500,
    type: 'cosmetic',
    icon: '🎩',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_hat_blue',
    name: 'Blue Cap',
    description: 'Cool blue cap',
    price: 500,
    type: 'cosmetic',
    icon: '🧢',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_glasses',
    name: 'Smart Glasses',
    description: 'Look intelligent',
    price: 600,
    type: 'cosmetic',
    icon: '👓',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_sunglasses',
    name: 'Sunglasses',
    description: 'Stay cool',
    price: 600,
    type: 'cosmetic',
    icon: '🕶️',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_crown',
    name: 'Royal Crown',
    description: 'Rule the leaderboard',
    price: 1500,
    type: 'cosmetic',
    icon: '👑',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_scarf',
    name: 'Cozy Scarf',
    description: 'Winter warmth',
    price: 400,
    type: 'cosmetic',
    icon: '🧣',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'owl_bowtie',
    name: 'Fancy Bowtie',
    description: 'Formal look',
    price: 450,
    type: 'cosmetic',
    icon: '🎀',
    effect: 'cosmetic',
    category: 'cosmetics'
  },
  {
    id: 'background_forest',
    name: 'Forest Background',
    description: 'Nature theme',
    price: 800,
    type: 'cosmetic',
    icon: '🌲',
    effect: 'background',
    category: 'cosmetics'
  },
  {
    id: 'background_beach',
    name: 'Beach Background',
    description: 'Tropical vibes',
    price: 800,
    type: 'cosmetic',
    icon: '🏖️',
    effect: 'background',
    category: 'cosmetics'
  },
  {
    id: 'background_space',
    name: 'Space Background',
    description: 'Cosmic learning',
    price: 1000,
    type: 'cosmetic',
    icon: '🚀',
    effect: 'background',
    category: 'cosmetics'
  },
  {
    id: 'theme_dark',
    name: 'Dark Theme',
    description: 'Easy on the eyes',
    price: 700,
    type: 'cosmetic',
    icon: '🌙',
    effect: 'theme',
    category: 'cosmetics'
  },
  {
    id: 'theme_rainbow',
    name: 'Rainbow Theme',
    description: 'Colorful interface',
    price: 900,
    type: 'cosmetic',
    icon: '🌈',
    effect: 'theme',
    category: 'cosmetics'
  },
  {
    id: 'badge_gold',
    name: 'Gold Badge',
    description: 'Show off your achievement',
    price: 1200,
    type: 'cosmetic',
    icon: '🥇',
    effect: 'badge',
    category: 'cosmetics'
  },
  {
    id: 'badge_silver',
    name: 'Silver Badge',
    description: 'Shine bright',
    price: 800,
    type: 'cosmetic',
    icon: '🥈',
    effect: 'badge',
    category: 'cosmetics'
  },
  {
    id: 'badge_bronze',
    name: 'Bronze Badge',
    description: 'Start your collection',
    price: 500,
    type: 'cosmetic',
    icon: '🥉',
    effect: 'badge',
    category: 'cosmetics'
  },

  // Upgrades (26-35)
  {
    id: 'heart_upgrade_1',
    name: 'Heart Capacity +1',
    description: 'Increase max hearts to 6',
    price: 2000,
    type: 'upgrade',
    icon: '💗',
    effect: 'heart_capacity',
    value: 1,
    category: 'upgrades'
  },
  {
    id: 'heart_upgrade_2',
    name: 'Heart Capacity +2',
    description: 'Increase max hearts to 7',
    price: 3500,
    type: 'upgrade',
    icon: '💗',
    effect: 'heart_capacity',
    value: 2,
    category: 'upgrades',
    requires: 'heart_upgrade_1'
  },
  {
    id: 'xp_multiplier_1',
    name: 'XP Multiplier 1.2x',
    description: 'Earn 20% more XP',
    price: 5000,
    type: 'upgrade',
    icon: '✨',
    effect: 'xp_multiplier',
    value: 1.2,
    category: 'upgrades'
  },
  {
    id: 'xp_multiplier_2',
    name: 'XP Multiplier 1.5x',
    description: 'Earn 50% more XP',
    price: 10000,
    type: 'upgrade',
    icon: '✨',
    effect: 'xp_multiplier',
    value: 1.5,
    category: 'upgrades',
    requires: 'xp_multiplier_1'
  },
  {
    id: 'gem_multiplier',
    name: 'Gem Finder',
    description: 'Find 25% more gems',
    price: 4000,
    type: 'upgrade',
    icon: '💎',
    effect: 'gem_multiplier',
    value: 1.25,
    category: 'upgrades'
  },
  {
    id: 'streak_saver',
    name: 'Streak Saver',
    description: 'Auto-freeze streak once per week',
    price: 3000,
    type: 'upgrade',
    icon: '🛡️',
    effect: 'streak_saver',
    category: 'upgrades'
  },
  {
    id: 'practice_boost',
    name: 'Practice Boost',
    description: 'Earn bonus XP from practice',
    price: 2500,
    type: 'upgrade',
    icon: '📚',
    effect: 'practice_boost',
    value: 1.3,
    category: 'upgrades'
  },
  {
    id: 'lesson_preview',
    name: 'Lesson Preview',
    description: 'See lesson content before starting',
    price: 1500,
    type: 'upgrade',
    icon: '👁️',
    effect: 'lesson_preview',
    category: 'upgrades'
  },
  {
    id: 'offline_mode',
    name: 'Offline Mode',
    description: 'Download lessons for offline use',
    price: 6000,
    type: 'upgrade',
    icon: '📥',
    effect: 'offline_mode',
    category: 'upgrades'
  },
  {
    id: 'ad_free',
    name: 'Ad-Free Experience',
    description: 'Remove all advertisements',
    price: 8000,
    type: 'upgrade',
    icon: '🚫',
    effect: 'ad_free',
    category: 'upgrades'
  },

  // Special Items (36-40)
  {
    id: 'treasure_chest',
    name: 'Treasure Chest',
    description: 'Random rewards!',
    price: 1000,
    type: 'special',
    icon: '🎁',
    effect: 'treasure_chest',
    category: 'special'
  },
  {
    id: 'golden_ticket',
    name: 'Golden Ticket',
    description: 'Access to premium content for 1 week',
    price: 2500,
    type: 'special',
    icon: '🎫',
    effect: 'premium_access',
    duration: 604800000, // 7 days
    category: 'special'
  },
  {
    id: 'language_unlock',
    name: 'Language Unlock',
    description: 'Unlock a new language course',
    price: 5000,
    type: 'special',
    icon: '🗣️',
    effect: 'language_unlock',
    category: 'special'
  },
  {
    id: 'skill_test',
    name: 'Skill Test',
    description: 'Test out of units',
    price: 1500,
    type: 'special',
    icon: '📝',
    effect: 'skill_test',
    category: 'special'
  },
  {
    id: 'legendary_status',
    name: 'Legendary Status',
    description: 'Unlock legendary challenges',
    price: 15000,
    type: 'special',
    icon: '⭐',
    effect: 'legendary_status',
    category: 'special'
  },
]

// Get items by category
export const getItemsByCategory = (category) => {
  return shopItems.filter(item => item.category === category)
}

// Get item by ID
export const getItemById = (id) => {
  return shopItems.find(item => item.id === id)
}

// Check if user can purchase item
export const canPurchase = (item, userGems, userInventory) => {
  if (userGems < item.price) return { canPurchase: false, reason: 'Not enough gems' }

  // Check if item requires another item
  if (item.requires) {
    const hasRequired = userInventory.some(i => i.id === item.requires)
    if (!hasRequired) {
      return { canPurchase: false, reason: `Requires ${item.requires}` }
    }
  }

  // Check if already owned (for non-consumables)
  if (item.type !== 'consumable') {
    const alreadyOwned = userInventory.some(i => i.id === item.id)
    if (alreadyOwned) {
      return { canPurchase: false, reason: 'Already owned' }
    }
  }

  return { canPurchase: true }
}

// Apply item effect
// Apply item effect
export const applyItemEffect = (item, store) => {
  switch (item.effect) {
    case 'refill_hearts':
      store.refillHearts()
      break
    case 'unlimited_hearts':
      if (store.enableUnlimitedHearts) {
        store.enableUnlimitedHearts(1) // 1 hour duration as per item description
      }
      break
    case 'xp_boost':
      store.addXp(item.value)
      break
    case 'gem_boost':
      store.addGems(item.value)
      break
    case 'streak_freeze':
      // This would be handled by streak logic
      break
    case 'double_xp':
    case 'time_freeze':
      // These are time-based effects stored in inventory
      break
    default:
      // Cosmetic or upgrade effects are passive
      break
  }
}
