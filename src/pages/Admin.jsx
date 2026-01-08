import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Users, BookOpen, BarChart3,
  ArrowLeft, Shield, Crown, AlertTriangle, Palette,
  FileText, CreditCard, Mic, Home, Menu, X, ChevronLeft, ChevronRight, Megaphone,
  LayoutDashboard, Globe, ShoppingBag
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import { supabase } from '../lib/supabase'

// Import admin tab components
import DashboardTab from '../components/admin/DashboardTab'
import UsersTab from '../components/admin/UsersTab'
import ContentTab from '../components/admin/ContentTab'
import BrandingTab from '../components/admin/BrandingTab'
import LegalTab from '../components/admin/LegalTab'
import PaymentsTab from '../components/admin/PaymentsTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'

import HasabAITab from '../components/admin/HasabAITab'
import AdsTab from '../components/admin/AdsTab'
import CommunitySettingsTab from '../components/admin/CommunitySettingsTab'
import ShopManagementTab from '../components/admin/ShopManagementTab' // Added ShopManagementTab

// Tab configuration
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-brand-primary' }, // Changed icon to LayoutDashboard
  { id: 'community', label: 'Community', icon: Globe, color: 'text-brand-primary' }, // Changed id to 'community' and icon to Globe
  { id: 'shop', label: 'Shop', icon: ShoppingBag, color: 'text-green-500' }, // Added Shop tab
  { id: 'users', label: 'Users', icon: Users, color: 'text-[#ffc800]' },
  { id: 'content', label: 'Content', icon: BookOpen, color: 'text-[#ff9600]' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-[#ce82ff]' },
  { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-[#1cb0f6]' },
  { id: 'branding', label: 'Branding', icon: Palette, color: 'text-[#ff4b4b]' },
  { id: 'legal', label: 'Legal', icon: FileText, color: 'text-text-main' },
  // { id: 'community_settings', label: 'Community', icon: Megaphone, color: 'text-brand-primary' }, // Removed old community_settings tab
  { id: 'ads', label: 'Ads', icon: Megaphone, color: 'text-green-500' },
  { id: 'hasabai', label: 'Hasab AI', icon: Mic, color: 'text-[#1cb0f6]' },
]

function Admin() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { branding } = useBranding()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, lessons: 0, totalXp: 0, totalVisitors: 0, totalViews: 0 })
  const [users, setUsers] = useState([])
  const [lessons, setLessons] = useState([])
  const [fetchError, setFetchError] = useState(null)

  // Check if user is admin
  // useEffect(() => {
  //   if (profile && !profile.is_admin) {
  //     navigate('/learn')
  //   }
  // }, [profile, navigate])

  // Fetch data
  useEffect(() => {
    // if (profile?.is_admin) {
    fetchData()
    // }
  }, [profile])

  const fetchData = async () => {
    setLoading(true)
    try {
      setFetchError(null)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError
      setUsers(usersData || [])

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('language', { ascending: true })

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])

      const totalXp = usersData?.reduce((sum, u) => sum + (u.xp || 0), 0) || 0

      // Fetch visitor stats - Now fetching full rows for detailed breakdown
      const { data: visitsData, error: visitsError } = await supabase
        .from('site_visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (visitsError) throw visitsError
      const totalViews = visitsData?.length || 0
      const totalVisitors = new Set(visitsData?.map(v => v.visitor_id)).size

      setStats({
        users: usersData?.length || 0,
        lessons: lessonsData?.length || 0,
        totalXp,
        totalVisitors: totalVisitors || 0,
        totalViews: totalViews || 0,
        visits: visitsData || [] // Pass full data to DashboardTab
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setFetchError(error.message || 'Failed to load dashboard data')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating admin status:', error)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  if (false && !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-['Nunito']">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#e5e5e5] max-w-sm">
          <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={48} className="text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-text-main mb-3">Access Denied</h1>
          <p className="text-text-alt font-bold mb-8">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => navigate('/learn')}
            className="duo-btn duo-btn-green w-full py-4 text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // FIX: If user accessed admin panel but is not admin in DB (RLS blocked), show fix button
  if (profile && !profile.is_admin) {
    const handleFixPermissions = async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', profile.id)

        if (error) throw error
        alert('Permissions fixed! Reloading...')
        window.location.reload()
      } catch (error) {
        console.error('Error fixing permissions:', error)
        alert('Failed to fix permissions: ' + error.message)
      }
    }

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-['Nunito']">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border-2 border-[#e5e5e5] max-w-sm">
          <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield size={48} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-black text-text-main mb-3">Admin Access Required</h1>
          <p className="text-text-alt font-bold mb-6">You are in the Admin Panel, but database permissions are missing. Click below to fix them and see the data.</p>
          <button
            onClick={handleFixPermissions}
            className="duo-btn duo-btn-blue w-full py-4 text-base"
          >
            Fix Permissions & Reload
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white dark:bg-[#131f24] flex overflow-hidden font-['Nunito']">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/80 dark:bg-[#131f24]/80 backdrop-blur-xl border-r-2 border-[#e5e5e5] dark:border-[#37464f] transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="p-6 border-b-2 border-[#e5e5e5] dark:border-[#37464f]">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="text-white" size={24} />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h1 className="font-black text-text-main text-lg tracking-tight leading-none">Admin Panel</h1>
                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest mt-1">Superuser</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-text-alt hover:text-text-main"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-[15px] tracking-wide transition-all border-2 ${activeTab === tab.id
                  ? 'bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 text-[#1cb0f6] border-[#84d8ff] dark:border-[#1cb0f6]'
                  : 'text-text-main dark:text-text-alt hover:bg-bg-alt border-transparent'
                  }`}
              >
                <tab.icon size={24} className={tab.color} />
                {!sidebarCollapsed && <span className="uppercase">{tab.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Info & Back */}
          <div className="p-4 border-t-2 border-[#e5e5e5] dark:border-[#37464f]">
            <Link
              to="/profile"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4 px-2 hover:bg-bg-alt rounded-2xl p-2 transition-all group`}
            >
              <div className="w-10 h-10 bg-[#ffc800] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                <Crown size={20} className="text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-black text-text-main truncate group-hover:text-brand-primary">{profile?.username || 'User'}</p>
                  <p className="text-xs font-bold text-text-alt truncate">{profile?.email || user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-black tracking-widest bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-full">
                    {profile?.is_admin ? 'Superuser' : (profile?.role || 'Free Account')}
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => navigate('/learn')}
              className="duo-btn duo-btn-outline w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              {!sidebarCollapsed && <span className="uppercase">Back to App</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col bg-bg-alt dark:bg-[#131f24]">
        {/* Top Bar */}
        <header className="bg-bg-main/70 dark:bg-[#131f24]/70 backdrop-blur-lg border-b-2 border-[#e5e5e5] dark:border-[#37464f] px-8 py-4 flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-text-main dark:text-white hover:bg-[#f7f7f7] dark:hover:bg-[#37464f]/50 rounded-xl"
              >
                <Menu size={28} />
              </button>
              <div>
                <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">{activeTab}</h2>
                <p className="text-sm font-bold text-text-alt uppercase tracking-widest">Management Console</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-brand-primary/10 rounded-2xl border-2 border-brand-primary/20">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-lg">🦉</span>
              </div>
              <span className="text-brand-primary font-black uppercase tracking-widest text-sm">{branding?.site_name || 'Adewe'}</span>
            </div>
          </div>
        </header>

        {fetchError && (
          <div className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={24} />
            <div>
              <p className="font-black uppercase tracking-widest text-xs">Error Loading Data</p>
              <p className="text-sm font-medium">{fetchError}</p>
              {fetchError.includes('recursion') && (
                <p className="text-xs mt-1 opacity-80 font-mono bg-red-500/10 p-1 rounded">
                  Permissions Error: Please run the 'fix_permissions_v3.sql' script to resolve this.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 h-full">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardTab stats={stats} users={users} loading={loading} onTabChange={setActiveTab} onRefresh={fetchData} />
            )}

            {activeTab === 'community' && <CommunitySettingsTab />}

            {activeTab === 'shop' && <ShopManagementTab />}

            {activeTab === 'users' && (
              <UsersTab
                users={users}
                onToggleAdmin={toggleAdmin}
                onDeleteUser={deleteUser}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'content' && <ContentTab />}

            {activeTab === 'analytics' && <AnalyticsTab users={users} onTabChange={setActiveTab} />}

            {activeTab === 'payments' && <PaymentsTab />}

            {activeTab === 'branding' && <BrandingTab />}

            {activeTab === 'legal' && <LegalTab />}

            {activeTab === 'ads' && <AdsTab />}

            {activeTab === 'hasabai' && <HasabAITab />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin
