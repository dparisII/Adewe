import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const BrandingContext = createContext({})

const defaultBranding = {
  site_name: 'Adewe',
  tagline: 'Adewe is for everyone',
  primary_color: '#58cc02',
  secondary_color: '#1cb0f6',
  accent_color: '#ff9600',
  logo_url: '',
  favicon_url: '',
  copyright: '© 2026 Adewe. Made with ❤️ for Ethiopian languages',
  seo_title: 'Adewe - Learn Ethiopian Languages',
  seo_description: 'Interactive platform to learn Amharic, Tigrinya, Oromo, Somali and more',
  show_legal_links: true,
  footer_links: [
    {
      label: 'About Us',
      links: [
        { label: 'Courses', url: '#' },
        { label: 'Mission', url: '#' },
        { label: 'Approach', url: '#' },
        { label: 'Efficacy', url: '#' },
      ]
    },
    {
      label: 'Products',
      links: [
        { label: 'Adewe', url: '#' },
        { label: 'For Schools', url: '#' },
      ]
    },
    {
      label: 'Help & Support',
      links: [
        { label: 'FAQs', url: '#' },
        { label: 'Contact', url: '#' },
      ]
    },
    {
      label: 'Privacy & Terms',
      links: [
        { label: 'Guidelines', url: '#' },
        { label: 'Terms', url: '/terms' },
        { label: 'Privacy', url: '/privacy' },
      ]
    }
  ],
  terms_content: `
    <h1>Terms of Service</h1>
    <p>Welcome to Adewe. By using our service, you agree to these terms.</p>
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using Adewe, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
    <h2>2. Use License</h2>
    <p>Permission is granted to temporarily download one copy of the materials on Adewe's website for personal, non-commercial transitory viewing only.</p>
  `,
  privacy_content: `
    <h1>Privacy Policy</h1>
    <p>Your privacy is important to us. This policy explains how we handle your data.</p>
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create an account or communicate with us.</p>
    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect to provide, maintain, and improve our services.</p>
  `,
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(defaultBranding)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranding()

    // Listen for localStorage changes (for admin updates)
    const handleStorage = (e) => {
      if (e.key === 'adewe_branding') {
        const data = JSON.parse(e.newValue || '{}')
        setBranding(prev => ({ ...prev, ...data }))
        applyBranding(data)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const fetchBranding = async () => {
    try {
      if (!supabase) throw new Error('Supabase not configured')

      // Fetch from DB
      const { data: dbData, error } = await supabase
        .from('branding_settings')
        .select('*')
        .single()

      // Fetch from LocalStorage
      const localDataStr = localStorage.getItem('adewe_branding')
      const localData = localDataStr ? JSON.parse(localDataStr) : null

      let finalBranding = defaultBranding

      if (dbData && !error) {
        finalBranding = { ...finalBranding, ...dbData }

        // Compare with LocalStorage if exists
        if (localData && localData.updated_at) {
          const dbTime = new Date(dbData.updated_at || 0).getTime()
          const localTime = new Date(localData.updated_at).getTime()

          if (localTime > dbTime) {
            console.log('Using local branding (newer than DB)')
            finalBranding = { ...finalBranding, ...localData }
          }
        }
      } else if (localData) {
        console.log('DB fetch failed, using local branding')
        finalBranding = { ...finalBranding, ...localData }
      }

      setBranding(finalBranding)
      applyBranding(finalBranding)

    } catch (error) {
      console.error('Fetch branding error:', error)
      const localDataStr = localStorage.getItem('adewe_branding')
      if (localDataStr) {
        const localData = JSON.parse(localDataStr)
        setBranding(prev => ({ ...prev, ...localData }))
        applyBranding(localData)
      }
    } finally {
      setLoading(false)
    }
  }

  const applyBranding = (data) => {
    // Helper to darken a color
    const darkenColor = (hex, amount = 20) => {
      const usePound = hex.startsWith('#')
      hex = hex.replace('#', '')
      let num = parseInt(hex, 16)
      let r = (num >> 16) - amount
      let g = ((num >> 8) & 0x00FF) - amount
      let b = (num & 0x0000FF) - amount
      r = r < 0 ? 0 : r
      g = g < 0 ? 0 : g
      b = b < 0 ? 0 : b
      return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0')
    }

    // Apply CSS variables for colors
    if (data.primary_color) {
      document.documentElement.style.setProperty('--color-primary', data.primary_color)
      document.documentElement.style.setProperty('--color-primary-dark', darkenColor(data.primary_color))
    }
    if (data.secondary_color) {
      document.documentElement.style.setProperty('--color-secondary', data.secondary_color)
      document.documentElement.style.setProperty('--color-secondary-dark', darkenColor(data.secondary_color))
    }
    if (data.accent_color) {
      document.documentElement.style.setProperty('--color-accent', data.accent_color)
      document.documentElement.style.setProperty('--color-accent-dark', darkenColor(data.accent_color))
    }

    // Update favicon
    if (data.favicon_url) {
      let link = document.querySelector("link[rel*='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = data.favicon_url
    }

    // Update page title
    if (data.seo_title) {
      document.title = data.seo_title
    }

    // Update meta description
    if (data.seo_description) {
      let meta = document.querySelector("meta[name='description']")
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = data.seo_description
    }
  }

  const updateBranding = (newBranding) => {
    setBranding(prev => ({ ...prev, ...newBranding }))
    applyBranding(newBranding)
  }

  const refreshBranding = () => {
    fetchBranding()
  }

  return (
    <BrandingContext.Provider value={{ branding, loading, updateBranding, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  return useContext(BrandingContext)
}

export default BrandingContext
