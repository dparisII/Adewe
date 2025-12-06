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
      console.log('No valid Supabase credentials')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error)
        setLoading(false)
        return
      }
      console.log('Session check:', session ? 'User logged in' : 'No session')
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      console.error('Session check failed:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
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

  const signUp = async (email, password, username, phone = '') => {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone,
        },
      },
    })

    if (error) throw error

    // Create profile - the trigger will handle this, but we can also try manually
    // Profile creation is handled by the database trigger on_auth_user_created

    return data
  }

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user || !supabase) return

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
