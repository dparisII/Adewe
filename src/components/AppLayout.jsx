import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Home, Trophy, Target, ShoppingBag, User, MoreHorizontal,
  Flame, Heart, LogOut, Shield, Gem, Settings, HelpCircle, FileText, ChevronUp, Globe, X, Check, Plus, Edit2, CheckCircle, Sun, Moon, Send,
  UserPlus, Share2, Search, UserCheck
} from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import { generateDailyQuests, generateWeeklyQuests } from '../data/questsData'
import { getLanguageInfo } from '../data/languageFlags'
import { getOtherLanguages } from '../data/languages'
import { getLeagueById } from '../data/leaguesData'
import { useEffect, useRef } from 'react'
import { useSound } from '../hooks/useSound'
import useThemeStore from '../store/useThemeStore'

function AppLayout({ children }) {
  const { streak, hearts, xp, gems, activeQuests, setActiveQuests, learningLanguages, switchLearningLanguage, currentLearningLanguage, setLearningLanguage, addLearningLanguage, nativeLanguage, regenerateHearts, refillHearts, lastHeartUpdate } = useStore()
  const { playClick } = useSound()
  const { signOut, profile } = useAuth()
  const { branding } = useBranding()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Modal states
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [showHeartsModal, setShowHeartsModal] = useState(false)
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [submittingTicket, setSubmittingTicket] = useState(false)

  // Available languages for the modal
  const availableLanguages = getOtherLanguages(nativeLanguage || 'en')

  // Heart regeneration timer
  const [timeToNextHeart, setTimeToNextHeart] = useState('')

  // Social/Search States
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [sidebarFriends, setSidebarFriends] = useState([])
  const [sidebarTab, setSidebarTab] = useState('following') // 'following' | 'followers'
  const [followingIds, setFollowingIds] = useState(new Set())

  useEffect(() => {
    // Generate quests if none exist
    if (!activeQuests || activeQuests.length === 0) {
      const daily = generateDailyQuests(profile?.id || 'guest', 3)
      const weekly = generateWeeklyQuests(2)
      setActiveQuests([...daily, ...weekly])
    }

    // Play open sound
    playClick()
  }, [profile, activeQuests, setActiveQuests, playClick])

  useEffect(() => {
    // Initial regen check
    regenerateHearts()

    const interval = setInterval(() => {
      regenerateHearts()
    }, 1000) // Check every 1 second for "real counting"

    return () => clearInterval(interval)
  }, [regenerateHearts])

  useEffect(() => {
    if (!lastHeartUpdate || hearts >= 20) {
      setTimeToNextHeart('')
      return
    }

    const updateTimer = () => {
      const now = new Date()
      const lastUpdate = new Date(lastHeartUpdate)
      const nextUpdate = new Date(lastUpdate.getTime() + 5 * 60 * 1000)
      const diff = nextUpdate - now

      if (diff <= 0) {
        setTimeToNextHeart('Ready!')
        return
      }

      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeToNextHeart(`${minutes}:${seconds.toString().padStart(2, '0')} `)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [lastHeartUpdate, hearts])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Fetch sidebar friends (if on profile)
  useEffect(() => {
    if (location.pathname === '/profile' && profile?.id) {
      fetchSidebarFriends()
      fetchFollowingIds()
    }
  }, [location.pathname, profile?.id])

  const fetchSidebarFriends = async () => {
    try {
      const isFollowing = sidebarTab === 'following'

      // Step 1: Get IDs
      const { data: follows, error: followsError } = await supabase
        .from('user_follows')
        .select(isFollowing ? 'followed_id' : 'follower_id')
        .eq(isFollowing ? 'follower_id' : 'followed_id', profile.id)
        .limit(3)

      if (followsError) throw followsError

      const ids = follows?.map(f => isFollowing ? f.followed_id : f.follower_id) || []

      if (ids.length === 0) {
        setSidebarFriends([])
        return
      }

      // Step 2: Get Profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, xp')
        .in('id', ids)

      if (profilesError) throw profilesError
      setSidebarFriends(profiles || [])
    } catch (err) {
      console.error('Error fetching sidebar friends:', err)
    }
  }

  // Refetch when tab changes or viewing community page
  useEffect(() => {
    if ((location.pathname === '/community' || location.pathname === '/profile') && profile?.id) {
      fetchSidebarFriends()
    }
  }, [sidebarTab, location.pathname])

  const fetchFollowingIds = async () => {
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('followed_id')
        .eq('follower_id', profile.id)
      setFollowingIds(new Set(data?.map(f => f.followed_id) || []))
    } catch (err) {
      console.error('Error fetching following IDs:', err)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
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
      fetchSidebarFriends()
    } catch (err) {
      console.error('Error toggling follow:', err)
    }
  }

  const handleInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Adewe!',
        text: 'Learn languages with me on Adewe! It is fun and free.',
        url: window.location.origin
      }).catch(console.error)
    } else {
      const url = window.location.origin
      navigator.clipboard.writeText(`Join me on Adewe! ${url}`)
      alert('Invite link copied to clipboard!')
    }
  }

  const navItems = [
    { to: '/learn', icon: Home, label: 'LEARN', color: 'text-brand-primary' },
    { to: '/leaderboards', icon: Trophy, label: 'LEADERBOARDS', color: 'text-brand-yellow' },
    { to: '/quests', icon: Target, label: 'QUESTS', color: 'text-brand-accent' },
    { to: '/shop', icon: ShoppingBag, label: 'SHOP', color: 'text-purple-500' },
    { to: '/community', icon: Globe, label: 'COMMUNITY', color: 'text-sky-500' },
    { to: '/profile', icon: User, label: 'PROFILE', color: 'text-brand-secondary' },
  ]

  return (
    <div className="min-h-screen bg-bg-main flex font-['Nunito'] transition-colors duration-300">
      {/* Left Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-main border-r-2 border-border-main fixed left-0 top-0 bottom-0 z-40 transition-colors duration-300">
        {/* Logo */}
        <div className="p-6">
          <NavLink to="/learn" className="flex items-center gap-2 group">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt="Logo" className="h-8 w-8 object-contain" />
            ) : (
              <span className="text-3xl">🦉</span>
            )}
            <span className="text-2xl font-black text-brand-primary tracking-tighter">
              {branding?.site_name || 'ADEWE'}
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-[15px] tracking-wide transition-all border-2 ${isActive
                  ? 'bg-brand-secondary/10 dark:bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30 dark:border-brand-secondary'
                  : 'text-text-alt hover:bg-bg-alt border-transparent'
                }`
              }
            >
              <item.icon size={28} className={item.color} />
              <span className="uppercase">{item.label}</span>
            </NavLink>
          ))}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-[15px] tracking-wide transition-all border-2 ${showMoreMenu
                ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary'
                : 'text-text-alt hover:bg-bg-alt border-transparent'
                }`}
            >
              <MoreHorizontal size={28} />
              <span className="uppercase">MORE</span>
              <ChevronUp className={`ml-auto transition-transform ${showMoreMenu ? '' : 'rotate-180'}`} size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 top-full mt-2 w-full bg-bg-card/95 backdrop-blur-md rounded-2xl border-2 border-border-main shadow-xl overflow-hidden z-50 transition-colors duration-300">
                <NavLink
                  to="/select-language"
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-3 px-4 py-4 text-sm font-bold text-text-alt hover:bg-bg-alt transition-all"
                >
                  <Settings size={20} />
                  <span className="uppercase">Change Language</span>
                </NavLink>
                <button
                  onClick={() => {
                    setShowMoreMenu(false)
                    setShowSupportModal(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-text-alt hover:bg-bg-alt transition-all text-left"
                >
                  <HelpCircle size={20} />
                  <span className="uppercase">Help & Support</span>
                </button>

                {profile?.is_admin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 px-4 py-4 text-sm font-black text-purple-500 hover:bg-purple-500/10 transition-all border-t-2 border-border-main"
                  >
                    <Shield size={20} />
                    <span className="uppercase">ADMIN PANEL</span>
                  </NavLink>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all text-left border-t-2 border-border-main"
                >
                  <LogOut size={20} />
                  <span className="uppercase">SIGN OUT</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 lg:pr-80 overflow-x-hidden">
        {/* Top Stats Bar */}
        <header className="sticky top-0 bg-bg-main border-b-2 border-border-main z-30 transition-all duration-300">
          <div className="w-full flex items-center justify-between px-3 md:px-6 h-14 md:h-16">
            {/* Left side - Mobile Logo */}
            <div className="md:hidden flex items-center gap-1 sm:gap-2">
              <span className="text-2xl">🦉</span>
              <span className="text-lg sm:text-xl font-black text-brand-primary tracking-tighter uppercase hidden xs:block">ADEWE</span>
            </div>

            {/* Right side - Stats */}
            <div className="flex items-center gap-1 sm:gap-4 md:gap-6 ml-auto">
              {/* Language Displayer */}
              <div className="relative">
                <div
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-bg-alt cursor-pointer transition-all active:scale-95 border-2 ${showLanguageDropdown ? 'border-brand-primary bg-brand-primary/10' : 'border-border-main bg-bg-card'} group`}
                >
                  <span className="text-2xl">{getLanguageInfo(currentLearningLanguage).flag}</span>
                  <span className="hidden sm:block text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest group-hover:text-brand-primary transition-colors">{getLanguageInfo(currentLearningLanguage).name}</span>
                  <ChevronUp size={16} className={`text - text - alt transition - transform ${showLanguageDropdown ? '' : 'rotate-180'} group - hover: text - brand - primary`} />
                </div>

                {showLanguageDropdown && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-48 sm:w-64 bg-bg-card rounded-2xl border-2 border-border-main shadow-2xl overflow-hidden z-50 transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-border-main bg-bg-alt/50">
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">Select Language</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {learningLanguages?.length > 0 ? learningLanguages.map((langState) => {
                        const langInfo = getLanguageInfo(langState.code)
                        return (
                          <button
                            key={langState.code}
                            onClick={() => {
                              switchLearningLanguage(langState.code)
                              if (setLearningLanguage) setLearningLanguage(langState.code) // Ensure legacy/main support
                              setShowLanguageDropdown(false)
                              navigate('/learn')
                            }}
                            className={`w - full flex items - center gap - 3 px - 3 py - 2.5 rounded - xl transition - all text - left group ${currentLearningLanguage === langState.code
                              ? 'bg-brand-primary/10 text-brand-primary'
                              : 'hover:bg-bg-alt text-gray-900 dark:text-white hover:text-brand-primary'
                              } `}
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">{langInfo.flag}</span>
                            <span className="font-bold text-sm uppercase tracking-wide">{langInfo.name}</span>
                            {currentLearningLanguage === langState.code && (
                              <div className="ml-auto w-2 h-2 bg-brand-primary rounded-full" />
                            )}
                          </button>
                        )
                      }) : (
                        <div className="p-3 text-center text-text-alt text-sm italic">No languages started</div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowLanguageDropdown(false)
                        setShowAddLanguageModal(true)
                      }}
                      className="w-full p-3 text-center text-brand-secondary font-black text-xs uppercase tracking-widest hover:bg-brand-secondary/5 border-t border-border-main transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} />
                      Add New Language
                    </button>
                  </div>
                )}
              </div>

              {/* Streak */}
              <div
                onClick={() => setShowStreakModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-brand-accent/10 dark:hover:bg-brand-accent/20 cursor-pointer transition-all active:scale-95 border-2 border-transparent hover:border-brand-accent/30 group"
              >
                <Flame className="text-brand-accent group-hover:animate-bounce" size={22} fill="currentColor" />
                <span className="text-brand-accent font-black text-lg">{streak}</span>
              </div>

              {/* Gems (Diamonds) */}
              <div
                onClick={() => navigate('/shop')}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-brand-secondary/10 dark:hover:bg-brand-secondary/20 cursor-pointer transition-all active:scale-95 border-2 border-transparent hover:border-brand-secondary/30 group"
              >
                <Gem className="text-brand-secondary group-hover:animate-pulse" size={22} fill="currentColor" />
                <span className="text-brand-secondary font-black text-lg">{gems || 0}</span>
              </div>

              {/* Hearts */}
              <div
                onClick={() => setShowHeartsModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-[#ff4b4b]/10 dark:hover:bg-[#ff4b4b]/20 cursor-pointer transition-all active:scale-95 border-2 border-transparent hover:border-[#ff4b4b]/30 group relative"
              >
                <Heart className="text-[#ff4b4b] group-hover:scale-110 transition-transform" size={22} fill="#ff4b4b" />
                <span className="text-[#ff4b4b] font-black text-lg">{hearts}</span>
                {timeToNextHeart && hearts < 20 && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#ff4b4b] bg-white dark:bg-[#1a2c35] px-1.5 py-0.5 rounded-full border-2 border-[#ff4b4b]/30 shadow-sm whitespace-nowrap animate-pulse">
                    NEXT: {timeToNextHeart}
                  </span>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-bg-alt cursor-pointer transition-all active:scale-95 border-2 border-border-main bg-bg-card group"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Moon size={18} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[1050px] mx-auto p-3 md:p-6 pb-20 md:pb-12 flex-1">
          {children}
        </main>

        {/* Footer - Legal Links */}
        {branding?.show_legal_links && (
          <footer className="mt-auto py-12 px-6 border-t-2 border-border-main bg-bg-main">
            <div className="max-w-[1050px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦉</span>
                  <span className="text-xl font-black text-brand-primary tracking-tighter uppercase">{branding?.site_name || 'ADEWE'}</span>
                </div>
                <p className="text-text-alt text-sm font-bold max-w-xs text-center md:text-left">
                  {branding?.copyright || '© 2026 Adewe. All rights reserved.'}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {(branding?.footer_links || [
                  {
                    label: 'Legal', links: [
                      { label: 'Privacy Policy', url: '/legal/privacy_policy' },
                      { label: 'Terms of Service', url: '/legal/terms_of_service' },
                      { label: 'Cookie Policy', url: '/legal/cookie_policy' }
                    ]
                  }
                ]).map((cat, i) => (
                  <div key={i} className="flex flex-col items-center md:items-start gap-3">
                    <h4 className="text-text-alt font-black uppercase tracking-widest text-[10px]">{cat.label}</h4>
                    <div className="flex flex-col items-center md:items-start gap-2">
                      {cat.links.map((link, j) => (
                        <NavLink key={j} to={link.url} className="text-text-main font-bold hover:text-brand-primary transition-colors text-sm">
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Right Sidebar - Desktop */}
      <aside className="hidden lg:block w-80 bg-bg-main border-l-2 border-border-main fixed right-0 top-0 bottom-0 z-30 overflow-y-auto transition-colors duration-300">
        <div className="p-6 pt-20 space-y-6">
          {/* Dynamic Content based on route */}
          {location.pathname === '/shop' ? (
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-black text-xl mb-2 uppercase tracking-tighter">Gem Master</h3>
                <p className="text-white/80 text-sm font-bold mb-4">You have {gems} gems! Use them to buy power-ups and refills.</p>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform">
                  <Gem size={32} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
            </div>
          ) : location.pathname === '/community' ? (
            <div className="space-y-6">
              {/* Community Sidebar Actions */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main space-y-4">
                <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Find Friends</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="flex flex-col items-center justify-center p-4 bg-blue-500/10 text-blue-500 rounded-2xl border-2 border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                  >
                    <UserPlus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Find</span>
                  </button>
                  <button
                    onClick={handleInvite}
                    className="flex flex-col items-center justify-center p-4 bg-purple-500/10 text-purple-500 rounded-2xl border-2 border-purple-500/20 hover:bg-purple-500/20 transition-all group"
                  >
                    <Share2 size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Invite</span>
                  </button>
                </div>
              </div>

              {/* Quick Friends View */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-bg-alt/50 p-1 rounded-xl flex-1 mr-2">
                    <button
                      onClick={() => setSidebarTab('following')}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-center ${sidebarTab === 'following' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-alt hover:text-text-main'}`}
                    >
                      Following
                    </button>
                    <button
                      onClick={() => setSidebarTab('followers')}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-center ${sidebarTab === 'followers' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-alt hover:text-text-main'}`}
                    >
                      Followers
                    </button>
                  </div>
                  <p className="text-text-alt text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{sidebarFriends.length}</p>
                </div>

                <div className="space-y-3">
                  {sidebarFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-bg-alt transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                          {friend.avatar_url ? <img src={friend.avatar_url} alt="" className="w-full h-full object-cover" /> : friend.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-bold text-sm leading-none">{friend.username}</p>
                          <p className="text-text-alt text-[10px] uppercase tracking-widest mt-1">{friend.xp || 0} XP</p>
                        </div>
                      </div>
                      <ChevronUp size={14} className="rotate-90 text-text-alt opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}

                  {sidebarFriends.length === 0 && (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-text-alt text-xs font-bold italic">No {sidebarTab} yet.</p>
                      {sidebarTab === 'following' && (
                        <button
                          onClick={() => setShowSearchModal(true)}
                          className="text-brand-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                        >
                          Start Discovering
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main space-y-4">
                <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-bg-alt/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Trophy size={18} className="text-yellow-500" />
                      <span className="text-text-alt text-[10px] font-black uppercase tracking-widest">Total XP</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-black">{xp}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bg-alt/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Flame size={18} className="text-orange-500" />
                      <span className="text-text-alt text-[10px] font-black uppercase tracking-widest">Streak</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-black">{streak} days</span>
                  </div>
                </div>
              </div>
            </div>
          ) : location.pathname === '/quests' ? (
            <div className="space-y-6">
              {/* Exercises Link */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main space-y-4">
                <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Exercises</h3>

                <button
                  onClick={() => navigate('/more/exercises')}
                  className="w-full flex items-center gap-4 p-4 bg-bg-alt rounded-2xl border-2 border-transparent hover:border-brand-primary transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main group-hover:text-brand-primary transition-colors">Practice Hub</h4>
                    <p className="text-xs text-text-alt mt-1">Strengthen your skills with targeted exercises</p>
                  </div>
                </button>
              </div>

              {/* League Card (Standard) */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main space-y-4">
                <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">League</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <Trophy className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-text-main">Bronze League</p>
                    <p className="text-xs text-text-alt">Top 10 advance</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/leaderboards')}
                  className="w-full py-3 bg-bg-alt border-2 border-border-main rounded-xl text-text-main font-black text-xs uppercase tracking-widest hover:border-brand-primary/50 transition-all"
                >
                  View League
                </button>
              </div>
            </div>
          ) : location.pathname === '/profile' ? (
            <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main space-y-4">
              <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-bg-alt/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-yellow-500" />
                    <span className="text-text-alt text-[10px] font-black uppercase tracking-widest">Total XP</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-black">{xp}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-alt/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Flame size={18} className="text-orange-500" />
                    <span className="text-text-alt text-[10px] font-black uppercase tracking-widest">Streak</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-black">{streak} days</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/leaderboards')}
                className="w-full py-3 bg-bg-alt border-2 border-border-main rounded-xl text-text-main font-black text-xs uppercase tracking-widest hover:border-brand-primary/50 transition-all"
              >
                View Rankings
              </button>
            </div>
          ) : (
            <>
              {/* League Card - Default */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">
                    {getLeagueById(profile?.league_id || 1).name} League
                  </h3>
                  <button onClick={() => navigate('/leaderboards')} className="text-brand-secondary text-xs font-black uppercase tracking-widest hover:brightness-90">VIEW LEAGUE</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="text-3xl">{getLeagueById(profile?.league_id || 1).icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-black">
                      {xp > 0 ? "You're competing!" : "Start learning to rank!"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">
                      {xp > 0 ? "Keep going to reach the top!" : "Earn XP to join the leaderboard"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Quests - Default */}
              <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Daily Quests</h3>
                  <button onClick={() => navigate('/quests')} className="text-brand-secondary text-xs font-black uppercase tracking-widest hover:brightness-90">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                  {activeQuests.slice(0, 3).map((quest, idx) => {
                    const progress = (quest.progress / quest.target) * 100
                    const isCompleted = progress >= 100

                    return (
                      <div key={quest.id || idx} className={`relative p-3 rounded-[20px] border-2 transition-all group hover:scale-[1.02] ${isCompleted ? 'bg-gradient-to-br from-[#ffc800]/10 to-[#ff9600]/10 border-[#ffc800]/50' : 'bg-bg-main border-border-main'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${isCompleted ? 'bg-[#ffc800] text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>
                            {quest.type === 'lessons' ? '📚' : quest.type === 'xp' ? '⚡' : '🎯'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white font-black text-[13px] uppercase tracking-wide truncate">{quest.title}</p>
                            <div className="flex justify-between items-center mt-0.5">
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{quest.progress} / {quest.target}</p>
                              {isCompleted && <CheckCircle size={12} className="text-[#ffc800]" />}
                            </div>
                          </div>
                        </div>

                        <div className="h-2.5 bg-bg-alt dark:bg-[#37464f] rounded-full overflow-hidden border border-border-main">
                          <div
                            className={`h-full rounded-full transition-all duration-700 relative ${isCompleted ? 'bg-[#ffc800]' : 'bg-brand-primary'}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            {!isCompleted && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                          </div>
                        </div>

                        {isCompleted && (
                          <div className="absolute -top-1.5 -right-1.5 bg-[#ffc800] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg uppercase tracking-tighter">
                            READY
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {activeQuests.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center font-bold italic">No active quests</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-main border-t-2 border-border-main z-50 safe-area-bottom transition-colors duration-300">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${isActive ? 'text-brand-secondary' : 'text-gray-400'}`
              }
            >
              <item.icon size={28} />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-bg-card w-full max-w-sm rounded-[32px] p-8 border-2 border-border-main shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-brand-accent/10 rounded-full flex items-center justify-center animate-pulse">
                <Flame size={48} className="text-brand-accent" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{streak} Day Streak!</h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">You're on fire! Keep learning every day to build your streak.</p>

              <div className="bg-bg-alt rounded-2xl p-4 mb-6 border-2 border-border-main">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">Next Milestone</span>
                  <span className="text-brand-accent font-black">7 Days</span>
                </div>
                <div className="h-4 bg-bg-card rounded-full overflow-hidden border border-border-main">
                  <div className="h-full bg-brand-accent w-[40%] rounded-full relative">
                    <div className="absolute inset-0 bg-white/20"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full py-3 bg-brand-primary text-white font-black rounded-xl uppercase tracking-widest hover:bg-brand-primary/90 transition-all border-b-4 border-brand-primary/50 active:border-b-0 active:translate-y-1"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hearts Modal */}
      {showHeartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg-card w-full max-w-sm rounded-[32px] p-8 border-2 border-border-main shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowHeartsModal(false)
              }}
              className="absolute top-6 right-6 text-text-alt hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 z-50 p-2 rounded-full hover:bg-bg-alt"
            >
              <X size={24} strokeWidth={3} />
            </button>

            <div className="text-center relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#ff4b4b]/10 rounded-full flex items-center justify-center animate-bounce-slow border-2 border-[#ff4b4b]/20">
                <Heart size={48} className="text-[#ff4b4b]" fill="currentColor" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {hearts >= 20 ? 'Hearts Full!' : `${hearts} Hearts`}
              </h2>

              {hearts < 20 ? (
                <>
                  <p className="text-[#ff4b4b] font-black text-sm mb-6 animate-pulse">
                    Next heart in {timeToNextHeart || '5:00'}
                  </p>

                  <div className="space-y-4 mb-8">
                    <button
                      onClick={() => {
                        // Better AD refill logic
                        refillHearts()
                        setShowHeartsModal(false)
                        alert('Heart refilled! Enjoy your learning.')
                      }}
                      className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl uppercase tracking-widest hover:brightness-110 transition-all border-b-4 border-black/20 flex items-center justify-center gap-3"
                    >
                      <Plus size={20} />
                      Refill with AD
                    </button>

                    <button
                      onClick={() => {
                        setShowHeartsModal(false)
                        navigate('/shop')
                      }}
                      className="w-full py-4 bg-white dark:bg-gray-800 text-brand-secondary font-black rounded-2xl uppercase tracking-widest hover:bg-bg-alt transition-all border-2 border-border-main flex items-center justify-center gap-3"
                    >
                      <Gem size={20} className="text-blue-400" fill="currentColor" />
                      Refill with Gems
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                  Your hearts are full! Use them to learn new lessons and practice.
                </p>
              )}

              {/* Premium CTA */}
              <button
                onClick={() => {
                  setShowHeartsModal(false)
                  navigate('/subscribe')
                }}
                className="w-full p-6 bg-gradient-to-r from-[#1cb0f6] to-[#2b70c9] text-white rounded-[24px] hover:scale-[1.02] transition-all shadow-xl group"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 transition-transform">
                    <Shield size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-none mb-1">Super Adewe</h3>
                    <p className="text-white/80 text-xs font-bold leading-none">Upgrade for full experience</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
          </div>
        </div>
      )}

      {/* Add Language Modal */}
      {showAddLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-bg-card rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border-2 border-border-main shadow-2xl transition-colors duration-300">
            <div className="p-4 border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-brand-primary" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Add Language</h2>
              </div>
              <button
                onClick={() => { setShowAddLanguageModal(false); setSelectedLanguage(null) }}
                className="p-2 text-text-alt hover:text-gray-600 dark:hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 font-bold">Select a language to add:</p>
              <div className="space-y-2">
                {availableLanguages?.filter(lang => !learningLanguages?.find(l => l.code === lang.code)).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedLanguage === lang.code
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-border-main hover:border-brand-primary/30'
                      }`}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="text-gray-900 dark:text-white font-black">{lang.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{lang.nativeName}</p>
                    </div>
                    {selectedLanguage === lang.code && (
                      <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border-main">
              <button
                onClick={() => {
                  if (selectedLanguage) {
                    addLearningLanguage(selectedLanguage)
                    setShowAddLanguageModal(false)
                    setSelectedLanguage(null)
                  }
                }}
                disabled={!selectedLanguage}
                className={`w-full py-3 rounded-xl font-bold transition-all ${selectedLanguage
                  ? 'bg-brand-primary text-white hover:brightness-110'
                  : 'bg-gray-200 dark:bg-[#2a3f4a] text-text-alt dark:text-[#58687a] cursor-not-allowed'
                  }`}
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Help & Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-bg-card rounded-3xl w-full max-w-lg border-2 border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-alt/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-text-main">Help & Support</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-alt">How can we help you today?</p>
                </div>
              </div>
              <button
                onClick={() => { setShowSupportModal(false); setSupportSubject(''); setSupportMessage('') }}
                className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!supportSubject.trim() || !supportMessage.trim()) return
              setSubmittingTicket(true)
              try {
                const { error } = await supabase
                  .from('support_tickets')
                  .insert({
                    user_id: profile.id, // Explicitly provide user_id for RLS
                    subject: supportSubject,
                    message: supportMessage,
                    status: 'open'
                  })

                if (error) throw error

                setSupportSubject('')
                setSupportMessage('')
                setShowSupportModal(false)
                alert("Ticket submitted successfully! We'll get back to you soon.")
              } catch (err) {
                console.error('Error submitting ticket:', err)
                alert('Failed to submit ticket. Please try again.')
              } finally {
                setSubmittingTicket(false)
              }
            }} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-alt pl-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Billing issue, Bug report..."
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-alt pl-1">Message</label>
                <textarea
                  required
                  placeholder="Tell us more about your issue..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  rows={5}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingTicket}
                className="w-full duo-btn duo-btn-blue py-4 flex items-center justify-center gap-2"
              >
                {submittingTicket ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
                SUBMIT INQUIRY
              </button>

              <p className="text-center text-[10px] text-text-alt font-bold uppercase tracking-widest pt-2">
                Average response time: <span className="text-brand-primary">24-48 hours</span>
              </p>
            </form>
          </div>
        </div>
      )}
      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-bg-card w-full max-w-md rounded-[32px] border-2 border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-card">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Find Friends</h2>
              <button
                onClick={() => {
                  setShowSearchModal(false)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="text-text-alt hover:bg-bg-alt p-2 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or email..."
                  className="w-full p-4 pl-12 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
                />
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-alt" />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {searching ? '...' : 'Search'}
                </button>
              </form>

              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border-divider">
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-center text-text-alt py-4 italic font-bold">No users found for "{searchQuery}"</p>
                )}

                {searchResults.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-bg-alt/50 rounded-2xl border-2 border-transparent hover:border-brand-primary/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                        {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-black text-base leading-none">{u.username}</p>
                        <p className="text-brand-secondary text-[10px] font-black uppercase tracking-widest mt-1">{u.xp || 0} XP</p>
                      </div>
                    </div>

                    {u.id !== profile?.id && (
                      <button
                        onClick={() => toggleFollow(u.id)}
                        className={`duo-btn text-[10px] px-4 py-2 flex-shrink-0 ${followingIds.has(u.id) ? 'duo-btn-outline' : 'duo-btn-blue'}`}
                      >
                        {followingIds.has(u.id) ? (
                          <span className="flex items-center gap-1"><UserCheck size={12} /> FOLLOWING</span>
                        ) : (
                          'FOLLOW'
                        )}
                      </button>
                    )}
                  </div>
                ))}

                {!searchQuery && !searching && (
                  <div className="text-center py-8 text-text-alt">
                    <UserPlus size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="font-bold">Search for people to start learning together!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-bg-alt/30 border-t-2 border-border-main">
              <button
                onClick={handleInvite}
                className="w-full py-4 bg-white dark:bg-bg-card border-2 border-border-main rounded-2xl flex items-center justify-center gap-3 hover:border-brand-primary/50 transition-all group"
              >
                <Share2 size={20} className="text-brand-primary" />
                <span className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest">Share Invite Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppLayout
