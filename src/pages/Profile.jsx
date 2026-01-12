import { useNavigate } from 'react-router-dom'
import {
  Flame, Heart, Gem, Trophy, Target, Calendar, BookOpen, LogOut, Settings, Edit, User, Globe, Star, Shield, ArrowRight,
  Plus, Search, Mail, Lock, Camera, Check, X, Trash2, Edit2, UserPlus, Sun, Moon, UserCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import useThemeStore from '../store/useThemeStore'
import { getLanguage, languages, getOtherLanguages } from '../data/languages'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=FelixCode',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Misty',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sugar',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Simba',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
]

function Profile() {
  const navigate = useNavigate()
  const { user, profile, signOut, updateProfile } = useAuth()
  const {
    xp,
    streak,
    hearts,
    gems,
    completedLessons,
    learningLanguage,
    learningLanguages,
    currentLearningLanguage,
    nativeLanguage,
    setLearningLanguage,
    addLearningLanguage,
    switchLearningLanguage,
    removeLearningLanguage,
    resetProgress,
    setProfileDetails,
    bio: storeBio
  } = useStore()

  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
  const [followingIds, setFollowingIds] = useState(new Set())
  const [searching, setSearching] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState(profile?.username || '')
  const [editFullName, setEditFullName] = useState(profile?.full_name || '')
  const [editBio, setEditBio] = useState(storeBio || '')
  const [editAvatar, setEditAvatar] = useState(profile?.avatar_url || '')
  const [editEmail, setEditEmail] = useState(user?.email || '')
  const [editPhone, setEditPhone] = useState(profile?.phone || '')
  const [editPassword, setEditPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followersList, setFollowersList] = useState([])
  const [followingList, setFollowingList] = useState([])
  const [loadingFollows, setLoadingFollows] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      fetchFollowStats()
      fetchFollowing()
    }
  }, [profile?.id])

  const fetchFollowStats = async () => {
    try {
      const { count: followers } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('followed_id', profile.id)

      const { count: following } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id)

      setFollowerCount(followers || 0)
      setFollowingCount(following || 0)
    } catch (err) {
      console.error('Error fetching follow stats:', err)
    }
  }

  const fetchFollowersList = async () => {
    setLoadingFollows(true)
    try {
      // Step 1: Get follower IDs
      const { data: follows, error: followsError } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('followed_id', profile.id)

      if (followsError) throw followsError

      const followerIds = follows?.map(f => f.follower_id) || []

      if (followerIds.length === 0) {
        setFollowersList([])
        return
      }

      // Step 2: Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followerIds)

      if (profilesError) throw profilesError

      console.log('Followers fetched:', profiles)
      setFollowersList(profiles || [])
    } catch (err) {
      console.error('Error fetching followers:', err)
    } finally {
      setLoadingFollows(false)
    }
  }

  const fetchFollowingList = async () => {
    setLoadingFollows(true)
    try {
      // Step 1: Get followed IDs
      const { data: follows, error: followsError } = await supabase
        .from('user_follows')
        .select('followed_id')
        .eq('follower_id', profile.id)

      if (followsError) throw followsError

      const followedIds = follows?.map(f => f.followed_id) || []

      if (followedIds.length === 0) {
        setFollowingList([])
        return
      }

      // Step 2: Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', followedIds)

      if (profilesError) throw profilesError

      console.log('Following fetched:', profiles)
      setFollowingList(profiles || [])
    } catch (err) {
      console.error('Error fetching following:', err)
    } finally {
      setLoadingFollows(false)
    }
  }

  const fetchFollowing = async () => {
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('followed_id')
        .eq('follower_id', profile.id)
      setFollowingIds(new Set(data?.map(f => f.followed_id) || []))
    } catch (err) {
      console.error('Error fetching following:', err)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      // Search by username OR email
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(10)

      if (error) throw error
      setSearchResults(data || [])
    } catch (err) {
      console.error('Error searching users:', err)
    } finally {
      setSearching(false)
    }
  }

  const toggleFollow = async (targetUserId) => {
    const isFollowing = followingIds.has(targetUserId)
    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', profile.id)
          .eq('followed_id', targetUserId)
        setFollowingIds(prev => {
          const next = new Set(prev)
          next.delete(targetUserId)
          return next
        })
      } else {
        await supabase
          .from('user_follows')
          .insert({ follower_id: profile.id, followed_id: targetUserId })
        setFollowingIds(prev => new Set([...prev, targetUserId]))
      }
      fetchFollowStats()
    } catch (err) {
      console.error('Error toggling follow:', err)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()

    // Require current password for any sensitive changes
    if (!currentPassword) {
      alert('Please enter your current password to save changes')
      return
    }

    setSavingSettings(true)
    try {
      // Authenticate with current password first to verify user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Incorrect current password. Please try again.')
      }

      // Update profile metadata
      const { error: profileError } = await supabase.from('profiles').update({
        username: editName,
        full_name: editFullName,
        phone: editPhone,
        avatar_url: editAvatar,
        bio: editBio
      }).eq('id', profile.id)

      if (profileError) throw profileError

      // Update bio in store
      setProfileDetails({ bio: editBio })

      // Update email/password if changed
      if ((editEmail && editEmail !== user.email) || editPassword) {
        const updates = {}
        if (editEmail && editEmail !== user.email) updates.email = editEmail
        if (editPassword) updates.password = editPassword

        const { error: authError } = await supabase.auth.updateUser(updates)
        if (authError) throw authError

        if (editEmail && editEmail !== user.email) {
          alert('Check your new email address for a confirmation link!')
        }
      }

      setIsEditing(false)
      setEditPassword('')
      setCurrentPassword('')
      // Refresh context profile
      if (updateProfile) updateProfile()
    } catch (err) {
      console.error('Error saving settings:', err)
      alert(err.message || 'Failed to save settings')
    } finally {
      setSavingSettings(false)
    }
  }

  const targetLanguage = getLanguage(learningLanguage)
  const sourceLanguage = getLanguage(nativeLanguage)
  const { theme, toggleTheme } = useThemeStore()
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const handleSignOut = async () => {
    try {
      await signOut()
      resetProgress()
      localStorage.removeItem('adewe-storage')
      localStorage.removeItem('adewe-theme')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
      navigate('/', { replace: true })
    }
  }

  const handleLanguageChange = () => {
    if (selectedLanguage) {
      setLearningLanguage(selectedLanguage)
      setShowLanguageModal(false)
      setSelectedLanguage(null)
    }
  }

  const handleAddLanguage = () => {
    if (selectedLanguage) {
      addLearningLanguage(selectedLanguage)
      setShowAddLanguageModal(false)
      setSelectedLanguage(null)
    }
  }

  const handleSwitchLanguage = (langCode) => {
    switchLearningLanguage(langCode)
  }

  const handleRemoveLanguage = (langCode) => {
    if (learningLanguages.length > 1) {
      removeLearningLanguage(langCode)
    } else {
      alert('You must have at least one learning language')
    }
  }

  const availableLanguages = getOtherLanguages(nativeLanguage)

  const stats = [
    {
      icon: <Flame className="text-orange-500" size={28} />,
      value: streak,
      label: 'Day Streak',
      color: 'from-orange-500/20 to-orange-600/20',
    },
    {
      icon: <Trophy className="text-yellow-400" size={28} />,
      value: xp,
      label: 'Total XP',
      color: 'from-yellow-500/20 to-yellow-600/20',
    },
    {
      icon: <BookOpen className="text-blue-400" size={28} />,
      value: completedLessons.length,
      label: 'Lessons Done',
      color: 'from-blue-500/20 to-blue-600/20',
    },
    {
      icon: <Gem className="text-cyan-400" size={28} />,
      value: gems,
      label: 'Gems',
      color: 'from-cyan-500/20 to-cyan-600/20',
    },
  ]

  return (
    <div className="min-h-screen md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Profile Header Card */}
        <div className="bg-bg-card border-2 border-border-main rounded-[24px] p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white dark:border-gray-900 overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.username?.[0]?.toUpperCase() || '👤'
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg hover:scale-110 transition-all"
              >
                <Edit2 size={14} />
              </button>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-none">
                  {profile?.username || 'Learner'}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="duo-btn duo-btn-white text-xs px-4 py-2 border-2 border-border-main"
                  >
                    EDIT PROFILE
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-text-alt font-bold text-sm mb-4">
                <p>@{profile?.username?.toLowerCase().replace(/\s+/g, '')}</p>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined {new Date(profile?.created_at).toLocaleDateString()}
                </div>
              </div>

              {storeBio && (
                <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4 max-w-md">
                  "{storeBio}"
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-6">
                <button
                  onClick={() => { fetchFollowersList(); setShowFollowersModal(true); }}
                  className="text-center sm:text-left hover:bg-bg-alt p-2 rounded-xl transition-all cursor-pointer"
                >
                  <p className="font-black text-gray-900 dark:text-white text-lg leading-none">{followerCount}</p>
                  <p className="text-text-alt text-xs font-black uppercase tracking-widest">Followers</p>
                </button>
                <button
                  onClick={() => { fetchFollowingList(); setShowFollowingModal(true); }}
                  className="text-center sm:text-left hover:bg-bg-alt p-2 rounded-xl transition-all cursor-pointer"
                >
                  <p className="font-black text-gray-900 dark:text-white text-lg leading-none">{followingCount}</p>
                  <p className="text-text-alt text-xs font-black uppercase tracking-widest">Following</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-bg-card border-2 border-border-main rounded-2xl p-4 flex items-center gap-4 hover:border-brand-primary/30 transition-all">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{stat.value}</p>
                <p className="text-text-alt text-xs font-black uppercase tracking-widest leading-none">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>


        {/* Learning Languages Section */}
        <section className="bg-bg-card border-2 border-border-main rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Courses</h2>
            <button
              onClick={() => setShowAddLanguageModal(true)}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {learningLanguages.map((lang) => {
              const info = getLanguage(lang.code)
              const isActive = (currentLearningLanguage || learningLanguage) === lang.code
              return (
                <div key={lang.code} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-brand-primary bg-brand-primary/5' : 'border-border-main'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{info?.flag}</span>
                    <div className="text-left font-black">
                      <p className="text-gray-900 dark:text-white leading-none">{info?.name}</p>
                      <p className="text-text-alt text-xs uppercase tracking-widest mt-1">Section {lang.currentSection + 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button onClick={() => handleSwitchLanguage(lang.code)} className="text-brand-primary font-black text-xs uppercase tracking-widest px-3 py-1 hover:bg-brand-primary/10 rounded-lg transition-all">
                        SWITCH
                      </button>
                    )}
                    {isActive && <UserCheck className="text-brand-primary" size={20} />}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Settings / System Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg-card border-2 border-border-main rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <p className="font-black text-gray-900 dark:text-white">Dark Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-[26px]' : 'translate-x-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="bg-bg-card border-2 border-border-main rounded-2xl p-4 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-red-500"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <p className="font-black">Sign Out</p>
          </button>
        </section>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Username</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                  placeholder="+251 ..."
                />
              </div>

              {user?.email && (
                <div className="space-y-2">
                  <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-alt" size={20} />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-4 pl-12 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-orange-500 font-black uppercase tracking-widest text-[10px]">Current Password (Required to save)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/50" size={20} />
                  <input
                    required
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-4 pl-12 bg-orange-50/50 dark:bg-orange-500/5 border-2 border-orange-200 dark:border-orange-500/30 rounded-2xl text-text-main font-bold focus:outline-none focus:border-orange-500 transition-all placeholder:text-orange-900/20"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">New Password (leave blank to keep current)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-alt" size={20} />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-4 pl-12 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-text-alt font-black uppercase tracking-widest text-[10px]">Choose Avatar</label>
              <div className="grid grid-cols-4 gap-2 border-2 border-border-main rounded-2xl p-3 bg-bg-alt max-h-[280px] overflow-y-auto">
                {AVATAR_OPTIONS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setEditAvatar(url)}
                    className={`aspect-square rounded-xl overflow-hidden border-4 transition-all ${editAvatar === url ? 'border-brand-primary' : 'border-transparent hover:border-border-main'}`}
                  >
                    <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter image URL:')
                    if (url) setEditAvatar(url)
                  }}
                  className="aspect-square rounded-xl border-4 border-dashed border-border-main flex items-center justify-center text-text-alt hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-bg-alt border-2 border-border-main rounded-2xl">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white text-2xl font-black overflow-hidden border-2 border-border-main">
                  {editAvatar ? <img src={editAvatar} alt="" className="w-full h-full object-cover" /> : editName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-text-alt uppercase tracking-widest">Preview</p>
                  <p className="text-text-main font-bold">{editName || 'Username'}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="w-full duo-btn duo-btn-blue flex items-center justify-center gap-2 py-4"
          >
            {savingSettings ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={20} />}
            SAVE CHANGES
          </button>
        </form>
      </Modal>

      {/* Add Language Modal */}
      <Modal
        isOpen={showAddLanguageModal}
        onClose={() => setShowAddLanguageModal(false)}
        title="Add Language"
      >
        <div className="grid grid-cols-1 gap-2">
          {availableLanguages.filter(lang => !learningLanguages.find(l => l.code === lang.code)).map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setSelectedLanguage(lang.code); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedLanguage === lang.code ? 'border-brand-primary bg-brand-primary/10' : 'border-border-main hover:bg-bg-alt'}`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-white font-black">{lang.name}</p>
                <p className="text-text-alt text-sm font-bold">{lang.nativeName}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t-2 border-border-main">
          <button
            onClick={handleAddLanguage}
            disabled={!selectedLanguage}
            className="w-full duo-btn duo-btn-blue"
          >
            ADD COURSE
          </button>
        </div>
      </Modal>


      {/* Followers Modal */}
      <Modal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
      >
        <div className="space-y-2">
          {loadingFollows ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : followersList.length === 0 ? (
            <p className="text-center text-text-alt py-8">No followers yet</p>
          ) : (
            followersList.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-text-main font-bold">{u.username}</p>
                    <p className="text-text-alt text-xs">{u.xp || 0} XP</p>
                  </div>
                </div>
                {u.id !== profile?.id && (
                  <button
                    onClick={() => toggleFollow(u.id)}
                    className={`duo-btn text-[10px] px-3 py-2 ${followingIds.has(u.id) ? 'duo-btn-outline' : 'duo-btn-blue'}`}
                  >
                    {followingIds.has(u.id) ? 'FOLLOWING' : 'FOLLOW BACK'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Following Modal */}
      <Modal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
      >
        <div className="space-y-2">
          {loadingFollows ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : followingList.length === 0 ? (
            <p className="text-center text-text-alt py-8">Not following anyone yet</p>
          ) : (
            followingList.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-text-main font-bold">{u.username}</p>
                    <p className="text-text-alt text-xs">{u.xp || 0} XP</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(u.id)}
                  className="duo-btn duo-btn-outline text-[10px] px-3 py-2"
                >
                  UNFOLLOW
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Profile
