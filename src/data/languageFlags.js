// Language flags and metadata
// Using emoji flags for simplicity - can be replaced with image URLs

export const languageFlags = {
  am: { flag: '🇪🇹', name: 'Amharic', nativeName: 'አማርኛ', script: 'geez' },
  ti: { flag: '🇪🇷', name: 'Tigrinya', nativeName: 'ትግርኛ', script: 'geez' },
  om: { flag: '🇪🇹', name: 'Oromo', nativeName: 'Afaan Oromoo', script: 'latin' },
  so: { flag: '🇸🇴', name: 'Somali', nativeName: 'Soomaali', script: 'latin' },
  // aa: { flag: '🇪🇹', name: 'Afar', nativeName: 'Qafar af', script: 'latin' },
  // sid: { flag: '🇪🇹', name: 'Sidamo', nativeName: 'Sidaamu Afoo', script: 'latin' },
  // wal: { flag: '🇪🇹', name: 'Wolaytta', nativeName: 'Wolaytta', script: 'latin' },
  gez: { flag: '🇪🇹', name: "Ge'ez", nativeName: 'ግዕዝ', script: 'geez' },
  en: { flag: '🇬🇧', name: 'English', nativeName: 'English', script: 'latin' },
  // ar: { flag: '🇸🇦', name: 'Arabic', nativeName: 'العربية', script: 'arabic' },
  // fr: { flag: '🇫🇷', name: 'French', nativeName: 'Français', script: 'latin' },
  // sw: { flag: '🇰🇪', name: 'Swahili', nativeName: 'Kiswahili', script: 'latin' },
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
