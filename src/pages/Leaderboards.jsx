import { supabase } from '../lib/supabase'
import { getLeagueById } from '../data/leaguesData'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useStore from '../store/useStore'
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function Leaderboards() {
  const { profile } = useAuth()
  const { xp } = useStore()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const leagueId = profile?.league_id || 1
  const currentLeague = getLeagueById(leagueId)

  // Calculate zones based on the current league's rules and active user count
  const zones = {
    promotion: currentLeague.promoteTop,
    demotion: currentLeague.demoteBottom
  }

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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-brand-primary" />
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-gray-500" />
    }
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

  return (
    <div className="min-h-screen md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
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

        {/* Time Remaining */}
        <div className="bg-bg-card rounded-xl p-3 mb-4 border border-border-main transition-colors duration-300">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Time remaining</span>
            <span className="text-text-main dark:text-white font-bold">6 days 23 hours</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-bg-card rounded-xl border-2 border-border-main overflow-hidden transition-colors duration-300">
          {/* Promotion Zone */}
          <div className="px-4 py-2 bg-brand-primary/10 border-b border-brand-primary/30">
            <span className="text-brand-primary text-sm font-black tracking-widest">PROMOTION ZONE</span>
          </div>

          {leaderboardData.slice(0, zones.promotion).map((u) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main transition-colors ${u.isCurrentUser ? 'bg-brand-primary/10 border-2 border-brand-primary rounded-xl mx-2' : ''
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

          {/* Safe Zone */}
          <div className="px-4 py-2 bg-gray-500/10 border-y border-gray-500/30">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-black tracking-widest">SAFE ZONE</span>
          </div>

          {leaderboardData.slice(zones.promotion, Math.max(zones.promotion, leaderboardData.length - zones.demotion)).map((u) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main transition-colors ${u.isCurrentUser ? 'bg-brand-primary/10 border-2 border-brand-primary rounded-xl mx-2' : ''
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

          {zones.demotion > 0 && leaderboardData.length > zones.demotion && (
            <div className="px-4 py-2 bg-red-500/10 border-y border-red-500/30">
              <span className="text-red-500 dark:text-red-400 text-sm font-black tracking-widest">DEMOTION ZONE</span>
            </div>
          )}

          {leaderboardData.length > 0 && leaderboardData.slice(Math.max(0, leaderboardData.length - zones.demotion)).map((u) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 border-b border-border-main last:border-b-0 transition-colors ${u.isCurrentUser ? 'bg-brand-primary/10 border-2 border-brand-primary rounded-xl mx-2' : ''
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
                <p className="text-gray-900 dark:text-white font-black text-sm md:text-base">{u.username}{u.isCurrentUser ? ' (You)' : ''}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-bold">{u.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}
        </div>

        {/* League Info */}
        <div className="mt-6 space-y-4">
          <div className="bg-bg-card rounded-xl p-4 border-2 border-border-main transition-colors duration-300">
            <h3 className="text-gray-900 dark:text-white font-black mb-2 uppercase tracking-wide">Your Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-bold">Current Rank:</span>
                <span className="text-gray-900 dark:text-white font-black">#{currentUser?.rank || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-bold">Your XP:</span>
                <span className="text-gray-900 dark:text-white font-black">{(currentUser?.xp || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-bold">Status:</span>
                <span className={`font-black uppercase tracking-wide ${currentUser && currentUser.rank <= zones.promotion ? 'text-brand-primary' :
                  currentUser && currentUser.rank > leaderboardData.length - zones.demotion ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                  {currentUser && currentUser.rank <= zones.promotion ? 'Promotion Zone' :
                    currentUser && currentUser.rank > leaderboardData.length - zones.demotion ? 'Demotion Zone' :
                      'Safe Zone'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Complete lessons to earn XP and climb the leaderboard!
            </p>
          </div>
        </div>
      </div>
      {/* Sticky Bottom Rank Bar */}
      {currentUser && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 lg:right-80 bg-bg-card/95 backdrop-blur-md border-t-4 border-brand-primary/20 z-40 px-6 py-4 animate-slide-up shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-brand-primary/20">
                #{currentUser.rank}
              </div>
              <div>
                <p className="text-text-main font-black leading-none mb-1">YOU</p>
                <p className="text-text-alt text-xs font-bold uppercase tracking-widest">{currentUser.xp.toLocaleString()} XP</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className={`font-black text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full ${currentUser.rank <= zones.promotion ? 'bg-emerald-500/10 text-emerald-500' :
                currentUser.rank > leaderboardData.length - zones.demotion ? 'bg-red-500/10 text-red-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                {currentUser.rank <= zones.promotion ? 'Promotion' :
                  currentUser.rank > leaderboardData.length - zones.demotion ? 'Demotion' :
                    'Safe'}
              </p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mt-1">
                {currentUser.rank <= zones.promotion ? 'Top 10 advance' : 'Keep pushing!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboards
