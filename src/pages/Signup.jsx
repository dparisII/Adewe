import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Check, Phone, X, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import useStore from '../store/useStore'
import { getLanguage } from '../data/languages'

function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { branding } = useBranding()
  const { nativeLanguage, learningLanguage } = useStore()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const selectedLangData = getLanguage(learningLanguage)

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
      await signUp(email, password, username, phone, nativeLanguage, learningLanguage)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center px-6 font-['Nunito'] transition-colors duration-300">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-24 h-24 bg-brand-primary rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main mb-4">Check your email!</h1>
          <p className="text-text-alt font-bold mb-10 leading-relaxed">
            We've sent a confirmation link to <span className="text-text-main">{email}</span>. Please click the link to activate your account.
          </p>
          <button
            onClick={() => navigate('/select-language')}
            className="duo-btn duo-btn-green w-full py-4 text-base"
          >
            Continue to language selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-['Nunito'] transition-colors duration-300">
      {/* Header */}
      <header className="h-[70px] border-b-2 border-border-main flex items-center sticky top-0 bg-bg-main z-50 transition-colors duration-300">
        <div className="max-w-[1050px] mx-auto w-full px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            ) : (
              <span className="text-3xl sm:text-4xl">🦉</span>
            )}
            <span className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tighter uppercase">
              {branding?.site_name || 'ADEWE'}
            </span>
          </Link>
          <Link
            to="/login"
            className="duo-btn duo-btn-outline py-2 px-6 text-sm"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl md:text-3xl font-black text-text-main text-center mb-8">
            Create your profile
          </h1>

          {/* Language Summary */}
          {selectedLangData && (
            <div className="bg-brand-secondary/10 border-2 border-brand-secondary/30 rounded-2xl p-4 mb-8 flex items-center gap-4">
              <span className="text-4xl">{selectedLangData.flag}</span>
              <div className="flex-1">
                <p className="text-brand-secondary font-black text-xs uppercase tracking-widest mb-1">Learning Language</p>
                <p className="text-text-main font-black text-lg uppercase">{selectedLangData.name}</p>
              </div>
              <Link to="/select-language" className="text-brand-secondary font-black text-xs uppercase hover:underline">
                Change
              </Link>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#fee2e2] border-2 border-[#ef4444] text-[#991b1b] px-4 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <X size={18} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full rounded-2xl py-3.5 px-4 text-base bg-bg-alt border-2 border-border-main text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-2xl py-3.5 px-4 text-base bg-bg-alt border-2 border-border-main text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full rounded-2xl py-3.5 px-4 text-base bg-bg-alt border-2 border-border-main text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary transition-all font-bold"
              />
            </div>

            <div className="relative space-y-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-2xl py-3.5 px-4 pr-12 text-base bg-bg-alt border-2 border-border-main text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary transition-all font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-alt hover:text-text-main"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="duo-btn duo-btn-blue w-full py-4 text-base mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center text-text-alt font-bold text-sm mt-8 leading-relaxed">
            By signing up to Adewe, you agree to our <Link to="/terms" className="text-brand-secondary hover:brightness-90">Terms</Link> and <Link to="/privacy" className="text-brand-secondary hover:brightness-90">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Signup
