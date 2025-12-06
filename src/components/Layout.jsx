import { NavLink, useNavigate } from 'react-router-dom'
import { User, Flame, Heart, LogOut, BookOpen, Home } from 'lucide-react'
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
      {/* Top Navbar - Desktop */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a2c35]/80 backdrop-blur-md border-b border-[#3c5a6a]/20 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo Text */}
            <span className="text-base font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Adewe
            </span>

            {/* Center Navigation - Hidden on mobile */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Flame className="text-orange-500" size={18} />
                  <span className="text-white font-bold text-sm">{streak}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="text-red-500 fill-red-500" size={18} />
                  <span className="text-white font-bold text-sm">{hearts}</span>
                </div>
              </div>

              {/* Sign Out - Hidden on mobile */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20 md:pb-8 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a2c35] border-t border-[#3c5a6a]/30 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`
            }
          >
            <Home size={22} />
            <span className="text-xs font-medium">Learn</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`
            }
          >
            <User size={22} />
            <span className="text-xs font-medium">Profile</span>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 transition-all"
          >
            <LogOut size={22} />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Layout
