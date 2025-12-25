import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'
import { languages } from '../data/languages'
import { landingTranslations } from '../data/landingTranslations'
import { Globe, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import useThemeStore from '../store/useThemeStore'

function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { branding } = useBranding()
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [selectedLang, setSelectedLang] = useState('english')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  // Get translations for selected language
  const t = landingTranslations[selectedLang] || landingTranslations.english

  const handleGetStarted = () => {
    if (user) {
      navigate('/learn')
    } else {
      navigate('/signup')
    }
  }

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode)
    setShowLangDropdown(false)
  }

  const getLanguageDisplayName = () => {
    const lang = languages.find(l => l.code === selectedLang)
    return lang ? lang.name : 'English'
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-['Nunito'] transition-colors duration-300">
      {/* Header - Duolingo Style */}
      <header className="bg-bg-main border-b-2 border-border-main sticky top-0 z-50 h-[70px] flex items-center transition-colors duration-300">
        <div className="max-w-[1050px] mx-auto w-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            ) : (
              <span className="text-3xl sm:text-4xl">🦉</span>
            )}
            <span className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tighter uppercase">
              {branding?.site_name || 'ADEWE'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowLangDropdown(true)}
                onMouseLeave={() => setShowLangDropdown(false)}
                className="flex items-center gap-2 text-text-alt hover:text-text-main text-sm font-bold uppercase tracking-widest transition-colors py-2"
              >
                <span>{t.siteLanguage}: {getLanguageDisplayName()}</span>
                <ChevronDown size={16} />
              </button>

              {showLangDropdown && (
                <div
                  onMouseEnter={() => setShowLangDropdown(true)}
                  onMouseLeave={() => setShowLangDropdown(false)}
                  className="absolute right-0 top-full bg-bg-card border-2 border-border-main rounded-2xl shadow-xl py-4 min-w-[240px] z-50 grid grid-cols-2 gap-2 px-4 transition-colors duration-300"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-2 text-left hover:bg-bg-alt rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${selectedLang === lang.code ? 'text-brand-primary' : 'text-text-main'
                        }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-alt hover:text-text-main hover:bg-bg-alt transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-alt hover:text-text-main"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-bg-main z-[60] flex flex-col p-6 md:hidden transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-black text-brand-primary tracking-tighter uppercase">{branding?.site_name || 'ADEWE'}</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={32} className="text-text-alt" /></button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-xs font-black text-text-alt uppercase tracking-widest mb-4">{t.siteLanguage}</p>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { handleLanguageChange(lang.code); setMobileMenuOpen(false); }}
                      className={`p-3 rounded-2xl border-2 border-b-4 flex items-center gap-3 font-bold transition-all ${selectedLang === lang.code
                        ? 'border-brand-primary bg-bg-alt text-brand-primary'
                        : 'border-border-main text-text-main'
                        }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-auto pb-8">
              <button onClick={handleGetStarted} className="duo-btn duo-btn-green w-full py-4 text-lg">{t.getStarted}</button>
              <Link to="/login" className="duo-btn duo-btn-white w-full py-4 text-lg">{t.haveAccount}</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-12 md:py-24 px-4 overflow-hidden">
        <div className="max-w-[1050px] w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Mascot/Globe Image */}
          <div className="flex justify-center order-1 md:order-1 relative">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              {/* Decorative circles like Duolingo */}
              <div className="absolute inset-0 bg-bg-alt rounded-full scale-90 -z-10 transition-colors duration-300"></div>
              <div className="absolute inset-0 border-2 border-border-main rounded-full scale-100 -z-10 transition-colors duration-300"></div>

              <span className="text-[120px] sm:text-[240px] md:text-[300px] leading-none animate-bounce-in drop-shadow-2xl">🦉</span>

              {/* Floating elements */}
              <div className="absolute top-[10%] right-[10%] bg-bg-card p-3 rounded-2xl shadow-lg border-2 border-border-main animate-bounce delay-100 transition-colors duration-300">
                <span className="text-3xl">🇪🇹</span>
              </div>
              <div className="absolute bottom-[20%] left-[5%] bg-bg-card p-3 rounded-2xl shadow-lg border-2 border-border-main animate-pulse transition-colors duration-300">
                <span className="text-3xl">⭐</span>
              </div>
            </div>
          </div>

          {/* CTA Content */}
          <div className="text-center md:text-left order-2 md:order-2">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-text-main mb-10 leading-[1.2] max-w-[480px] mx-auto md:mx-0">
              {branding?.tagline || t.tagline}
            </h1>

            <div className="space-y-4 max-w-[330px] mx-auto md:mx-0">
              <button
                onClick={handleGetStarted}
                className="duo-btn duo-btn-green w-full py-4 text-base"
              >
                {t.getStarted}
              </button>

              <Link
                to="/login"
                className="duo-btn duo-btn-white w-full py-4 text-base"
              >
                {t.haveAccount}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Bar */}
      <div className="border-y-2 border-border-main bg-bg-main py-4 overflow-hidden transition-colors duration-300">
        <div className="max-w-[1050px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 whitespace-nowrap">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={handleGetStarted}
                className="flex items-center gap-3 text-text-alt hover:text-text-main font-black uppercase tracking-widest text-sm transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Sections - Alternating */}
      <main className="bg-bg-main transition-colors duration-300">
        {/* Feature 1 */}
        <section className="py-20 md:py-32 border-b-2 border-border-main">
          <div className="max-w-[1050px] mx-auto px-4 flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-brand-primary mb-6 leading-tight">
                {t.feature1Title}
              </h2>
              <p className="text-text-alt text-lg md:text-xl font-bold leading-relaxed">
                {t.feature1Text.replace('Adewe', branding?.site_name || 'Adewe')}
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[380px] aspect-square bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-[40px] flex items-center justify-center text-[120px] md:text-[160px] shadow-inner transition-colors">
                📱
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2 */}
        <section className="py-20 md:py-32 border-b-2 border-border-main bg-bg-alt transition-colors duration-300">
          <div className="max-w-[1050px] mx-auto px-4 flex flex-col md:flex-row-reverse items-center gap-16 md:gap-24">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-brand-primary mb-6 leading-tight">
                {t.feature2Title}
              </h2>
              <p className="text-text-alt text-lg md:text-xl font-bold leading-relaxed">
                {t.feature2Text}
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[380px] aspect-square bg-brand-accent/10 dark:bg-brand-accent/20 rounded-[40px] flex items-center justify-center text-[120px] md:text-[160px] shadow-inner transition-colors">
                🧬
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3 */}
        <section className="py-20 md:py-32 border-b-2 border-border-main">
          <div className="max-w-[1050px] mx-auto px-4 flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-brand-primary mb-6 leading-tight">
                {t.feature3Title}
              </h2>
              <p className="text-text-alt text-lg md:text-xl font-bold leading-relaxed">
                {t.feature3Text}
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[380px] aspect-square bg-brand-yellow/10 dark:bg-brand-yellow/20 rounded-[40px] flex items-center justify-center text-[120px] md:text-[160px] shadow-inner transition-colors">
                🏆
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Final CTA */}
      <section className="py-24 md:py-32 text-center bg-bg-main transition-colors duration-300">
        <div className="max-w-[600px] mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-text-main mb-12">
            Learn a language with us.
          </h2>
          <button
            onClick={handleGetStarted}
            className="duo-btn duo-btn-green px-12 py-5 text-xl w-full sm:w-auto"
          >
            {t.getStarted}
          </button>
        </div>
      </section>

      {/* Footer - Duolingo Style */}
      <footer className="bg-brand-primary py-16 text-white transition-colors">
        <div className="max-w-[1050px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            {branding?.footer_links?.map((category, idx) => (
              <div key={idx}>
                <h3 className="font-black uppercase tracking-widest text-sm mb-6 opacity-80">{category.label}</h3>
                <ul className="space-y-4 font-bold">
                  {category.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.url} className="hover:opacity-70 transition-opacity">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-white/20 pt-12">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-sm font-black uppercase tracking-widest hover:opacity-100 transition-opacity ${selectedLang === lang.code ? 'opacity-100 underline underline-offset-4' : 'opacity-60'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            <p className="text-center font-bold opacity-60 text-sm">
              {branding?.copyright || `© ${new Date().getFullYear()} ${branding?.site_name || 'Adewe'}`}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
