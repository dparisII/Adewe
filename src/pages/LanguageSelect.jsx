import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import useStore from '../store/useStore'
import { languages, getOtherLanguages } from '../data/languages'
import { useAuth } from '../context/AuthContext'

function LanguageSelect() {
  const navigate = useNavigate()
  const { nativeLanguage, setNativeLanguage, setLearningLanguage } = useStore()
  const { updateProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedNative, setSelectedNative] = useState(nativeLanguage || 'english')
  const [selectedLearning, setSelectedLearning] = useState(null)
  const [saving, setSaving] = useState(false)

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
      setSaving(true)
      try {
        // Save to database
        await updateProfile({
          native_language: selectedNative,
          learning_language: selectedLearning
        })
        // Update local store
        setLearningLanguage(selectedLearning)
        navigate('/learn')
      } catch (error) {
        console.error('Failed to save language preferences:', error)
        // Still continue even if save fails
        setLearningLanguage(selectedLearning)
        navigate('/learn')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      navigate('/')
    }
  }

  const availableLanguages = step === 1 ? languages : getOtherLanguages(selectedNative)

  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a2c35] border-b border-[#3c5a6a] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-[#3c5a6a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#58cc02] transition-all duration-300"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>
          <span className="text-gray-400 font-semibold">{step}/2</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {step === 1
              ? 'What language do you speak?'
              : 'What do you want to learn?'}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {step === 1
              ? 'Select your native language'
              : 'Choose a language to start learning'}
          </p>

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
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#58cc02] bg-[#58cc02]/10'
                      : 'border-[#3c5a6a] bg-[#1a2c35] hover:border-[#58cc02]/50'
                  }`}
                >
                  <span className="text-4xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white font-bold text-lg">{lang.name}</p>
                    <p className="text-gray-400">{lang.nativeName}</p>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 bg-[#58cc02] rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2c35] border-t border-[#3c5a6a] px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={step === 1 ? !selectedNative : !selectedLearning || saving}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
              (step === 1 ? selectedNative : selectedLearning) && !saving
                ? 'bg-[#58cc02] hover:bg-[#4caf00] text-white'
                : 'bg-[#3c5a6a] text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default LanguageSelect
