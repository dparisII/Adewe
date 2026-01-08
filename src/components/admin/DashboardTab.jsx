import { useState, useEffect } from 'react'
import {
  Users, BookOpen, TrendingUp, Activity, Flame, Globe,
  Heart, Gem, Calendar, Clock, Award, Target, Zap,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Trash2, Filter, RefreshCw,
  ArrowRight
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getFlag } from '../../data/languageFlags'
import Modal from '../Modal'

function StatCard({ icon: Icon, label, value, color, subtext, trend, trendUp, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card rounded-2xl p-6 border border-border-main transition-all relative overflow-hidden group ${onClick ? 'cursor-pointer hover:border-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/5 active:scale-[0.98]' : ''}`}
    >
      <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-40 transition-opacity ${onClick ? 'block' : 'hidden'}`}>
        <ArrowRight size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-text-main mb-1 group-hover:text-brand-primary transition-colors leading-none">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-text-alt opacity-60">{label}</p>
      {subtext && <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-2">{subtext}</p>}
    </div>
  )
}

function MiniStatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 bg-bg-card rounded-2xl border border-border-main transition-all relative overflow-hidden group ${onClick ? 'cursor-pointer hover:border-brand-primary/50 hover:shadow-lg active:scale-[0.98]' : ''}`}
    >
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon className={color.replace('bg-', 'text-').replace('/20', '') || 'text-white'} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-black text-text-main leading-none mb-1 truncate">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-text-alt opacity-60 truncate">{label}</p>
      </div>
      {onClick && (
        <ArrowRight size={14} className="text-text-alt opacity-0 group-hover:opacity-40 transition-opacity" />
      )}
    </div>
  )
}

const AreaChart = ({ data, dataKey, color, label, gradientColor }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!data || data.length === 0) return (
    <div className="h-40 flex items-center justify-center text-text-alt text-xs font-bold bg-bg-alt/30 rounded-2xl border-2 border-border-main/50">
      No data available
    </div>
  )

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0), 1)
  const max = maxValue * 1.2 // Add 20% headroom
  const min = 0

  // Generate points for SVG
  const getX = (i) => (i / (data.length - 1 || 1)) * 300
  const getY = (val) => 100 - ((val - min) / (max - min)) * 100

  const points = data.map((d, i) => `${getX(i)},${getY(d[dataKey] || 0)}`).join(' ')
  const areaPath = `M0,100 L${points} L300,100 Z`
  const linePath = `M${points}`

  return (
    <div className="h-48 mb-8 bg-bg-alt/30 p-4 rounded-2xl border-2 border-border-main/50 relative group">
      <div className="absolute top-2 right-4 text-xs font-black text-text-alt uppercase tracking-widest opacity-50">
        Max: {Math.round(maxValue)}
      </div>

      <svg
        viewBox="0 0 300 100"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 300
          const index = Math.round((x / 300) * (data.length - 1))
          setHoveredIndex(Math.max(0, Math.min(data.length - 1, index)))
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area */}
        <path d={areaPath} fill={`url(#gradient-${label})`} className="transition-all duration-300" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover Guide Line */}
        {hoveredIndex !== null && (
          <line
            x1={getX(hoveredIndex)} y1="0"
            x2={getX(hoveredIndex)} y2="100"
            stroke={color} strokeWidth="1" strokeDasharray="4" opacity="0.5"
          />
        )}

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)} cy={getY(d[dataKey] || 0)}
            r={hoveredIndex === i ? "5" : "3"}
            fill={hoveredIndex === i ? color : "white"}
            stroke={color} strokeWidth="2"
            className="transition-all duration-200"
          />
        ))}

        {/* Stable Tooltip Implementation */}
        {hoveredIndex !== null && (
          <g transform={`translate(${getX(hoveredIndex)}, ${getY(data[hoveredIndex][dataKey] || 0)})`}>
            <g transform="translate(0, -15)">
              <rect x="-35" y="-25" width="70" height="25" rx="6" fill="#1e1e1e" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
              <text y="-8" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" style={{ pointerEvents: 'none' }}>
                {data[hoveredIndex][dataKey] || 0} {label}
              </text>
              {/* Arrow pointing down */}
              <path d="M-4,-2 L0,2 L4,-2" fill="none" stroke="#1e1e1e" strokeWidth="4" />
            </g>
          </g>
        )}
      </svg>

      {/* X Axis Labels */}
      <div className="flex justify-between mt-3 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] font-black text-text-alt uppercase tracking-tighter w-0 overflow-visible text-center whitespace-nowrap">
            {d.date.split(',')[0]}
          </span>
        ))}
      </div>
    </div>
  )
}

