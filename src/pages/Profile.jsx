import { useNavigate } from 'react-router-dom'
import { Flame, Heart, Gem, Trophy, Target, Calendar, BookOpen, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import { getLanguage } from '../data/languages'

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
    nativeLanguage,
    resetProgress,
  } = useStore()

  const targetLanguage = getLanguage(learningLanguage)
  const sourceLanguage = getLanguage(nativeLanguage)

  const handleSignOut = async () => {
    try {
      await signOut()
      resetProgress()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#58cc02] to-[#4caf00] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
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
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} bg-[#1a2c35] rounded-xl p-4 border border-[#3c5a6a]`}
            >
              <div className="flex items-center gap-3 mb-2">
                {stat.icon}
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Current Language */}
        <div className="bg-[#1a2c35] rounded-xl p-6 mb-8 border border-[#3c5a6a]">
          <h2 className="text-lg font-bold text-white mb-4">Currently Learning</h2>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{targetLanguage?.flag}</span>
            <div>
              <p className="text-white font-bold text-xl">{targetLanguage?.name}</p>
              <p className="text-gray-400">{targetLanguage?.nativeName}</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#1a2c35] rounded-xl p-6 border border-[#3c5a6a]">
          <h2 className="text-lg font-bold text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-[#58cc02]/20 border border-[#58cc02]'
                    : 'bg-[#2a3f4a] opacity-50'
                }`}
              >
                <span className="text-3xl mb-2 block">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </span>
                <p
                  className={`font-bold text-sm ${
                    achievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {achievement.title}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-[#1a2c35] hover:bg-[#2a3f4a] text-red-400 font-bold py-4 rounded-xl border border-[#3c5a6a] transition-all flex items-center justify-center gap-2 mt-8"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile
