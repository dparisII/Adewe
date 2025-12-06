import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Check, Sun, Moon, Phone, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useThemeStore from '../store/useThemeStore'
import useLanguageStore, { availableLanguages } from '../store/useLanguageStore'

function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage, t } = useLanguageStore()
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0]
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const passwordRequirements = [
    { text: t('atLeast6Chars'), met: password.length >= 6 },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await signUp(email, password, username, phone)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-emerald-50 via-white to-amber-50'
      }`}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <Check size={40} className="text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>{t('checkEmail')}</h1>
          <p className={`mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('confirmationSent')} <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{email}</span>
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {t('goToLogin').toUpperCase()}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-emerald-50 via-white to-amber-50'
    }`}>
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className={`p-2 rounded-lg transition-all ${
            theme === 'dark' 
              ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
              : 'text-slate-500 hover:bg-white hover:text-slate-700'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
              }`}
            >
              <span>{currentLang.flag}</span>
              <ChevronDown size={14} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangDropdownOpen(false)} />
                <div className={`absolute right-0 mt-2 py-1.5 w-40 rounded-lg shadow-xl z-20 ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'
                }`}>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                        language === lang.code
                          ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          : theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' 
                : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                <span className="text-white font-bold text-lg">ፖ</span>
              </div>
            </div>
            <h1 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>{t('createProfile')}</h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>{t('startJourney')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`} size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('chooseUsername')}
                  required
                  className={`w-full rounded-lg py-2.5 pl-10 pr-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`} size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  required
                  className={`w-full rounded-lg py-2.5 pl-10 pr-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`} size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('enterPhone')}
                  required
                  className={`w-full rounded-lg py-2.5 pl-10 pr-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('createPassword')}
                  required
                  className={`w-full rounded-lg py-2.5 pl-10 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-2">
                {passwordRequirements.map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 text-xs ${
                      req.met ? 'text-emerald-500' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <Check size={12} />
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold text-sm py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                t('createAccount').toUpperCase()
              )}
            </button>
          </form>

          {/* Terms */}
          <p className={`text-center text-xs mt-4 ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {t('terms')}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('or')}</span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>

          {/* Login Link */}
          <p className={`text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="text-emerald-500 font-bold hover:underline"
            >
              {t('login')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Signup
