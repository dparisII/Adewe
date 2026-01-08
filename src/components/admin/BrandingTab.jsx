import { useState, useEffect } from 'react'
import { Save, Upload, RefreshCw, Palette, Image, Type, Link2, Globe, CheckCircle, XCircle, X, Layers, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-[#ddf4ff] border-[#84d8ff] text-[#1cb0f6]',
    error: 'bg-[#fee2e2] border-[#ef4444] text-[#991b1b]',
  }

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-4 p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-sm ${colors[type]} font-['Nunito'] font-black uppercase tracking-wide animate-bounce-subtle`}>
      {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
      <p className="text-sm">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
        <X size={20} />
      </button>
    </div>
  )
}

function BrandingTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [branding, setBranding] = useState({
    site_name: 'Adewe',
    tagline: 'Learn Ethiopian Languages',
    primary_color: '#58cc02',
    secondary_color: '#1cb0f6',
    accent_color: '#ff9600',
    logo_url: '',
    favicon_url: '',
    font_family: 'Nunito',
    copyright: '© 2024 Adewe. Made with ❤️ for Ethiopian languages',
    seo_title: 'Adewe - Learn Ethiopian Languages',
    seo_description: 'Interactive platform to learn Amharic, Tigrinya, Oromo, Somali and more',
    seo_keywords: 'ethiopian languages, learn amharic, tigrinya, oromo, somali',
    header_links: [],
    footer_links: [],
    social_links: {},
    show_legal_links: true,
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchBranding()
  }, [])

  const fetchBranding = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .single()

      if (data && !error) {
        setBranding(prev => ({ ...prev, ...data }))
      } else {
        const localData = localStorage.getItem('adewe_branding')
        if (localData) {
          try {
            const parsed = JSON.parse(localData)
            setBranding(prev => ({ ...prev, ...parsed }))
          } catch (e) {
            console.log('Error parsing local branding data')
          }
        }
      }
    } catch (error) {
      console.log('Branding table error, checking localStorage')
      const localData = localStorage.getItem('adewe_branding')
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          setBranding(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.log('Error parsing local branding data')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const saveBranding = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('branding_settings')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          ...branding,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        localStorage.setItem('adewe_branding', JSON.stringify(branding))
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'adewe_branding',
          newValue: JSON.stringify(branding)
        }))
        applyBrandingToPage(branding)
        showToast('Branding saved locally!', 'success')
      } else {
        applyBrandingToPage(branding)
        showToast('Branding settings saved!', 'success')
      }
    } catch (error) {
      console.error('Error saving branding:', error)
      localStorage.setItem('adewe_branding', JSON.stringify(branding))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adewe_branding',
        newValue: JSON.stringify(branding)
      }))
      applyBrandingToPage(branding)
      showToast('Branding saved locally!', 'success')
    } finally {
      setSaving(false)
    }
  }

  const applyBrandingToPage = (data) => {
    if (data.primary_color) {
      document.documentElement.style.setProperty('--color-primary', data.primary_color)
    }
    if (data.secondary_color) {
      document.documentElement.style.setProperty('--color-secondary', data.secondary_color)
    }
    if (data.accent_color) {
      document.documentElement.style.setProperty('--color-accent', data.accent_color)
    }
    if (data.favicon_url) {
      let link = document.querySelector("link[rel*='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = data.favicon_url
    }
    if (data.seo_title) {
      document.title = data.seo_title
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBranding(prev => ({ ...prev, logo_url: e.target.result }))
        showToast('Logo updated!', 'success')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading logo:', error)
      showToast('Error uploading logo', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl font-['Nunito'] pb-20 animate-fade-in">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero Header with Glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary/20 via-blue-500/10 to-brand-primary/20 p-1 rounded-[2rem] border-2 border-brand-primary/20 shadow-2xl group">
        <div className="bg-white/80 dark:bg-[#1a2c35]/80 backdrop-blur-2xl p-8 rounded-[1.9rem] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-primary to-green-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Palette className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-text-main uppercase tracking-tight leading-none">Branding & Identity</h2>
              <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-2 opacity-70">Design the voice and look of your platform</p>
            </div>
          </div>
          <button
            onClick={saveBranding}
            disabled={saving}
            className="duo-btn duo-btn-blue px-10 py-4 text-base flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
          >
            {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      {/* Live Preview Section */}
      <div className="bg-bg-card dark:bg-[#1a2c35] p-8 rounded-[2rem] border-2 border-border-main shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-3 mb-6">
          <Activity size={20} className="text-brand-primary" />
          <h3 className="text-sm font-black text-text-alt uppercase tracking-[0.2em]">Real-time Preview</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="bg-bg-alt rounded-3xl border-2 border-border-main p-1 overflow-hidden shadow-inner">
              <header className="p-4 bg-white dark:bg-[#1a2c35] flex items-center justify-between border-b-2 border-border-main">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-border-main font-black text-xs" style={{ color: branding.primary_color }}>
                    {branding.logo_url ? <img src={branding.logo_url} className="w-full h-full object-contain" /> : '🦉'}
                  </div>
                  <span className="font-black text-lg" style={{ fontFamily: branding.font_family || 'Nunito', color: branding.primary_color }}>
                    {branding.site_name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-3 rounded-full opacity-20" style={{ backgroundColor: branding.secondary_color }} />
                  <div className="w-8 h-3 rounded-full opacity-20" style={{ backgroundColor: branding.accent_color }} />
                </div>
              </header>
              <div className="p-8 text-center bg-white dark:bg-[#111f26]">
                <h1 className="text-4xl font-black mb-4" style={{ fontFamily: branding.font_family || 'Nunito', color: branding.primary_color }}>
                  {branding.tagline}
                </h1>
                <p className="text-text-alt font-bold max-w-sm mx-auto mb-8 leading-relaxed">
                  Experience learning in a new way with {branding.site_name}. Custom built for your journey.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="px-6 py-3 rounded-2xl font-black text-white shadow-lg" style={{ backgroundColor: branding.primary_color }}>GET STARTED</div>
                  <div className="px-6 py-3 rounded-2xl font-black border-2" style={{ color: branding.primary_color, borderColor: branding.primary_color }}>LEARN MORE</div>
                </div>
              </div>
              <footer className="p-4 bg-bg-alt text-center text-[10px] font-black text-text-alt border-t-2 border-border-main">
                {branding.copyright}
              </footer>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-bg-alt p-6 rounded-2xl border-2 border-border-main">
              <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mb-4">Color Palette</p>
              <div className="flex gap-3">
                <div className="flex-1 aspect-square rounded-xl shadow-md cursor-help group relative" style={{ backgroundColor: branding.primary_color }}>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">Primary</span>
                </div>
                <div className="flex-1 aspect-square rounded-xl shadow-md cursor-help group relative" style={{ backgroundColor: branding.secondary_color }}>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">Secondary</span>
                </div>
                <div className="flex-1 aspect-square rounded-xl shadow-md cursor-help group relative" style={{ backgroundColor: branding.accent_color }}>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">Accent</span>
                </div>
              </div>
            </div>
            <div className="bg-bg-alt p-6 rounded-2xl border-2 border-border-main">
              <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mb-2 text-center">Active Typography</p>
              <p className="text-2xl font-black text-center text-text-main truncate" style={{ fontFamily: branding.font_family || 'Nunito' }}>
                {branding.font_family || 'Nunito'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Site Identity Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-black text-text-main mb-8 flex items-center gap-3 uppercase tracking-wide">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              <Type size={20} />
            </div>
            Voice & Name
          </h3>
          <div className="space-y-6">
            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 group-focus-within:text-brand-primary">Site Name</label>
              <input
                type="text"
                value={branding.site_name}
                onChange={(e) => setBranding({ ...branding, site_name: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
              />
            </div>
            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 group-focus-within:text-brand-primary">Tagline / Motto</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
              />
            </div>
            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 group-focus-within:text-brand-primary">Legal Disclaimer</label>
              <textarea
                value={branding.copyright}
                onChange={(e) => setBranding({ ...branding, copyright: e.target.value })}
                rows={2}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Visual Identity Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-black text-text-main mb-8 flex items-center gap-3 uppercase tracking-wide">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Layers size={20} />
            </div>
            Asset Library
          </h3>
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-4 bg-bg-alt rounded-2xl border-2 border-border-main shadow-inner">
              <div className="w-20 h-20 bg-white dark:bg-[#1a2c35] rounded-2xl flex items-center justify-center border-2 border-border-main overflow-hidden shadow-inner group relative">
                {branding.logo_url ? (
                  <img src={branding.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-3xl">🎴</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="cursor-pointer text-white p-2">
                    <Upload size={20} />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mb-2">Main Platform Logo</p>
                <div className="flex gap-2">
                  <label className="px-3 py-1.5 bg-white dark:bg-[#1a2c35] border-2 border-border-main rounded-lg text-[10px] font-black cursor-pointer hover:border-brand-primary transition-colors">
                    CHOOSE FILE
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <button onClick={() => setBranding({ ...branding, logo_url: '' })} className="px-3 py-1.5 bg-red-50 text-red-500 border-2 border-red-100 rounded-lg text-[10px] font-black hover:bg-red-500 hover:text-white transition-all">REMOVE</button>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 group-focus-within:text-brand-primary">Custom Logo URL</label>
              <div className="flex gap-2">
                <div className="p-4 bg-bg-alt border-2 border-border-main rounded-2xl flex-1 flex items-center gap-3 group-focus-within:border-brand-primary transition-all shadow-inner">
                  <Link2 size={18} className="text-text-alt" />
                  <input
                    type="url"
                    value={branding.logo_url}
                    onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-transparent border-none outline-none w-full text-text-main font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colors & Palette Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-text-main flex items-center gap-3 uppercase tracking-wide">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                <Palette size={20} />
              </div>
              Atmosphere & Palette
            </h3>
            <div className="flex h-1 gap-2 w-32 bg-bg-alt rounded-full overflow-hidden">
              <div className="flex-1" style={{ backgroundColor: branding.primary_color }} />
              <div className="flex-1" style={{ backgroundColor: branding.secondary_color }} />
              <div className="flex-1" style={{ backgroundColor: branding.accent_color }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Primary Brand', key: 'primary_color', desc: 'Main UI elements & buttons' },
              { label: 'Secondary', key: 'secondary_color', desc: 'Accents & highlights' },
              { label: 'Accent', key: 'accent_color', desc: 'Notifications & alerts' },
            ].map((c) => (
              <div key={c.key} className="bg-bg-alt p-6 rounded-3xl border-2 border-border-main transition-all group hover:border-brand-primary/20">
                <label className="block text-text-alt font-black text-[10px] uppercase tracking-[0.2em] mb-4">{c.label}</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl shadow-lg border-2 border-white overflow-hidden ring-4 ring-bg-alt">
                    <input
                      type="color"
                      value={branding[c.key]}
                      onChange={(e) => setBranding({ ...branding, [c.key]: e.target.value })}
                      className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={branding[c.key]}
                      onChange={(e) => setBranding({ ...branding, [c.key]: e.target.value })}
                      className="w-full bg-transparent border-none outline-none text-text-main font-mono font-black text-sm uppercase"
                    />
                    <p className="text-[9px] text-text-alt font-bold uppercase tracking-widest mt-1 opacity-60">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="text-lg font-black text-text-main flex items-center gap-3 uppercase tracking-wide">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                <Globe size={20} />
              </div>
              Platform Typography
            </h3>
            <div className="flex items-center gap-4 px-4 py-2 bg-bg-alt rounded-2xl border-2 border-border-main">
              <p className="text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Sample</p>
              <p className="text-xl font-black text-text-main" style={{ fontFamily: branding.font_family || 'Nunito' }}>Abc 123</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest px-1">Selected Style</label>
              <div className="relative group">
                <select
                  value={branding.font_family || 'Nunito'}
                  onChange={(e) => setBranding({ ...branding, font_family: e.target.value })}
                  className="w-full p-5 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-black focus:outline-none focus:border-brand-primary appearance-none cursor-pointer transition-all shadow-inner"
                  style={{ fontFamily: branding.font_family || 'Nunito' }}
                >
                  <optgroup label="Core Selection" style={{ fontFamily: 'Nunito' }}>
                    <option value="Nunito">Nunito</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  </optgroup>
                  <optgroup label="System Standard" style={{ fontFamily: 'Nunito' }}>
                    <option value="Arial">Arial</option>
                    <option value="system-ui">System UI</option>
                  </optgroup>
                  <optgroup label="Ethiopian Specialist" style={{ fontFamily: 'Nunito' }}>
                    <option value="Noto Sans Ethiopic">Noto Sans Ethiopic</option>
                    <option value="Abyssinica SIL">Abyssinica SIL</option>
                  </optgroup>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-alt group-hover:text-brand-primary transition-colors">
                  <RefreshCw size={18} />
                </div>
              </div>
            </div>

            <div className="bg-bg-alt p-6 rounded-3xl border-2 border-border-main flex items-center justify-center min-h-[160px] relative overflow-hidden group">
              <div className="text-center relative z-10">
                <p className="text-4xl font-black text-text-main mb-2" style={{ fontFamily: branding.font_family || 'Nunito' }}>
                  AaBbCc 123
                </p>
                <p className="text-xs font-bold text-text-alt uppercase tracking-[0.2em] opacity-60">Complete Alphabet & Numbers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Configuration Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-text-main flex items-center gap-3 uppercase tracking-wide mb-8">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              <Link2 size={20} />
            </div>
            Footer Settings
          </h3>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 px-1">Active Navigation Links (comma separated)</label>
                  <textarea
                    value={branding.footer_links || ''}
                    onChange={(e) => setBranding({ ...branding, footer_links: e.target.value })}
                    placeholder="Home, About, Contact..."
                    className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all shadow-inner h-32 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-text-alt uppercase tracking-widest px-1">Quick Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {['About', 'Contact', 'FAQ', 'Help', 'Terms', 'Privacy', 'Jobs', 'Blog'].map(link => (
                    <button
                      key={link}
                      onClick={() => {
                        const current = branding.footer_links ? branding.footer_links.split(',').map(s => s.trim()) : [];
                        if (!current.includes(link)) {
                          setBranding({ ...branding, footer_links: branding.footer_links ? `${branding.footer_links}, ${link}` : link });
                        }
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-[#1a2c35] border-2 border-border-main rounded-xl text-[10px] font-black hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all uppercase"
                    >
                      + {link}
                    </button>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t-2 border-border-main">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={branding.show_legal_links}
                        onChange={(e) => setBranding({ ...branding, show_legal_links: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-bg-alt border-2 border-border-main rounded-full peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </div>
                    <span className="text-xs font-black text-text-main uppercase tracking-widest group-hover:text-brand-primary transition-colors">Show Legal Links</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings Card */}
        <div className="bg-bg-card p-8 rounded-[2rem] border-2 border-border-main shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-text-main mb-8 flex items-center gap-3 uppercase tracking-wide">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <Globe size={20} />
            </div>
            SEO & Search Visibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 px-1">Meta Title Tag</label>
              <input
                type="text"
                value={branding.seo_title}
                onChange={(e) => setBranding({ ...branding, seo_title: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
              />
            </div>
            <div className="group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 px-1">Discoverability Keywords</label>
              <input
                type="text"
                value={branding.seo_keywords}
                onChange={(e) => setBranding({ ...branding, seo_keywords: e.target.value })}
                placeholder="language, learn, ethiopia..."
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-2 group">
              <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2 px-1">Meta Description</label>
              <textarea
                value={branding.seo_description}
                onChange={(e) => setBranding({ ...branding, seo_description: e.target.value })}
                rows={3}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandingTab
