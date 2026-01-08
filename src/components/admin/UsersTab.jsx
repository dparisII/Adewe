import { useState } from 'react'
import { Search, Trash2, Shield, Ban, Eye, Mail, Flame, Heart } from 'lucide-react'

function UsersTab({ users, onToggleAdmin, onDeleteUser, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // User to delete
  const [confirmText, setConfirmText] = useState('')

  // Get unique languages
  const languages = [...new Set(users.map(u => u.learning_language).filter(Boolean))]

  // Filter and sort users
  const filteredUsers = users
    .filter(u => {
      const matchesSearch =
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage = !filterLanguage || u.learning_language === filterLanguage
      return matchesSearch && matchesLanguage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'xp': return (b.xp || 0) - (a.xp || 0)
        case 'streak': return (b.streak || 0) - (a.streak || 0)
        case 'username': return (a.username || '').localeCompare(b.username || '')
        default: return new Date(b.created_at) - new Date(a.created_at)
      }
    })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <div className="relative flex-1 min-w-full sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-alt" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border-main rounded-xl text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-3 bg-bg-card border border-border-main rounded-xl text-text-main focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-3 bg-bg-card border border-border-main rounded-xl text-text-main focus:outline-none focus:border-brand-primary"
          >
            <option value="created_at">Newest First</option>
            <option value="xp">Highest XP</option>
            <option value="streak">Highest Streak</option>
            <option value="username">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-4 text-sm">
        <span className="text-text-alt">
          Showing <span className="text-text-main font-bold">{filteredUsers.length}</span> of {users.length} users
        </span>
        <span className="text-text-alt">
          Admins: <span className="text-brand-primary font-bold">{users.filter(u => u.is_admin).length}</span>
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-alt dark:bg-[#2a3f4a]">
              <tr>
                <th className="text-left p-4 text-text-alt font-medium">User</th>
                <th className="text-left p-4 text-text-alt font-medium">Stats</th>
                <th className="text-left p-4 text-text-alt font-medium">Native</th>
                <th className="text-left p-4 text-text-alt font-medium">Joined</th>
                <th className="text-left p-4 text-text-alt font-medium">Role</th>
                <th className="text-left p-4 text-text-alt font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t border-border-main dark:border-[#37464f] hover:bg-bg-alt dark:hover:bg-[#2a3f4a]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.username?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-text-main font-medium">{user.username}</p>
                        <p className="text-text-alt text-sm">{user.email}</p>
                        {user.phone && <p className="text-text-alt opacity-70 text-xs">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{user.xp || 0}</p>
                        <p className="text-text-alt text-xs">XP</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame size={14} />
                          <span className="font-bold">{user.streak || 0}</span>
                        </div>
                        <p className="text-text-alt text-xs">Streak</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-red-400">
                          <Heart size={14} />
                          <span className="font-bold">{user.hearts || 0}</span>
                        </div>
                        <p className="text-text-alt text-xs">Hearts</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full capitalize">
                      {user.native_language || 'Not set'}
                    </span>
                  </td>
                  <td className="p-4 text-text-alt text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onToggleAdmin(user.id, user.is_admin)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${user.is_admin
                        ? 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30'
                        : 'bg-bg-alt text-text-alt hover:bg-border-main'
                        }`}
                    >
                      {user.is_admin ? '👑 Admin' : 'User'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-text-alt hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#37464f] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirm(user)
                          setConfirmText('')
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-md" style={{ margin: 0, padding: '1rem' }}>
          <div className="bg-bg-card dark:bg-[#131f24] rounded-[32px] w-full max-w-lg shadow-2xl border-2 border-border-main dark:border-[#37464f] max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border-main flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-main">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-text-alt hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {selectedUser.username?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main">{selectedUser.username}</h3>
                  <p className="text-text-alt">{selectedUser.email}</p>
                  {selectedUser.is_admin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-primary/20 text-brand-primary text-xs rounded-full mt-1">
                      <Shield size={12} /> Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-alt rounded-lg p-4 border border-border-main">
                  <p className="text-text-alt text-sm">XP</p>
                  <p className="text-2xl font-bold text-yellow-400">{selectedUser.xp || 0}</p>
                </div>
                <div className="bg-bg-alt rounded-lg p-4 border border-border-main">
                  <p className="text-text-alt text-sm">Streak</p>
                  <p className="text-2xl font-bold text-orange-400">{selectedUser.streak || 0} 🔥</p>
                </div>
                <div className="bg-bg-alt rounded-lg p-4 border border-border-main">
                  <p className="text-text-alt text-sm">Hearts</p>
                  <p className="text-2xl font-bold text-red-400">{selectedUser.hearts || 0} ❤️</p>
                </div>
                <div className="bg-bg-alt rounded-lg p-4 border border-border-main">
                  <p className="text-text-alt text-sm">Gems</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedUser.gems || 0} 💎</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Phone</span>
                  <span className="text-text-main">{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Native Language</span>
                  <span className="text-text-main capitalize font-black">{selectedUser.native_language || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Active Course</span>
                  <span className="text-text-main capitalize font-black text-brand-primary">{selectedUser.learning_language || 'Not set'}</span>
                </div>

                {/* Multiple Learning Languages - ensuring we show at least the current one */}
                <div className="mt-4 pt-4 border-t border-border-main">
                  <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-3">All Languages Learning</h4>
                  <div className="space-y-2">
                    {/* Map language_progress if it exists, otherwise fallback to at least showing the learning_language */}
                    {selectedUser.language_progress && selectedUser.language_progress.length > 0 ? (
                      selectedUser.language_progress.map((lang, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-bg-alt dark:bg-[#202f36] p-3 rounded-2xl border-2 border-border-main">
                          <div className="flex items-center gap-2">
                            <span className="text-text-main capitalize font-bold">{lang.code}</span>
                            {lang.code === selectedUser.learning_language && (
                              <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                            )}
                          </div>
                          <span className="text-yellow-500 font-black">Section {lang.currentSection || 0}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center text-sm bg-bg-alt dark:bg-[#202f36] p-3 rounded-2xl border-2 border-border-main">
                        <div className="flex items-center gap-2">
                          <span className="text-text-main capitalize font-bold">{selectedUser.learning_language || 'Not set'}</span>
                          <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                        </div>
                        <span className="text-yellow-500 font-black">Section 0</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Lessons Completed</span>
                  <span className="text-text-main">{selectedUser.completed_lessons?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Sections Progress</span>
                  <span className="text-text-main">{selectedUser.progress ? Object.keys(selectedUser.progress).length : 0} sections</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-alt">Joined</span>
                  <span className="text-text-main">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Sections Detail */}
              {selectedUser.progress && Object.keys(selectedUser.progress).length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-main dark:border-[#37464f]">
                  <h4 className="text-sm font-bold text-text-main mb-2">Section Progress</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {Object.entries(selectedUser.progress).map(([section, data]) => (
                      <div key={section} className="flex justify-between text-xs">
                        <span className="text-text-alt">Section {section}</span>
                        <span className="text-text-main font-medium">{data.completed || 0} lessons</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    onToggleAdmin(selectedUser.id, selectedUser.is_admin)
                    setSelectedUser(null)
                  }}
                  className="flex-1 py-3 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors font-bold"
                >
                  {selectedUser.is_admin ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => {
                    onDeleteUser(selectedUser.id)
                    setSelectedUser(null)
                  }}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-bold"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] backdrop-blur-md" style={{ margin: 0, padding: '1rem' }}>
          <div className="bg-bg-card dark:bg-[#131f24] rounded-[32px] w-full max-w-md border-2 border-red-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
              <h2 className="text-xl font-black text-red-500 uppercase tracking-wide">⚠️ Delete User</h2>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-2 hover:bg-bg-alt rounded-lg text-text-alt hover:text-text-main"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-text-main font-bold">
                You are about to permanently delete the user:
              </p>
              <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/20">
                <p className="font-black text-red-400">{deleteConfirm.username}</p>
                <p className="text-sm text-text-alt">{deleteConfirm.email}</p>
              </div>

              <p className="text-text-alt text-sm">
                This action cannot be undone. Type <span className="font-black text-red-500">{deleteConfirm.username}</span> to confirm:
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type ${deleteConfirm.username} to confirm`}
                className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-red-500 text-center uppercase tracking-widest"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 duo-btn duo-btn-white"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    if (confirmText.toLowerCase() === deleteConfirm.username.toLowerCase()) {
                      onDeleteUser(deleteConfirm.id)
                      setDeleteConfirm(null)
                      setConfirmText('')
                    }
                  }}
                  disabled={confirmText.toLowerCase() !== deleteConfirm.username.toLowerCase()}
                  className={`flex-1 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${confirmText.toLowerCase() === deleteConfirm.username.toLowerCase()
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_0_#b91c1c]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  DELETE USER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default UsersTab
