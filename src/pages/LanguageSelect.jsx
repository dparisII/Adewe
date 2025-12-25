import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react'
import useStore from '../store/useStore'
import { languages, getOtherLanguages } from '../data/languages'
import { useAuth } from '../context/AuthContext'
import { useBranding } from '../context/BrandingContext'

function LanguageSelect() {
  const navigate = useNavigate()
  const { user, updateProfile, profile } = useAuth()
  const { branding } = useBranding()
  const { nativeLanguage, setNativeLanguage, setLearningLanguage, learningLanguage } = useStore()

  const [step, setStep] = useState(1)
  const [selectedNative, setSelectedNative] = useState(nativeLanguage || 'english')
  const [selectedLearning, setSelectedLearning] = useState(learningLanguage || null)
  const [saving, setSaving] = useState(false)

  // Always start at step 1 to allow changing both languages
  useEffect(() => {
    setStep(1)
  }, [])

  const handleNativeSelect = (code) => {
    setSelectedNative(code)
  }

  const handleLearningSelect = (code) => {
    setSelectedLearning(code)
  }

  const handleContinue = async () => {
    if (step === 1 && selectedNative) {
      setNativeLanguage(selectedNative)
      setStep(2)
    } else if (step === 2 && selectedLearning) {
      setLearningLanguage(selectedLearning)

      if (user) {
        setSaving(true)
        try {
          await updateProfile({
            native_language: selectedNative,
            learning_language: selectedLearning
          })
          navigate('/learn')
        } catch (error) {
          console.error('Failed to save language preferences:', error)
          navigate('/learn')
        } finally {
          setSaving(false)
        }
      } else {
        // If not logged in, go to signup
        navigate('/signup')
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      // If on step 1, go to /learn if logged in, else home
      if (user) {
        navigate('/learn')
      } else {
        navigate('/')
      }
    }
  }

  const availableLanguages = step === 1 ? languages : getOtherLanguages(selectedNative)

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Nunito']">
      {/* Header */}
      <header className="h-[70px] border-b-2 border-[#e5e5e5] dark:border-[#37464f] flex items-center sticky top-0 bg-white dark:bg-[#131f24] z-50 transition-colors">
        <div className="max-w-[1050px] mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white transition-colors p-2"
            >
              <X size={28} />
            </button>
            <div className="flex-1 max-w-md">
              <div className="h-4 bg-[#e5e5e5] dark:bg-[#37464f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary transition-all duration-500 ease-out rounded-full"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="hidden sm:block ml-8">
            <Link to="/" className="flex items-center gap-2 group">
              {branding?.logo_url ? (
                <img src={branding.logo_url} alt="Logo" className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-3xl">🦉</span>
              )}
              <span className="text-2xl font-black text-brand-primary tracking-tighter uppercase">
                {branding?.site_name || 'ADEWE'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4 bg-white dark:bg-[#131f24] transition-colors">
        <div className="w-full max-w-[600px]">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white text-center mb-10">
            {step === 1
              ? 'What language do you speak?'
              : 'What language do you want to learn?'}
          </h1>

          {/* Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableLanguages.map((lang) => {
              const isSelected =
                step === 1
                  ? selectedNative === lang.code
                  : selectedLearning === lang.code

              return (
                <button
                  key={lang.code}
                  onClick={() =>
                    step === 1
                      ? handleNativeSelect(lang.code)
                      : handleLearningSelect(lang.code)
                  }
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group relative ${isSelected
                    ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
                    : 'border-[#e5e5e5] dark:border-[#37464f] hover:bg-[#f7f7f7] dark:hover:bg-[#37464f]/50 text-gray-700 dark:text-gray-400'
                    }`}
                  style={{
                    boxShadow: isSelected ? '0 4px 0 0 var(--color-secondary-dark)' : '0 4px 0 0 var(--border-color)'
                  }}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-black text-lg leading-tight uppercase tracking-wide">{lang.name}</p>
                    <p className={`${isSelected ? 'text-brand-secondary' : 'text-gray-500 dark:text-gray-500'} font-bold text-sm`}>{lang.nativeName}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-secondary rounded-full flex items-center justify-center shadow-md">
                      <Check size={14} className="text-white stroke-[4px]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#e5e5e5] dark:border-[#37464f] py-6 px-4 bg-white dark:bg-[#131f24] sticky bottom-0 transition-colors">
        <div className="max-w-[1050px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              Step {step} of 2
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={step === 1 ? !selectedNative : !selectedLearning || saving}
            className={`w-full sm:w-auto min-w-[200px] duo-btn ${(step === 1 ? selectedNative : selectedLearning) && !saving
              ? 'duo-btn-green'
              : 'duo-btn-disabled'
              } py-4 text-base flex items-center justify-center gap-3`}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                {step === 1 ? 'CONTINUE' : (user ? 'START LEARNING' : 'CREATE PROFILE')}
                <ArrowRight size={20} className="stroke-[3px]" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default LanguageSelect
