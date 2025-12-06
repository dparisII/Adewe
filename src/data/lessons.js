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
          {
            id: '3-2',
            title: 'Extended Family',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Grandmother', right: 'አያት' },
                  { left: 'Grandfather', right: 'አያት' },
                  { left: 'Uncle', right: 'አጎት' },
                  { left: 'Aunt', right: 'አክስት' },
                ],
              },
              {
                type: 'translation',
                question: 'Cousin',
                answer: 'የአጎት/የአክስት ልጅ',
                options: ['የአጎት/የአክስት ልጅ', 'ወንድም', 'እህት', 'ልጅ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "nephew" in Amharic?',
                answer: 'የወንድም/የእህት ልጅ',
                options: ['የወንድም/የእህት ልጅ', 'አጎት', 'አክስት', 'አያት'],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'Food & Drinks',
        description: 'Learn about Ethiopian cuisine',
        lessons: [
          {
            id: '4-1',
            title: 'Basic Foods',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Bread', right: 'ዳቦ' },
                  { left: 'Water', right: 'ውሃ' },
                  { left: 'Coffee', right: 'ቡና' },
                  { left: 'Injera', right: 'እንጀራ' },
                ],
              },
              {
                type: 'translation',
                question: 'I am hungry',
                answer: 'ርቤኛል',
                options: ['ርቤኛል', 'ጠማኝ', 'ደክሞኛል', 'ተኝቻለሁ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "ቡና" in English?',
                answer: 'Coffee',
                options: ['Coffee', 'Tea', 'Water', 'Milk'],
              },
              {
                type: 'translation',
                question: 'I am thirsty',
                answer: 'ጠማኝ',
                options: ['ጠማኝ', 'ርቤኛል', 'ደክሞኛል', 'ተኝቻለሁ'],
                audio: null,
              },
              {
                type: 'fillBlank',
                sentence: 'Ethiopian traditional bread is called ___',
                answer: 'እንጀራ',
                options: ['እንጀራ', 'ዳቦ', 'ቂጣ', 'አምባሻ'],
              },
            ],
          },
          {
            id: '4-2',
            title: 'Ethiopian Dishes',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Doro Wot', right: 'ዶሮ ወጥ' },
                  { left: 'Shiro', right: 'ሽሮ' },
                  { left: 'Tibs', right: 'ጥብስ' },
                  { left: 'Kitfo', right: 'ክትፎ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What is "ዶሮ ወጥ"?',
                answer: 'Chicken stew',
                options: ['Chicken stew', 'Beef stew', 'Vegetable stew', 'Fish stew'],
              },
              {
                type: 'translation',
                question: 'Delicious',
                answer: 'ጣፋጭ',
                options: ['ጣፋጭ', 'መራራ', 'ጨዋማ', 'ቅመም'],
                audio: null,
              },
            ],
          },
        ],
      },
      {
        id: 5,
        title: 'Colors & Objects',
        description: 'Learn colors and everyday objects',
        lessons: [
          {
            id: '5-1',
            title: 'Colors',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Red', right: 'ቀይ' },
                  { left: 'Green', right: 'አረንጓዴ' },
                  { left: 'Yellow', right: 'ቢጫ' },
                  { left: 'Blue', right: 'ሰማያዊ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What color is "ጥቁር"?',
                answer: 'Black',
                options: ['Black', 'White', 'Gray', 'Brown'],
              },
              {
                type: 'translation',
                question: 'White',
                answer: 'ነጭ',
                options: ['ነጭ', 'ጥቁር', 'ግራጫ', 'ቡናማ'],
                audio: null,
              },
              {
                type: 'fillBlank',
                sentence: 'The Ethiopian flag has green, yellow, and ___',
                answer: 'ቀይ',
                options: ['ቀይ', 'ሰማያዊ', 'ነጭ', 'ጥቁር'],
              },
            ],
          },
          {
            id: '5-2',
            title: 'Everyday Objects',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Book', right: 'መጽሐፍ' },
                  { left: 'Pen', right: 'እስክሪብቶ' },
                  { left: 'Phone', right: 'ስልክ' },
                  { left: 'Table', right: 'ጠረጴዛ' },
                ],
              },
              {
                type: 'translation',
                question: 'Chair',
                answer: 'ወንበር',
                options: ['ወንበር', 'ጠረጴዛ', 'አልጋ', 'በር'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "በር" in English?',
                answer: 'Door',
                options: ['Door', 'Window', 'Wall', 'Floor'],
              },
            ],
          },
        ],
      },
      {
        id: 6,
        title: 'Time & Days',
        description: 'Learn to tell time and days of the week',
        lessons: [
          {
            id: '6-1',
            title: 'Days of the Week',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Monday', right: 'ሰኞ' },
                  { left: 'Tuesday', right: 'ማክሰኞ' },
                  { left: 'Wednesday', right: 'ረቡዕ' },
                  { left: 'Thursday', right: 'ሐሙስ' },
                ],
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Friday', right: 'አርብ' },
                  { left: 'Saturday', right: 'ቅዳሜ' },
                  { left: 'Sunday', right: 'እሁድ' },
                  { left: 'Today', right: 'ዛሬ' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What day is "ቅዳሜ"?',
                answer: 'Saturday',
                options: ['Saturday', 'Sunday', 'Friday', 'Monday'],
              },
              {
                type: 'translation',
                question: 'Tomorrow',
                answer: 'ነገ',
                options: ['ነገ', 'ዛሬ', 'ትናንት', 'ሳምንት'],
                audio: null,
              },
            ],
          },
          {
            id: '6-2',
            title: 'Telling Time',
            exercises: [
              {
                type: 'translation',
                question: 'What time is it?',
                answer: 'ስንት ሰዓት ነው?',
                options: ['ስንት ሰዓት ነው?', 'ዛሬ ምን ቀን ነው?', 'የት ነህ?', 'ምን ትፈልጋለህ?'],
                audio: null,
              },
              {
                type: 'matching',
                pairs: [
                  { left: 'Morning', right: 'ጠዋት' },
                  { left: 'Afternoon', right: 'ከሰዓት' },
                  { left: 'Evening', right: 'ማታ' },
                  { left: 'Night', right: 'ሌሊት' },
                ],
              },
              {
                type: 'multipleChoice',
                question: 'What does "ጠዋት" mean?',
                answer: 'Morning',
                options: ['Morning', 'Afternoon', 'Evening', 'Night'],
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
          {
            id: '2-2',
            title: 'Yes and No',
            exercises: [
              {
                type: 'translation',
                question: 'Yes',
                answer: 'እወ',
                options: ['እወ', 'ኣይፋል', 'ምናልባት', 'ርግጸኛ እየ'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'No',
                answer: 'ኣይፋል',
                options: ['ኣይፋል', 'እወ', 'ምናልባት', 'ኣይተረድኣንን'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I don\'t understand" in Tigrinya?',
                answer: 'ኣይተረድኣንን',
                options: ['ኣይተረድኣንን', 'ተረዲኡኒ', 'እወ', 'ኣይፋል'],
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
                  { left: 'Mother', right: 'ኣደ' },
                  { left: 'Father', right: 'ኣቦ' },
                  { left: 'Sister', right: 'ሓብቲ' },
                  { left: 'Brother', right: 'ሓው' },
                ],
              },
              {
                type: 'translation',
                question: 'Family',
                answer: 'ስድራ',
                options: ['ስድራ', 'ገዛ', 'ሰብ', 'ቆልዓ'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "child" in Tigrinya?',
                answer: 'ቆልዓ',
                options: ['ቆልዓ', 'ሰብ', 'ስድራ', 'ሓው'],
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
          {
            id: '2-2',
            title: 'Yes and No',
            exercises: [
              {
                type: 'translation',
                question: 'Yes',
                answer: 'Eeyyee',
                options: ['Eeyyee', 'Lakki', 'Tarii', 'Nan hubadhe'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'No',
                answer: 'Lakki',
                options: ['Lakki', 'Eeyyee', 'Tarii', 'Hin hubanne'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I understand" in Oromo?',
                answer: 'Nan hubadhe',
                options: ['Nan hubadhe', 'Hin hubanne', 'Eeyyee', 'Lakki'],
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
                  { left: 'Mother', right: 'Haadha' },
                  { left: 'Father', right: 'Abbaa' },
                  { left: 'Sister', right: 'Obboleettii' },
                  { left: 'Brother', right: 'Obboleessa' },
                ],
              },
              {
                type: 'translation',
                question: 'Family',
                answer: 'Maatii',
                options: ['Maatii', 'Mana', 'Nama', 'Ijoollee'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "child" in Oromo?',
                answer: 'Ijoollee',
                options: ['Ijoollee', 'Nama', 'Maatii', 'Obboleessa'],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'Food & Drinks',
        description: 'Learn about food and beverages',
        lessons: [
          {
            id: '4-1',
            title: 'Basic Foods',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Bread', right: 'Buddeena' },
                  { left: 'Water', right: 'Bishaan' },
                  { left: 'Coffee', right: 'Buna' },
                  { left: 'Milk', right: 'Aannan' },
                ],
              },
              {
                type: 'translation',
                question: 'I am hungry',
                answer: 'Beela\'e',
                options: ['Beela\'e', 'Dheebote', 'Dadhabee', 'Rafee'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "Buna" in English?',
                answer: 'Coffee',
                options: ['Coffee', 'Tea', 'Water', 'Milk'],
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
          {
            id: '2-2',
            title: 'Yes and No',
            exercises: [
              {
                type: 'translation',
                question: 'Yes',
                answer: 'Haa',
                options: ['Haa', 'Maya', 'Laga yaabaa', 'Waan fahamsanahay'],
                audio: null,
              },
              {
                type: 'translation',
                question: 'No',
                answer: 'Maya',
                options: ['Maya', 'Haa', 'Laga yaabaa', 'Ma fahmin'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'How do you say "I understand" in Somali?',
                answer: 'Waan fahamsanahay',
                options: ['Waan fahamsanahay', 'Ma fahmin', 'Haa', 'Maya'],
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
                  { left: 'Mother', right: 'Hooyo' },
                  { left: 'Father', right: 'Aabo' },
                  { left: 'Sister', right: 'Walaal (gabadh)' },
                  { left: 'Brother', right: 'Walaal (wiil)' },
                ],
              },
              {
                type: 'translation',
                question: 'Family',
                answer: 'Qoys',
                options: ['Qoys', 'Guri', 'Qof', 'Ilmo'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "child" in Somali?',
                answer: 'Ilmo',
                options: ['Ilmo', 'Qof', 'Qoys', 'Walaal'],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        title: 'Food & Drinks',
        description: 'Learn about food and beverages',
        lessons: [
          {
            id: '4-1',
            title: 'Basic Foods',
            exercises: [
              {
                type: 'matching',
                pairs: [
                  { left: 'Bread', right: 'Rooti' },
                  { left: 'Water', right: 'Biyo' },
                  { left: 'Tea', right: 'Shaah' },
                  { left: 'Milk', right: 'Caano' },
                ],
              },
              {
                type: 'translation',
                question: 'I am hungry',
                answer: 'Waan gaajoonayaa',
                options: ['Waan gaajoonayaa', 'Waan harraadsan ahay', 'Waan daallan ahay', 'Waan seexanayaa'],
                audio: null,
              },
              {
                type: 'multipleChoice',
                question: 'What is "Shaah" in English?',
                answer: 'Tea',
                options: ['Tea', 'Coffee', 'Water', 'Milk'],
              },
              {
                type: 'translation',
                question: 'Rice',
                answer: 'Bariis',
                options: ['Bariis', 'Rooti', 'Hilib', 'Khudaar'],
                audio: null,
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
