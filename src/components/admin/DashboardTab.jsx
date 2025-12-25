import { useState, useEffect } from 'react'
import {
  Users, BookOpen, TrendingUp, Activity, Flame, Globe,
  Heart, Gem, Calendar, Clock, Award, Target, Zap,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react'
import { getFlag } from '../../data/languageFlags'

function StatCard({ icon: Icon, label, value, color, subtext, trend, trendUp }) {
  return (
    <div className="bg-bg-card/70 dark:bg-[#1a2c35]/70 backdrop-blur-md rounded-xl p-5 border border-border-main hover:border-brand-primary/30 transition-all shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={22} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-brand-primary' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-text-main mb-1">{value}</p>
      <p className="text-text-alt text-sm">{label}</p>
      {subtext && <p className="text-xs text-text-alt opacity-70 mt-1">{subtext}</p>}
    </div>
  )
}

function MiniStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-bg-alt dark:bg-[#1a2c35] rounded-lg border border-border-main dark:border-[#37464f]">
      <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="text-white" size={18} />
      </div>
      <div>
        <p className="text-text-main font-bold">{value}</p>
        <p className="text-text-alt text-xs">{label}</p>
      </div>
    </div>
  )
}

function DashboardTab({ stats, users, loading }) {
  const [timeRange, setTimeRange] = useState('today')

  // Calculate comprehensive stats
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeToday = users.filter(u => new Date(u.updated_at) >= today).length
  const activeThisWeek = users.filter(u => new Date(u.updated_at) >= thisWeek).length
  const newThisWeek = users.filter(u => new Date(u.created_at) >= thisWeek).length
  const newThisMonth = users.filter(u => new Date(u.created_at) >= thisMonth).length

  const avgXp = users.length > 0 ? Math.round(stats.totalXp / users.length) : 0
  const totalStreaks = users.reduce((sum, u) => sum + (u.streak || 0), 0)
  const avgStreak = users.length > 0 ? Math.round(totalStreaks / users.length) : 0
  const totalHearts = users.reduce((sum, u) => sum + (u.hearts || 0), 0)
  const totalGems = users.reduce((sum, u) => sum + (u.gems || 0), 0)
  const totalLessonsCompleted = users.reduce((sum, u) => sum + (u.completed_lessons?.length || 0), 0)

  // Users with streaks
  const usersWithStreak = users.filter(u => (u.streak || 0) > 0).length
  const streakPercentage = users.length > 0 ? Math.round((usersWithStreak / users.length) * 100) : 0

  // Top languages
  const topLanguages = users.reduce((acc, u) => {
    if (u.learning_language) {
      acc[u.learning_language] = (acc[u.learning_language] || 0) + 1
    }
    return acc
  }, {})

  const sortedLanguages = Object.entries(topLanguages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // XP distribution
  const xpRanges = [
    { label: 'Beginners (0-100)', min: 0, max: 100, color: 'bg-gray-400' },
    { label: 'Learners (101-500)', min: 101, max: 500, color: 'bg-blue-500' },
    { label: 'Intermediate (501-1000)', min: 501, max: 1000, color: 'bg-purple-500' },
    { label: 'Advanced (1001-5000)', min: 1001, max: 5000, color: 'bg-brand-primary' },
    { label: 'Expert (5000+)', min: 5001, max: Infinity, color: 'bg-yellow-500' },
  ]

  const xpDistribution = xpRanges.map(range => ({
    ...range,
    count: users.filter(u => (u.xp || 0) >= range.min && (u.xp || 0) <= range.max).length
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats at Top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-card/70 backdrop-blur-md rounded-xl p-6 border border-border-main shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-primary">{stats.users}</p>
          <p className="text-text-alt text-sm mt-1">Registered Users</p>
        </div>
        <div className="bg-bg-card/70 backdrop-blur-md rounded-xl p-6 border border-border-main shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-primary">{sortedLanguages.length}</p>
          <p className="text-text-alt text-sm mt-1">Active Languages</p>
        </div>
        <div className="bg-bg-card/70 backdrop-blur-md rounded-xl p-6 border border-border-main shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-primary">{stats.totalXp.toLocaleString()}</p>
          <p className="text-text-alt text-sm mt-1">Total XP Earned</p>
        </div>
        <div className="bg-bg-card/70 backdrop-blur-md rounded-xl p-6 border border-border-main shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-primary">{totalStreaks}</p>
          <p className="text-text-alt text-sm mt-1">Combined Streak Days</p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 dark:from-brand-primary/20 dark:to-brand-primary/10 rounded-xl p-6 border border-brand-primary/20 dark:border-brand-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-text-alt">Here's what's happening with your platform today.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {['today', 'week', 'month'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === range
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-500 dark:text-text-alt hover:bg-gray-100 dark:hover:bg-[#37464f]'
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users.toLocaleString()}
          color="bg-blue-500"
          trend={`+${newThisWeek} this week`}
          trendUp={true}
        />
        <StatCard
          icon={Activity}
          label="Active Today"
          value={activeToday}
          color="bg-brand-primary"
          subtext={`${activeThisWeek} this week`}
        />
        <StatCard
          icon={BookOpen}
          label="Total Lessons"
          value={stats.lessons}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total XP"
          value={stats.totalXp.toLocaleString()}
          color="bg-yellow-500"
          subtext={`${avgXp} avg/user`}
        />
        <StatCard
          icon={Flame}
          label="Active Streaks"
          value={usersWithStreak}
          color="bg-orange-500"
          subtext={`${streakPercentage}% of users`}
        />
        <StatCard
          icon={Target}
          label="Lessons Done"
          value={totalLessonsCompleted}
          color="bg-pink-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStatCard icon={Heart} label="Total Hearts" value={totalHearts.toLocaleString()} color="bg-red-500/20" />
        <MiniStatCard icon={Gem} label="Total Gems" value={totalGems.toLocaleString()} color="bg-blue-500/20" />
        <MiniStatCard icon={Zap} label="Avg Streak" value={`${avgStreak} days`} color="bg-orange-500/20" />
        <MiniStatCard icon={Calendar} label="New This Month" value={newThisMonth} color="bg-brand-primary/20" />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#37464f] shadow-sm">
          <div className="p-4 border-b border-border-main flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main">Recent Users</h2>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{users.length} total</span>
          </div>
          <div className="p-3 space-y-2 max-h-[350px] overflow-y-auto">
            {users.slice(0, 8).map((user, i) => (
              <div key={user.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#2a3f4a] rounded-lg hover:bg-gray-100 dark:hover:bg-[#37464f] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">N</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-text-main text-sm font-medium">{user.username}</p>
                    <p className="text-text-alt text-xs">{getFlag(user.learning_language)} {user.learning_language || 'No language'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 text-sm font-bold">{user.xp || 0}</p>
                  <p className="text-text-alt text-xs">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Languages */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#37464f] shadow-sm">
          <div className="p-4 border-b border-border-main">
            <h2 className="text-lg font-bold text-text-main">Language Distribution</h2>
          </div>
          <div className="p-4 space-y-4">
            {sortedLanguages.length > 0 ? (
              sortedLanguages.map(([lang, count], index) => {
                const percentage = Math.round((count / users.length) * 100)
                const colors = ['bg-brand-primary', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500']
                return (
                  <div key={lang} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getFlag(lang)}</span>
                        <span className="text-text-main capitalize font-medium">{lang}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-text-main font-bold">{count}</span>
                        <span className="text-text-alt text-sm ml-1">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-[#37464f] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Globe size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 dark:text-[#58687a]">No language data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* XP Distribution */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#37464f] shadow-sm">
          <div className="p-4 border-b border-border-main">
            <h2 className="text-lg font-bold text-text-main">User Progress Levels</h2>
          </div>
          <div className="p-4 space-y-3">
            {xpDistribution.map((range, i) => {
              const percentage = users.length > 0 ? Math.round((range.count / users.length) * 100) : 0
              return (
                <div key={range.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${range.color} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-text-alt text-sm">{range.label}</span>
                      <span className="text-text-main font-bold text-sm">{range.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-[#37464f] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${range.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* XP Leaderboard */}
      <div className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#37464f] shadow-sm">
        <div className="p-4 border-b border-border-main dark:border-[#37464f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="text-yellow-400" size={24} />
            <h2 className="text-lg font-bold text-text-main">XP Leaderboard</h2>
          </div>
          <span className="text-text-alt text-sm">Top 10 learners</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#2a3f4a]">
              <tr>
                <th className="text-left p-4 text-text-alt font-medium w-16">Rank</th>
                <th className="text-left p-4 text-text-alt font-medium">User</th>
                <th className="text-left p-4 text-text-alt font-medium">Language</th>
                <th className="text-left p-4 text-text-alt font-medium">XP</th>
                <th className="text-left p-4 text-text-alt font-medium">Streak</th>
                <th className="text-left p-4 text-text-alt font-medium">Lessons</th>
              </tr>
            </thead>
            <tbody>
              {users
                .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                .slice(0, 10)
                .map((user, index) => (
                  <tr key={user.id} className="border-t border-border-main dark:border-[#37464f] hover:bg-gray-50 dark:hover:bg-[#2a3f4a] transition-colors">
                    <td className="p-4">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            'bg-amber-600'
                          }`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-text-alt font-medium pl-2">#{index + 1}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
                          {user.is_admin && (
                            <span className="ml-2 px-1.5 py-0.5 bg-brand-primary/20 text-brand-primary text-xs rounded">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg mr-2">{getFlag(user.learning_language)}</span>
                      <span className="text-text-alt capitalize">{user.learning_language || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-yellow-400 font-bold">{(user.xp || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame size={16} />
                        <span className="font-bold">{user.streak || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-alt">{user.completed_lessons?.length || 0}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default DashboardTab
