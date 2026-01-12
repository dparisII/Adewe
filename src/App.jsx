import { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BrandingProvider } from './context/BrandingContext'
import useStore from './store/useStore'
import useThemeStore from './store/useThemeStore'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LanguageSelect from './pages/LanguageSelect'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import Leaderboards from './pages/Leaderboards'
import Quests from './pages/Quests'
import Admin from './pages/Admin'
import Subscribe from './pages/Subscribe'
import LegalPage from './pages/LegalPage'
import Community from './pages/Community'
import Exercises from './pages/Exercises'
import AnalyticsTracker from './components/AnalyticsTracker'
import NotFound from './pages/NotFound'

// Error boundary to catch rendering errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6 font-['Nunito']">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-100 max-w-lg w-full">
            <h1 className="text-2xl font-black text-red-600 mb-4">Something went wrong!</h1>
            <div className="bg-red-50 rounded-2xl p-4 mb-6 overflow-auto max-h-40">
              <pre className="text-red-800 text-sm font-mono">{this.state.error?.toString()}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="duo-btn duo-btn-green w-full py-3"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setShowTimeout(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#131f24] flex flex-col items-center justify-center gap-4 font-['Nunito']">
        <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
        {showTimeout && (
          <div className="text-center animate-fade-in">
            <p className="text-[#afafaf] font-bold text-sm">Taking longer than expected...</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#1cb0f6] font-black text-sm mt-2 hover:underline uppercase tracking-wide"
            >
              Refresh page
            </button>
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const { learningLanguage, setLearningLanguage, setNativeLanguage, nativeLanguage } = useStore()
  const { profile, updateProfile } = useAuth()

  // Load language preferences from profile when it changes
  useEffect(() => {
    if (profile) {
      // If profile has languages but store doesn't, sync from profile to store
      if (profile.learning_language && !learningLanguage) {
        setLearningLanguage(profile.learning_language)
      }
      if (profile.native_language && !nativeLanguage) {
        setNativeLanguage(profile.native_language)
      }

      // If store has languages but profile doesn't (e.g. just signed up after selecting), sync from store to profile
      if (learningLanguage && !profile.learning_language) {
        updateProfile({
          learning_language: learningLanguage,
          native_language: nativeLanguage
        }).catch(err => console.error('Failed to sync language to profile:', err))
      }
    }
  }, [profile, learningLanguage, nativeLanguage, setLearningLanguage, setNativeLanguage, updateProfile])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/terms" element={<LegalPage />} />
      <Route path="/privacy" element={<LegalPage />} />
      <Route path="/legal/:docId" element={<LegalPage />} />
      <Route path="/select-language" element={<LanguageSelect />} />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            {learningLanguage || profile?.learning_language ? (
              <AppLayout>
                <Home />
              </AppLayout>
            ) : (
              <Navigate to="/select-language" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/lesson/:unitId/:lessonId"
        element={
          <ProtectedRoute>
            {learningLanguage || profile?.learning_language ? (
              <Lesson />
            ) : (
              <Navigate to="/select-language" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Shop />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Leaderboards />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quests"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Quests />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/more/exercises"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Exercises />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Community />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribe"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Subscribe />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* Catch all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme class to document root on mount
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(theme)
  }, [theme])

  return (
    <ErrorBoundary>
      <Router>
        <AnalyticsTracker />
        <AuthProvider>
          <BrandingProvider>
            <AppRoutes />
          </BrandingProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
