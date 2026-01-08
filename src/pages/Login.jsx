import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import useLanguageStore from '../store/useLanguageStore'

function Login() {
  const navigate = useNavigate()
  const { signIn, user, loading: authLoading } = useAuth()
  const { branding } = useBranding()
  const { t } = useLanguageStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/learn', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      if (result?.user) {
        navigate('/learn')
      }
    } catch (err) {
      console.error('Login error:', err)
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.')
      } else {
        setError(err.message || 'Failed to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-['Nunito'] transition-colors duration-300">
      {/* Header */}
      <header className="h-[70px] border-b-2 border-border-main flex items-center bg-bg-main sticky top-0 z-50 transition-colors duration-300">
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
            to="/signup"
            className="duo-btn duo-btn-outline py-2 px-6 text-sm"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl md:text-3xl font-black text-text-main text-center mb-8">
            Log in
          </h1>

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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or username"
                required
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
                'Log in'
              )}
            </button>
          </form>

          <p className="text-center text-text-alt font-bold text-sm mt-8">
            By logging in to Adewe, you agree to our <Link to="/terms" className="text-brand-secondary hover:brightness-90">Terms</Link> and <Link to="/privacy" className="text-brand-secondary hover:brightness-90">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
