import { useState, useEffect } from 'react'
import {
  Users, TrendingUp, Globe, Clock, Activity, Calendar, Target,
  Award, Flame, AlertCircle, CheckCircle, XCircle, RefreshCw,
  BarChart2, ArrowRight
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'

function AnalyticsTab({ users, onTabChange }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [errorData, setErrorData] = useState({
    totalAttempts: 0,
    totalErrors: 0,
    errorRate: 0,
    commonMistakes: [],
    userErrors: [],
    errorsByType: [],
    loading: true
  })

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const dailyActive = users.filter(u => new Date(u.updated_at) >= today).length
  const monthlyActive = users.filter(u => new Date(u.updated_at) >= thisMonth).length
  const usersWithLessons = users.filter(u => u.completed_lessons?.length > 0).length
  const completionRate = users.length > 0 ? Math.round((usersWithLessons / users.length) * 100) : 0

  const langCounts = users.reduce((acc, u) => {
    if (u.learning_language) {
      acc[u.learning_language] = (acc[u.learning_language] || 0) + 1
    }
    return acc
  }, {})
  const topLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, count, percentage: Math.round((count / users.length) * 100) }))

  const { recentMistakes } = useStore() // Get real-time errors from store

  useEffect(() => {
    fetchErrorData()
  }, [recentMistakes]) // Re-run when local mistakes update

  // Calculate additional User Activity metrics
  const registrationsToday = users.filter(u => new Date(u.created_at) >= today).length
  const totalXp = users.reduce((acc, u) => acc + (u.xp || 0), 0)
  const avgXp = users.length > 0 ? Math.round(totalXp / users.length) : 0
  const totalLessonCompletions = users.reduce((acc, u) => acc + (u.completed_lessons?.length || 0), 0)

  // Calculate hourly activity peaks from recent attempts
  const hourlyActivity = Array(24).fill(0)
  if (errorData.recentAttempts) {
    errorData.recentAttempts.forEach(a => {
      const hour = new Date(a.created_at).getHours()
      hourlyActivity[hour]++
    })
  }

  // Calculate most popular lessons from recent attempts
  const lessonActivityMap = {}
  if (errorData.recentAttempts) {
    errorData.recentAttempts.forEach(a => {
      if (a.lesson_id) {
        lessonActivityMap[a.lesson_id] = (lessonActivityMap[a.lesson_id] || 0) + 1
      }
    })
  }
  const popularLessons = Object.entries(lessonActivityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }))

  const fetchErrorData = async () => {
    try {
      const { data: attempts } = await supabase
        .from('exercise_attempts')
        .select('*, profiles(username, email)')
        .order('created_at', { ascending: false })
        .limit(500)

      const { data: mistakes } = await supabase
        .from('common_mistakes')
        .select('*')
        .order('occurrence_count', { ascending: false })
        .limit(20)

      if (attempts) {
        const totalAttempts = attempts.length
        const totalErrors = attempts.filter(a => !a.is_correct).length
        const errorRate = totalAttempts > 0 ? Math.round((totalErrors / totalAttempts) * 100) : 0

        const userErrorMap = {}
        attempts.forEach(a => {
          if (!a.is_correct && a.user_id) {
            if (!userErrorMap[a.user_id]) {
              userErrorMap[a.user_id] = { userId: a.user_id, errors: 0, attempts: 0 }
            }
            userErrorMap[a.user_id].errors++
          }
          if (a.user_id && userErrorMap[a.user_id]) {
            userErrorMap[a.user_id].attempts++
          }
        })

        const errorTypeMap = {}
        attempts.filter(a => !a.is_correct).forEach(a => {
          const type = a.error_type || a.exercise_type || 'unknown'
          errorTypeMap[type] = (errorTypeMap[type] || 0) + 1
        })

        setErrorData({
          totalAttempts,
          totalErrors,
          errorRate,
          commonMistakes: mistakes || [],
          recentAttempts: attempts,
          userErrors: Object.values(userErrorMap).sort((a, b) => b.errors - a.errors).slice(0, 10),
          errorsByType: Object.entries(errorTypeMap).map(([type, count]) => ({ type, count })),
          loading: false
        })
      } else {
        setErrorData(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setErrorData(prev => ({ ...prev, loading: false }))
    }
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'errors', label: 'Error Tracking', icon: AlertCircle },
    { id: 'users', label: 'User Activity', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${activeSection === section.id
              ? 'bg-brand-primary text-white'
              : 'bg-bg-card text-text-alt hover:bg-bg-alt border border-border-main'
              }`}
          >
            <section.icon size={18} />
            {section.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => onTabChange?.('users')}
              className="bg-gradient-to-br from-blue-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={24} className="text-blue-500" />
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Users className="text-white" size={24} />
              </div>
              <p className="text-3xl font-black text-text-main group-hover:text-blue-500 transition-colors leading-none mb-1">{users.length}</p>
              <p className="text-text-alt text-xs font-black uppercase tracking-widest opacity-60">Total Users</p>
            </div>

            <div
              onClick={() => setActiveSection('users')}
              className="bg-gradient-to-br from-brand-primary/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={24} className="text-brand-primary" />
              </div>
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/20">
                <Activity className="text-white" size={24} />
              </div>
              <p className="text-3xl font-black text-text-main group-hover:text-brand-primary transition-colors leading-none mb-1">{dailyActive}</p>
              <p className="text-text-alt text-xs font-black uppercase tracking-widest opacity-60">Active Today</p>
            </div>

            <div
              onClick={() => setActiveSection('users')}
              className="bg-gradient-to-br from-purple-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={24} className="text-purple-500" />
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Calendar className="text-white" size={24} />
              </div>
              <p className="text-3xl font-black text-text-main group-hover:text-purple-500 transition-colors leading-none mb-1">{monthlyActive}</p>
              <p className="text-text-alt text-xs font-black uppercase tracking-widest opacity-60">Active This Month</p>
            </div>

            <div
              onClick={() => setActiveSection('errors')}
              className="bg-gradient-to-br from-amber-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={24} className="text-amber-500" />
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                <Target className="text-white" size={24} />
              </div>
              <p className="text-3xl font-black text-text-main group-hover:text-amber-500 transition-colors leading-none mb-1">{completionRate}%</p>
              <p className="text-text-alt text-xs font-black uppercase tracking-widest opacity-60">Completion Rate</p>
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" /> Language Distribution
            </h3>
            <div className="space-y-4">
              {topLanguages.length > 0 ? topLanguages.map((item, index) => {
                const colors = ['bg-brand-primary', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500']
                return (
                  <div
                    key={item.lang}
                    onClick={() => onTabChange?.('branding')}
                    className="space-y-4 cursor-pointer group/item hover:bg-bg-alt/50 p-4 rounded-2xl border-2 border-transparent hover:border-border-main transition-all relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[index % colors.length]} shadow-lg shadow-current/20`}>
                          <Globe size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-text-main capitalize font-black group-hover/item:text-brand-primary transition-colors">{item.lang}</p>
                          <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Language Distribution</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-text-main font-black underline decoration-brand-primary/30 decoration-2 underline-offset-4">{item.count} users</p>
                        <p className="text-text-alt font-black tracking-tighter text-xs">{item.percentage}%</p>
                      </div>
                    </div>
                    <div className="h-4 bg-bg-alt rounded-full overflow-hidden border-2 border-border-main/50 group-hover/item:border-brand-primary/30 transition-all p-1">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length].replace('bg-', 'from-')} to-transparent rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden`}
                        style={{ width: `${item.percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all">
                      <ArrowRight size={20} className="text-brand-primary" />
                    </div>
                  </div>
                )
              }) : <p className="text-text-alt text-center py-8 font-black uppercase tracking-widest opacity-40">No language data yet</p>}
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" /> Recent Signups
            </h3>
            <div className="space-y-3">
              {users.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  onClick={() => onTabChange?.('users')}
                  className="flex items-center justify-between p-4 bg-bg-alt/50 rounded-2xl cursor-pointer hover:bg-bg-card hover:border-brand-primary/30 border-2 border-transparent transition-all group hover:shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-white font-black text-lg">{user.username?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-bg-card rounded-full flex items-center justify-center p-0.5 shadow-sm">
                        <div className="w-full h-full bg-green-500 rounded-full border-2 border-white dark:border-bg-card" />
                      </div>
                    </div>
                    <div>
                      <p className="text-text-main font-black tracking-tight group-hover:text-brand-primary transition-colors">{user.username}</p>
                      <p className="text-text-alt text-xs font-bold uppercase tracking-widest opacity-60">
                        {user.learning_language ? `Learning ${user.learning_language}` : 'New Learner'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mb-1">{new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                      <TrendingUp size={12} className="text-brand-primary" />
                      <span className="text-[10px] font-black text-brand-primary uppercase">New Profile</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
                    <ArrowRight size={20} className="text-brand-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'errors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => document.getElementById('error-logs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-br from-blue-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-blue-500" />
              </div>
              <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <BarChart2 className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-blue-500 transition-colors leading-none mb-1">{errorData.totalAttempts}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Total Attempts</p>
            </div>

            <div
              onClick={() => document.getElementById('error-logs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-br from-red-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-red-500" />
              </div>
              <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                <XCircle className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-red-500 transition-colors leading-none mb-1">{errorData.totalErrors}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Total Errors</p>
            </div>

            <div
              onClick={() => document.getElementById('error-logs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-br from-brand-primary/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-brand-primary" />
              </div>
              <div className="w-11 h-11 bg-brand-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/20">
                <CheckCircle className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-brand-primary transition-colors leading-none mb-1">{errorData.totalAttempts - errorData.totalErrors}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Correct Answers</p>
            </div>

            <div
              onClick={() => document.getElementById('error-logs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-br from-amber-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-amber-500" />
              </div>
              <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                <AlertCircle className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-amber-500 transition-colors leading-none mb-1">{errorData.errorRate}%</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Error Rate</p>
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" /> Errors by Type
              </h3>
              <button onClick={fetchErrorData} className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-lg">
                <RefreshCw size={18} />
              </button>
            </div>
            {errorData.loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : errorData.errorsByType.length > 0 ? (
              <div className="space-y-3">
                {errorData.errorsByType.map(item => {
                  const maxCount = Math.max(...errorData.errorsByType.map(e => e.count))
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  return (
                    <div key={item.type} className="flex items-center gap-4">
                      <span className="text-text-alt text-sm w-32 capitalize">{item.type.replace('_', ' ')}</span>
                      <div className="flex-1 h-6 bg-bg-alt rounded-lg overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-end pr-2" style={{ width: `${percentage}%`, minWidth: item.count > 0 ? '40px' : '0' }}>
                          <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={48} className="text-border-main mx-auto mb-3" />
                <p className="text-text-alt">No error data yet</p>
                <p className="text-text-alt opacity-70 text-sm">Error tracking will appear here once users start practicing</p>
              </div>
            )}
          </div>

          <div id="error-logs-section" className="bg-bg-card rounded-xl border border-border-main p-6 scroll-mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Activity size={20} className="text-brand-primary" /> Recent Error Logs
              </h3>
              <button
                onClick={fetchErrorData}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-alt hover:bg-bg-card border border-border-main rounded-lg text-xs font-black uppercase tracking-widest text-text-alt transition-all"
              >
                <RefreshCw size={14} className={errorData.loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto border-2 border-border-main rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-alt text-[10px] font-black uppercase tracking-widest text-text-alt border-b-2 border-border-main">
                    <th className="text-left py-3 px-4">User / Time</th>
                    <th className="text-left py-3 px-4">Language / Lesson</th>
                    <th className="text-left py-3 px-4">Mistake</th>
                    <th className="text-left py-3 px-4">Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border-main">
                  {errorData.recentAttempts?.filter(a => !a.is_correct).slice(0, 20).map((attempt, i) => (
                    <tr
                      key={attempt.id}
                      onClick={() => onTabChange?.('users')}
                      className="hover:bg-bg-alt cursor-pointer transition-colors group border-b border-border-main/30 last:border-0"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-bg-card border-2 border-border-main rounded-xl flex items-center justify-center group-hover:border-brand-primary/30 transition-all shadow-sm">
                            <span className="text-text-main font-black text-sm">{attempt.profiles?.username?.[0]?.toUpperCase() || 'G'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-text-main group-hover:text-brand-primary transition-colors">{attempt.profiles?.username || 'Guest'}</span>
                            <span className="text-[10px] text-text-alt font-bold opacity-60">{new Date(attempt.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          onClick={(e) => { e.stopPropagation(); onTabChange?.('content'); }}
                          className="flex flex-col hover:opacity-80 transition-opacity"
                        >
                          <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest flex items-center gap-1">
                            {attempt.language} <ArrowRight size={10} />
                          </span>
                          <span className="text-[10px] text-text-alt font-black opacity-60 truncate max-w-[120px]">Lesson: {attempt.lesson_id?.slice(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-black line-through opacity-70 w-fit">{attempt.user_answer || 'Skipped'}</span>
                          <span className="px-2 py-0.5 bg-green-500/10 text-brand-primary rounded text-[10px] font-black w-fit">{attempt.correct_answer}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-bg-alt border border-border-main rounded-lg text-[10px] font-black uppercase text-text-alt">
                            {attempt.exercise_type?.replace('_', ' ')}
                          </span>
                          <ArrowRight size={16} className="text-brand-primary opacity-0 group-hover:opacity-40 transition-opacity translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!errorData.recentAttempts || errorData.recentAttempts.filter(a => !a.is_correct).length === 0) && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-text-alt font-bold italic">No recent errors recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-text-alt mt-4 font-bold uppercase tracking-widest opacity-60">Showing last 20 errors with full depth context</p>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-red-500" /> Common Mistakes
            </h3>
            {errorData.commonMistakes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-main">
                      <th className="text-left py-3 px-4 text-text-alt font-medium">Correct Answer</th>
                      <th className="text-left py-3 px-4 text-text-alt font-medium">Wrong Answer</th>
                      <th className="text-left py-3 px-4 text-text-alt font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-text-alt font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorData.commonMistakes.map((mistake, i) => {
                      const formatCell = (val) => {
                        if (!val) return '—'
                        if (typeof val === 'object') {
                          // Try to extract text if it's a common exercise object
                          return val.text || val.learning || val.native || JSON.stringify(val).slice(0, 30) + '...'
                        }
                        return String(val)
                      }
                      return (
                        <tr key={i} className="border-b border-border-main hover:bg-bg-alt transition-colors">
                          <td className="py-3 px-4 text-brand-primary font-bold text-sm">{formatCell(mistake.correct_answer)}</td>
                          <td className="py-3 px-4 text-red-500 font-bold text-sm">{formatCell(mistake.wrong_answer)}</td>
                          <td className="py-3 px-4 text-text-alt capitalize text-xs">{formatCell(mistake.exercise_type)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-black">
                              {mistake.occurrence_count}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-border-main mx-auto mb-3" />
                <p className="text-text-alt">No common mistakes recorded yet</p>
              </div>
            )}
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Users size={20} className="text-amber-500" /> Users Needing Help
            </h3>
            {errorData.userErrors.length > 0 ? (
              <div className="space-y-3">
                {errorData.userErrors.map(userError => {
                  const user = users.find(u => u.id === userError.userId)
                  const errRate = userError.attempts > 0 ? Math.round((userError.errors / userError.attempts) * 100) : 0
                  return (
                    <div
                      key={userError.userId}
                      onClick={() => onTabChange?.('users')}
                      className="flex items-center justify-between p-4 bg-bg-alt rounded-xl cursor-pointer hover:bg-bg-card hover:border-amber-500/30 border border-transparent transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="text-white font-bold">{user?.username?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                        <div>
                          <p className="text-text-main font-medium group-hover:text-amber-500">{user?.username || 'Unknown User'}</p>
                          <p className="text-text-alt text-sm">{user?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-bold">{userError.errors} errors</p>
                        <p className="text-text-alt opacity-70 text-sm">{userError.attempts} attempts ({errRate}% error rate)</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-border-main mx-auto mb-3" />
                <p className="text-text-alt">No user error data yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => onTabChange?.('users')}
              className="bg-gradient-to-br from-green-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-green-500" />
              </div>
              <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                <Users className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-green-500 transition-colors leading-none mb-1">{registrationsToday}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">New Today</p>
            </div>

            <div
              onClick={() => onTabChange?.('analytics')}
              className="bg-gradient-to-br from-amber-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-amber-500" />
              </div>
              <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                <Target className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-amber-500 transition-colors leading-none mb-1">{avgXp.toLocaleString()}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Avg. XP per User</p>
            </div>

            <div
              onClick={() => onTabChange?.('analytics')}
              className="bg-gradient-to-br from-blue-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-blue-500" />
              </div>
              <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <CheckCircle className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-blue-500 transition-colors leading-none mb-1">{totalLessonCompletions.toLocaleString()}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Lesson Completions</p>
            </div>

            <div
              onClick={() => onTabChange?.('branding')}
              className="bg-gradient-to-br from-purple-500/5 to-transparent bg-bg-card rounded-2xl p-6 border border-border-main cursor-pointer hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-40 transition-opacity">
                <ArrowRight size={20} className="text-purple-500" />
              </div>
              <div className="w-11 h-11 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Globe className="text-white" size={22} />
              </div>
              <p className="text-2xl font-black text-text-main group-hover:text-purple-500 transition-colors leading-none mb-1">{Object.keys(langCounts).length}</p>
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest opacity-60">Active Languages</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-bg-card rounded-xl border border-border-main p-6">
              <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" /> Hourly Activity Peaks
              </h3>
              <div className="h-48 flex items-end gap-1 px-2">
                {hourlyActivity.map((count, i) => {
                  const maxCount = Math.max(...hourlyActivity)
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-full bg-blue-500/20 group-hover:bg-blue-500 rounded-t-sm transition-all relative"
                        style={{ height: `${height}%`, minHeight: count > 0 ? '2px' : '0' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-card border border-border-main px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {count} attempts
                        </div>
                      </div>
                      <span className="text-[10px] text-text-alt font-medium rotate-45 mt-1">{i}h</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-center text-text-alt text-xs mt-6 opacity-60 font-medium">Binned activity from last 500 exercise attempts</p>
            </div>

            <div className="bg-bg-card rounded-xl border border-border-main p-6">
              <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <Target size={20} className="text-brand-primary" /> Most Popular Lessons
              </h3>
              {popularLessons.length > 0 ? (
                <div className="space-y-4">
                  {popularLessons.map((item, i) => {
                    const maxCount = popularLessons[0].count
                    const percentage = (item.count / maxCount) * 100
                    return (
                      <div
                        key={item.id}
                        onClick={() => onTabChange?.('content')}
                        className="space-y-1 cursor-pointer group/item"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-text-main font-black uppercase tracking-tight group-hover/item:text-brand-primary transition-colors">Lesson {item.id}</span>
                          <span className="text-text-alt font-black">{item.count} attempts</span>
                        </div>
                        <div className="h-2 bg-bg-alt rounded-full overflow-hidden border border-border-main/50 group-hover/item:border-brand-primary/30 transition-all">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-text-alt opacity-60">
                  <Activity size={48} className="mb-3" />
                  <p>No lesson activity tracked yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <Award size={20} className="text-amber-500" /> XP Leaderboard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-alt">Rank</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-alt">User</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-alt text-right">XP</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-alt text-center">Streak</th>
                    <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-alt text-right">Lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {users.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 10).map((user, index) => (
                    <tr
                      key={user.id}
                      onClick={() => onTabChange?.('users')}
                      className="border-b border-border-main/50 hover:bg-bg-alt/50 cursor-pointer transition-all group relative overflow-hidden"
                    >
                      <td className="py-5 px-4 relative z-10">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30' : index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-400/30' : 'bg-gradient-to-br from-orange-300 to-orange-500 shadow-lg shadow-orange-400/30'}`}>
                            <span className="text-white font-black text-sm">{index + 1}</span>
                          </div>
                        ) : <span className="text-text-alt font-black text-xs pl-2 group-hover:text-text-main transition-colors">#{index + 1}</span>}
                      </td>
                      <td className="py-5 px-4 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 rounded-2xl flex items-center justify-center border-2 border-brand-primary/20 group-hover:border-brand-primary/50 group-hover:scale-105 transition-all shadow-sm">
                            <span className="text-brand-primary font-black text-base">{user.username?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-text-main font-black text-sm tracking-tight group-hover:text-brand-primary transition-colors">{user.username}</span>
                            <span className="text-[10px] text-text-alt font-black uppercase tracking-widest opacity-60 underline decoration-border-main decoration-1 underline-offset-2">{user.email?.split('@')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right relative z-10">
                        <span className="text-amber-500 font-black text-base drop-shadow-sm">{(user.xp || 0).toLocaleString()}</span>
                        <p className="text-[10px] text-text-alt font-black uppercase tracking-widest opacity-40">Total XP</p>
                      </td>
                      <td className="py-5 px-4 relative z-10">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-1.5 text-orange-500">
                            <Flame size={18} fill="currentColor" className="group-hover:animate-bounce drop-shadow-sm" />
                            <span className="font-black text-base">{user.streak || 0}</span>
                          </div>
                          <p className="text-[10px] text-text-alt font-black uppercase tracking-widest opacity-40">Day Streak</p>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right relative z-10">
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-3 py-1 bg-bg-card rounded-lg text-[10px] font-black text-text-alt border-2 border-border-main group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all shadow-sm">
                            {user.completed_lessons?.length || 0} COMPLETED
                          </span>
                          <ArrowRight size={16} className="text-brand-primary opacity-0 group-hover:opacity-40 transition-opacity translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" /> Streak Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                {[
                  { label: '0 days', min: 0, max: 0, color: 'bg-slate-500' },
                  { label: '1-7 days', min: 1, max: 7, color: 'bg-blue-500' },
                  { label: '8-30 days', min: 8, max: 30, color: 'bg-purple-500' },
                  { label: '31-100 days', min: 31, max: 100, color: 'bg-orange-500' },
                  { label: '100+ days', min: 101, max: Infinity, color: 'bg-brand-primary' },
                ].map(range => {
                  const count = users.filter(u => (u.streak || 0) >= range.min && (u.streak || 0) <= range.max).length
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0
                  return (
                    <div key={range.label} className="flex items-center gap-4 group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-alt w-24">{range.label}</span>
                      <div className="flex-1 h-8 bg-bg-alt rounded-xl overflow-hidden border border-border-main p-1">
                        <div
                          className={`h-full ${range.color} rounded-lg flex items-center justify-end pr-2 transition-all duration-1000 group-hover:ring-2 ring-white/20`}
                          style={{ width: `${percentage}%`, minWidth: count > 0 ? '45px' : '0' }}
                        >
                          <span className="text-[10px] font-black text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center p-6 bg-bg-alt rounded-2xl border border-dashed border-border-main">
                <div className="text-center">
                  <Flame size={48} className="text-orange-500 mx-auto mb-3 opacity-20" />
                  <p className="text-text-alt text-sm font-medium">Keep your users engaged to push these bars to the right!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsTab
