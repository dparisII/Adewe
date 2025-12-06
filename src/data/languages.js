export const languages = [
  {
    code: 'english',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    script: 'latin',
    direction: 'ltr',
  },
  {
    code: 'amharic',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    flag: '🇪🇹',
    script: 'ethiopic',
    direction: 'ltr',
  },
  {
    code: 'tigrinya',
    name: 'Tigrinya',
    nativeName: 'ትግርኛ',
    flag: '🇪🇷',
    script: 'ethiopic',
    direction: 'ltr',
  },
  {
    code: 'oromo',
    name: 'Afaan Oromo',
    nativeName: 'Afaan Oromoo',
    flag: '🇪🇹',
    script: 'latin',
    direction: 'ltr',
  },
  {
    code: 'somali',
    name: 'Somali',
    nativeName: 'Soomaali',
    flag: '🇸🇴',
    script: 'latin',
    direction: 'ltr',
  },
]

export const getLanguage = (code) => languages.find((l) => l.code === code)

export const getOtherLanguages = (excludeCode) => 
  languages.filter((l) => l.code !== excludeCode)
