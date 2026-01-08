import { Zap, Clock, Trophy, Gift, CheckCircle, Flame, Star, Crown, ChevronRight, Volume2, Mic2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import { generateDailyQuests, generateWeeklyQuests } from '../data/questsData'

function Quests() {
  const { profile } = useAuth()
  const { xp, streak, activeQuests, setActiveQuests, completeQuest, addGems, monthlyChallenge } = useStore()

  const [dailyQuests, setDailyQuests] = useState([])
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      const diff = endOfDay - now

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${hours} HOURS ${minutes} MINUTES`)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!activeQuests || activeQuests.length === 0) {
      const daily = generateDailyQuests(profile?.id || 'guest', 3)
      const weekly = generateWeeklyQuests(profile?.id || 'guest', 2)
      setActiveQuests([...daily, ...weekly])
    }
  }, [profile, activeQuests, setActiveQuests])

  useEffect(() => {
    if (activeQuests) {
      setDailyQuests(activeQuests.filter(q => !q.isWeekly))
    }
  }, [activeQuests])

  // Get months remaining time
  const getMonthlyTimeLeft = () => {
    if (!monthlyChallenge) return ''
    const now = new Date()
    const expiry = new Date(monthlyChallenge.expiresAt)
    const diff = expiry - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days} DAYS LEFT`
  }

  const getQuestIcon = (type) => {
    if (type === 'xp') return <Zap className="text-yellow-400 fill-yellow-400" size={24} />
    if (type?.includes('time') || type?.includes('minutes')) return <Clock className="text-blue-400" size={24} />
    if (type?.includes('listen') || type?.includes('exercises')) return <Volume2 className="text-blue-400" size={24} />
    return <Star className="text-brand-primary" size={24} />
  }

  const getChestIcon = (index) => {
    const chests = ['🥉', '🥈', '🥇']
    return <span className="text-2xl">{chests[index % 3]}</span>
  }

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Monthly Challenge Section */}
        {monthlyChallenge && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="inline-block bg-white text-purple-600 px-3 py-1 rounded-lg text-xs font-black mb-3">
                {new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}
              </div>

              <h1 className="text-2xl font-black mb-1">{monthlyChallenge.title}</h1>

              <div className="flex items-center gap-2 text-white/80 text-sm font-bold mb-6">
                <Clock size={16} />
                <span>{getMonthlyTimeLeft()}</span>
              </div>

              <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
                <p className="text-white font-bold mb-3">{monthlyChallenge.description}</p>

                <div className="relative h-8 bg-black/40 rounded-full p-1 group">
                  {/* Progress Fill */}
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${(monthlyChallenge.progress / monthlyChallenge.target) * 100}%` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black italic text-black">
                      {monthlyChallenge.progress} / {monthlyChallenge.target}
                    </div>
                  </div>

                  {/* Character Icon at the end of progress */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -ml-4 transition-all duration-1000"
                    style={{ left: `${(monthlyChallenge.progress / monthlyChallenge.target) * 100}%` }}
                  >
                    <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xl shadow-xl">
                      {monthlyChallenge.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
          </div>
        )}

        {/* Daily Quests Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Daily Quests</h2>
            <div className="flex items-center gap-2 text-[#ff9600] font-black text-sm">
              <Clock size={18} />
              <span>{timeLeft}</span>
            </div>
          </div>

          <div className="bg-bg-card rounded-2xl border-2 border-border-main divide-y-2 divide-border-main overflow-hidden shadow-sm">
            {dailyQuests.map((quest, index) => {
              const progress = (quest.progress / quest.target) * 100

              return (
                <div key={quest.id} className="p-5 flex items-center gap-4 hover:bg-bg-alt/30 transition-colors">
                  <div className="w-14 h-14 bg-bg-alt rounded-2xl flex items-center justify-center border-2 border-border-main shadow-inner">
                    {getQuestIcon(quest.type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2 leading-tight">
                      {quest.title}
                    </h3>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-4 bg-gray-200 dark:bg-[#37464f] rounded-full overflow-hidden relative border border-black/5">
                        <div
                          className="h-full bg-brand-primary transition-all duration-1000"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white mix-blend-difference">
                          {quest.progress} / {quest.target}
                        </div>
                      </div>

                      <div className="flex-shrink-0 grayscale-[0.5] hover:grayscale-0 transition-all">
                        {getChestIcon(index)}
                      </div>
                    </div>
                  </div>

                  {quest.progress >= quest.target && !quest.claimed && (
                    <div className="ml-2">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                        <CheckCircle size={18} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className="bg-bg-card rounded-2xl p-5 border-2 border-border-main border-dashed flex items-center justify-between group cursor-pointer hover:border-brand-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              <Flame size={20} />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white">Quest Streak</p>
              <p className="text-xs text-text-alt font-bold">Complete all to earn bonus gems!</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-brand-primary transition-all" />
        </div>

      </div>
    </div>
  )
}

export default Quests
