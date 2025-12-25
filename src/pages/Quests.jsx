import { Target, Zap, Clock, Trophy, Gift, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import { generateDailyQuests, generateWeeklyQuests, updateQuestProgressByAction } from '../data/questsData'

function Quests() {
  const { profile } = useAuth()
  const { xp, streak, completedLessons, activeQuests, setActiveQuests, updateQuestProgress, completeQuest, addGems } = useStore()
  const [dailyQuests, setDailyQuests] = useState([])
  const [weeklyQuests, setWeeklyQuests] = useState([])

  useEffect(() => {
    // Generate quests if none exist
    if (!activeQuests || activeQuests.length === 0) {
      const daily = generateDailyQuests(profile?.id || 'guest', 3)
      const weekly = generateWeeklyQuests(2)
      setActiveQuests([...daily, ...weekly])
    }
  }, [profile])

  useEffect(() => {
    // Separate daily and weekly quests from active quests
    if (activeQuests) {
      setDailyQuests(activeQuests.filter(q => !q.isWeekly))
      setWeeklyQuests(activeQuests.filter(q => q.isWeekly))
    }
  }, [activeQuests])

  const handleClaimReward = (quest) => {
    addGems(quest.gemReward)
    completeQuest(quest.id)
  }


  const getProgressColor = (color) => {
    const colors = {
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    }
    return colors[color] || 'bg-brand-primary'
  }

  const getQuestIcon = (category) => {
    const icons = {
      daily_practice: <Target className="text-brand-primary" size={24} />,
      skill_building: <Trophy className="text-purple-400" size={24} />,
      achievements: <Zap className="text-yellow-400" size={24} />,
      challenges: <Clock className="text-blue-400" size={24} />,
      special: <Gift className="text-orange-400" size={24} />,
    }
    return icons[category] || <Target className="text-gray-400" size={24} />
  }

  const QuestCard = ({ quest }) => {
    const progress = (quest.progress / quest.target) * 100
    const isComplete = quest.completed

    return (
      <div className={`bg-bg-card rounded-xl p-4 border-2 transition-colors duration-300 ${isComplete ? 'border-brand-primary' : 'border-border-main'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isComplete ? 'bg-brand-primary/20' : 'bg-bg-alt'}`}>
            {isComplete ? <CheckCircle className="text-brand-primary" size={24} /> : getQuestIcon(quest.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-black ${isComplete ? 'text-brand-primary' : 'text-gray-900 dark:text-white'}`}>{quest.name}</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-bg-alt rounded-lg">
                <Gift size={14} className="text-brand-primary" />
                <span className="text-brand-primary text-sm font-bold">+{quest.gemReward}</span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 font-medium">{quest.description}</p>
            <div className="h-3 bg-bg-alt dark:bg-[#37464f] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                {quest.progress} / {quest.target}
              </p>
              {isComplete && (
                <button
                  onClick={() => handleClaimReward(quest)}
                  className="px-3 py-1 bg-brand-primary text-white rounded-lg text-xs font-bold hover:brightness-110"
                >
                  Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="text-orange-400" size={40} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Daily Quests</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Complete quests to earn bonus gems</p>
        </div>

        {/* Daily Quests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide">Today's Quests</h2>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">Resets in 12h 30m</span>
          </div>
          <div className="space-y-4">
            {dailyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>

        {/* Weekly Quests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide">Weekly Challenges</h2>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-bold">Resets in 5 days</span>
          </div>
          <div className="space-y-4">
            {weeklyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>

        {/* Bonus Info */}
        <div className="mt-8 bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/30 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Gift className="text-brand-primary" size={24} />
            <div>
              <p className="text-gray-900 dark:text-white font-bold">Complete all daily quests</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Earn a bonus chest with extra rewards!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quests
