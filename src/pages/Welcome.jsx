import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sun, Moon, ChevronDown, BookOpen, Trophy, Zap, Users, Globe, Sparkles, ArrowRight, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useThemeStore from '../store/useThemeStore'
import useLanguageStore, { availableLanguages } from '../store/useLanguageStore'

// Language cards for display
const languageCards = [
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', speakers: '57M+', script: 'ሰላም' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', speakers: '9M+', script: 'ሰላም' },
  { code: 'om', name: 'Afaan Oromo', nativeName: 'Oromoo', flag: '🇪🇹', speakers: '37M+', script: 'Nagaa' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', speakers: '22M+', script: 'Salaan' },
]

function Welcome() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage, t } = useLanguageStore()
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Redirect if already logged in
  if (!loading && user) {
    navigate('/learn')
  }

  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0]

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'
    }`}>
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-200/30'
        }`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-200/20'
        }`} />
        <div className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-200/30'
        }`} />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <span className={`text-xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-slate-800'
        }`}>
          Adewe
        </span>

        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
              }`}
            >
              <span>{currentLang.flag}</span>
              <span className="text-sm font-medium hidden sm:inline">{currentLang.name}</span>
              <ChevronDown size={16} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className={`absolute right-0 mt-2 py-2 w-48 rounded-xl shadow-xl z-20 ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'
                }`}>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        language === lang.code
                          ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          : theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' 
                : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login Button */}
          <button
            onClick={() => navigate('/login')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-emerald-400 hover:bg-slate-800'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {t('login')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <Sparkles size={14} />
                <span>Learn Ethiopian Languages</span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {t('tagline')}
              </h1>
              
              {/* Subtitle */}
              <p className={`text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => navigate('/signup')}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                >
                  {t('getStarted')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className={`flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'border-slate-700 text-white hover:bg-slate-800'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t('haveAccount')}
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>120M+</strong> speakers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>5</strong> languages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-emerald-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    100% <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Free</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Language Cards */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {languageCards.map((lang, i) => (
                  <div
                    key={lang.code}
                    className={`p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50' 
                        : 'bg-white hover:shadow-lg shadow-sm border border-slate-100'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <div>
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{lang.name}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{lang.nativeName}</p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {lang.script}
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                      {lang.speakers} native speakers
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={`relative z-10 px-6 py-16 ${
        theme === 'dark' ? 'bg-slate-900/30' : 'bg-white/50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Why Learn with Adewe?
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Our platform makes learning Ethiopian languages fun, effective, and accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className={`p-6 rounded-2xl text-center ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
              }`}>
                <BookOpen size={28} className="text-emerald-500" />
              </div>
              <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('heroFeature1')}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Quick 5-minute lessons that fit into your busy schedule
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-2xl text-center ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
              }`}>
                <Trophy size={28} className="text-amber-500" />
              </div>
              <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('heroFeature2')}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Earn XP, maintain streaks, and watch your skills grow
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-2xl text-center ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
              }`}>
                <Zap size={28} className="text-purple-500" />
              </div>
              <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('heroFeature3')}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Learn anytime, anywhere at your own comfortable pace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Ethiopia Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {t('aboutTitle')}
              </h2>
              <p className={`mb-6 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('aboutText')}
              </p>
              <p className={`mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('missionText')}
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-2 text-emerald-500 font-semibold hover:text-emerald-600 transition-colors"
              >
                Start Learning Today
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right - Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
                <div className={`text-4xl font-bold mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>80+</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Languages spoken in Ethiopia</p>
              </div>
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
                <div className={`text-4xl font-bold mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>120M+</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Native speakers worldwide</p>
              </div>
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
                <div className={`text-4xl font-bold mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>3000+</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Years of written history</p>
              </div>
              <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
                <div className={`text-4xl font-bold mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>100%</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Free forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative z-10 px-6 py-16 ${
        theme === 'dark' ? 'bg-gradient-to-r from-emerald-900/30 to-slate-900/30' : 'bg-gradient-to-r from-emerald-50 to-slate-50'
      }`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Ready to start your journey?
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Join thousands of learners discovering the beauty of Ethiopian languages.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
          >
            Get Started  It's Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className={`mt-4 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('freeForever')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 px-6 py-8 border-t ${
        theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white/50'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ፖ</span>
            </div>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Adewe</span>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            © 2024 Adewe. Made with ❤️ for Ethiopian languages.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
