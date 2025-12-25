import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Trophy, Target, ShoppingBag, User, MoreHorizontal,
  Flame, Heart, LogOut, Shield, Gem, Settings, HelpCircle, FileText, ChevronUp, Globe, X, Check, Plus
} from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import { generateDailyQuests, generateWeeklyQuests } from '../data/questsData'
import { getLanguageInfo } from '../data/languageFlags'
import { getOtherLanguages } from '../data/languages'
import { useEffect } from 'react'

function AppLayout({ children }) {
  const { streak, hearts, xp, activeQuests, setActiveQuests, learningLanguages, switchLearningLanguage, currentLearningLanguage, setLearningLanguage, addLearningLanguage, nativeLanguage } = useStore()
  const { signOut, profile } = useAuth()
  const { branding } = useBranding()
  const navigate = useNavigate()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Modal states
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [showHeartsModal, setShowHeartsModal] = useState(false)
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  // Available languages for the modal
  const availableLanguages = getOtherLanguages(nativeLanguage || 'en')

  useEffect(() => {
    // Generate quests if none exist
    if (!activeQuests || activeQuests.length === 0) {
      const daily = generateDailyQuests(profile?.id || 'guest', 3)
      const weekly = generateWeeklyQuests(2)
      setActiveQuests([...daily, ...weekly])
    }
  }, [profile, activeQuests, setActiveQuests])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: '/learn', icon: Home, label: 'LEARN', color: 'text-brand-primary' },
    { to: '/leaderboards', icon: Trophy, label: 'LEADERBOARDS', color: 'text-brand-yellow' },
    { to: '/quests', icon: Target, label: 'QUESTS', color: 'text-brand-accent' },
    { to: '/shop', icon: ShoppingBag, label: 'SHOP', color: 'text-purple-500' },
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
                ? 'bg-bg-alt text-text-main border-border-main'
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
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-text-alt hover:bg-bg-alt transition-all text-left"
                >
                  <HelpCircle size={20} />
                  <span className="uppercase">Help & Support</span>
                </button>
                {profile?.is_admin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center gap-3 px-4 py-4 text-sm font-bold text-purple-500 hover:bg-purple-500/10 transition-all border-t-2 border-border-main"
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
                  className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-bg-alt cursor-pointer transition-all active:scale-95 border-2 backdrop-blur-md ${showLanguageDropdown ? 'border-brand-primary bg-brand-primary/10' : 'border-border-main bg-bg-card/50'} group`}
                >
                  <span className="text-2xl">{getLanguageInfo(currentLearningLanguage).flag}</span>
                  <span className="hidden sm:block text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest group-hover:text-brand-primary transition-colors">{getLanguageInfo(currentLearningLanguage).name}</span>
                  <ChevronUp size={16} className={`text-text-alt transition-transform ${showLanguageDropdown ? '' : 'rotate-180'} group-hover:text-brand-primary`} />
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
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${currentLearningLanguage === langState.code
                              ? 'bg-brand-primary/10 text-brand-primary'
                              : 'hover:bg-bg-alt text-gray-900 dark:text-white hover:text-brand-primary'
                              }`}
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

              {/* XP */}
              <div
                onClick={() => navigate('/shop')}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-brand-secondary/10 dark:hover:bg-brand-secondary/20 cursor-pointer transition-all active:scale-95 border-2 border-transparent hover:border-brand-secondary/30 group"
              >
                <Gem className="text-brand-secondary group-hover:animate-pulse" size={22} fill="currentColor" />
                <span className="text-brand-secondary font-black text-lg">{xp || 0}</span>
              </div>

              {/* Hearts */}
              <div
                onClick={() => setShowHeartsModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 rounded-xl hover:bg-[#ff4b4b]/10 dark:hover:bg-[#ff4b4b]/20 cursor-pointer transition-all active:scale-95 border-2 border-transparent hover:border-[#ff4b4b]/30 group"
              >
                <Heart className="text-[#ff4b4b] group-hover:scale-110 transition-transform" size={22} fill="#ff4b4b" />
                <span className="text-[#ff4b4b] font-black text-lg">{hearts}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[1050px] mx-auto p-3 md:p-6 pb-20 md:pb-12">
          {children}
        </main>
      </div>

      {/* Right Sidebar - Desktop */}
      <aside className="hidden lg:block w-80 bg-bg-main border-l-2 border-border-main fixed right-0 top-0 bottom-0 z-30 overflow-y-auto transition-colors duration-300">
        <div className="p-6 pt-20 space-y-6">
          {/* League Card */}
          <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-wide">Amethyst League</h3>
              <button onClick={() => navigate('/leaderboards')} className="text-brand-secondary text-xs font-black uppercase tracking-widest hover:brightness-90">VIEW LEAGUE</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Trophy className="text-purple-500 dark:text-purple-400" size={32} />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-black">You're ranked #12</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">3 ranks away from the demotion zone!</p>
              </div>
            </div>
          </div>

          {/* Daily Quests */}
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
                  <div key={quest.id || idx} className={`relative p-4 rounded-xl border-2 transition-all ${isCompleted ? 'bg-gradient-to-br from-brand-yellow/20 to-brand-accent/20 border-brand-yellow/50' : 'bg-bg-main border-border-main'}`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${isCompleted ? 'bg-brand-yellow text-white' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                        {quest.type === 'lessons' ? '📚' : quest.type === 'xp' ? '⚡' : '🎯'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-wide truncate">{quest.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mt-1">{quest.progress} / {quest.target}</p>
                      </div>
                    </div>

                    <div className="h-4 bg-bg-alt dark:bg-[#37464f] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 relative ${isCompleted ? 'bg-brand-yellow' : 'bg-brand-secondary'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-brand-yellow text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md uppercase tracking-widest animate-bounce">
                        Claim!
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg-card w-full max-w-sm rounded-3xl p-6 border-2 border-border-main shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
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
          <div className="bg-bg-card w-full max-w-sm rounded-3xl p-6 border-2 border-border-main shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#ff4b4b]/10 rounded-full flex items-center justify-center animate-bounce-slow">
                <Heart size={48} className="text-[#ff4b4b]" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{hearts} Hearts</h2>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">Hearts are used to learn new lessons. Mistakes cost hearts.</p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setShowHeartsModal(false)
                    navigate('/shop')
                  }}
                  className="w-full py-3 bg-brand-secondary text-white font-black rounded-xl uppercase tracking-widest hover:bg-brand-secondary/90 transition-all border-b-4 border-brand-secondary/50 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                >
                  <Heart size={20} fill="currentColor" />
                  Unlimited Hearts
                </button>
                <button
                  onClick={() => {
                    setShowHeartsModal(false)
                    navigate('/shop')
                  }}
                  className="w-full py-3 bg-bg-alt text-brand-secondary font-black rounded-xl uppercase tracking-widest hover:bg-bg-alt/80 transition-all border-2 border-border-main flex items-center justify-center gap-2"
                >
                  <Gem size={20} className="text-blue-400" />
                  Refill Hearts
                </button>
              </div>

              <button
                onClick={() => setShowHeartsModal(false)}
                className="text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                No Thanks
              </button>
            </div>
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
    </div>
  )
}

export default AppLayout
