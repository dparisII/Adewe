import { NavLink, useNavigate } from 'react-router-dom'
import { User, Flame, Heart, LogOut, BookOpen } from 'lucide-react'
import useStore from '../store/useStore'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { streak, hearts } = useStore()
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#131f24]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a2c35]/80 backdrop-blur-md border-b border-[#3c5a6a]/20 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo Text */}
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Adewe
            </span>

            {/* Center Navigation */}
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                <BookOpen size={16} />
                <span>Learn</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                <User size={16} />
                <span>Profile</span>
              </NavLink>
            </nav>

            {/* Right Side - Stats & Sign Out */}
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="text-orange-500" size={16} />
                  <span className="text-white font-bold text-sm">{streak}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="text-red-500" size={16} />
                  <span className="text-white font-bold text-sm">{hearts}</span>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-12 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout
