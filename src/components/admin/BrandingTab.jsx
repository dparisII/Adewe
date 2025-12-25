import { useState, useEffect } from 'react'
import { Save, Upload, RefreshCw, Palette, Image, Type, Link2, Globe, CheckCircle, XCircle, X } from 'lucide-react'
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
    copyright: '© 2024 Adewe. Made with ❤️ for Ethiopian languages',
    seo_title: 'Adewe - Learn Ethiopian Languages',
    seo_description: 'Interactive platform to learn Amharic, Tigrinya, Oromo, Somali and more',
    seo_keywords: 'ethiopian languages, learn amharic, tigrinya, oromo, somali',
    header_links: [],
    footer_links: [],
    social_links: {},
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
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl font-['Nunito'] pb-20">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Branding Settings</h2>
          <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Customize your site's identity</p>
        </div>
        <button
          onClick={saveBranding}
          disabled={saving}
          className="duo-btn duo-btn-green px-8 py-3 text-base flex items-center gap-3"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Identity */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-8 shadow-sm">
          <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-3 uppercase tracking-wide">
            <Type size={24} className="text-brand-primary" /> Site Identity
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">Site Name</label>
              <input
                type="text"
                value={branding.site_name}
                onChange={(e) => setBranding({ ...branding, site_name: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">Tagline</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">Copyright Text</label>
              <textarea
                value={branding.copyright}
                onChange={(e) => setBranding({ ...branding, copyright: e.target.value })}
                rows={2}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-8 shadow-sm">
          <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-3 uppercase tracking-wide">
            <Image size={24} className="text-[#1cb0f6]" /> Logo & Favicon
          </h3>
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-bg-alt rounded-3xl flex items-center justify-center border-2 border-border-main overflow-hidden shadow-inner">
                {branding.logo_url ? (
                  <img src={branding.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-4xl">🦉</span>
                )}
              </div>
              <div className="flex-1">
                <label className="duo-btn duo-btn-outline py-2 px-4 text-xs inline-flex items-center gap-2 cursor-pointer">
                  <Upload size={16} />
                  UPLOAD LOGO
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mt-3">Recommended: 200x200px PNG</p>
              </div>
            </div>

            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">Logo URL</label>
              <input
                type="url"
                value={branding.logo_url}
                onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                placeholder="https://..."
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-8 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-text-main mb-8 flex items-center gap-3 uppercase tracking-wide">
            <Palette size={24} className="text-[#ff9600]" /> Brand Colors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Primary', key: 'primary_color', color: '#58cc02' },
              { label: 'Secondary', key: 'secondary_color', color: '#1cb0f6' },
              { label: 'Accent', key: 'accent_color', color: '#ff9600' },
            ].map((c) => (
              <div key={c.key}>
                <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-3">{c.label} Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={branding[c.key]}
                    onChange={(e) => setBranding({ ...branding, [c.key]: e.target.value })}
                    className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-border-main bg-bg-main p-1 shadow-sm"
                  />
                  <input
                    type="text"
                    value={branding[c.key]}
                    onChange={(e) => setBranding({ ...branding, [c.key]: e.target.value })}
                    className="flex-1 p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-black uppercase focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Color Preview */}
          <div className="mt-10 p-8 bg-bg-alt rounded-3xl border-2 border-border-main">
            <p className="text-text-alt font-black text-xs uppercase tracking-widest mb-6">Live Preview</p>
            <div className="flex flex-wrap gap-6">
              <button
                style={{
                  backgroundColor: branding.primary_color,
                  borderBottom: `4px solid ${branding.primary_color}cc`
                }}
                className="px-8 py-3 rounded-2xl text-white font-black uppercase tracking-wide shadow-lg active:translate-y-[2px] active:border-b-0"
              >
                Primary Button
              </button>
              <button
                style={{
                  backgroundColor: branding.secondary_color,
                  borderBottom: `4px solid ${branding.secondary_color}cc`
                }}
                className="px-8 py-3 rounded-2xl text-white font-black uppercase tracking-wide shadow-lg active:translate-y-[2px] active:border-b-0"
              >
                Secondary Button
              </button>
              <button
                style={{
                  backgroundColor: branding.accent_color,
                  borderBottom: `4px solid ${branding.accent_color}cc`
                }}
                className="px-8 py-3 rounded-2xl text-white font-black uppercase tracking-wide shadow-lg active:translate-y-[2px] active:border-b-0"
              >
                Accent Button
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links Management */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-8 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-3 uppercase tracking-wide">
            <Link2 size={24} className="text-[#ce82ff]" /> Footer Links
          </h3>
          <div className="space-y-8">
            {branding.footer_links?.map((category, catIdx) => (
              <div key={catIdx} className="p-6 bg-bg-alt rounded-2xl border-2 border-border-main">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={category.label}
                    onChange={(e) => {
                      const newLinks = [...branding.footer_links]
                      newLinks[catIdx].label = e.target.value
                      setBranding({ ...branding, footer_links: newLinks })
                    }}
                    className="bg-transparent border-b-2 border-border-main focus:border-brand-primary outline-none font-black text-text-main uppercase tracking-wider"
                  />
                  <button
                    onClick={() => {
                      const newLinks = branding.footer_links.filter((_, i) => i !== catIdx)
                      setBranding({ ...branding, footer_links: newLinks })
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {category.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={link.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const newLinks = [...branding.footer_links]
                          newLinks[catIdx].links[linkIdx].label = e.target.value
                          setBranding({ ...branding, footer_links: newLinks })
                        }}
                        className="flex-1 p-2 bg-bg-main border-2 border-border-main rounded-xl text-sm font-bold"
                      />
                      <input
                        type="text"
                        value={link.url}
                        placeholder="URL"
                        onChange={(e) => {
                          const newLinks = [...branding.footer_links]
                          newLinks[catIdx].links[linkIdx].url = e.target.value
                          setBranding({ ...branding, footer_links: newLinks })
                        }}
                        className="flex-1 p-2 bg-bg-main border-2 border-border-main rounded-xl text-sm font-bold"
                      />
                      <button
                        onClick={() => {
                          const newLinks = [...branding.footer_links]
                          newLinks[catIdx].links = newLinks[catIdx].links.filter((_, i) => i !== linkIdx)
                          setBranding({ ...branding, footer_links: newLinks })
                        }}
                        className="text-red-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newLinks = [...branding.footer_links]
                      newLinks[catIdx].links.push({ label: 'New Link', url: '#' })
                      setBranding({ ...branding, footer_links: newLinks })
                    }}
                    className="text-brand-primary text-xs font-black uppercase tracking-widest hover:underline mt-2"
                  >
                    + Add Link
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newLinks = [...(branding.footer_links || [])]
                newLinks.push({ label: 'New Category', links: [] })
                setBranding({ ...branding, footer_links: newLinks })
              }}
              className="duo-btn duo-btn-outline w-full py-4 text-sm"
            >
              + ADD CATEGORY
            </button>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-8 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-text-main mb-6 flex items-center gap-3 uppercase tracking-wide">
            <Globe size={24} className="text-brand-primary" /> SEO Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">SEO Title</label>
              <input
                type="text"
                value={branding.seo_title}
                onChange={(e) => setBranding({ ...branding, seo_title: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all"
              />
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mt-2">{branding.seo_title?.length || 0}/60 CHARACTERS</p>
            </div>
            <div>
              <label className="block text-text-alt font-black text-xs uppercase tracking-widest mb-2">SEO Description</label>
              <textarea
                value={branding.seo_description}
                onChange={(e) => setBranding({ ...branding, seo_description: e.target.value })}
                rows={3}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
              <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mt-2">{branding.seo_description?.length || 0}/160 CHARACTERS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandingTab
