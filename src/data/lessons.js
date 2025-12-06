// Lesson data for all language pairs
export const lessonData = {
  // English to Amharic
  'english-amharic': {
    units: [
      {
        id: 1,
        title: 'Basics 1',
        description: 'Learn basic greetings and introductions',
        lessons: [
          {
            id: '1-1',
            title: 'Greetings',
            exercises: [
              {
                type: 'translation',
                question: 'Hello',
                answer: 'ሰላም',
                options: ['ሰላም', 'አመሰግናለሁ', 'ደህና ሁን', 'እንደምን'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'Good morning',
                answer: 'እንደምን አደርክ',
                options: ['እንደምን አደርክ', 'እንደምን ዋልክ', 'ደህና ሁን', 'ሰላም'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Hello', right: 'ሰላም' },
                  { left: 'Goodbye', right: 'ደህና ሁን' },
                  { left: 'Thank you', right: 'አመሰግናለሁ' },
                  { left: 'Please', right: 'እባክህ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What does "ሰላም" mean?',
                answer: 'Hello',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              },
              {
                type: 'fillBlank',
                sentence: 'To say "thank you" in Amharic, you say ___',
                answer: 'አመሰግናለሁ',
                options: ['አመሰግናለሁ', 'ሰላም', 'ደህና ሁን', 'እባክህ'],
              },
            ],
          },
          {
            id: '1-2',
            title: 'Introductions',
            exercises: [
              {
                type: 'translation',
                question: 'My name is...',
                answer: 'ስሜ ... ነው',
                options: ['ስሜ ... ነው', 'እኔ ... ነኝ', 'ስምህ ማን ነው', 'ከየት ነህ'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'What is your name?',
                answer: 'ስምህ ማን ነው?',
                options: ['ስምህ ማን ነው?', 'ስሜ ... ነው', 'እንደምን ነህ', 'ከየት ነህ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I am" in Amharic?',
                answer: 'እኔ ... ነኝ',
                options: ['እኔ ... ነኝ', 'አንተ ... ነህ', 'እሱ ... ነው', 'እሷ ... ናት'],
              },
              {
                type: 'translation',
                question: 'Nice to meet you',
                answer: 'ደስ ብሎኛል',
                options: ['ደስ ብሎኛል', 'አመሰግናለሁ', 'ሰላም', 'ደህና ሁን'],
                audio: null,
              },
            ],
          },
          {
            id: '1-3',
            title: 'Numbers 1-10',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: '1', right: 'አንድ' },
                  { left: '2', right: 'ሁለት' },
                  { left: '3', right: 'ሶስት' },
                  { left: '4', right: 'አራት' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What is "5" in Amharic?',
                answer: 'አምስት',
                options: ['አምስት', 'ስድስት', 'ሰባት', 'ስምንት'],
              },
              {
                type: 'translation',
                question: 'Six',
                answer: 'ስድስት',
                options: ['ስድስት', 'ሰባት', 'ስምንት', 'ዘጠኝ'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: '7', right: 'ሰባት' },
                  { left: '8', right: 'ስምንት' },
                  { left: '9', right: 'ዘጠኝ' },
                  { left: '10', right: 'አስር' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Basics 2',
        description: 'Learn common phrases and expressions',
        lessons: [
          {
            id: '2-1',
            title: 'Common Phrases',
            exercises: [
              {
                type: 'translation',
                question: 'How are you?',
                answer: 'እንደምን ነህ?',
                options: ['እንደምን ነህ?', 'ስምህ ማን ነው?', 'ከየት ነህ?', 'ምን ትፈልጋለህ?'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'I am fine',
                answer: 'ደህና ነኝ',
                options: ['ደህና ነኝ', 'ደህና ሁን', 'አመሰግናለሁ', 'ሰላም'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What does "ደህና ነኝ" mean?',
                answer: 'I am fine',
                options: ['I am fine', 'Goodbye', 'Thank you', 'Hello'],
              },
              {
                type: 'fillBlank',
                sentence: 'To ask "How are you?" say ___',
                answer: 'እንደምን ነህ?',
                options: ['እንደምን ነህ?', 'ደህና ነኝ', 'ስምህ ማን ነው?', 'ከየት ነህ?'],
              },
            ],
          },
          {
            id: '2-2',
            title: 'Yes and No',
            exercises: [
              {
                type: 'translation',
                question: 'Yes',
                answer: 'አዎ',
                options: ['አዎ', 'አይ', 'ምናልባት', 'እርግጠኛ ነኝ'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'No',
                answer: 'አይ',
                options: ['አይ', 'አዎ', 'ምናልባት', 'አልገባኝም'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I don\'t understand" in Amharic?',
                answer: 'አልገባኝም',
                options: ['አልገባኝም', 'ገባኝ', 'አዎ', 'አይ'],
              },
              {
                type: 'translation',
                question: 'I understand',
                answer: 'ገባኝ',
                options: ['ገባኝ', 'አልገባኝም', 'አዎ', 'አይ'],
                audio: null,
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: 'Family',
        description: 'Learn family member names',
        lessons: [
          {
            id: '3-1',
            title: 'Immediate Family',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Mother', right: 'እናት' },
                  { left: 'Father', right: 'አባት' },
                  { left: 'Sister', right: 'እህት' },
                  { left: 'Brother', right: 'ወንድም' },
                ],
              },
              {
                type: 'translation',
                question: 'Family',
                answer: 'ቤተሰብ',
                options: ['ቤተሰብ', 'ቤት', 'ሰው', 'ልጅ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "child" in Amharic?',
                answer: 'ልጅ',
                options: ['ልጅ', 'ሰው', 'ቤተሰብ', 'ወንድም'],
              },
              {
                type: 'translation',
                question: 'Son',
                answer: 'ወንድ ልጅ',
                options: ['ወንድ ልጅ', 'ሴት ልጅ', 'ልጅ', 'ወንድም'],
                audio: null,
              },
            ],
          },
        ],
      },
    ],
  },

  // English to Tigrinya
  'english-tigrinya': {
    units: [
      {
        id: 1,
        title: 'Basics 1',
        description: 'Learn basic greetings and introductions',
        lessons: [
          {
            id: '1-1',
            title: 'Greetings',
            exercises: [
              {
                type: 'translation',
                question: 'Hello',
                answer: 'ሰላም',
                options: ['ሰላም', 'የቐንየለይ', 'ደሓን ኩን', 'ከመይ'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'Good morning',
                answer: 'ከመይ ሓዲርካ',
                options: ['ከመይ ሓዲርካ', 'ከመይ ዊዕልካ', 'ደሓን ኩን', 'ሰላም'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Hello', right: 'ሰላም' },
                  { left: 'Goodbye', right: 'ደሓን ኩን' },
                  { left: 'Thank you', right: 'የቐንየለይ' },
                  { left: 'Please', right: 'በጃኻ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What does "ሰላም" mean?',
                answer: 'Hello',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              },
            ],
          },
          {
            id: '1-2',
            title: 'Introductions',
            exercises: [
              {
                type: 'translation',
                question: 'My name is...',
                answer: 'ስመይ ... እዩ',
                options: ['ስመይ ... እዩ', 'ኣነ ... እየ', 'ስምካ መን እዩ', 'ካበይ ኢኻ'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'What is your name?',
                answer: 'ስምካ መን እዩ?',
                options: ['ስምካ መን እዩ?', 'ስመይ ... እዩ', 'ከመይ ኣለኻ', 'ካበይ ኢኻ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I am" in Tigrinya?',
                answer: 'ኣነ ... እየ',
                options: ['ኣነ ... እየ', 'ንስኻ ... ኢኻ', 'ንሱ ... እዩ', 'ንሳ ... እያ'],
              },
            ],
          },
          {
            id: '1-3',
            title: 'Numbers 1-10',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: '1', right: 'ሓደ' },
                  { left: '2', right: 'ክልተ' },
                  { left: '3', right: 'ሰለስተ' },
                  { left: '4', right: 'ኣርባዕተ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What is "5" in Tigrinya?',
                answer: 'ሓሙሽተ',
                options: ['ሓሙሽተ', 'ሽድሽተ', 'ሸውዓተ', 'ሸሞንተ'],
              },
              {
                type: 'matching',
                pairs: [
                  { left: '7', right: 'ሸውዓተ' },
                  { left: '8', right: 'ሸሞንተ' },
                  { left: '9', right: 'ትሽዓተ' },
                  { left: '10', right: 'ዓሰርተ' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Basics 2',
        description: 'Learn common phrases',
        lessons: [
          {
            id: '2-1',
            title: 'Common Phrases',
            exercises: [
              {
                type: 'translation',
                question: 'How are you?',
                answer: 'ከመይ ኣለኻ?',
                options: ['ከመይ ኣለኻ?', 'ስምካ መን እዩ?', 'ካበይ ኢኻ?', 'እንታይ ትደሊ?'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'I am fine',
                answer: 'ደሓን እየ',
                options: ['ደሓን እየ', 'ደሓን ኩን', 'የቐንየለይ', 'ሰላም'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What does "ደሓን እየ" mean?',
                answer: 'I am fine',
                options: ['I am fine', 'Goodbye', 'Thank you', 'Hello'],
              },
            ],
          },
        ],
      },
    ],
  },

  // English to Afaan Oromo
  'english-oromo': {
    units: [
      {
        id: 1,
        title: 'Basics 1',
        description: 'Learn basic greetings and introductions',
        lessons: [
          {
            id: '1-1',
            title: 'Greetings',
            exercises: [
              {
                type: 'translation',
                question: 'Hello',
                answer: 'Akkam',
                options: ['Akkam', 'Galatoomaa', 'Nagaatti', 'Maaloo'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'Good morning',
                answer: 'Akkam bultee',
                options: ['Akkam bultee', 'Akkam ooltee', 'Nagaatti', 'Akkam'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Hello', right: 'Akkam' },
                  { left: 'Goodbye', right: 'Nagaatti' },
                  { left: 'Thank you', right: 'Galatoomaa' },
                  { left: 'Please', right: 'Maaloo' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What does "Akkam" mean?',
                answer: 'Hello',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              },
              {
                type: 'fillBlank',
                sentence: 'To say "thank you" in Oromo, you say ___',
                answer: 'Galatoomaa',
                options: ['Galatoomaa', 'Akkam', 'Nagaatti', 'Maaloo'],
              },
            ],
          },
          {
            id: '1-2',
            title: 'Introductions',
            exercises: [
              {
                type: 'translation',
                question: 'My name is...',
                answer: 'Maqaan koo ... dha',
                options: ['Maqaan koo ... dha', 'Ani ... dha', 'Maqaan kee eenyu', 'Eessaa dhufte'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'What is your name?',
                answer: 'Maqaan kee eenyu?',
                options: ['Maqaan kee eenyu?', 'Maqaan koo ... dha', 'Akkam jirta', 'Eessaa dhufte'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I am" in Oromo?',
                answer: 'Ani ... dha',
                options: ['Ani ... dha', 'Ati ... dha', 'Inni ... dha', 'Isheen ... dha'],
              },
            ],
          },
          {
            id: '1-3',
            title: 'Numbers 1-10',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: '1', right: 'Tokko' },
                  { left: '2', right: 'Lama' },
                  { left: '3', right: 'Sadii' },
                  { left: '4', right: 'Afur' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What is "5" in Oromo?',
                answer: 'Shan',
                options: ['Shan', 'Jaha', 'Torba', 'Saddeet'],
              },
              {
                type: 'matching',
                pairs: [
                  { left: '7', right: 'Torba' },
                  { left: '8', right: 'Saddeet' },
                  { left: '9', right: 'Sagal' },
                  { left: '10', right: 'Kudhan' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Basics 2',
        description: 'Learn common phrases',
        lessons: [
          {
            id: '2-1',
            title: 'Common Phrases',
            exercises: [
              {
                type: 'translation',
                question: 'How are you?',
                answer: 'Akkam jirta?',
                options: ['Akkam jirta?', 'Maqaan kee eenyu?', 'Eessaa dhufte?', 'Maal barbaadda?'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'I am fine',
                answer: 'Nagaa dha',
                options: ['Nagaa dha', 'Nagaatti', 'Galatoomaa', 'Akkam'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What does "Nagaa dha" mean?',
                answer: 'I am fine',
                options: ['I am fine', 'Goodbye', 'Thank you', 'Hello'],
              },
            ],
          },
        ],
      },
    ],
  },

  // English to Somali
  'english-somali': {
    units: [
      {
        id: 1,
        title: 'Basics 1',
        description: 'Learn basic greetings and introductions',
        lessons: [
          {
            id: '1-1',
            title: 'Greetings',
            exercises: [
              {
                type: 'translation',
                question: 'Hello',
                answer: 'Salaan',
                options: ['Salaan', 'Mahadsanid', 'Nabad gelyo', 'Fadlan'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'Good morning',
                answer: 'Subax wanaagsan',
                options: ['Subax wanaagsan', 'Galab wanaagsan', 'Nabad gelyo', 'Salaan'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Hello', right: 'Salaan' },
                  { left: 'Goodbye', right: 'Nabad gelyo' },
                  { left: 'Thank you', right: 'Mahadsanid' },
                  { left: 'Please', right: 'Fadlan' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What does "Salaan" mean?',
                answer: 'Hello',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              },
              {
                type: 'fillBlank',
                sentence: 'To say "thank you" in Somali, you say ___',
                answer: 'Mahadsanid',
                options: ['Mahadsanid', 'Salaan', 'Nabad gelyo', 'Fadlan'],
              },
            ],
          },
          {
            id: '1-2',
            title: 'Introductions',
            exercises: [
              {
                type: 'translation',
                question: 'My name is...',
                answer: 'Magacaygu waa ...',
                options: ['Magacaygu waa ...', 'Waxaan ahay ...', 'Magacaagu waa maxay', 'Xaggee ka timid'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'What is your name?',
                answer: 'Magacaagu waa maxay?',
                options: ['Magacaagu waa maxay?', 'Magacaygu waa ...', 'Sidee tahay', 'Xaggee ka timid'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I am" in Somali?',
                answer: 'Waxaan ahay',
                options: ['Waxaan ahay', 'Waxaad tahay', 'Wuu yahay', 'Way tahay'],
              },
            ],
          },
          {
            id: '1-3',
            title: 'Numbers 1-10',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: '1', right: 'Kow' },
                  { left: '2', right: 'Laba' },
                  { left: '3', right: 'Saddex' },
                  { left: '4', right: 'Afar' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What is "5" in Somali?',
                answer: 'Shan',
                options: ['Shan', 'Lix', 'Toddoba', 'Siddeed'],
              },
              {
                type: 'matching',
                pairs: [
                  { left: '7', right: 'Toddoba' },
                  { left: '8', right: 'Siddeed' },
                  { left: '9', right: 'Sagaal' },
                  { left: '10', right: 'Toban' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Basics 2',
        description: 'Learn common phrases',
        lessons: [
          {
            id: '2-1',
            title: 'Common Phrases',
            exercises: [
              {
                type: 'translation',
                question: 'How are you?',
                answer: 'Sidee tahay?',
                options: ['Sidee tahay?', 'Magacaagu waa maxay?', 'Xaggee ka timid?', 'Maxaad rabtaa?'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'I am fine',
                answer: 'Waan fiicnahay',
                options: ['Waan fiicnahay', 'Nabad gelyo', 'Mahadsanid', 'Salaan'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What does "Waan fiicnahay" mean?',
                answer: 'I am fine',
                options: ['I am fine', 'Goodbye', 'Thank you', 'Hello'],
              },
            ],
          },
        ],
      },
    ],
  },
}

export const getLessons = (nativeLanguage, learningLanguage) => {
  const key = `${nativeLanguage}-${learningLanguage}`
  return lessonData[key] || null
}

export const getLesson = (nativeLanguage, learningLanguage, unitId, lessonId) => {
  const data = getLessons(nativeLanguage, learningLanguage)
  if (!data) return null
  
  const unit = data.units.find((u) => u.id === parseInt(unitId))
  if (!unit) return null
  
  return unit.lessons.find((l) => l.id === lessonId)
}
