// Real lesson content for all Ethiopian languages
// This file contains actual translations and exercises for each language pair

const amharicLessons = {
  greetings: {
    vocabulary: [
      { english: 'Hello', amharic: 'ሰላም', pronunciation: 'selam' },
      { english: 'Good morning', amharic: 'እንደምን አደርክ', pronunciation: 'endemin aderk' },
      { english: 'Good evening', amharic: 'እንደምን አመሸህ', pronunciation: 'endemin amesheh' },
      { english: 'Goodbye', amharic: 'ደህና ሁን', pronunciation: 'dehna hun' },
      { english: 'Thank you', amharic: 'አመሰግናለሁ', pronunciation: 'ameseginalehu' },
      { english: 'Please', amharic: 'እባክህ', pronunciation: 'ebakeh' },
      { english: 'Yes', amharic: 'አዎ', pronunciation: 'awo' },
      { english: 'No', amharic: 'አይ', pronunciation: 'ay' },
    ],
    phrases: [
      { english: 'How are you?', amharic: 'እንደምን ነህ?', pronunciation: 'endemin neh?' },
      { english: 'I am fine', amharic: 'ደህና ነኝ', pronunciation: 'dehna negn' },
      { english: 'What is your name?', amharic: 'ስምህ ማን ነው?', pronunciation: 'simih man new?' },
      { english: 'My name is...', amharic: 'ስሜ ... ነው', pronunciation: 'sime ... new' },
    ]
  },
  numbers: {
    vocabulary: [
      { english: '1', amharic: 'አንድ', pronunciation: 'and' },
      { english: '2', amharic: 'ሁለት', pronunciation: 'hulet' },
      { english: '3', amharic: 'ሶስት', pronunciation: 'sost' },
      { english: '4', amharic: 'አራት', pronunciation: 'arat' },
      { english: '5', amharic: 'አምስት', pronunciation: 'amist' },
      { english: '6', amharic: 'ስድስት', pronunciation: 'sidist' },
      { english: '7', amharic: 'ሰባት', pronunciation: 'sebat' },
      { english: '8', amharic: 'ስምንት', pronunciation: 'simint' },
      { english: '9', amharic: 'ዘጠኝ', pronunciation: 'zetegn' },
      { english: '10', amharic: 'አስር', pronunciation: 'asir' },
    ]
  },
  family: {
    vocabulary: [
      { english: 'Mother', amharic: 'እናት', pronunciation: 'enat' },
      { english: 'Father', amharic: 'አባት', pronunciation: 'abat' },
      { english: 'Sister', amharic: 'እህት', pronunciation: 'ehit' },
      { english: 'Brother', amharic: 'ወንድም', pronunciation: 'wendim' },
      { english: 'Son', amharic: 'ልጅ', pronunciation: 'lij' },
      { english: 'Daughter', amharic: 'ሴት ልጅ', pronunciation: 'set lij' },
      { english: 'Grandmother', amharic: 'አያት', pronunciation: 'ayat' },
      { english: 'Grandfather', amharic: 'አያት', pronunciation: 'ayat' },
    ]
  }
}

const tigrinyaLessons = {
  greetings: {
    vocabulary: [
      { english: 'Hello', tigrinya: 'ሰላም', pronunciation: 'selam' },
      { english: 'Good morning', tigrinya: 'ደሓን ዋዓልካ', pronunciation: 'dehan waelka' },
      { english: 'Good evening', tigrinya: 'ደሓን ምሸትካ', pronunciation: 'dehan mishetka' },
      { english: 'Goodbye', tigrinya: 'ደሓን ሂድ', pronunciation: 'dehan hid' },
      { english: 'Thank you', tigrinya: 'የቐንየለይ', pronunciation: 'yekeniyeley' },
      { english: 'Please', tigrinya: 'በጃኻ', pronunciation: 'bejaka' },
      { english: 'Yes', tigrinya: 'እወ', pronunciation: 'ewe' },
      { english: 'No', tigrinya: 'አይፋልን', pronunciation: 'ayfalin' },
    ],
    phrases: [
      { english: 'How are you?', tigrinya: 'ከመይ ኣለኻ?', pronunciation: 'kemey aleka?' },
      { english: 'I am fine', tigrinya: 'ደሓን እየ', pronunciation: 'dehan eye' },
      { english: 'What is your name?', tigrinya: 'ስምካ ምንድን እዩ?', pronunciation: 'simka mindin iyu?' },
      { english: 'My name is...', tigrinya: 'ስመይ ... እዩ', pronunciation: 'simey ... iyu' },
    ]
  },
  numbers: {
    vocabulary: [
      { english: '1', tigrinya: 'ሓደ', pronunciation: 'hade' },
      { english: '2', tigrinya: 'ክልተ', pronunciation: 'kilte' },
      { english: '3', tigrinya: 'ሰለስተ', pronunciation: 'seleste' },
      { english: '4', tigrinya: 'ኣርባዕተ', pronunciation: 'arbate' },
      { english: '5', tigrinya: 'ሓሙሽተ', pronunciation: 'hamushte' },
      { english: '6', tigrinya: 'ሽድሽተ', pronunciation: 'shidishte' },
      { english: '7', tigrinya: 'ሸውዓተ', pronunciation: 'shewate' },
      { english: '8', tigrinya: 'ሸሞንተ', pronunciation: 'shemonte' },
      { english: '9', tigrinya: 'ትሽዓተ', pronunciation: 'tishate' },
      { english: '10', tigrinya: 'ዓሰርተ', pronunciation: 'aserte' },
    ]
  }
}

const oromoLessons = {
  greetings: {
    vocabulary: [
      { english: 'Hello', oromo: 'Akkam', pronunciation: 'akkam' },
      { english: 'Good morning', oromo: 'Akkam bulte', pronunciation: 'akkam bulte' },
      { english: 'Good evening', oromo: 'Akkam galgalte', pronunciation: 'akkam galgalte' },
      { english: 'Goodbye', oromo: 'Nagaatti', pronunciation: 'nagaatti' },
      { english: 'Thank you', oromo: 'Galatoomaa', pronunciation: 'galatoomaa' },
      { english: 'Please', oromo: 'Maaloo', pronunciation: 'maaloo' },
      { english: 'Yes', oromo: 'Eeyyee', pronunciation: 'eeyyee' },
      { english: 'No', oromo: 'Lakki', pronunciation: 'lakki' },
    ],
    phrases: [
      { english: 'How are you?', oromo: 'Akkam jirta?', pronunciation: 'akkam jirta?' },
      { english: 'I am fine', oromo: 'Nagaan jira', pronunciation: 'nagaan jira' },
      { english: 'What is your name?', oromo: 'Maqaan kee eenyu?', pronunciation: 'maqaan kee eenyu?' },
      { english: 'My name is...', oromo: 'Maqaan koo ... dha', pronunciation: 'maqaan koo ... dha' },
    ]
  },
  numbers: {
    vocabulary: [
      { english: '1', oromo: 'Tokko', pronunciation: 'tokko' },
      { english: '2', oromo: 'Lama', pronunciation: 'lama' },
      { english: '3', oromo: 'Sadii', pronunciation: 'sadii' },
      { english: '4', oromo: 'Afur', pronunciation: 'afur' },
      { english: '5', oromo: 'Shan', pronunciation: 'shan' },
      { english: '6', oromo: 'Jaha', pronunciation: 'jaha' },
      { english: '7', oromo: 'Torba', pronunciation: 'torba' },
      { english: '8', oromo: 'Saddeet', pronunciation: 'saddeet' },
      { english: '9', oromo: 'Sagal', pronunciation: 'sagal' },
      { english: '10', oromo: 'Kudhan', pronunciation: 'kudhan' },
    ]
  }
}

const somaliLessons = {
  greetings: {
    vocabulary: [
      { english: 'Hello', somali: 'Salaam', pronunciation: 'salaam' },
      { english: 'Good morning', somali: 'Subax wanaagsan', pronunciation: 'subax wanaagsan' },
      { english: 'Good evening', somali: 'Fiid wanaagsan', pronunciation: 'fiid wanaagsan' },
      { english: 'Goodbye', somali: 'Nabad gelyo', pronunciation: 'nabad gelyo' },
      { english: 'Thank you', somali: 'Mahadsanid', pronunciation: 'mahadsanid' },
      { english: 'Please', somali: 'Fadlan', pronunciation: 'fadlan' },
      { english: 'Yes', somali: 'Haa', pronunciation: 'haa' },
      { english: 'No', somali: 'Maya', pronunciation: 'maya' },
    ],
    phrases: [
      { english: 'How are you?', somali: 'Sidee tahay?', pronunciation: 'sidee tahay?' },
      { english: 'I am fine', somali: 'Waan fiicnahay', pronunciation: 'waan fiicnahay' },
      { english: 'What is your name?', somali: 'Magacaa?', pronunciation: 'magacaa?' },
      { english: 'My name is...', somali: 'Magacaygu waa...', pronunciation: 'magacaygu waa...' },
    ]
  },
  numbers: {
    vocabulary: [
      { english: '1', somali: 'Kow', pronunciation: 'kow' },
      { english: '2', somali: 'Laba', pronunciation: 'laba' },
      { english: '3', somali: 'Saddex', pronunciation: 'saddex' },
      { english: '4', somali: 'Afar', pronunciation: 'afar' },
      { english: '5', somali: 'Shan', pronunciation: 'shan' },
      { english: '6', somali: 'Lix', pronunciation: 'lix' },
      { english: '7', somali: 'Todobo', pronunciation: 'todobo' },
      { english: '8', somali: 'Sideed', pronunciation: 'sideed' },
      { english: '9', somali: 'Sagaal', pronunciation: 'sagaal' },
      { english: '10', somali: 'Toban', pronunciation: 'toban' },
    ]
  }
}

const geezLessons = {
  greetings: {
    vocabulary: [
      { english: 'Hello', geez: 'ሰላም (Selam)', pronunciation: 'selam' },
      { english: 'Peace', geez: 'አመክሮ (Amekro)', pronunciation: 'amekro' },
      { english: 'Holy', geez: 'ቅዱስ (Qidus)', pronunciation: 'qidus' },
      { english: 'King', geez: 'ንጉሥ (Nigus)', pronunciation: 'nigus' },
      { english: 'Prayer', geez: 'ጸሎት (Tselot)', pronunciation: 'tselot' },
    ],
    phrases: []
  },
  numbers: {
    vocabulary: [
      { english: '1', geez: 'አሐዱ (Ahadu)', pronunciation: 'ahadu' },
      { english: '2', geez: 'ክልኤቱ (Kilietu)', pronunciation: 'kilietu' },
      { english: '3', geez: 'ሠለስቱ (Selestu)', pronunciation: 'selestu' },
    ]
  }
}

// Generate exercises from vocabulary
const generateExercisesFromVocab = (vocab, targetLang) => {
  const exercises = []

  // Translation exercises
  vocab.forEach((item, index) => {
    if (index < 3) { // First 3 items
      exercises.push({
        type: 'translation',
        question: item.english,
        answer: item[targetLang],
        options: [
          item[targetLang],
          vocab[(index + 1) % vocab.length][targetLang],
          vocab[(index + 2) % vocab.length][targetLang],
          vocab[(index + 3) % vocab.length][targetLang],
        ],
        audio: null,
      })
    }
  })

  // Multiple choice exercises
  vocab.forEach((item, index) => {
    if (index >= 3 && index < 6) { // Next 3 items
      exercises.push({
        type: 'multipleChoice',
        question: `What does "${item[targetLang]}" mean?`,
        answer: item.english,
        options: [
          item.english,
          vocab[(index + 1) % vocab.length].english,
          vocab[(index + 2) % vocab.length].english,
          vocab[(index + 3) % vocab.length].english,
        ],
      })
    }
  })

  // Matching exercise
  if (vocab.length >= 4) {
    exercises.push({
      type: 'matching',
      pairs: vocab.slice(0, 4).map(item => ({
        left: item.english,
        right: item[targetLang]
      }))
    })
  }

  // Fill in the blank
  vocab.forEach((item, index) => {
    if (index >= 6 && index < 8) {
      exercises.push({
        type: 'fillBlank',
        sentence: `To say "${item.english}" in ${targetLang}, you say ___`,
        answer: item[targetLang],
        options: [
          item[targetLang],
          vocab[(index + 1) % vocab.length][targetLang],
          vocab[(index + 2) % vocab.length][targetLang],
          vocab[(index + 3) % vocab.length][targetLang],
        ],
      })
    }
  })

  return exercises
}

// Export real lesson data
export const realLessonsData = {
  amharic: amharicLessons,
  tigrinya: tigrinyaLessons,
  oromo: oromoLessons,
  somali: somaliLessons,
  geez: geezLessons,
}

// Get real exercises for a specific topic and language
export const getRealExercises = (language, topic) => {
  const langData = realLessonsData[language]
  if (!langData || !langData[topic]) return null

  return generateExercisesFromVocab(langData[topic].vocabulary, language)
}

// Get vocabulary for a topic
export const getVocabulary = (language, topic) => {
  const langData = realLessonsData[language]
  if (!langData || !langData[topic]) return []

  return langData[topic].vocabulary || []
}

// Get phrases for a topic
export const getPhrases = (language, topic) => {
  const langData = realLessonsData[language]
  if (!langData || !langData[topic]) return []

  return langData[topic].phrases || []
}

export default realLessonsData
