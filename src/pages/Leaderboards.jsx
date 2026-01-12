import { supabase } from '../lib/supabase'
import { getLeagueById } from '../data/leaguesData'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'

function Leaderboards() {
  const { profile } = useAuth()
  const { xp } = useStore()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const leagueId = profile?.league_id || 1
  const currentLeague = getLeagueById(leagueId)

  // League zone rules - Top 5 promote, 6-15 stay, 16+ demote
  const zones = {
    promotion: 5,  // Top 5 advance
    safe: 15,      // 6-15 stay
    demotion: 16   // 16+ demote
  }

  // Calculate time remaining until end of week (Sunday midnight)
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const endOfWeek = new Date()

      // Calculate days until Sunday
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7
      endOfWeek.setDate(now.getDate() + daysUntilSunday)
      endOfWeek.setHours(23, 59, 59, 999)

      const diff = endOfWeek.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeRemaining({ days, hours, minutes, seconds })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        // Fetch users in the same league sorted by XP
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id, username, xp, avatar_url, league_id')
          .eq('league_id', leagueId)
          .order('xp', { ascending: false })
          .limit(50)

        if (error) throw error

        if (users) {
          // Map to helpful format
          const formatted = users.map((u, index) => ({
            ...u,
            rank: index + 1,
            isCurrentUser: u.id === profile?.id,
            avatar: u.avatar_url || '👤'
          }))
          setLeaderboardData(formatted)
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) {
      fetchLeaderboard()
    }
  }, [profile, xp, leagueId])

  const currentUser = leaderboardData.find(u => u.isCurrentUser)

  const getZoneStatus = (rank) => {
    if (rank <= zones.promotion) return 'promotion'
    if (rank <= zones.safe) return 'safe'
    return 'demotion'
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400 fill-yellow-400" size={24} />
      case 2:
        return <Medal className="text-gray-300" size={24} />
      case 3:
        return <Medal className="text-amber-600" size={24} />
      default:
        return <span className="text-gray-400 font-bold text-lg w-6 text-center">{rank}</span>
    }
  }

  // Split leaderboard into zones
  const promotionZone = leaderboardData.filter(u => u.rank <= zones.promotion)
  const safeZone = leaderboardData.filter(u => u.rank > zones.promotion && u.rank <= zones.safe)
  const demotionZone = leaderboardData.filter(u => u.rank > zones.safe)

  return (
    <div className="min-h-screen md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Current User Status - Moved to TOP */}
        {currentUser && (
          <div className="bg-gradient-to-r from-brand-primary/20 to-blue-500/20 rounded-2xl p-4 mb-6 border-2 border-brand-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-primary/30">
                  #{currentUser.rank}
                </div>
                <div>
                  <p className="text-text-main font-black text-lg">YOU</p>
                  <p className="text-text-alt font-bold">{currentUser.xp.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm uppercase tracking-widest px-3 py-1 rounded-full ${getZoneStatus(currentUser.rank) === 'promotion' ? 'bg-emerald-500/20 text-emerald-500' :
                    getZoneStatus(currentUser.rank) === 'demotion' ? 'bg-red-500/20 text-red-500' :
                      'bg-gray-500/20 text-gray-500'
                  }`}>
                  {getZoneStatus(currentUser.rank) === 'promotion' ? 'Promotion' :
                    getZoneStatus(currentUser.rank) === 'demotion' ? 'Demotion' : 'Safe'}
                </p>
                <p className="text-text-alt text-xs font-bold mt-1">
                  {getZoneStatus(currentUser.rank) === 'promotion' ? 'Top 5 advance!' :
                    getZoneStatus(currentUser.rank) === 'demotion' ? 'Need more XP!' : 'Keep pushing!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-brand-primary/30">
            <span className="text-3xl">{currentLeague.icon}</span>
          </div>
          <h1 className="text-2xl font-black text-text-main dark:text-white mb-1 uppercase tracking-wide">
            {currentLeague.name} League
          </h1>
          <p className="text-text-alt font-bold text-sm">Top {zones.promotion} advance to the next league</p>
        </div>

        {/* Time Remaining - Realistic countdown */}
        <div className="bg-bg-card rounded-xl p-4 mb-4 border border-border-main transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand-primary" />
              <span className="text-text-alt font-bold">Time remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-bg-alt px-2 py-1 rounded-lg">
                <span className="text-text-main font-black">{timeRemaining.days}</span>
                <span className="text-text-alt text-xs ml-1">d</span>
              </div>
              <div className="bg-bg-alt px-2 py-1 rounded-lg">
                <span className="text-text-main font-black">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="text-text-alt text-xs ml-1">h</span>
              </div>
              <div className="bg-bg-alt px-2 py-1 rounded-lg">
                <span className="text-text-main font-black">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="text-text-alt text-xs ml-1">m</span>
              </div>
              <div className="bg-bg-alt px-2 py-1 rounded-lg">
                <span className="text-brand-primary font-black">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="text-text-alt text-xs ml-1">s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-bg-card rounded-xl border-2 border-border-main overflow-hidden transition-colors duration-300">
          {/* Promotion Zone - Top 5 */}
          <div className="px-4 py-2 bg-brand-primary/10 border-b border-brand-primary/30">
            <span className="text-brand-primary text-sm font-black tracking-widest">PROMOTION ZONE (Top 5)</span>
          </div>

          {promotionZone.map((u) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main transition-colors ${u.isCurrentUser ? 'bg-brand-primary/10 border-2 border-brand-primary rounded-xl mx-2 my-1' : ''
                }`}
            >
              <div className="w-8 flex justify-center">
                {getRankBadge(u.rank)}
              </div>
              <div className="w-10 h-10 bg-bg-alt rounded-full flex items-center justify-center overflow-hidden border-2 border-border-main shadow-sm">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-black truncate text-sm md:text-base">{u.username}{u.isCurrentUser ? ' (You)' : ''}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-bold truncate">{u.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}

          {/* Safe Zone - 6-15 */}
          {safeZone.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-500/10 border-y border-gray-500/30">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-black tracking-widest">SAFE ZONE (6-15)</span>
              </div>

              {safeZone.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main transition-colors ${u.isCurrentUser ? 'bg-brand-primary/10 border-2 border-brand-primary rounded-xl mx-2 my-1' : ''
                    }`}
                >
                  <div className="w-8 flex justify-center">
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">{u.rank}</span>
                  </div>
                  <div className="w-10 h-10 bg-bg-alt rounded-full flex items-center justify-center overflow-hidden border-2 border-border-main shadow-sm">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-main font-black text-sm md:text-base">{u.username}{u.isCurrentUser ? ' (You)' : ''}</p>
                    <p className="text-text-alt text-xs md:text-sm font-bold">{u.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Demotion Zone - 16+ */}
          {demotionZone.length > 0 && (
            <>
              <div className="px-4 py-2 bg-red-500/10 border-y border-red-500/30">
                <span className="text-red-500 dark:text-red-400 text-sm font-black tracking-widest">DEMOTION ZONE (16+)</span>
              </div>

              {demotionZone.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main last:border-b-0 transition-colors ${u.isCurrentUser ? 'bg-red-500/10 border-2 border-red-500 rounded-xl mx-2 my-1' : ''
                    }`}
                >
                  <div className="w-8 flex justify-center">
                    <span className="text-red-500 dark:text-red-400 font-bold text-lg">{u.rank}</span>
                  </div>
                  <div className="w-10 h-10 bg-bg-alt rounded-full flex items-center justify-center overflow-hidden border-2 border-border-main shadow-sm">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-black text-sm md:text-base">{u.username}{u.isCurrentUser ? ' (You)' : ''}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-bold">{u.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* League Rules Info */}
        <div className="mt-6 bg-bg-card rounded-xl p-4 border-2 border-border-main">
          <h3 className="text-text-main font-black mb-3 uppercase tracking-wide">League Rules</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
              <span className="text-text-alt"><span className="text-brand-primary font-bold">Top 5</span> advance to next league</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-text-alt"><span className="text-gray-400 font-bold">6-15</span> stay in current league</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-text-alt"><span className="text-red-500 font-bold">16+</span> demote to previous league</span>
            </div>
            <div className="mt-3 p-3 bg-bg-alt rounded-lg text-text-alt text-xs">
              <strong>Note:</strong> You need at least 1 XP or 1 completed lesson to participate in league rankings.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboards
