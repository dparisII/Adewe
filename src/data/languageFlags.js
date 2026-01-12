// Language flags and metadata
// Using emoji flags for simplicity - can be replaced with image URLs

export const languageFlags = {
  // Ethiopian Languages - all default to 🇪🇹 Ethiopian flag
  amharic: { flag: '🇪🇹', name: 'Amharic', nativeName: 'አማርኛ', script: 'geez', country: 'ethiopia' },
  tigrinya: { flag: '🇪🇹', name: 'Tigrinya', nativeName: 'ትግርኛ', script: 'geez', country: 'ethiopia' },
  oromo: { flag: '🇪🇹', name: 'Oromo', nativeName: 'Afaan Oromoo', script: 'latin', country: 'ethiopia' },
  geez: { flag: '🇪🇹', name: "Ge'ez", nativeName: 'ግዕዝ', script: 'geez', country: 'ethiopia' },
  sidama: { flag: '🇪🇹', name: 'Sidama', nativeName: 'Sidaamu Afoo', script: 'latin', country: 'ethiopia' },
  afar: { flag: '🇪🇹', name: 'Afar', nativeName: 'Qafar af', script: 'latin', country: 'ethiopia' },
  wolayta: { flag: '🇪🇹', name: 'Wolayta', nativeName: 'Wolaytta', script: 'latin', country: 'ethiopia' },
  gurage: { flag: '🇪🇹', name: 'Gurage', nativeName: 'ጉራጊኛ', script: 'geez', country: 'ethiopia' },
  hadiyya: { flag: '🇪🇹', name: 'Hadiyya', nativeName: 'Hadiyyisa', script: 'latin', country: 'ethiopia' },
  kafa: { flag: '🇪🇹', name: 'Kafa', nativeName: 'Kafficho', script: 'latin', country: 'ethiopia' },

  // Short codes for Ethiopian languages
  am: { flag: '🇪🇹', name: 'Amharic', nativeName: 'አማርኛ', script: 'geez', country: 'ethiopia' },
  ti: { flag: '🇪🇹', name: 'Tigrinya', nativeName: 'ትግርኛ', script: 'geez', country: 'ethiopia' },
  om: { flag: '🇪🇹', name: 'Oromo', nativeName: 'Afaan Oromoo', script: 'latin', country: 'ethiopia' },
  gez: { flag: '🇪🇹', name: "Ge'ez", nativeName: 'ግዕዝ', script: 'geez', country: 'ethiopia' },
  aa: { flag: '🇪🇹', name: 'Afar', nativeName: 'Qafar af', script: 'latin', country: 'ethiopia' },
  sid: { flag: '🇪🇹', name: 'Sidama', nativeName: 'Sidaamu Afoo', script: 'latin', country: 'ethiopia' },
  wal: { flag: '🇪🇹', name: 'Wolayta', nativeName: 'Wolaytta', script: 'latin', country: 'ethiopia' },

  // Non-Ethiopian languages
  somali: { flag: '🇸🇴', name: 'Somali', nativeName: 'Soomaali', script: 'latin', country: 'somalia' },
  so: { flag: '🇸🇴', name: 'Somali', nativeName: 'Soomaali', script: 'latin', country: 'somalia' },
  english: { flag: '🇬🇧', name: 'English', nativeName: 'English', script: 'latin', country: 'uk' },
  en: { flag: '🇬🇧', name: 'English', nativeName: 'English', script: 'latin', country: 'uk' },
}

// Ethiopian language codes for detection
const ethiopianCodes = ['am', 'ti', 'om', 'gez', 'aa', 'sid', 'wal', 'amharic', 'tigrinya', 'oromo', 'geez', 'afar', 'sidama', 'wolayta', 'gurage', 'hadiyya', 'kafa']

// Get flag by language code - defaults to 🇪🇹 for Ethiopian languages
export function getFlag(code) {
  if (!code) return '🇪🇹'
  const normalized = code.toLowerCase().trim()

  // Check if it's an Ethiopian language by name
  if (ethiopianCodes.includes(normalized)) {
    return '🇪🇹'
  }

  return languageFlags[normalized]?.flag || '🇪🇹' // Default to Ethiopian flag
}

// Get language info by code
export function getLanguageInfo(code) {
  if (!code) return { flag: '🇪🇹', name: 'Unknown', nativeName: 'Unknown', script: 'geez', country: 'ethiopia' }
  const normalized = code.toLowerCase().trim()
  return languageFlags[normalized] || { flag: '🇪🇹', name: code, nativeName: code, script: 'latin', country: 'ethiopia' }
}

// Check if a language is Ethiopian
export function isEthiopianLanguage(code) {
  if (!code) return true
  return ethiopianCodes.includes(code.toLowerCase().trim())
}

// All available languages for selection
export const availableLanguages = Object.entries(languageFlags)
  .filter(([code]) => code.length > 2) // Only full names, not short codes
  .map(([code, data]) => ({ code, ...data }))

// Ethiopian languages specifically
export const ethiopianLanguages = Object.entries(languageFlags)
  .filter(([code, data]) => data.country === 'ethiopia' && code.length > 2)
  .map(([code, data]) => ({ code, ...data }))

export default languageFlags
