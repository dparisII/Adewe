# Adewe 🇪🇹

A Duolingo-style language learning app for Ethiopian and East African languages.

## Supported Languages

- **English** 🇬🇧
- **Amharic** (አማርኛ) 🇪🇹
<!-- - **Tigrinya** (ትግርኛ) 🇪🇷 -->
- **Tigrinya** (ትግርኛ) 🇪🇹
- **Afaan Oromo** (Afaan Oromoo) 🇪🇹
- **Somali** (Soomaali) 🇸🇴

## Features

- 🔐 User authentication with Supabase
- 🎯 Interactive lessons with multiple exercise types
- 📊 Progress tracking with XP and streaks
- ❤️ Heart system for gamification
- 💎 Gem economy with shop
- 🏆 Achievements system
- 📱 Responsive design (mobile & desktop)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free at https://supabase.com)

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)

2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`

3. Go to **Settings > API** and copy:
   - Project URL
   - anon/public key

4. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Go to **Authentication > URL Configuration** and add:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173`

### Installation

1. Open a terminal in this directory

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Tech Stack

- **React** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx
│   └── exercises/
│       ├── TranslationExercise.jsx
│       ├── MatchingExercise.jsx
│       ├── MultipleChoiceExercise.jsx
│       └── FillBlankExercise.jsx
├── data/
│   ├── languages.js
│   └── lessons.js
├── pages/
│   ├── Welcome.jsx
│   ├── LanguageSelect.jsx
│   ├── Home.jsx
│   ├── Lesson.jsx
│   ├── Profile.jsx
│   └── Shop.jsx
├── store/
│   └── useStore.js
├── App.jsx
├── main.jsx
└── index.css
```

## Exercise Types

1. **Translation** - Translate words between languages
2. **Matching** - Match pairs of words
3. **Multiple Choice** - Select the correct answer
4. **Fill in the Blank** - Complete sentences

## Contributing

Feel free to add more lessons and vocabulary to the `src/data/lessons.js` file!

## License

MIT
