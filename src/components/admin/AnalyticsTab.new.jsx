import { useState, useEffect } from 'react'
import { 
  Users, TrendingUp, Globe, Clock, Activity, Calendar, Target, 
  Award, Flame, AlertCircle, CheckCircle, XCircle, RefreshCw,
  ChevronRight, BarChart2
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

function AnalyticsTab({ users }) {
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

  // Calculate user analytics
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const dailyActive = users.filter(u => new Date(u.updated_at) >= today).length
  const monthlyActive = users.filter(u => new Date(u.updated_at) >= thisMonth).length
  const usersWithLessons = users.filter(u => u.completed_lessons?.length > 0).length
  const completionRate = users.length > 0 ? Math.round((usersWithLessons / users.length) * 100) : 0

  // Language distribution
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

  // Fetch error tracking data
  useEffect(() => {
    fetchErrorData()
  }, [])

  const fetchErrorData = async () => {
    try {
      // Fetch exercise attempts
      const { data: attempts } = await supabase
        .from('exercise_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)

      // Fetch common mistakes
      const { data: mistakes } = await supabase
        .from('common_mistakes')
        .select('*')
        .order('occurrence_count', { ascending: false })
        .limit(20)

      if (attempts) {
        const totalAttempts = attempts.length
        const totalErrors = attempts.filter(a => !a.is_correct).length
        const errorRate = totalAttempts > 0 ? Math.round((totalErrors / totalAttempts) * 100) : 0

        // Group errors by user
        const userErrorMap = {}
        attempts.forEach(a => {
          if (!a.is_correct) {
            if (!userErrorMap[a.user_id]) {
              userErrorMap[a.user_id] = { userId: a.user_id, errors: 0, attempts: 0 }
            }
            userErrorMap[a.user_id].errors++
          }
          if (userErrorMap[a.user_id]) {
            userErrorMap[a.user_id].attempts++
          }
        })

        // Group errors by type
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
          userErrors: Object.values(userErrorMap).sort((a, b) => b.errors - a.errors).slice(0, 10),
          errorsByType: Object.entries(errorTypeMap).map(([type, count]) => ({ type, count })),
          loading: false
        })
      } else {
        setErrorData(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.log('Error tracking tables may not exist yet:', error)
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
      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-brand-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <section.icon size={18} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-gray-500 text-sm">Total Users</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                  <Activity className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{dailyActive}</p>
              <p className="text-gray-500 text-sm">Active Today</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{monthlyActive}</p>
              <p className="text-gray-500 text-sm">Active This Month</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-gray-500 text-sm">Completion Rate</p>
            </div>
          </div>

          {/* Language Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" /> Language Distribution
            </h3>
            <div className="space-y-4">
              {topLanguages.length > 0 ? (
                topLanguages.map((item, index) => {
                  const colors = ['bg-brand-primary', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500']
                  return (
                    <div key={item.lang} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 capitalize font-medium">{item.lang}</span>
                        <span className="text-gray-500">{item.count} users ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[index % colors.length]} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-400 text-center py-4">No language data yet</p>
              )}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" /> Recent Signups
            </h3>
            <div className="space-y-3">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{user.username}</p>
                      <p className="text-gray-500 text-sm">{user.learning_language || 'No language'}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Tracking Section */}
      {activeSection === 'errors' && (
        <div className="space-y-6">
          {/* Error Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart2 className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{errorData.totalAttempts}</p>
              <p className="text-gray-500 text-sm">Total Attempts</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <XCircle className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{errorData.totalErrors}</p>
              <p className="text-gray-500 text-sm">Total Errors</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{errorData.totalAttempts - errorData.totalErrors}</p>
              <p className="text-gray-500 text-sm">Correct Answers</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="text-white" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{errorData.errorRate}%</p>
              <p className="text-gray-500 text-sm">Error Rate</p>
            </div>
          </div>

          {/* Errors by Type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" /> Errors by Type
              </h3>
              <button 
                onClick={fetchErrorData}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            {errorData.loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : errorData.errorsByType.length > 0 ? (
              <div className="space-y-3">
                {errorData.errorsByType.map((item, index) => {
                  const maxCount = Math.max(...errorData.errorsByType.map(e => e.count))
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  return (
                    <div key={item.type} className="flex items-center gap-4">
                      <span className="text-gray-600 text-sm w-32 capitalize">{item.type.replace('_', ' ')}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%`, minWidth: item.count > 0 ? '40px' : '0' }}
                        >
                          <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No error data yet</p>
                <p className="text-gray-400 text-sm">Error tracking will appear here once users start practicing</p>
              </div>
            )}
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-red-500" /> Common Mistakes
            </h3>
            {errorData.commonMistakes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Correct Answer</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Wrong Answer</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-500 font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorData.commonMistakes.map((mistake, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-brand-primary font-medium">{mistake.correct_answer}</td>
                        <td className="py-3 px-4 text-red-500">{mistake.wrong_answer}</td>
                        <td className="py-3 px-4 text-gray-600 capitalize">{mistake.exercise_type}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold">
                            {mistake.occurrence_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No common mistakes recorded yet</p>
              </div>
            )}
          </div>

          {/* Users with Most Errors */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-amber-500" /> Users Needing Help
            </h3>
            {errorData.userErrors.length > 0 ? (
              <div className="space-y-3">
                {errorData.userErrors.map((userError, i) => {
                  const user = users.find(u => u.id === userError.userId)
                  const errorRate = userError.attempts > 0 ? Math.round((userError.errors / userError.attempts) * 100) : 0
                  return (
                    <div key={userError.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user?.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{user?.username || 'Unknown User'}</p>
                          <p className="text-gray-500 text-sm">{user?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-bold">{userError.errors} errors</p>
                        <p className="text-gray-400 text-sm">{userError.attempts} attempts ({errorRate}% error rate)</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No user error data yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Activity Section */}
      {activeSection === 'users' && (
        <div className="space-y-6">
          {/* XP Leaderboard */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-amber-500" /> XP Leaderboard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">XP</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Streak</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                    .slice(0, 10)
                    .map((user, index) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-amber-500' :
                              index === 1 ? 'bg-gray-400' :
                              'bg-orange-400'
                            }`}>
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium pl-2">#{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <span className="text-gray-900 font-medium">{user.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-amber-500 font-bold">{(user.xp || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1 text-orange-500">
                            <Flame size={16} />
                            <span className="font-bold">{user.streak || 0}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.completed_lessons?.length || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Streak Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" /> Streak Distribution
            </h3>
            <div className="space-y-3">
              {[
                { label: '0 days', min: 0, max: 0 },
                { label: '1-7 days', min: 1, max: 7 },
                { label: '8-30 days', min: 8, max: 30 },
                { label: '31-100 days', min: 31, max: 100 },
                { label: '100+ days', min: 101, max: Infinity },
              ].map(range => {
                const count = users.filter(u => (u.streak || 0) >= range.min && (u.streak || 0) <= range.max).length
                const percentage = users.length > 0 ? (count / users.length) * 100 : 0
                return (
                  <div key={range.label} className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm w-24">{range.label}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-lg flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%`, minWidth: count > 0 ? '40px' : '0' }}
                      >
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsTab
