import { useState, useEffect } from 'react'
import {
  Mic, Volume2, Languages, Settings, Play, RefreshCw,
  Check, X, AlertTriangle, DollarSign, Activity, CheckCircle, XCircle, Globe
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import hasabAI from '../../services/hasabAI'
import { availableLanguages, getFlag } from '../../data/languageFlags'

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
  }

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${colors[type]}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
        <X size={16} />
      </button>
    </div>
  )
}

function HasabAITab() {
  const [settings, setSettings] = useState({
    api_key: '',
    is_enabled: false,
    tts_enabled: true,
    stt_enabled: true,
    translate_enabled: true,
    monthly_budget: 100,
    current_month_usage: 0,
  })
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testLoading, setTestLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Test inputs
  const [ttsText, setTtsText] = useState('ሰላም')
  const [ttsLang, setTtsLang] = useState('am')
  const [translateText, setTranslateText] = useState('Hello')
  const [translateFrom, setTranslateFrom] = useState('en')
  const [translateTo, setTranslateTo] = useState('am')

  useEffect(() => {
    fetchSettings()
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const { data } = await supabase.from('languages').select('*').order('name')
      setLanguages(data || availableLanguages.slice(0, 5).map(l => ({ code: l.code, name: l.name, flag: l.flag })))
    } catch {
      setLanguages(availableLanguages.slice(0, 5).map(l => ({ code: l.code, name: l.name, flag: l.flag })))
    }
  }

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('hasab_ai_settings')
        .select('*')
        .single()

      if (data && !error) {
        setSettings(prev => ({ ...prev, ...data, api_key: data.api_key_encrypted || '' }))
        if (data.api_key_encrypted) {
          hasabAI.setApiKey(data.api_key_encrypted)
        }
      } else {
        // Try localStorage fallback
        const localData = localStorage.getItem('hasab_ai_settings')
        if (localData) {
          try {
            const parsed = JSON.parse(localData)
            setSettings(prev => ({ ...prev, ...parsed }))
            if (parsed.api_key) hasabAI.setApiKey(parsed.api_key)
          } catch (e) { }
        }
      }
    } catch (error) {
      console.log('Hasab AI settings table may not exist yet')
      // Try localStorage fallback
      const localData = localStorage.getItem('hasab_ai_settings')
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          setSettings(prev => ({ ...prev, ...parsed }))
          if (parsed.api_key) hasabAI.setApiKey(parsed.api_key)
        } catch (e) { }
      }
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('hasab_ai_settings')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          api_key_encrypted: settings.api_key,
          is_enabled: settings.is_enabled,
          tts_enabled: settings.tts_enabled,
          stt_enabled: settings.stt_enabled,
          translate_enabled: settings.translate_enabled,
          monthly_budget: settings.monthly_budget,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        // Fallback to localStorage
        localStorage.setItem('hasab_ai_settings', JSON.stringify(settings))
        showToast('Settings saved locally', 'success')
      } else {
        hasabAI.setApiKey(settings.api_key)
        showToast('Settings saved successfully!', 'success')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      localStorage.setItem('hasab_ai_settings', JSON.stringify(settings))
      showToast('Settings saved locally', 'success')
    } finally {
      setSaving(false)
    }
  }

  const testTTS = async () => {
    setTestLoading(true)
    setTestResult(null)
    try {
      const result = await hasabAI.generateTTS(ttsText, ttsLang)
      setTestResult({ type: 'tts', success: true, data: result })
    } catch (error) {
      setTestResult({ type: 'tts', success: false, error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  const testTranslate = async () => {
    setTestLoading(true)
    setTestResult(null)
    try {
      const result = await hasabAI.translate(translateText, translateFrom, translateTo)
      setTestResult({ type: 'translate', success: true, data: result })
    } catch (error) {
      setTestResult({ type: 'translate', success: false, error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  const testConnection = async () => {
    setTestLoading(true)
    setTestResult(null)
    try {
      const result = await hasabAI.checkStatus()
      setTestResult({ type: 'status', success: result.status === 'ok', data: result })
    } catch (error) {
      setTestResult({ type: 'status', success: false, error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-main">Hasab AI Integration</h2>
          <p className="text-text-alt text-sm">Text-to-Speech, Speech-to-Text, and Translation</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:brightness-110 disabled:opacity-50 font-medium"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* API Configuration */}
      <div className="bg-bg-card rounded-xl border border-border-main p-6">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <Settings size={20} /> API Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-text-alt text-sm mb-1">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                placeholder="Enter your Hasab AI API key"
                className="flex-1 p-3 bg-bg-alt border border-border-main rounded-lg text-text-main font-mono focus:outline-none focus:border-brand-primary"
              />
              <button
                onClick={testConnection}
                disabled={testLoading || !settings.api_key}
                className="px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 disabled:opacity-50 font-medium"
              >
                Test
              </button>
            </div>
            <p className="text-text-alt text-xs mt-1">Get your API key from hasabai.ai</p>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-border-main mt-4">
            <div>
              <p className="text-text-main font-medium">Enable Hasab AI</p>
              <p className="text-text-alt text-sm">Activate AI features for the platform</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, is_enabled: !settings.is_enabled })}
              className={`relative w-14 h-8 rounded-full transition-colors ${settings.is_enabled ? 'bg-brand-primary' : 'bg-gray-300'
                }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${settings.is_enabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-bg-card rounded-xl border border-border-main p-6">
        <h3 className="text-lg font-bold text-text-main mb-4">Feature Toggles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${settings.tts_enabled ? 'border-brand-primary/50 bg-brand-primary/10' : 'border-border-main bg-bg-alt'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 size={20} className={settings.tts_enabled ? 'text-brand-primary' : 'text-text-alt'} />
                <span className="text-text-main font-medium">Text-to-Speech</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tts_enabled}
                  onChange={(e) => setSettings({ ...settings, tts_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
            <p className="text-text-alt text-sm">Generate audio from text</p>
          </div>

          <div className={`p-4 rounded-lg border ${settings.stt_enabled ? 'border-brand-primary/50 bg-brand-primary/10' : 'border-border-main bg-bg-alt'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic size={20} className={settings.stt_enabled ? 'text-brand-primary' : 'text-text-alt'} />
                <span className="text-text-main font-medium">Speech-to-Text</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.stt_enabled}
                  onChange={(e) => setSettings({ ...settings, stt_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
            <p className="text-text-alt text-sm">Transcribe audio to text</p>
          </div>

          <div className={`p-4 rounded-lg border ${settings.translate_enabled ? 'border-brand-primary/50 bg-brand-primary/10' : 'border-border-main bg-bg-alt'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Languages size={20} className={settings.translate_enabled ? 'text-brand-primary' : 'text-text-alt'} />
                <span className="text-text-main font-medium">Translation</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.translate_enabled}
                  onChange={(e) => setSettings({ ...settings, translate_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
            <p className="text-text-alt text-sm">Translate between languages</p>
          </div>
        </div>
      </div>

      {/* Test Tools */}
      <div className="bg-bg-card rounded-xl border border-border-main p-6">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <Activity size={20} /> Test Tools
        </h3>

        <div className="space-y-6">
          {/* TTS Test */}
          <div className="p-4 bg-bg-alt rounded-lg">
            <h4 className="text-text-main font-medium mb-3 flex items-center gap-2">
              <Volume2 size={18} /> Test Text-to-Speech
            </h4>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Enter text..."
                className="flex-1 min-w-[200px] p-2 bg-bg-card border border-border-main rounded-lg text-text-main"
              />
              <select
                value={ttsLang}
                onChange={(e) => setTtsLang(e.target.value)}
                className="p-2 bg-bg-card border border-border-main rounded-lg text-text-main"
              >
                <option value="am">Amharic</option>
                <option value="ti">Tigrinya</option>
                <option value="om">Oromo</option>
                <option value="so">Somali</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={testTTS}
                disabled={testLoading || !settings.api_key}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 font-medium"
              >
                <Play size={18} /> Generate
              </button>
            </div>
          </div>

          {/* Translation Test */}
          <div className="p-4 bg-bg-alt rounded-lg">
            <h4 className="text-text-main font-medium mb-3 flex items-center gap-2">
              <Languages size={18} /> Test Translation
            </h4>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={translateText}
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder="Enter text..."
                className="flex-1 min-w-[200px] p-2 bg-bg-card border border-border-main rounded-lg text-text-main"
              />
              <select
                value={translateFrom}
                onChange={(e) => setTranslateFrom(e.target.value)}
                className="p-2 bg-bg-card border border-border-main rounded-lg text-text-main"
              >
                <option value="en">English</option>
                <option value="am">Amharic</option>
                <option value="ti">Tigrinya</option>
                <option value="om">Oromo</option>
                <option value="so">Somali</option>
              </select>
              <span className="text-text-alt self-center">→</span>
              <select
                value={translateTo}
                onChange={(e) => setTranslateTo(e.target.value)}
                className="p-2 bg-bg-card border border-border-main rounded-lg text-text-main"
              >
                <option value="am">Amharic</option>
                <option value="ti">Tigrinya</option>
                <option value="om">Oromo</option>
                <option value="so">Somali</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={testTranslate}
                disabled={testLoading || !settings.api_key}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 font-medium"
              >
                <Languages size={18} /> Translate
              </button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg border ${testResult.success
              ? 'bg-brand-primary/10 border-brand-primary/30'
              : 'bg-red-500/10 border-red-500/30'
              }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <Check size={20} className="text-brand-primary" />
                ) : (
                  <AlertTriangle size={20} className="text-red-400" />
                )}
                <span className={testResult.success ? 'text-brand-primary' : 'text-red-400'}>
                  {testResult.success ? 'Success' : 'Error'}
                </span>
              </div>
              <pre className="text-sm text-text-alt overflow-x-auto">
                {JSON.stringify(testResult.data || testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Language-specific Settings */}
      <div className="bg-bg-card rounded-xl border border-border-main p-6">
        <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <Globe size={20} /> Language Integration
        </h3>
        <p className="text-text-alt text-sm mb-4">
          Configure Hasab AI features for each language. Enable TTS/STT per language in the Content → Languages section.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {languages.map(lang => (
            <div key={lang.code} className="p-3 bg-bg-alt rounded-lg border border-border-main">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{lang.flag || getFlag(lang.code)}</span>
                <span className="text-text-main font-medium">{lang.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {lang.hasab_ai_enabled ? (
                  <span className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded flex items-center gap-1">
                    <Check size={12} /> Enabled
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-bg-card text-text-alt rounded">
                    Not configured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {languages.length === 0 && (
          <div className="text-center py-6 text-text-alt">
            <Globe size={32} className="mx-auto mb-2 opacity-50" />
            <p>No languages configured yet</p>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="bg-bg-card rounded-xl border border-border-main p-6">
        <h3 className="text-lg font-bold text-text-main mb-4">Documentation</h3>
        <div className="space-y-3 text-text-alt text-sm">
          <p>
            <strong className="text-text-main">Text-to-Speech (TTS):</strong> Convert text to natural-sounding audio in Ethiopian languages.
          </p>
          <p>
            <strong className="text-text-main">Speech-to-Text (STT):</strong> Transcribe audio recordings to text for pronunciation exercises.
          </p>
          <p>
            <strong className="text-text-main">Translation:</strong> Translate content between English and Ethiopian languages.
          </p>
          <div className="mt-4 p-3 bg-bg-alt rounded-lg">
            <p className="text-text-alt text-xs">
              Configure Hasab AI for each language in Content → Languages → Edit Language → Hasab AI Integration
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HasabAITab
