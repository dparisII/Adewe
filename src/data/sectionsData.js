// Generate 10 sections with 15 units each for all language pairs
// Each unit has 5 lessons

const realContent = {
  'amharic': {
    'Greetings': [
      { native: 'Hello', learning: 'Selam (ሰላም)' },
      { native: 'Good morning', learning: 'Endemin aderk (እንደምን አደርክ)' },
      { native: 'Good evening', learning: 'Endemin amesheh (እንደምን አመሸህ)' },
      { native: 'How are you?', learning: 'Endet neh? (እንዴት ነህ?)' },
      { native: 'Goodbye', learning: 'Dehna hun (ደህና ሁን)' }
    ],
    'Introductions': [
      { native: 'My name is...', learning: 'Sime... naw (ስሜ... ነው)' },
      { native: 'Nice to meet you', learning: 'Siletewaweqin des bilognal (ስለተዋወቅን ደስ ብሎኛል)' },
      { native: 'Where are you from?', learning: 'Ke yet neh? (ከየት ነህ?)' },
      { native: 'I am from...', learning: 'Ine ke... negn (እኔ ከ... ነኝ)' },
      { native: 'Who are you?', learning: 'Man neh? (ማን ነህ?)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'And (አንድ)' },
      { native: 'Two', learning: 'Hulet (ሁለት)' },
      { native: 'Three', learning: 'Sost (ሶስት)' },
      { native: 'Four', learning: 'Arat (አራት)' },
      { native: 'Five', learning: 'Amist (አምስት)' },
      { native: 'Six', learning: 'Sidist (ስድስት)' },
      { native: 'Seven', learning: 'Sebat (ሰባት)' },
      { native: 'Eight', learning: 'Simint (ስምንት)' },
      { native: 'Nine', learning: 'Zetegn (ዘጠኝ)' },
      { native: 'Ten', learning: 'Asir (አስር)' }
    ],
    'Colors': [
      { native: 'Red', learning: 'Key (ቀይ)' },
      { native: 'Blue', learning: 'Semayawi (ሰማያዊ)' },
      { native: 'Green', learning: 'Arengwade (አረንጓዴ)' },
      { native: 'Yellow', learning: 'Bicha (ቢጫ)' },
      { native: 'Black', learning: 'Tikur (ጥቁር)' },
      { native: 'White', learning: 'Nech (ነጭ)' }
    ],
    'Family': [
      { native: 'Mother', learning: 'Enat (እናት)' },
      { native: 'Father', learning: 'Abat (አባት)' },
      { native: 'Brother', learning: 'Wondim (ወንድም)' },
      { native: 'Sister', learning: 'Ehit (እህት)' },
      { native: 'Grandmother', learning: 'Ayat (አያት)' }
    ],
    'Days of Week': [
      { native: 'Monday', learning: 'Segno (ሰኞ)' },
      { native: 'Tuesday', learning: 'Maksegno (ማክሰኞ)' },
      { native: 'Wednesday', learning: 'Erob (ረቡዕ)' },
      { native: 'Thursday', learning: 'Hamus (ሐሙስ)' },
      { native: 'Friday', learning: 'Arb (አርብ)' },
      { native: 'Saturday', learning: 'Kidame (ቅዳሜ)' },
      { native: 'Sunday', learning: 'Ehud (እሁድ)' }
    ],
    'Months': [
      { native: 'September', learning: 'Meskerem (መስከረም)' },
      { native: 'October', learning: 'Tikimt (ጥቅምት)' },
      { native: 'November', learning: 'Hidar (ህዳር)' },
      { native: 'December', learning: 'Tahisas (ታህሳስ)' },
      { native: 'January', learning: 'Tir (ጥር)' }
    ],
    'Basic Verbs': [
      { native: 'To eat', learning: 'Meblat (መብላት)' },
      { native: 'To drink', learning: 'Metetat (መጠጣት)' },
      { native: 'To sleep', learning: 'Metegnat (መተኛት)' },
      { native: 'To go', learning: 'Mehed (መሄድ)' },
      { native: 'To come', learning: 'Memtat (መምጣት)' }
    ],
    'Common Objects': [
      { native: 'Table', learning: 'Terepeza (ጠረጴዛ)' },
      { native: 'Chair', learning: 'Wember (ወንበር)' },
      { native: 'Door', learning: 'Ber (በር)' },
      { native: 'Window', learning: 'Meskot (መስኮት)' },
      { native: 'Pen', learning: 'Iskiribto (እስክሪብቶ)' }
    ],
    'Food Basics': [
      { native: 'Bread', learning: 'Dabo (ዳቦ)' },
      { native: 'Water', learning: 'Wuha (ውሃ)' },
      { native: 'Milk', learning: 'Wetet (ወተት)' },
      { native: 'Coffee', learning: 'Buna (ቡና)' },
      { native: 'Tea', learning: 'Shay (ሻይ)' }
    ],
    'Animals': [
      { native: 'Dog', learning: 'Wisha (ውሻ)' },
      { native: 'Cat', learning: 'Dimet (ድመት)' },
      { native: 'Cow', learning: 'Lam (ላም)' },
      { native: 'Sheep', learning: 'Beg (በግ)' },
      { native: 'Lion', learning: 'Anbessa (አንበሳ)' }
    ],
    'Body Parts': [
      { native: 'Head', learning: 'Ras (ራስ)' },
      { native: 'Eye', learning: 'Ayn (ዓይን)' },
      { native: 'Nose', learning: 'Afincha (አፍንጫ)' },
      { native: 'Mouth', learning: 'Af (አፍ)' },
      { native: 'Hand', learning: 'Ej (እጅ)' }
    ],
    'Clothing': [
      { native: 'Shirt', learning: 'Shemiz (ሸሚዝ)' },
      { native: 'Pants', learning: 'Surri (ሱሪ)' },
      { native: 'Shoes', learning: 'Chamma (ጫማ)' },
      { native: 'Hat', learning: 'Kofiya (ቆብ)' },
      { native: 'Dress', learning: 'Kemis (ቀሚስ)' }
    ],
    'Weather': [
      { native: 'Sun', learning: 'Tsehay (ፀሐይ)' },
      { native: 'Rain', learning: 'Zinab (ዝናብ)' },
      { native: 'Wind', learning: 'Nifas (ንፋስ)' },
      { native: 'Cloud', learning: 'Demena (ደመና)' },
      { native: 'Hot', learning: 'Muk (ሙቀት)' }
    ],
    'Time': [
      { native: 'Morning', learning: 'Tewat (ጠዋት)' },
      { native: 'Afternoon', learning: 'Keseat (ከሰዓት)' },
      { native: 'Night', learning: 'Lelit (ሌሊት)' },
      { native: 'Today', learning: 'Zare (ዛሬ)' },
      { native: 'Tomorrow', learning: 'Nege (ነገ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Tiliq (ትልቅ)' },
      { native: 'Small', learning: 'Tinish (ትንሽ)' },
      { native: 'Beautiful', learning: 'Qonjo (ቆንጆ)' },
      { native: 'Ugly', learning: 'Yemaymori (የማያምር)' },
      { native: 'Fast', learning: 'Fetani (ፈጣን)' }
    ],
    // Section 2 - Explore
    'Numbers 11-100': [
      { native: 'Eleven', learning: 'Asra and (አስራ አንድ)' },
      { native: 'Twelve', learning: 'Asra hulet (አስራ ሁለት)' },
      { native: 'Twenty', learning: 'Haya (ሃያ)' },
      { native: 'Thirty', learning: 'Selasa (ሰላሳ)' },
      { native: 'Hundred', learning: 'Meto (መቶ)' }
    ],
    'Directions': [
      { native: 'Left', learning: 'Gra (ግራ)' },
      { native: 'Right', learning: 'Qegn (ቀኝ)' },
      { native: 'Straight', learning: 'Qetita (ቀጥታ)' },
      { native: 'North', learning: 'Semen (ሰሜን)' },
      { native: 'South', learning: 'Debub (ደቡብ)' }
    ],
    'Places in City': [
      { native: 'Market', learning: 'Gebeya (ገበያ)' },
      { native: 'Hospital', learning: 'Hospital (ሆስፒታል)' },
      { native: 'School', learning: 'Timhirt bet (ትምህርት ቤት)' },
      { native: 'Bank', learning: 'Bank (ባንክ)' },
      { native: 'Church', learning: 'Betekrstiyan (ቤተክርስቲያን)' }
    ],
    'Transportation': [
      { native: 'Car', learning: 'Mekina (መኪና)' },
      { native: 'Bus', learning: 'Autobus (አውቶቡስ)' },
      { native: 'Airplane', learning: 'Ayroplan (አይሮፕላን)' },
      { native: 'Bicycle', learning: 'Biskilet (ብስክሌት)' },
      { native: 'Train', learning: 'Babur (ባቡር)' }
    ],
    'Shopping': [
      { native: 'How much?', learning: 'Sint new? (ስንት ነው?)' },
      { native: 'Expensive', learning: 'Wud (ውድ)' },
      { native: 'Cheap', learning: 'Rkash (ርካሽ)' },
      { native: 'To buy', learning: 'Megzat (መግዛት)' },
      { native: 'To sell', learning: 'Meshet (መሸጥ)' }
    ],
    'At Restaurant': [
      { native: 'Menu', learning: 'Menu (ሜኑ)' },
      { native: 'Waiter', learning: 'Astelalafi (አስተላላፊ)' },
      { native: 'Bill', learning: 'Hisab (ሂሳብ)' },
      { native: 'Delicious', learning: 'Tafach (ጣፋጭ)' },
      { native: 'Hungry', learning: 'Rabeñ (ራበኝ)' }
    ],
    'At Home': [
      { native: 'Kitchen', learning: 'Madbet (ማድቤት)' },
      { native: 'Bedroom', learning: 'Megnta kilil (መኝታ ክፍል)' },
      { native: 'Bathroom', learning: 'Metatebiya (መታጠቢያ)' },
      { native: 'Living room', learning: 'Salon (ሳሎን)' },
      { native: 'Garden', learning: 'Yatilikit bota (የአትክልት ቦታ)' }
    ],
    'Hobbies': [
      { native: 'Reading', learning: 'Manbeb (ማንበብ)' },
      { native: 'Writing', learning: 'Metsaf (መጻፍ)' },
      { native: 'Drawing', learning: 'Mesal (መሳል)' },
      { native: 'Cooking', learning: 'Mabeslat (ማብሰል)' },
      { native: 'Dancing', learning: 'Mereked (መረገጥ)' }
    ],
    'Sports': [
      { native: 'Football', learning: 'Igir kwas (እግር ኳስ)' },
      { native: 'Running', learning: 'Rucha (ሩጫ)' },
      { native: 'Swimming', learning: 'Wana (ዋና)' },
      { native: 'Basketball', learning: 'Basket kwas (ባስኬት ኳስ)' },
      { native: 'Tennis', learning: 'Tennis (ቴኒስ)' }
    ],
    'Music': [
      { native: 'Song', learning: 'Zema (ዜማ)' },
      { native: 'Singer', learning: 'Zemari (ዘማሪ)' },
      { native: 'Instrument', learning: 'Yamusika mesariya (የሙዚቃ መሳሪያ)' },
      { native: 'To sing', learning: 'Mezemer (መዘመር)' },
      { native: 'To listen', learning: 'Masmat (ማስማት)' }
    ],
    'School': [
      { native: 'Teacher', learning: 'Memhir (መምህር)' },
      { native: 'Student', learning: 'Temari (ተማሪ)' },
      { native: 'Book', learning: 'Metshaf (መጽሐፍ)' },
      { native: 'Class', learning: 'Kilil (ክፍል)' },
      { native: 'Exam', learning: 'Fetena (ፈተና)' }
    ],
    'Work': [
      { native: 'Office', learning: 'Biro (ቢሮ)' },
      { native: 'Boss', learning: 'Aleqa (አለቃ)' },
      { native: 'Colleague', learning: 'Yaser baleber (የሥራ ባልደረባ)' },
      { native: 'Salary', learning: 'Demoz (ደሞዝ)' },
      { native: 'Meeting', learning: 'Sbseb (ስብሰባ)' }
    ],
    'Health': [
      { native: 'Doctor', learning: 'Hakim (ሀኪም)' },
      { native: 'Medicine', learning: 'Medhanit (መድሃኒት)' },
      { native: 'Sick', learning: 'Tameñ (ታምሜአለሁ)' },
      { native: 'Healthy', learning: 'Tename (ጤነኛ)' },
      { native: 'Pain', learning: 'Himret (ህመም)' }
    ],
    'Emotions': [
      { native: 'Happy', learning: 'Desita (ደስታ)' },
      { native: 'Sad', learning: 'Hazin (ሐዘን)' },
      { native: 'Angry', learning: 'Neded (ንዴት)' },
      { native: 'Afraid', learning: 'Firit (ፍርሃት)' },
      { native: 'Surprised', learning: 'Midenget (መደንገጥ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Tiliq (ትልቅ)' },
      { native: 'Small', learning: 'Tinish (ትንሽ)' },
      { native: 'Beautiful', learning: 'Qonjo (ቆንጆ)' },
      { native: 'Ugly', learning: 'Yemaymori (የማያምር)' },
      { native: 'Fast', learning: 'Fetani (ፈጣን)' }
    ],
    // Section 1 missing items expansion
    'Greetings': [
      { native: 'Hello', learning: 'Selam (ሰላም)' },
      { native: 'Good morning', learning: 'Endemin aderk (እንደምን አደርክ)' },
      { native: 'Good evening', learning: 'Endemin amesheh (እንደምን አመሸህ)' },
      { native: 'How are you?', learning: 'Endet neh? (እንዴት ነህ?)' },
      { native: 'Goodbye', learning: 'Dehna hun (ደህና ሁን)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'And (አንድ)' },
      { native: 'Two', learning: 'Hulet (ሁለት)' },
      { native: 'Three', learning: 'Sost (ሶስት)' },
      { native: 'Four', learning: 'Arat (አራት)' },
      { native: 'Five', learning: 'Amist (አምስት)' }
    ],
    'Colors': [
      { native: 'Red', learning: 'Key (ቀይ)' },
      { native: 'Blue', learning: 'Semayawi (ሰማያዊ)' },
      { native: 'Green', learning: 'Arengwade (አረንጓዴ)' },
      { native: 'Yellow', learning: 'Bicha (ቢጫ)' },
      { native: 'Black', learning: 'Tikur (ጥቁር)' }
    ],
    'Basic Verbs': [
      { native: 'To eat', learning: 'Meblat (መብላት)' },
      { native: 'To drink', learning: 'Metetat (መጠጣት)' },
      { native: 'To sleep', learning: 'Metegnat (መተኛት)' },
      { native: 'To go', learning: 'Mehed (መሄድ)' },
      { native: 'To come', learning: 'Memtat (መምጣት)' }
    ]
  },
  'tigrinya': {
    'Greetings': [
      { native: 'Hello', learning: 'Selam (ሰላም)' },
      { native: 'Good morning', learning: 'Kemey haderka (ከመይ ሓዲርካ)' },
      { native: 'Good evening', learning: 'Kemey amsika (ከመይ ኣምሲኻ)' },
      { native: 'How are you?', learning: 'Kemey leka? (ከመይ ለኻ?)' },
      { native: 'Goodbye', learning: 'Dehan kun (ደሓን ኩን)' }
    ],
    'Introductions': [
      { native: 'My name is...', learning: 'Simey... eyu (ስመይ... እዩ)' },
      { native: 'Nice to meet you', learning: 'Siletewaweqna des biluni (ስለተዋወቅና ደስ ኢሉኒ)' },
      { native: 'Where are you from?', learning: 'Kabey metsika? (ካበይ መጺኻ?)' },
      { native: 'I am from...', learning: 'Ane kab... iye (ኣነ ካብ... እየ)' },
      { native: 'Who are you?', learning: 'Men ixa? (መን ኢኻ?)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'Hade (ሓደ)' },
      { native: 'Two', learning: 'Kelete (ክልተ)' },
      { native: 'Three', learning: 'Seleste (ሰለስተ)' },
      { native: 'Four', learning: 'Arbate (ኣርባዕተ)' },
      { native: 'Five', learning: 'Hamushte (ሓሙሽተ)' },
      { native: 'Six', learning: 'Shudushte (ሹዱሽተ)' },
      { native: 'Seven', learning: 'Showate (ሾውዓተ)' },
      { native: 'Eight', learning: 'Shemonte (ሸሞንተ)' },
      { native: 'Nine', learning: 'Tisheate (ትሽዓተ)' },
      { native: 'Ten', learning: 'Aserte (ዓሰርተ)' }
    ],
    'Colors': [
      { native: 'Red', learning: 'Keyih (ቀይሕ)' },
      { native: 'Blue', learning: 'Semayawi (ሰማያዊ)' },
      { native: 'Green', learning: 'Khetelya (ቀጠልያ)' },
      { native: 'Yellow', learning: 'Bicha (ቢጫ)' },
      { native: 'Black', learning: 'Tselim (ጸሊም)' },
      { native: 'White', learning: 'Tsaeda (ጻዕዳ)' }
    ],
    'Family': [
      { native: 'Mother', learning: 'Ade (ኣደ)' },
      { native: 'Father', learning: 'Abo (ኣቦ)' },
      { native: 'Brother', learning: 'Haw (ሓው)' },
      { native: 'Sister', learning: 'Hafti (ሓፍቲ)' },
      { native: 'Grandmother', learning: 'Abay (ኣባይ)' }
    ],
    'Days of Week': [
      { native: 'Monday', learning: 'Senuy (ሰኑይ)' },
      { native: 'Tuesday', learning: 'Selus (ሰሉስ)' },
      { native: 'Wednesday', learning: 'Rebu (ረቡዕ)' },
      { native: 'Thursday', learning: 'Hamus (ሓሙስ)' },
      { native: 'Friday', learning: 'Arbi (ዓርቢ)' },
      { native: 'Saturday', learning: 'Qidam (ቀዳም)' },
      { native: 'Sunday', learning: 'Senbet (ሰንበት)' }
    ],
    'Months': [
      { native: 'September', learning: 'Meskerem (መስከረም)' },
      { native: 'October', learning: 'Tiqimti (ጥቅምቲ)' },
      { native: 'November', learning: 'Hidar (ሕዳር)' },
      { native: 'December', learning: 'Tahsas (ታሕሳስ)' },
      { native: 'January', learning: 'Tiri (ጥሪ)' }
    ],
    'Basic Verbs': [
      { native: 'To eat', learning: 'Mebla (ምብላዕ)' },
      { native: 'To drink', learning: 'Meste (ምስተ)' },
      { native: 'To sleep', learning: 'Midkas (ምድቃስ)' },
      { native: 'To go', learning: 'Mikad (ምኻድ)' },
      { native: 'To come', learning: 'Mimtsa (ምምጻእ)' }
    ],
    'Common Objects': [
      { native: 'Table', learning: 'Tawla (ጣውላ)' },
      { native: 'Chair', learning: 'Korsi (ኮርሲ)' },
      { native: 'Door', learning: 'Maatso (ማዕጾ)' },
      { native: 'Window', learning: 'Meskoti (መስኮት)' },
      { native: 'Pen', learning: 'Iskiribto (እስክሪብቶ)' }
    ],
    'Food Basics': [
      { native: 'Bread', learning: 'Bani (ባኒ)' },
      { native: 'Water', learning: 'May (ማይ)' },
      { native: 'Milk', learning: 'Tseba (ጸባ)' },
      { native: 'Coffee', learning: 'Bun (ቡን)' },
      { native: 'Tea', learning: 'Shahi (ሻሂ)' }
    ],
    'Animals': [
      { native: 'Dog', learning: 'Kelbi (ከልቢ)' },
      { native: 'Cat', learning: 'Dmu (ድሙ)' },
      { native: 'Cow', learning: 'Lam (ላም)' },
      { native: 'Sheep', learning: 'Begie (በጊዕ)' },
      { native: 'Lion', learning: 'Anbessa (ኣንበሳ)' }
    ],
    'Body Parts': [
      { native: 'Head', learning: 'Reesi (ርእሲ)' },
      { native: 'Eye', learning: 'Ayni (ዓይኒ)' },
      { native: 'Nose', learning: 'Aficha (ኣፍንጫ)' },
      { native: 'Mouth', learning: 'Af (ኣፍ)' },
      { native: 'Hand', learning: 'Id (ኢድ)' }
    ],
    'Clothing': [
      { native: 'Shirt', learning: 'Shemiz (ሸሚዝ)' },
      { native: 'Pants', learning: 'Surri (ሱሪ)' },
      { native: 'Shoes', learning: 'Kob (ኮብ)' },
      { native: 'Hat', learning: 'Kofiya (ቆብ)' },
      { native: 'Dress', learning: 'Kemis (ቀሚስ)' }
    ],
    'Weather': [
      { native: 'Sun', learning: 'Tsehay (ጸሓይ)' },
      { native: 'Rain', learning: 'Zinab (ዝናብ)' },
      { native: 'Wind', learning: 'Nifas (ንፋስ)' },
      { native: 'Cloud', learning: 'Debena (ደበና)' },
      { native: 'Hot', learning: 'Muk (ሙቐት)' }
    ],
    'Time': [
      { native: 'Morning', learning: 'Nguho (ንጉሆ)' },
      { native: 'Afternoon', learning: 'Dihri seati (ድሕሪ ሰዓት)' },
      { native: 'Night', learning: 'Leyti (ለይቲ)' },
      { native: 'Today', learning: 'Lomi (ሎሚ)' },
      { native: 'Tomorrow', learning: 'Tsibah (ጽባሕ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Zeleqi (ዓቢ)' },
      { native: 'Small', learning: 'Nishto (ንእሽቶ)' },
      { native: 'Beautiful', learning: 'Tsebuq (ጽቡቕ)' },
      { native: 'Ugly', learning: 'Metsfo (ሕማቕ)' },
      { native: 'Fast', learning: 'Fetun (ፈጣን)' }
    ],
    // Section 2 - Explore
    'Numbers 11-100': [
      { native: 'Eleven', learning: 'Aserte hade (ዓሰርተ ሓደ)' },
      { native: 'Twenty', learning: 'Esra (ዕስራ)' },
      { native: 'Thirty', learning: 'Selasa (ሰላሳ)' },
      { native: 'Fifty', learning: 'Hamsa (ሓምሳ)' },
      { native: 'Hundred', learning: 'Meti (ሚእቲ)' }
    ],
    'Directions': [
      { native: 'Left', learning: 'Tsegam (ጸጋም)' },
      { native: 'Right', learning: 'Yemin (የሚን)' },
      { native: 'Straight', learning: 'Qetita (ቀጥታ)' },
      { native: 'North', learning: 'Semen (ሰሜን)' },
      { native: 'South', learning: 'Debub (ደቡብ)' }
    ],
    'Places in City': [
      { native: 'Market', learning: 'Shuk (ሹቕ)' },
      { native: 'Hospital', learning: 'Hospital (ሆስፒታል)' },
      { native: 'School', learning: 'Temhirti bet (ትምህርቲ ቤት)' },
      { native: 'Bank', learning: 'Bank (ባንክ)' },
      { native: 'Church', learning: 'Betekrstian (ቤተክርስትያን)' }
    ],
    'Transportation': [
      { native: 'Car', learning: 'Makina (ማኪና)' },
      { native: 'Bus', learning: 'Autobus (ኣውቶቡስ)' },
      { native: 'Airplane', learning: 'Nefriti (ነፈርቲ)' },
      { native: 'Bicycle', learning: 'Biskleta (ብስክለታ)' },
      { native: 'Train', learning: 'Babur (ባቡር)' }
    ],
    'Shopping': [
      { native: 'How much?', learning: 'Kndey iye? (ክንደይ ኢዩ?)' },
      { native: 'Expensive', learning: 'Kebid (ከቢድ)' },
      { native: 'Cheap', learning: 'Hasus (ሓሱስ)' },
      { native: 'To buy', learning: 'Migzai (ምግዛእ)' },
      { native: 'To sell', learning: 'Mishyat (ምሻጥ)' }
    ],
    'At Restaurant': [
      { native: 'Menu', learning: 'Menu (ሜኑ)' },
      { native: 'Waiter', learning: 'Astelalafi (ኣስተላላፊ)' },
      { native: 'Bill', learning: 'Hisab (ሒሳብ)' },
      { native: 'Delicious', learning: 'Teum (ጥዑም)' },
      { native: 'Hungry', learning: 'Tsemieni (ጸሚኡኒ)' }
    ],
    'At Home': [
      { native: 'Kitchen', learning: 'Kishine (ክሽነ)' },
      { native: 'Bedroom', learning: 'Medqesi (መድቀሲ)' },
      { native: 'Bathroom', learning: 'Metatebiya (መታጠቢያ)' },
      { native: 'Living room', learning: 'Salon (ሳሎን)' },
      { native: 'Garden', learning: 'Yatilikiti bota (የአትክልት ቦታ)' }
    ],
    'Hobbies': [
      { native: 'Reading', learning: 'Manbebi (ምንባብ)' },
      { native: 'Writing', learning: 'Metsafi (ምጽሓፍ)' },
      { native: 'Drawing', learning: 'Mesali (ምስኣል)' },
      { native: 'Cooking', learning: 'Mabsali (ምብስሳል)' },
      { native: 'Dancing', learning: 'Merekedi (ምርጋጽ)' }
    ],
    'Sports': [
      { native: 'Football', learning: 'Igir kwas (ኩዕሶ እግሪ)' },
      { native: 'Running', learning: 'Guye (ጉያ)' },
      { native: 'Swimming', learning: 'Wana (ዋና)' },
      { native: 'Basketball', learning: 'Basket kwas (ኩዕሶ መርበብ)' }
    ],
    'Music': [
      { native: 'Song', learning: 'Derib (ደርፊ)' },
      { native: 'Singer', learning: 'Deritaye (ደራፋይ)' },
      { native: 'Instrument', learning: 'Mesariya (መሳርሒ)' }
    ],
    'School': [
      { native: 'Teacher', learning: 'Memhir (መምህር)' },
      { native: 'Student', learning: 'Temaray (ተምሃራይ)' },
      { native: 'Book', learning: 'Metsaf (መጽሓፍ)' }
    ],
    'Work': [
      { native: 'Office', learning: 'Biro (ቢሮ)' },
      { native: 'Boss', learning: 'Aleqa (ሓላፊ)' },
      { native: 'Salary', learning: 'Demoz (ደሞዝ)' }
    ],
    'Health': [
      { native: 'Doctor', learning: 'Hakim (ሓኪም)' },
      { native: 'Medicine', learning: 'Medhanit (መድሓኒት)' },
      { native: 'Sick', learning: 'Hamim (ሕሙም)' }
    ],
    'Emotions': [
      { native: 'Happy', learning: 'Hagosed (ሕጉስ)' },
      { native: 'Sad', learning: 'Hazined (ሓዙን)' },
      { native: 'Angry', learning: 'Neded (ኩሩዕ)' },
      { native: 'Afraid', learning: 'Firit (ፍርሒ)' },
      { native: 'Surprised', learning: 'Midenget (ምድናግ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Zeleqi (ዓቢ)' },
      { native: 'Small', learning: 'Nishto (ንእሽቶ)' },
      { native: 'Beautiful', learning: 'Tsebuq (ጽቡቕ)' },
      { native: 'Ugly', learning: 'Metsfo (ሕማቕ)' },
      { native: 'Fast', learning: 'Fetun (ፈጣን)' }
    ],
    // Section 1 missing items expansion
    'Greetings': [
      { native: 'Hello', learning: 'Selam (ሰላም)' },
      { native: 'Good morning', learning: 'Kemey haderka (ከመይ ሓዲርካ)' },
      { native: 'Good evening', learning: 'Kemey amsika (ከመይ ኣምሲኻ)' },
      { native: 'How are you?', learning: 'Kemey leka? (ከመይ ለኻ?)' },
      { native: 'Goodbye', learning: 'Dehan kun (ደሓን ኩን)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'Hade (ሓደ)' },
      { native: 'Two', learning: 'Kelete (ክልተ)' },
      { native: 'Three', learning: 'Seleste (ሰለስተ)' },
      { native: 'Four', learning: 'Arbate (ኣርባዕተ)' },
      { native: 'Five', learning: 'Hamushte (ሓሙሽተ)' }
    ]
  },
  'oromo': {
    'Greetings': [
      { native: 'Hello', learning: 'Akkam (አካም)' },
      { native: 'Good morning', learning: 'Akkam bulte (አካም ቡልቴ)' },
      { native: 'Good evening', learning: 'Akkam oolte (አካም ኦልቴ)' },
      { native: 'How are you?', learning: 'Akkam jirta? (አካም ጂርታ?)' },
      { native: 'Goodbye', learning: 'Nagaatti (ናጋቲ)' }
    ],
    'Introductions': [
      { native: 'My name is...', learning: 'Maqaan koo... dha (መቃን ኮ... ዳ)' },
      { native: 'Nice to meet you', learning: 'Wal baruu kootti gammadeera (ዋል ባሩ ኮቲ ጋማዴራ)' },
      { native: 'Where are you from?', learning: 'Eessaa dhufte? (ኤሳ ዱፍቴ?)' },
      { native: 'I am from...', learning: 'Ani... dhufe (አኒ... ዱፌ)' },
      { native: 'Who are you?', learning: 'Eenyu ati? (ኤኙ አቲ?)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'Tokko (ቶኮ)' },
      { native: 'Two', learning: 'Lama (ላማ)' },
      { native: 'Three', learning: 'Sadii (ሳዲ)' },
      { native: 'Four', learning: 'Afur (አፉር)' },
      { native: 'Five', learning: 'Shan (ሻን)' },
      { native: 'Six', learning: 'Jaha (ጃሃ)' },
      { native: 'Seven', learning: 'Torba (ቶርባ)' },
      { native: 'Eight', learning: 'Saddeet (ሳዴቲ)' },
      { native: 'Nine', learning: 'Sagal (ሳጋል)' },
      { native: 'Ten', learning: 'Kudhan (ኩዳን)' }
    ],
    'Colors': [
      { native: 'Red', learning: 'Diimaa (ዲማ)' },
      { native: 'Blue', learning: 'Cuquliisa (ጩቁሊሳ)' },
      { native: 'Green', learning: 'Magariisa (ማጋሪሳ)' },
      { native: 'Yellow', learning: 'Keelloo (ኬሎ)' },
      { native: 'Black', learning: 'Gurraacha (ጉራቻ)' },
      { native: 'White', learning: 'Adii (አዲ)' }
    ],
    'Family': [
      { native: 'Mother', learning: 'Haadha (ሃዳ)' },
      { native: 'Father', learning: 'Abbaa (አባ)' },
      { native: 'Brother', learning: 'Obboleessa (ኦቦሌሳ)' },
      { native: 'Sister', learning: 'Obboleettii (ኦቦሌቲ)' },
      { native: 'Grandmother', learning: 'Akkoo (አኮ)' }
    ],
    'Days of Week': [
      { native: 'Monday', learning: 'Wiixata (ዊክሳታ)' },
      { native: 'Tuesday', learning: 'Kibxata (ኪብሳታ)' },
      { native: 'Wednesday', learning: 'Roobii (ሮቢ)' },
      { native: 'Thursday', learning: 'Kamisa (ካሚሳ)' },
      { native: 'Friday', learning: 'Jimaata (ጂማታ)' },
      { native: 'Saturday', learning: 'Sanbata (ሳንባታ)' },
      { native: 'Sunday', learning: 'Dilbata (ዲልባታ)' }
    ],
    'Months': [
      { native: 'September', learning: 'Fulbaana (ፉልባና)' },
      { native: 'October', learning: 'Onkololeessa (ኦንኮሎሌሳ)' },
      { native: 'November', learning: 'Sadaasa (ሳዳሳ)' },
      { native: 'December', learning: 'Muddee (ሙዴ)' },
      { native: 'January', learning: 'Amajjii (አማጂ)' }
    ],
    'Basic Verbs': [
      { native: 'To eat', learning: 'Nyaachuu (ኛቹ)' },
      { native: 'To drink', learning: 'Dhuguu (ዱጉ)' },
      { native: 'To sleep', learning: 'Rafuu (ራፉ)' },
      { native: 'To go', learning: 'Deemuu (ዴሙ)' },
      { native: 'To come', learning: 'Dhufuu (ዱፉ)' }
    ],
    'Common Objects': [
      { native: 'Table', learning: 'Minjaala (ሚንጃላ)' },
      { native: 'Chair', learning: 'Teessoo (ቴሶ)' },
      { native: 'Door', learning: 'Balbala (ባልባላ)' },
      { native: 'Window', learning: 'Foddaa (ፎዳ)' },
      { native: 'Pen', learning: 'Qalama (ቃላማ)' }
    ],
    'Food Basics': [
      { native: 'Bread', learning: 'Daabboo (ዳቦ)' },
      { native: 'Water', learning: 'Bishaan (ቢሻን)' },
      { native: 'Milk', learning: 'Aannan (አናን)' },
      { native: 'Coffee', learning: 'Buna (ቡና)' },
      { native: 'Tea', learning: 'Shaayii (ሻይ)' }
    ],
    'Animals': [
      { native: 'Dog', learning: 'Saree (ሳሬ)' },
      { native: 'Cat', learning: 'Adurree (አዱሬ)' },
      { native: 'Cow', learning: 'Sa\'a (ሳአ)' },
      { native: 'Sheep', learning: 'Hoolaa (ሆላ)' },
      { native: 'Lion', learning: 'Leenca (ሌንጫ)' }
    ],
    'Body Parts': [
      { native: 'Head', learning: 'Mata (ማታ)' },
      { native: 'Eye', learning: 'Ija (ኢጃ)' },
      { native: 'Nose', learning: 'Funyaan (ፉኛን)' },
      { native: 'Mouth', learning: 'Afaan (አፋን)' },
      { native: 'Hand', learning: 'Harka (ሃርካ)' }
    ],
    'Clothing': [
      { native: 'Shirt', learning: 'Shamiizii (ሻሚዚ)' },
      { native: 'Pants', learning: 'Surree (ሱሬ)' },
      { native: 'Shoes', learning: 'Kophee (ኮፔ)' },
      { native: 'Hat', learning: 'Kofiyyaa (ኮፊያ)' },
      { native: 'Dress', learning: 'Qamisii (ቃሚሲ)' }
    ],
    'Weather': [
      { native: 'Sun', learning: 'Aduu (አዱ)' },
      { native: 'Rain', learning: 'Bokkaa (ቦካ)' },
      { native: 'Wind', learning: 'Qilleensa (ቂሌንሳ)' },
      { native: 'Cloud', learning: 'Duumessa (ዱሜሳ)' },
      { native: 'Hot', learning: 'Ho\'aa (ሆአ)' }
    ],
    'Time': [
      { native: 'Morning', learning: 'Ganama (ጋናማ)' },
      { native: 'Afternoon', learning: 'Waaree booda (ዋሬ ቦዳ)' },
      { native: 'Night', learning: 'Halkan (ሃልካን)' },
      { native: 'Today', learning: 'Har\'a (ሃራ)' },
      { native: 'Tomorrow', learning: 'Boru (ቦሩ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Guddaa (ጉዳ)' },
      { native: 'Small', learning: 'Xiqqaa (ሺቃ)' },
      { native: 'Beautiful', learning: 'Bareeda (ባሬዳ)' },
      { native: 'Ugly', learning: 'Fokkisaa (ፎኪሳ)' },
      { native: 'Fast', learning: 'Ariifata (አሪፋታ)' }
    ],
    // Section 2 - Explore
    'Numbers 11-100': [
      { native: 'Eleven', learning: 'Kudha tokko (ኩዳ ቶኮ)' },
      { native: 'Twenty', learning: 'Digdama (ዲግዳማ)' },
      { native: 'Thirty', learning: 'Soddoma (ሶዶማ)' },
      { native: 'Fifty', learning: 'Shantama (ሻንታማ)' },
      { native: 'Hundred', learning: 'Dhibba (ዲባ)' }
    ],
    'Directions': [
      { native: 'Left', learning: 'Bitaa (ቢታ)' },
      { native: 'Right', learning: 'Mirga (ሚርጋ)' },
      { native: 'Straight', learning: 'Qajeela (ቃጄላ)' },
      { native: 'North', learning: 'Kaabaa (ካባ)' },
      { native: 'South', learning: 'Kibba (ኪባ)' }
    ],
    'Places in City': [
      { native: 'Market', learning: 'Gabaa (ጋባ)' },
      { native: 'Hospital', learning: 'Mana yaalaa (ማና ያላ)' },
      { native: 'School', learning: 'Mana barumsaa (ማና ባሩምሳ)' },
      { native: 'Bank', learning: 'Baankii (ባንኪ)' },
      { native: 'Church', learning: 'Bataskaana (ባታስካና)' }
    ],
    'Transportation': [
      { native: 'Car', learning: 'Makiinaa (መኪና)' },
      { native: 'Bus', learning: 'Awtoobisii (አውቶቢሲ)' },
      { native: 'Airplane', learning: 'Xiyyaara (ሺያራ)' }
    ],
    'Shopping': [
      { native: 'How much?', learning: 'Meeqa? (ሜቃ?)' },
      { native: 'Expensive', learning: 'Qaali (ቃሊ)' },
      { native: 'Cheap', learning: 'Rakasa (ራካሳ)' }
    ],
    'At Restaurant': [
      { native: 'Menu', learning: 'Meenuu (ሜኑ)' },
      { native: 'Waiter', learning: 'Keessummeessaa (ኬሱሜሳ)' },
      { native: 'Bill', learning: 'Hisaaba (ሂሳባ)' }
    ],
    'At Home': [
      { native: 'Kitchen', learning: 'Kushinaa (ኩሺና)' },
      { native: 'Bedroom', learning: 'Mana ciisichaa (ማና ጪሲቻ)' }
    ],
    'Hobbies': [
      { native: 'Reading', learning: 'Dubbisuu (ዱቢሱ)' },
      { native: 'Cooking', learning: 'Nyaata hojjachuu (ኛታ ሆጃቹ)' }
    ],
    'Sports': [
      { native: 'Football', learning: 'Kubbaa miilaa (ኩባ ሚላ)' },
      { native: 'Running', learning: 'Fiigicha (ፊጊቻ)' }
    ],
    'Music': [
      { native: 'Song', learning: 'Sirba (ሲርባ)' },
      { native: 'Singer', learning: 'Weellisaa (ዌሊሳ)' }
    ],
    'School': [
      { native: 'Teacher', learning: 'Barsiisaa (ባርሲሳ)' },
      { native: 'Student', learning: 'Barataa (ባራታ)' }
    ],
    'Work': [
      { native: 'Office', learning: 'Biroo (ቢሮ)' },
      { native: 'Boss', learning: 'Hoogganaa (ሆጋና)' }
    ],
    'Health': [
      { native: 'Doctor', learning: 'Ogeessa fayyaa (ኦጌሳ ፋያ)' },
      { native: 'Medicine', learning: 'Qallicha (ቃሊቻ)' }
    ],
    'Emotions': [
      { native: 'Happy', learning: 'Gammachuu (ጋማቹ)' },
      { native: 'Sad', learning: 'Gadda (ጋዳ)' },
      { native: 'Angry', learning: 'Aarii (አሪ)' },
      { native: 'Afraid', learning: 'Sodaachuu (ሶዳቹ)' },
      { native: 'Surprised', learning: 'Dinqisiifachuu (ዲንቂሲፋቹ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Guddaa (ጉዳ)' },
      { native: 'Small', learning: 'Xiqqaa (ሺቃ)' },
      { native: 'Beautiful', learning: 'Bareeda (ባሬዳ)' },
      { native: 'Ugly', learning: 'Fokkisaa (ፎኪሳ)' },
      { native: 'Fast', learning: 'Ariifata (አሪፋታ)' }
    ]
  },
  'somali': {
    'Greetings': [
      { native: 'Hello', learning: 'Iska warran (ኢስካ ዋራን)' },
      { native: 'Good morning', learning: 'Subax wanaagsan (ሱባህ ዋንአግሳን)' },
      { native: 'Good evening', learning: 'Galab wanaagsan (ጋላብ ዋንአግሳን)' },
      { native: 'How are you?', learning: 'Ma nabad baa? (ማ ናባድ ባ?)' },
      { native: 'Goodbye', learning: 'Nabad gelyo (ናባድ ጌልዮ)' }
    ],
    'Introductions': [
      { native: 'My name is...', learning: 'Magacaygu waa... (ማጋካይጉ ዋ...)' },
      { native: 'Nice to meet you', learning: 'Barasho wanaagsan (ባራሾ ዋንአግሳን)' },
      { native: 'Where are you from?', learning: 'Xagee baad ka timid? (ሃጌ ባድ ካ ቲሚድ?)' },
      { native: 'I am from...', learning: 'Waxaan ka imid... (ዋሃን ካ ኢሚድ...)' },
      { native: 'Who are you?', learning: 'Kumaad tahay? (ኩማድ ታሃይ?)' }
    ],
    'Numbers 1-10': [
      { native: 'One', learning: 'Kow (ኮው)' },
      { native: 'Two', learning: 'Laba (ላባ)' },
      { native: 'Three', learning: 'Saddex (ሳዴህ)' },
      { native: 'Four', learning: 'Afar (አፋር)' },
      { native: 'Five', learning: 'Shan (ሻን)' },
      { native: 'Six', learning: 'Lix (ሊህ)' },
      { native: 'Seven', learning: 'Todoba (ቶዶባ)' },
      { native: 'Eight', learning: 'Sideed (ሲዴድ)' },
      { native: 'Nine', learning: 'Sagaal (ሳጋል)' },
      { native: 'Ten', learning: 'Toban (ቶባን)' }
    ],
    'Colors': [
      { native: 'Red', learning: 'Casaan (ካሳን)' },
      { native: 'Blue', learning: 'Buluug (ቡሉግ)' },
      { native: 'Green', learning: 'Cagaar (ካጋር)' },
      { native: 'Yellow', learning: 'Huruud (ሁሩድ)' },
      { native: 'Black', learning: 'Madow (ማዶው)' },
      { native: 'White', learning: 'Cadaan (ካዳን)' }
    ],
    'Family': [
      { native: 'Mother', learning: 'Hooyo (ሆዮ)' },
      { native: 'Father', learning: 'Aabo (አቦ)' },
      { native: 'Brother', learning: 'Walaal (ዋላል)' },
      { native: 'Sister', learning: 'Walaash (ዋላሽ)' },
      { native: 'Grandmother', learning: 'Ayeeyo (አዬዮ)' }
    ],
    'Days of Week': [
      { native: 'Monday', learning: 'Isniin (ኢስኒን)' },
      { native: 'Tuesday', learning: 'Talaado (ታላዶ)' },
      { native: 'Wednesday', learning: 'Arbaco (አርባኮ)' },
      { native: 'Thursday', learning: 'Khamiis (ካሚስ)' },
      { native: 'Friday', learning: 'Jimco (ጂምኮ)' },
      { native: 'Saturday', learning: 'Sabti (ሳብቲ)' },
      { native: 'Sunday', learning: 'Axad (አሃድ)' }
    ],
    'Months': [
      { native: 'September', learning: 'Sebtembar (ሴፕቴምባር)' },
      { native: 'October', learning: 'Oktoobar (ኦክቶባር)' },
      { native: 'November', learning: 'Nofembar (ኖቬምባር)' },
      { native: 'December', learning: 'Disembar (ዲሴምባር)' },
      { native: 'January', learning: 'Janaayo (ጃናዮ)' }
    ],
    'Basic Verbs': [
      { native: 'To eat', learning: 'Cunid (ኩኒድ)' },
      { native: 'To drink', learning: 'Cabid (ካቢድ)' },
      { native: 'To sleep', learning: 'Seexasho (ሴሃሾ)' },
      { native: 'To go', learning: 'Tagid (ታጊድ)' },
      { native: 'To come', learning: 'Imaansho (ኢማንሾ)' }
    ],
    'Common Objects': [
      { native: 'Table', learning: 'Miis (ሚስ)' },
      { native: 'Chair', learning: 'Kursi (ኩርሲ)' },
      { native: 'Door', learning: 'Albaab (አልባብ)' },
      { native: 'Window', learning: 'Daaqad (ዳቃድ)' },
      { native: 'Pen', learning: 'Qalin (ቃሊን)' }
    ],
    'Food Basics': [
      { native: 'Bread', learning: 'Rooti (ሮቲ)' },
      { native: 'Water', learning: 'Biyo (ቢዮ)' },
      { native: 'Milk', learning: 'Caano (ካኖ)' },
      { native: 'Coffee', learning: 'Qaxwe (ቃህዌ)' },
      { native: 'Tea', learning: 'Shaah (ሻህ)' }
    ],
    'Animals': [
      { native: 'Dog', learning: 'Eey (ኤይ)' },
      { native: 'Cat', learning: 'Bisad (ቢሳድ)' },
      { native: 'Cow', learning: 'Lo\' (ሎ)' },
      { native: 'Sheep', learning: 'Ido (ኢዶ)' },
      { native: 'Lion', learning: 'Libaax (ሊባህ)' }
    ],
    'Body Parts': [
      { native: 'Head', learning: 'Madax (ማዳህ)' },
      { native: 'Eye', learning: 'Il (ኢል)' },
      { native: 'Nose', learning: 'San (ሳን)' },
      { native: 'Mouth', learning: 'Af (አፍ)' },
      { native: 'Hand', learning: 'Gacan (ጋካን)' }
    ],
    'Clothing': [
      { native: 'Shirt', learning: 'Shaati (ሻቲ)' },
      { native: 'Pants', learning: 'Surwaal (ሱርዋል)' },
      { native: 'Shoes', learning: 'Kab (ካብ)' },
      { native: 'Hat', learning: 'Koofiyad (ኮፊያድ)' },
      { native: 'Dress', learning: 'Guntiino (ጉንቲኖ)' }
    ],
    'Weather': [
      { native: 'Sun', learning: 'Qorrax (ቆራህ)' },
      { native: 'Rain', learning: 'Roob (ሮብ)' },
      { native: 'Wind', learning: 'Dabayl (ዳባይል)' },
      { native: 'Cloud', learning: 'Daruur (ዳሩር)' },
      { native: 'Hot', learning: 'Kulul (ኩሉል)' }
    ],
    'Time': [
      { native: 'Morning', learning: 'Subax (ሱባህ)' },
      { native: 'Afternoon', learning: 'Galab (ጋላብ)' },
      { native: 'Night', learning: 'Habeen (ሃቤን)' },
      { native: 'Today', learning: 'Maanta (ማንታ)' },
      { native: 'Tomorrow', learning: 'Berri (ቤሪ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Weyn (ወይን)' },
      { native: 'Small', learning: 'Yar (ያር)' },
      { native: 'Beautiful', learning: 'Qurux (ቁሩህ)' },
      { native: 'Ugly', learning: 'Fool xun (ፎል ሁን)' },
      { native: 'Fast', learning: 'Degdeg (ደግደግ)' }
    ],
    // Section 2 - Explore
    'Numbers 11-100': [
      { native: 'Eleven', learning: 'Kow iyo toban (ኮው ኢዮ ቶባን)' },
      { native: 'Twenty', learning: 'Labaatan (ላባታን)' },
      { native: 'Thirty', learning: 'Soddon (ሶዶን)' },
      { native: 'Fifty', learning: 'Konton (ኮንቶን)' },
      { native: 'Hundred', learning: 'Boqol (ቦቆል)' }
    ],
    'Directions': [
      { native: 'Left', learning: 'Bidix (ቢዲህ)' },
      { native: 'Right', learning: 'Midig (ሚዲግ)' },
      { native: 'Straight', learning: 'Toos (ቶስ)' },
      { native: 'North', learning: 'Waqooyi (ዋቆዪ)' },
      { native: 'South', learning: 'Koonfur (ኮንፉር)' }
    ],
    'Places in City': [
      { native: 'Market', learning: 'Suuq (ሱቅ)' },
      { native: 'Hospital', learning: 'Isbitaal (ኢስቢታል)' },
      { native: 'School', learning: 'Dugsi (ዱግሲ)' },
      { native: 'Bank', learning: 'Banki (ባንኪ)' }
    ],
    'Transportation': [
      { native: 'Car', learning: 'Gaadhi (ጋዲ)' },
      { native: 'Bus', learning: 'Bas (ባስ)' },
      { native: 'Airplane', learning: 'Diyaarad (ዲያራድ)' }
    ],
    'Shopping': [
      { native: 'How much?', learning: 'Immisa? (ኢሚሳ?)' },
      { native: 'Expensive', learning: 'Qaali (ቃሊ)' },
      { native: 'Cheap', learning: 'Raqiis (ራቂያስ)' }
    ],
    'At Restaurant': [
      { native: 'Menu', learning: 'Menu (ሜኑ)' },
      { native: 'Waiter', learning: 'Adade (አዳደ)' },
      { native: 'Bill', learning: 'Xisaab (ሂሳብ)' }
    ],
    'At Home': [
      { native: 'Kitchen', learning: 'Jiko (ጂኮ)' },
      { native: 'Bedroom', learning: 'Hurdo (ሁርዶ)' }
    ],
    'Hobbies': [
      { native: 'Reading', learning: 'Akhriska (አህሪስካ)' },
      { native: 'Writing', learning: 'Qoraalka (ቆራልካ)' }
    ],
    'Sports': [
      { native: 'Football', learning: 'Kubadda cagta (ኩባዳ ካግታ)' },
      { native: 'Running', learning: 'Orodka (ኦሮድካ)' }
    ],
    'Music': [
      { native: 'Song', learning: 'Hees (ሄስ)' },
      { native: 'Singer', learning: 'Fannaan (ፋናን)' }
    ],
    'School': [
      { native: 'Teacher', learning: 'Macallin (ማካሊን)' },
      { native: 'Student', learning: 'Arday (አርዳይ)' }
    ],
    'Work': [
      { native: 'Office', learning: 'Xafiis (ሃፊስ)' },
      { native: 'Boss', learning: 'Maamule (ማሙሌ)' }
    ],
    'Health': [
      { native: 'Doctor', learning: 'Dhakhtar (ዳህታር)' },
      { native: 'Medicine', learning: 'Daawo (ዳዎ)' }
    ],
    'Emotions': [
      { native: 'Happy', learning: 'Farxad (ፋርሃድ)' },
      { native: 'Sad', learning: 'Naxdin (ናህዲን)' },
      { native: 'Angry', learning: 'Cadho (ካዶ)' },
      { native: 'Afraid', learning: 'Cabsi (ካብሲ)' },
      { native: 'Surprised', learning: 'Yaab (ያብ)' }
    ],
    'Adjectives': [
      { native: 'Big', learning: 'Weyn (ወይን)' },
      { native: 'Small', learning: 'Yar (ያር)' },
      { native: 'Beautiful', learning: 'Qurux (ቁሩህ)' },
      { native: 'Ugly', learning: 'Fool xun (ፎል ሁን)' },
      { native: 'Fast', learning: 'Degdeg (ደግደግ)' }
    ]
  }
}

// Section themes
export const sectionThemes = [
  { name: 'Foundations', description: 'Build your foundation' },
  { name: 'Explore', description: 'Explore new concepts' },
  { name: 'Expand', description: 'Expand your knowledge' },
  { name: 'Communicate', description: 'Start communicating' },
  { name: 'Express', description: 'Express yourself' },
  { name: 'Interact', description: 'Interact with others' },
  { name: 'Master', description: 'Master the language' },
  { name: 'Advance', description: 'Advanced topics' },
  { name: 'Specialize', description: 'Specialized vocabulary' },
  { name: 'Perfect', description: 'Perfect your skills' },
]

// Unit topics for each section
export const unitTopics = [
  // Section 1 - Foundations
  ['Greetings', 'Introductions', 'Numbers 1-10', 'Colors', 'Family', 'Days of Week', 'Months', 'Basic Verbs', 'Common Objects', 'Food Basics', 'Animals', 'Body Parts', 'Clothing', 'Weather', 'Time'],
  // Section 2 - Explore
  ['Numbers 11-100', 'Directions', 'Places in City', 'Transportation', 'Shopping', 'At Restaurant', 'At Home', 'Hobbies', 'Sports', 'Music', 'School', 'Work', 'Health', 'Emotions', 'Adjectives'],
  // Section 3 - Expand
  ['Past Tense', 'Future Tense', 'Questions', 'Negation', 'Comparisons', 'Possessives', 'Prepositions', 'Conjunctions', 'Pronouns', 'Adverbs', 'Travel', 'Hotel', 'Airport', 'Nature', 'Seasons'],
  // Section 4 - Communicate
  ['Phone Calls', 'Emails', 'Letters', 'Conversations', 'Opinions', 'Agreements', 'Disagreements', 'Requests', 'Offers', 'Invitations', 'Apologies', 'Thanks', 'Compliments', 'Complaints', 'Suggestions'],
  // Section 5 - Express
  ['Feelings', 'Desires', 'Preferences', 'Plans', 'Dreams', 'Memories', 'Stories', 'Descriptions', 'Explanations', 'Arguments', 'Debates', 'Presentations', 'Reports', 'Reviews', 'Recommendations'],
  // Section 6 - Interact
  ['Small Talk', 'Networking', 'Meetings', 'Interviews', 'Negotiations', 'Discussions', 'Collaboration', 'Teamwork', 'Leadership', 'Feedback', 'Criticism', 'Praise', 'Motivation', 'Conflict Resolution', 'Problem Solving'],
  // Section 7 - Master
  ['Idioms', 'Proverbs', 'Slang', 'Formal Language', 'Informal Language', 'Written Style', 'Spoken Style', 'Poetry', 'Literature', 'News', 'Politics', 'Economics', 'Science', 'Technology', 'Culture'],
  // Section 8 - Advance
  ['Advanced Grammar', 'Complex Sentences', 'Passive Voice', 'Conditional', 'Subjunctive', 'Reported Speech', 'Relative Clauses', 'Participles', 'Gerunds', 'Infinitives', 'Modal Verbs', 'Phrasal Verbs', 'Collocations', 'Fixed Expressions', 'Discourse Markers'],
  // Section 9 - Specialize
  ['Business', 'Legal', 'Medical', 'Engineering', 'IT', 'Finance', 'Marketing', 'Sales', 'HR', 'Education', 'Research', 'Media', 'Arts', 'Sports', 'Tourism'],
  // Section 10 - Perfect
  ['Pronunciation', 'Intonation', 'Rhythm', 'Stress', 'Accent', 'Fluency', 'Accuracy', 'Vocabulary Range', 'Grammar Mastery', 'Reading Speed', 'Listening Comprehension', 'Writing Skills', 'Speaking Confidence', 'Cultural Nuances', 'Native-like Expression'],
]

const generateSectionsAndUnits = (languagePair) => {
  const [nativeLang, learningLang] = languagePair.split('-')
  const sections = []


  for (let sectionIndex = 0; sectionIndex < 10; sectionIndex++) {
    const section = {
      id: sectionIndex + 1,
      name: sectionThemes[sectionIndex].name,
      description: sectionThemes[sectionIndex].description,
      units: []
    }

    for (let unitIndex = 0; unitIndex < 15; unitIndex++) {
      const globalUnitNumber = sectionIndex * 15 + unitIndex + 1
      const topic = unitTopics[sectionIndex][unitIndex]
      const unit = {
        id: globalUnitNumber,
        sectionId: section.id,
        title: topic,
        description: `Learn about ${topic.toLowerCase()}`,
        lessons: []
      }

      // Each unit has 5 lessons
      for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
        const lesson = {
          id: `${globalUnitNumber}-${lessonIndex + 1}`,
          unitId: globalUnitNumber,
          title: `${topic} - Lesson ${lessonIndex + 1}`,
          exercises: generateExercises(topic, lessonIndex + 1, learningLang, nativeLang)
        }
        unit.lessons.push(lesson)
      }

      section.units.push(unit)
    }

    sections.push(section)
  }

  return sections
}

// Generate sample exercises for a lesson
const generateExercises = (topic, lessonNumber, learningLang, nativeLang) => {
  const exercises = []
  const content = realContent[learningLang]?.[topic] || []
  const item = content[lessonNumber - 1] || { native: `${topic} phrase ${lessonNumber}`, learning: `Sample ${learningLang} translation` }

  // Helper to get random distractors
  const getDistractors = (correctAnswer, type = 'learning', count = 3) => {
    const distractors = []
    const available = content.filter(c => c[type] !== correctAnswer)

    // If not enough items in current topic, add some generic ones or from other topics if possible
    // For now, we'll duplicate or use placeholders if absolutely necessary, but we have enough data in Section 1
    while (distractors.length < count) {
      if (available.length > 0) {
        const randomIndex = Math.floor(Math.random() * available.length)
        distractors.push(available[randomIndex][type])
        available.splice(randomIndex, 1)
      } else {
        distractors.push(type === 'learning' ? `Option ${distractors.length + 1}` : `Option ${distractors.length + 1}`)
      }
    }
    return distractors
  }

  // 1. Translation (Native to Learning)
  const t1Distractors = getDistractors(item.learning, 'learning')
  exercises.push({
    type: 'translation',
    question: `How do you say "${item.native}" in ${learningLang}?`,
    answer: item.learning,
    options: [item.learning, ...t1Distractors].sort(() => Math.random() - 0.5),
    audio: null,
  })

  // 2. Multiple Choice (Vocabulary)
  const mcDistractors = getDistractors(item.learning, 'learning')
  exercises.push({
    type: 'multipleChoice',
    question: `Which of these means "${item.native}"?`,
    answer: item.learning,
    options: [item.learning, ...mcDistractors].sort(() => Math.random() - 0.5),
  })

  // 3. Fill in the Blank
  const fbDistractors = getDistractors(item.learning, 'learning')
  exercises.push({
    type: 'fillBlank',
    sentence: `${item.native} is ___ in ${learningLang}.`,
    answer: item.learning,
    options: [item.learning, ...fbDistractors].sort(() => Math.random() - 0.5),
  })

  // 4. Matching
  const pairs = content.slice(0, 4).map(c => ({ left: c.native, right: c.learning }))
  // If not enough pairs, fill with placeholders (shouldn't happen for Section 1)
  if (pairs.length < 4) {
    for (let i = pairs.length; i < 4; i++) {
      pairs.push({ left: `Word ${i + 1}`, right: `Translation ${i + 1}` })
    }
  }
  exercises.push({
    type: 'matching',
    pairs: pairs,
  })

  // 5. Translation (Learning to Native)
  const t2Distractors = getDistractors(item.native, 'native')
  exercises.push({
    type: 'translation',
    question: `Translate "${item.learning}" to ${nativeLang}.`,
    answer: item.native,
    options: [item.native, ...t2Distractors].sort(() => Math.random() - 0.5),
  })

  return exercises
}

// Helper: Generate Practice Lesson (Targeted, Listening, etc.)
const generatePracticeLesson = (nativeLanguage, learningLanguage, type) => {
  const allUnits = getAllUnits(nativeLanguage, learningLanguage)
  let allContent = []

  // Flatten content
  allUnits.forEach(unit => {
    unit.lessons.forEach(lesson => {
      // Extract vocab from exercises if possible, or just re-use exercises
      // For simplicity, we'll pool all exercises
      allContent.push(...lesson.exercises)
    })
  })

  // Filter based on type if needed
  let pool = allContent
  if (type === 'listening') {
    // In future, filter for audio exercises only. For now, use all.
  }

  // Shuffle and pick 10
  const practiceExercises = pool
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((ex, i) => ({
      ...ex,
      id: `practice-${type}-${i}` // Ensure unique IDs
    }))

  return {
    id: type,
    title: type === 'mistakes' ? 'Mistakes Review' : 'Targeted Practice',
    exercises: practiceExercises
  }
}

// Export lesson data for all language pairs
export const sectionsData = {
  'english-amharic': generateSectionsAndUnits('english-amharic'),
  'english-tigrinya': generateSectionsAndUnits('english-tigrinya'),
  'english-oromo': generateSectionsAndUnits('english-oromo'),
  'english-somali': generateSectionsAndUnits('english-somali'),
  'english-geez': generateSectionsAndUnits('english-geez'),
  'amharic-english': generateSectionsAndUnits('amharic-english'),
  'tigrinya-english': generateSectionsAndUnits('tigrinya-english'),
  'oromo-english': generateSectionsAndUnits('oromo-english'),
  'somali-english': generateSectionsAndUnits('somali-english'),
}

// Helper function to get sections for a language pair
export const getSections = (nativeLanguage, learningLanguage) => {
  const key = `${nativeLanguage}-${learningLanguage}`
  return sectionsData[key] || null
}

// Helper function to get a specific section
export const getSection = (nativeLanguage, learningLanguage, sectionId) => {
  const sections = getSections(nativeLanguage, learningLanguage)
  if (!sections) return null
  return sections.find(s => s.id === parseInt(sectionId))
}

// Helper function to get a specific unit
export const getUnit = (nativeLanguage, learningLanguage, unitId) => {
  const sections = getSections(nativeLanguage, learningLanguage)
  if (!sections) return null

  for (const section of sections) {
    const unit = section.units.find(u => u.id === parseInt(unitId))
    if (unit) return unit
  }
  return null
}

// Helper function to get a specific lesson
export const getLesson = (nativeLanguage, learningLanguage, unitId, lessonId) => {
  if (unitId === 'practice') {
    return generatePracticeLesson(nativeLanguage, learningLanguage, lessonId)
  }

  const unit = getUnit(nativeLanguage, learningLanguage, unitId)
  if (!unit) return null
  return unit.lessons.find(l => l.id === lessonId)
}

// Get all units flattened (for backward compatibility)
export const getAllUnits = (nativeLanguage, learningLanguage) => {
  const sections = getSections(nativeLanguage, learningLanguage)
  if (!sections) return []

  const allUnits = []
  sections.forEach(section => {
    allUnits.push(...section.units)
  })
  return allUnits
}
