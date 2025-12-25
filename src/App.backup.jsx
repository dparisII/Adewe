import { useState, useEffect, Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BrandingProvider } from './context/BrandingContext'
import useStore from './store/useStore'
import useThemeStore from './store/useThemeStore'
import Layout from './components/Layout'
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
                <div style={{ padding: '20px', backgroundColor: '#ffcccc', color: '#cc0000' }}>
                    <h1>Something went wrong!</h1>
                    <pre>{this.state.error?.toString()}</pre>
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
            <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
                {showTimeout && (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">Taking longer than expected...</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-brand-primary text-sm mt-2 hover:underline"
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
            <Route path="/" element={<Landing />} />
            <Route path="/welcome" element={<Welcome />} />
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
                path="/subscribe"
                element={
                    <ProtectedRoute>
                        <Subscribe />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

function App() {
    const { theme } = useThemeStore()

    useEffect(() => {
        console.log('App mounted, theme:', theme)
        console.log('App is rendering - debugging white page issue')
        // Apply theme class to document root
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    return (
        <ErrorBoundary>
            <Router>
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
