import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import useStore from './store/useStore'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LanguageSelect from './pages/LanguageSelect'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Shop from './pages/Shop'

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
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
        {showTimeout && (
          <div className="text-center">
            <p className="text-slate-400 text-sm">Taking longer than expected...</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-emerald-400 text-sm mt-2 hover:underline"
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
  const { learningLanguage, setLearningLanguage, setNativeLanguage } = useStore()
  const { profile } = useAuth()

  // Load language preferences from profile when it changes
  useEffect(() => {
    if (profile?.learning_language && !learningLanguage) {
      setLearningLanguage(profile.learning_language)
    }
    if (profile?.native_language) {
      setNativeLanguage(profile.native_language)
    }
  }, [profile, learningLanguage, setLearningLanguage, setNativeLanguage])

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/select-language"
        element={
          <ProtectedRoute>
            <LanguageSelect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            {learningLanguage ? (
              <Layout>
                <Home />
              </Layout>
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
            {learningLanguage ? (
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
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Layout>
              <Shop />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
