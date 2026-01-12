import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sun, Moon, ChevronDown, BookOpen, Trophy, Zap, Users, Globe, Sparkles, ArrowRight, Play, Check, Heart, Headphones, Download, Star, Shield, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import useThemeStore from '../store/useThemeStore'
import useLanguageStore, { availableLanguages } from '../store/useLanguageStore'

// Pricing plans
const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '5 hearts per day',
      'Basic lessons',
      '2 languages',
      'Progress tracking',
      'Community support'
    ],
    cta: 'Start Free',
    popular: false,
    icon: Heart
  },
  {
    name: 'Premium',
    price: 299,
    period: 'month',
    currency: 'ETB',
    description: 'Unlock your full potential',
    features: [
      'Unlimited hearts',
      'All lessons & levels',
      'All 5 languages',
      'Offline mode',
      'No ads',
      'Priority support',
      'Audio pronunciation'
    ],
    cta: 'Go Premium',
    popular: true,
    icon: Crown
  },
  {
    name: 'Family',
    price: 499,
    period: 'month',
    currency: 'ETB',
    description: 'Learn together as a family',
    features: [
      'Everything in Premium',
      'Up to 6 family members',
      'Family progress dashboard',
      'Shared achievements',
      'Parental controls'
    ],
    cta: 'Get Family Plan',
    popular: false,
    icon: Users
  }
]

// Language cards for display
const languageCards = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speakers: '1.5B+', script: 'Hello' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', speakers: '57M+', script: 'ሰላም' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', speakers: '9M+', script: 'ሰላም' },
  { code: 'om', name: 'Afaan Oromo', nativeName: 'Oromoo', flag: '🇪🇹', speakers: '37M+', script: 'Nagaa' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', speakers: '22M+', script: 'Salaan' },
  { code: 'gez', name: "Ge'ez", nativeName: 'ግዕዝ', flag: '🇪🇹', speakers: 'Liturgical', script: 'ሰላም' },
]

function Welcome() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { branding } = useBranding()
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
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'
      }`}>
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-200/30'
          }`} />
        <div className={`absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-200/20'
          }`} />
        <div className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-200/30'
          }`} />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-6">
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>
            {branding.site_name || 'Adewe'}
          </span>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <a href="#features" className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Features
            </a>
            <a href="#about" className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              About
            </a>
            <a href="#pricing" className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Pricing
            </a>
            <a href="#testimonials" className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Testimonials
            </a>
            <a href="#events" className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Events
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${theme === 'dark'
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
                <div className={`absolute right-0 mt-2 py-2 w-48 rounded-xl shadow-xl z-20 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'
                  }`}>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${language === lang.code
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
            className={`p-2.5 rounded-xl transition-all ${theme === 'dark'
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
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${theme === 'dark'
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
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600'
                }`}>
                <Sparkles size={14} />
                <span>Learn Ethiopian Languages</span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                {t('tagline')}
              </h1>

              {/* Subtitle */}
              <p className={`text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
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
                  className={`flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${theme === 'dark'
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
                    className={`p-5 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer ${theme === 'dark'
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
      <section id="features" className={`relative z-10 px-6 py-16 ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-white/50'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
              Why Learn with Adewe?
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Our platform makes learning Ethiopian languages fun, effective, and accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className={`p-6 rounded-2xl text-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
              }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
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
            <div className={`p-6 rounded-2xl text-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
              }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
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
            <div className={`p-6 rounded-2xl text-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'
              }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
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
      <section id="about" className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
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

      {/* Pricing Section */}
      <section id="pricing" className={`relative z-10 px-6 py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}>
              Pricing Plans
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
              Choose Your Learning Journey
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Start free and upgrade anytime. All plans include access to our core learning features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl transition-all hover:scale-[1.02] ${plan.popular
                  ? theme === 'dark'
                    ? 'bg-gradient-to-b from-emerald-900/50 to-slate-800 border-2 border-emerald-500'
                    : 'bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-500 shadow-xl'
                  : theme === 'dark'
                    ? 'bg-slate-800/50 border border-slate-700'
                    : 'bg-white border border-slate-200 shadow-sm'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${plan.popular
                    ? 'bg-emerald-500 text-white'
                    : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                    <plan.icon size={24} />
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price === 0 ? (
                      <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Free
                      </span>
                    ) : (
                      <>
                        <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {plan.currency}/{plan.period}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.price === 0 ? navigate('/signup') : navigate('/subscribe')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className={`text-center mt-8 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            💳 Pay with bank transfer (CBE, Awash, Telebirr) • Cancel anytime
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
              How It Works
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Start learning in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up for free in seconds', icon: Users },
              { step: 2, title: 'Choose Language', desc: 'Pick from 5 Ethiopian languages', icon: Globe },
              { step: 3, title: 'Start Learning', desc: 'Complete fun, bite-sized lessons', icon: BookOpen }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
                  }`}>
                  <item.icon size={28} className="text-emerald-500" />
                  <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-md'
                    }`}>
                    {item.step}
                  </span>
                </div>
                <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`relative z-10 px-6 py-20 ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-white/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Community Love
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Join thousands of happy learners mastering Ethiopian languages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Abebe K.', role: 'Student', text: 'Adewe helped me reconnect with my heritage. The Amharic lessons are fun and easy to stick with!', avatar: '👨🏾‍🎓' },
              { name: 'Sarah J.', role: 'Traveler', text: 'I used Adewe to learn basic Oromo before my trip to Jimma. The locals were so impressed!', avatar: '👩🏼' },
              { name: 'Dawit M.', role: 'Diaspora', text: 'Finally an app that treats our languages with the quality they deserve. Highly recommended!', avatar: '👨🏾' }
            ].map((t, i) => (
              <div key={i} className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{t.role}</p>
                  </div>
                </div>
                <p className={`italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Upcoming Events
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Practice with others in live virtual events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Amharic Conversation Club', date: 'Sat, Jan 20 • 2:00 PM', type: 'Virtual', image: '☕' },
              { title: 'Tigrinya for Beginners', date: 'Sun, Jan 21 • 4:00 PM', type: 'Workshop', image: '📚' },
              { title: 'Coffee Ceremony & Chat', date: 'Fri, Jan 26 • 6:00 PM', type: 'Social', image: '🍵' }
            ].map((e, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border transition-all hover:shadow-lg hover:-translate-y-1`}>
                <div className={`h-32 flex items-center justify-center text-6xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                  {e.image}
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 mb-3">
                    {e.type}
                  </span>
                  <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{e.title}</h3>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{e.date}</p>
                  <button className="mt-4 w-full py-2 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative z-10 px-6 py-16 ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-900/30 to-slate-900/30' : 'bg-gradient-to-r from-emerald-50 to-slate-50'
        }`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
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
            Get Started — It's Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className={`mt-4 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('freeForever')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 px-6 py-8 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white/50'
        }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={branding.site_name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ፖ</span>
              </div>
            )}
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {branding.site_name || 'Adewe'}
            </span>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            {branding.copyright || '© 2026 Adewe. Made with ❤️ for Ethiopian languages.'}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
