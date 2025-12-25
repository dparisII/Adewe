import { useNavigate } from 'react-router-dom'
import { Flame, Heart, Gem, Trophy, Target, Calendar, BookOpen, LogOut, Settings, Sun, Moon, Plus, Globe, Check, X, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import useThemeStore from '../store/useThemeStore'
import { getLanguage, languages, getOtherLanguages } from '../data/languages'

function Profile() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
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
  } = useStore()

  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)

  const targetLanguage = getLanguage(learningLanguage)
  const sourceLanguage = getLanguage(nativeLanguage)
  const { theme, toggleTheme } = useThemeStore()
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const handleSignOut = async () => {
    try {
      await signOut()
      resetProgress()
      // Clear any remaining local storage items
      localStorage.removeItem('adewe-storage')
      localStorage.removeItem('adewe-theme')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback navigation
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

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlocked: completedLessons.length >= 1,
    },
    {
      id: 2,
      title: 'Getting Started',
      description: 'Complete 5 lessons',
      icon: '📚',
      unlocked: completedLessons.length >= 5,
    },
    {
      id: 3,
      title: 'Dedicated Learner',
      description: 'Complete 10 lessons',
      icon: '🌟',
      unlocked: completedLessons.length >= 10,
    },
    {
      id: 4,
      title: 'XP Hunter',
      description: 'Earn 100 XP',
      icon: '💎',
      unlocked: xp >= 100,
    },
    {
      id: 5,
      title: 'XP Master',
      description: 'Earn 500 XP',
      icon: '👑',
      unlocked: xp >= 500,
    },
    {
      id: 6,
      title: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      unlocked: streak >= 3,
    },
  ]

  return (
    <div className="min-h-screen md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl md:text-4xl shadow-inner">
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-black text-white">
                {profile?.username || 'Language Learner'}
              </h1>
              <p className="text-white/80">{user?.email}</p>
              <p className="text-white/60 text-sm">
                Learning {targetLanguage?.name || 'a language'} from {sourceLanguage?.name || 'English'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-bg-card rounded-xl p-4 border border-border-main shadow-sm hover:border-brand-primary/30 transition-all`}
            >
              <div className="flex items-center gap-3 mb-2">
                {stat.icon}
                <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Learning Languages */}
        <div className="bg-bg-card rounded-xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-border-main shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Learning Languages</h2>
            <button
              onClick={() => setShowAddLanguageModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Language
            </button>
          </div>

          {learningLanguages.length > 0 ? (
            <div className="space-y-3">
              {learningLanguages.map((lang) => {
                const langInfo = getLanguage(lang.code)
                const isActive = currentLearningLanguage === lang.code || learningLanguage === lang.code

                return (
                  <div
                    key={lang.code}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all gap-4 ${isActive ? 'border-brand-primary bg-brand-primary/5' : 'border-border-main hover:border-border-main dark:hover:border-[#4b5a6a]'
                      }`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="text-3xl flex-shrink-0">{langInfo?.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 dark:text-white font-black truncate">{langInfo?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold truncate">{langInfo?.nativeName}</p>
                      </div>
                      {isActive && (
                        <span className="px-2 py-1 bg-brand-primary text-white text-xs rounded-full font-bold whitespace-nowrap flex-shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {!isActive && (
                        <button
                          onClick={() => handleSwitchLanguage(lang.code)}
                          className="px-3 py-2 text-sm text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors flex-1 sm:flex-none text-center"
                        >
                          Switch
                        </button>
                      )}
                      {learningLanguages.length > 1 && (
                        <button
                          onClick={() => handleRemoveLanguage(lang.code)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="mx-auto text-gray-400 mb-2" size={40} />
              <p className="text-gray-500 dark:text-gray-400 font-bold">No languages added yet</p>
              <button
                onClick={() => setShowAddLanguageModal(true)}
                className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:brightness-110"
              >
                Add Your First Language
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-bg-card rounded-2xl p-6 mb-8 border-2 border-border-main shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Settings</h2>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border-main">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} className="text-indigo-500" /> : <Sun size={20} className="text-amber-500" />}
              <div>
                <p className="text-gray-900 dark:text-white font-bold">Theme</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Switch between light and dark mode</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}>
                {theme === 'dark' ? (
                  <Moon size={14} className="text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                ) : (
                  <Sun size={14} className="text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-bg-card rounded-xl p-6 border-2 border-border-main shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-4 text-center transition-all border-2 ${achievement.unlocked
                  ? 'bg-brand-primary/10 border-brand-primary/30'
                  : 'bg-bg-alt border-border-main opacity-50'
                  }`}
              >
                <span className="text-3xl mb-2 block">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </span>
                <p
                  className={`font-bold text-sm ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}
                >
                  {achievement.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-medium">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-bg-card hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-border-main shadow-sm transition-all flex items-center justify-center gap-2 mt-8"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-bg-card rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border-2 border-border-main shadow-2xl transition-colors duration-300">
            <div className="p-4 border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-brand-primary" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Change Language</h2>
              </div>
              <button
                onClick={() => { setShowLanguageModal(false); setSelectedLanguage(null) }}
                className="p-2 text-text-alt hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 font-bold">Select a language to learn:</p>
              <div className="space-y-2">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedLanguage === lang.code
                      ? 'border-brand-primary bg-brand-primary/10'
                      : lang.code === learningLanguage
                        ? 'border-brand-primary/50 bg-brand-primary/5'
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
                    {lang.code === learningLanguage && selectedLanguage !== lang.code && (
                      <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border-main">
              <button
                onClick={handleLanguageChange}
                disabled={!selectedLanguage || selectedLanguage === learningLanguage}
                className={`w-full py-3 rounded-xl font-black uppercase tracking-widest transition-all ${selectedLanguage
                  ? 'bg-brand-primary text-white hover:brightness-110'
                  : 'bg-gray-200 dark:bg-[#2a3f4a] text-gray-400 dark:text-[#58687a] cursor-not-allowed'
                  }`}
              >
                Change Language
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
                {availableLanguages.filter(lang => !learningLanguages.find(l => l.code === lang.code)).map((lang) => (
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
                onClick={handleAddLanguage}
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

export default Profile