function DashboardTab({ stats, users, loading, onRefresh, onTabChange }) {
  const [timeRange, setTimeRange] = useState('today')
  const [showVisitorDetails, setShowVisitorDetails] = useState(false)
  const [showPageViewDetails, setShowPageViewDetails] = useState(false)
  const [logFilter, setLogFilter] = useState('all') // all, user, guest
  const [daysFilter, setDaysFilter] = useState('7d') // 24h, 7d, 30d, all
  const [isResetting, setIsResetting] = useState(false)

  const handleResetLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all visitor logs? This cannot be undone.')) return

    setIsResetting(true)
    try {
      // Try RPC first, fallback to delete
      const { error } = await supabase.rpc('clear_site_visits')

      if (error && error.code !== '42883') { // Ignore function missing error
        // Fallback to direct delete if policy allows
        await supabase.from('site_visits').delete().neq('id', 0)
      } else if (error) {
        await supabase.from('site_visits').delete().neq('id', 0)
      }

      if (onRefresh) onRefresh()
      setShowVisitorDetails(false)
      setShowPageViewDetails(false)
    } catch (err) {
      console.error('Error resetting logs:', err)
    } finally {
      setIsResetting(false)
    }
  }

  // Filter logic
  const getFilteredVisits = () => {
    const visits = stats.visits || []
    const now = new Date()

    return visits.filter(v => {
      // Type filter
      if (logFilter === 'user' && !v.user_id) return false
      if (logFilter === 'guest' && v.user_id) return false // Assuming guest has null user_id? Check logs. Yes.

      // Date filter
      const visitDate = new Date(v.created_at)
      if (daysFilter === '24h' && (now - visitDate) > 24 * 60 * 60 * 1000) return false
      if (daysFilter === '7d' && (now - visitDate) > 7 * 24 * 60 * 60 * 1000) return false
      if (daysFilter === '30d' && (now - visitDate) > 30 * 24 * 60 * 60 * 1000) return false

      return true
    })
  }

  const filteredVisits = getFilteredVisits()

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

  // Process visits for daily breakdown (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    return d
  }).reverse()

  const dailyStats = last7Days.map(day => {
    const dayStr = day.toDateString()
    const dayVisits = (stats.visits || []).filter(v => new Date(v.created_at).toDateString() === dayStr)
    const uniqueDayVisits = new Set(dayVisits.map(v => v.visitor_id)).size
    return {
      date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: dayVisits.length,
      visitors: uniqueDayVisits
    }
  })

  const VisitTable = ({ visits }) => (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-bg-alt p-1 rounded-lg border border-border-main">
          <button
            onClick={() => setLogFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${logFilter === 'all' ? 'bg-bg-card shadow-sm text-text-main' : 'text-text-alt hover:bg-bg-card/50'}`}
          >
            All Inputs
          </button>
          <button
            onClick={() => setLogFilter('user')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${logFilter === 'user' ? 'bg-bg-card shadow-sm text-brand-primary' : 'text-text-alt hover:bg-bg-card/50'}`}
          >
            Users
          </button>
          <button
            onClick={() => setLogFilter('guest')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${logFilter === 'guest' ? 'bg-bg-card shadow-sm text-blue-500' : 'text-text-alt hover:bg-bg-card/50'}`}
          >
            Visitors
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
            className="px-3 py-2 bg-bg-alt border border-border-main rounded-lg text-xs font-bold text-text-main outline-none focus:border-brand-primary"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleResetLogs}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-black uppercase tracking-wide transition-all disabled:opacity-50"
          >
            {isResetting ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden border-2 border-border-main rounded-2xl shadow-sm">
        <div className="bg-bg-alt/80 backdrop-blur-sm p-3 border-b-2 border-border-main grid grid-cols-3 text-[10px] font-black uppercase tracking-widest text-text-alt">
          <span>Time / Date</span>
          <span>Device / IP</span>
          <span className="text-right">Action</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto divide-y divide-border-main/50 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
          {visits.length === 0 ? (
            <div className="p-8 text-center text-text-alt font-bold italic flex flex-col items-center gap-2">
              <Filter size={24} className="opacity-20" />
              <span>No logs found matching filters</span>
            </div>
          ) : visits.map((v, i) => {
            const meta = typeof v.metadata === 'string' ? JSON.parse(v.metadata || '{}') : (v.metadata || {})
            return (
              <div key={i} className="p-3 grid grid-cols-3 items-center hover:bg-bg-alt/50 transition-colors group">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-main tabular-nums group-hover:text-brand-primary transition-colors">{new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[10px] text-text-alt">{new Date(v.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-brand-primary truncate" title={meta.user_agent}>
                    {meta.browser || 'Browser'} • {meta.os || 'OS'}
                  </span>
                  <span className="text-[10px] text-text-alt font-mono opacity-70">{meta.ip || 'Unknown IP'}</span>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${v.user_id
                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                    {v.user_id ? 'User' : 'Visitor'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Layer 1: Traffic Stats - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setShowPageViewDetails(true)}
          className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl p-8 border-2 border-brand-primary/20 shadow-lg text-center backdrop-blur-md hover:border-brand-primary/50 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <Activity className="text-white" size={32} />
          </div>
          <p className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.totalViews?.toLocaleString() || 0}</p>
          <p className="text-brand-primary font-black uppercase tracking-widest text-sm">Total Page Views</p>
          <p className="text-xs text-text-alt mt-2 font-bold uppercase tracking-widest flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100">
            View Analytics <TrendingUp size={14} />
          </p>
        </button>
        <button
          onClick={() => setShowVisitorDetails(true)}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-8 border-2 border-blue-500/20 shadow-lg text-center backdrop-blur-md hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <Users className="text-white" size={32} />
          </div>
          <p className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.totalVisitors?.toLocaleString() || 0}</p>
          <p className="text-blue-500 font-black uppercase tracking-widest text-sm">Unique Visitors</p>
          <p className="text-xs text-text-alt mt-2 font-bold uppercase tracking-widest flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100">
            View Statistics <TrendingUp size={14} />
          </p>
        </button>
      </div>

      {/* Page Views Detail Modal */}
      <Modal
        isOpen={showPageViewDetails}
        onClose={() => setShowPageViewDetails(false)}
        title="Traffic Breakdown"
        maxWidth="max-w-2xl"
      >
        <p className="text-text-alt font-bold uppercase tracking-widest text-xs mb-4">Daily Page View Trends</p>

        {/* Daily Schedule - Area Chart */}
        <AreaChart
          data={dailyStats}
          dataKey="views"
          color="#58cc02"
          gradientColor="#58cc02"
          label="Views"
        />

        <div className="flex items-center gap-3 mb-2">
          <Activity size={18} className="text-brand-primary" />
          <h4 className="font-black text-text-main uppercase tracking-widest text-sm">Recent Activity Log</h4>
        </div>
        <VisitTable visits={filteredVisits} />
      </Modal>

      {/* Unique Visitors Detail Modal */}
      <Modal
        isOpen={showVisitorDetails}
        onClose={() => setShowVisitorDetails(false)}
        title="Visitor Insights"
        maxWidth="max-w-2xl"
      >
        <p className="text-text-alt font-bold uppercase tracking-widest text-xs mb-4">Reach & Conversion Analytics</p>

        {/* Daily Schedule for Visitors - Area Chart */}
        <AreaChart
          data={dailyStats}
          dataKey="visitors"
          color="#3b82f6"
          gradientColor="#3b82f6"
          label="Visitors"
        />

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main text-center">
            <p className="text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Total Reach</p>
            <p className="text-2xl font-black text-text-main">{stats.totalVisitors}</p>
          </div>
          <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main text-center">
            <p className="text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Registered</p>
            <p className="text-2xl font-black text-text-main">{stats.users}</p>
          </div>
          <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main text-center">
            <p className="text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Conv. Rate</p>
            <p className="text-2xl font-black text-brand-primary">
              {stats.totalVisitors > 0 ? ((stats.users / stats.totalVisitors) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Users size={18} className="text-blue-500" />
          <h4 className="font-black text-text-main uppercase tracking-widest text-sm">Visitor Device Log</h4>
        </div>
        <VisitTable visits={filteredVisits} />
      </Modal>

      {/* Layer 2: Platform Stats - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onTabChange?.('users')}
          className="bg-bg-card rounded-xl p-6 border-2 border-border-main shadow-sm text-center hover:border-brand-primary/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
        >
          <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{stats.users}</p>
          <p className="text-text-alt text-xs font-black uppercase tracking-wider mt-1">Registered Users</p>
        </div>
        <div
          onClick={() => onTabChange?.('branding')}
          className="bg-bg-card rounded-xl p-6 border-2 border-border-main shadow-sm text-center hover:border-brand-primary/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
        >
          <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{Object.keys(topLanguages).length}</p>
          <p className="text-text-alt text-xs font-black uppercase tracking-wider mt-1">Active Languages</p>
        </div>
        <div
          onClick={() => onTabChange?.('analytics')}
          className="bg-bg-card rounded-xl p-6 border-2 border-border-main shadow-sm text-center hover:border-brand-primary/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
        >
          <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{stats.totalXp.toLocaleString()}</p>
          <p className="text-text-alt text-xs font-black uppercase tracking-wider mt-1">Total XP Earned</p>
        </div>
        <div
          onClick={() => onTabChange?.('analytics')}
          className="bg-bg-card rounded-xl p-6 border-2 border-border-main shadow-sm text-center hover:border-brand-primary/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
        >
          <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{totalStreaks}</p>
          <p className="text-text-alt text-xs font-black uppercase tracking-wider mt-1">Combined Streak Days</p>
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
          onClick={() => onTabChange?.('users')}
        />
        <StatCard
          icon={Activity}
          label="Active Today"
          value={activeToday}
          color="bg-brand-primary"
          subtext={`${activeThisWeek} this week`}
          onClick={() => onTabChange?.('analytics')}
        />
        <StatCard
          icon={BookOpen}
          label="Total Lessons"
          value={stats.lessons}
          color="bg-purple-500"
          onClick={() => onTabChange?.('content')}
        />
        <StatCard
          icon={TrendingUp}
          label="Total XP"
          value={stats.totalXp.toLocaleString()}
          color="bg-yellow-500"
          subtext={`${avgXp} avg/user`}
          onClick={() => onTabChange?.('analytics')}
        />
        <StatCard
          icon={Flame}
          label="Active Streaks"
          value={usersWithStreak}
          color="bg-orange-500"
          subtext={`${streakPercentage}% of users`}
          onClick={() => onTabChange?.('analytics')}
        />
        <StatCard
          icon={Target}
          label="Lessons Done"
          value={totalLessonsCompleted}
          color="bg-pink-500"
          onClick={() => onTabChange?.('analytics')}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStatCard
          icon={Heart}
          label="Total Hearts"
          value={totalHearts.toLocaleString()}
          color="bg-red-500/10"
          onClick={() => onTabChange?.('analytics')}
        />
        <MiniStatCard
          icon={Gem}
          label="Total Gems"
          value={totalGems.toLocaleString()}
          color="bg-blue-500/10"
          onClick={() => onTabChange?.('analytics')}
        />
        <MiniStatCard
          icon={Zap}
          label="Avg Streak"
          value={`${avgStreak} days`}
          color="bg-orange-500/10"
          onClick={() => onTabChange?.('analytics')}
        />
        <MiniStatCard
          icon={Calendar}
          label="New This Month"
          value={newThisMonth}
          color="bg-brand-primary/10"
          onClick={() => onTabChange?.('users')}
        />
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
              <div
                key={user.id}
                onClick={() => onTabChange?.('users')}
                className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#2a3f4a] rounded-lg hover:bg-gray-100 dark:hover:bg-[#37464f] hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
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
                    <p className="text-text-main text-sm font-medium group-hover:text-brand-primary transition-colors">{user.username}</p>
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
                  <tr
                    key={user.id}
                    onClick={() => onTabChange?.('users')}
                    className="border-t border-border-main dark:border-[#37464f] hover:bg-gray-50 dark:hover:bg-[#2a3f4a] cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            'bg-amber-600'
                          }`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-text-alt font-medium pl-2 group-hover:text-text-main transition-colors">#{index + 1}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="text-white text-sm font-bold">
                            {user.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium group-hover:text-brand-primary transition-colors">{user.username}</span>
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
                        <Flame size={16} className="group-hover:animate-bounce" />
                        <span className="font-bold">{user.streak || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-alt tabular-nums">{user.completed_lessons?.length || 0}</td>
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
