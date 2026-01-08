// Language flags and metadata
// Using emoji flags for simplicity - can be replaced with image URLs

export const languageFlags = {
  amharic: { flag: '🇪🇹', name: 'Amharic', nativeName: 'አማርኛ', script: 'geez' },
  tigrinya: { flag: '🇪🇷', name: 'Tigrinya', nativeName: 'ትግርኛ', script: 'geez' },
  oromo: { flag: '🇪🇹', name: 'Oromo', nativeName: 'Afaan Oromoo', script: 'latin' },
  somali: { flag: '🇸🇴', name: 'Somali', nativeName: 'Soomaali', script: 'latin' },
  geez: { flag: '🇪🇹', name: "Ge'ez", nativeName: 'ግዕዝ', script: 'geez' },
  english: { flag: '🇬🇧', name: 'English', nativeName: 'English', script: 'latin' },
}

// Get flag by language code
export function getFlag(code) {
  return languageFlags[code]?.flag || '🏳️'
}

// Get language info by code
export function getLanguageInfo(code) {
  return languageFlags[code] || { flag: '🏳️', name: code, nativeName: code, script: 'latin' }
}

// All available languages for selection
export const availableLanguages = Object.entries(languageFlags).map(([code, data]) => ({
  code,
  ...data
}))

// Ethiopian languages specifically
export const ethiopianLanguages = ['am', 'ti', 'om', 'so', 'aa', 'sid', 'wal', 'gez']
  .map(code => ({ code, ...languageFlags[code] }))

export default languageFlags
