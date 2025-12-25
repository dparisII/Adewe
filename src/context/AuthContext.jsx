import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, hasValidCredentials } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If no valid credentials, skip auth
    if (!hasValidCredentials || !supabase) {
      const savedProfile = localStorage.getItem('demo_profile')
      if (savedProfile) {
        const demoProfile = JSON.parse(savedProfile)
        setUser({ id: demoProfile.id, email: demoProfile.email })
        setProfile(demoProfile)
      }
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setLoading(false)
        return
      }
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // PGRST116 = no rows found - profile might not exist yet
        if (error.code === 'PGRST116') {
          console.log('Profile not found, user may need to complete signup')
        } else {
          console.error('Error fetching profile:', error)
        }
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, username, phone = '', nativeLanguage = '', learningLanguage = '') => {
    if (!supabase) throw new Error('Supabase not configured')

    // Get the current site URL for email redirect
    const siteUrl = window.location.origin

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone,
          native_language: nativeLanguage,
          learning_language: learningLanguage
        },
        emailRedirectTo: `${siteUrl}/login`,
      },
    })

    if (error) throw error

    // Create profile - the trigger will handle this, but we can also try manually
    // Profile creation is handled by the database trigger on_auth_user_created

    return data
  }

  const signIn = async (email, password) => {
    if (!hasValidCredentials || !supabase) {
      // Demo mode - simulate login
      console.log('Demo mode: Simulating login')
      const savedProfile = localStorage.getItem('demo_profile')
      if (savedProfile) {
        const demoProfile = JSON.parse(savedProfile)
        setUser({ id: demoProfile.id, email: demoProfile.email })
        setProfile(demoProfile)
      } else {
        const demoUser = {
          id: 'demo-user-123',
          email,
          user_metadata: { username: 'Demo User' }
        }
        setUser(demoUser)
        const demoProfile = {
          id: demoUser.id,
          username: 'Demo User',
          email,
          native_language: 'english',
          learning_language: 'amharic',
          xp: 0,
          streak: 0,
          hearts: 5,
          gems: 0,
          is_admin: true,
          completed_lessons: [],
          progress: {}
        }
        setProfile(demoProfile)
        localStorage.setItem('demo_profile', JSON.stringify(demoProfile))
      }
      return { user: { email }, data: { user: { email } }, error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (!hasValidCredentials || !supabase) {
      // Demo mode - simulate logout
      console.log('Demo mode: Simulating logout')
      setUser(null)
      setProfile(null)
      localStorage.removeItem('demo_profile')
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user) return

    if (!hasValidCredentials || !supabase) {
      // Demo mode - update localStorage
      console.log('Demo mode: Updating profile')
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      localStorage.setItem('demo_profile', JSON.stringify(updatedProfile))
      return updatedProfile
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
