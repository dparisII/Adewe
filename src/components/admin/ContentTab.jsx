import { useState, useEffect } from 'react'
import {
  Plus, Edit, Trash2, ChevronRight, ChevronDown, Globe, Layers,
  BookOpen, FileQuestion, Volume2, Save, X, Mic, CheckCircle, XCircle, Gem
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getFlag, languageFlags } from '../../data/languageFlags'
import { getAllUnits, unitTopics } from '../../data/sectionsData'

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1a2c35] rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-scale-in border-2 border-border-main">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

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

function ContentTab() {
  const [activeSection, setActiveSection] = useState('languages')
  const [languages, setLanguages] = useState([])
  const [units, setUnits] = useState([])
  const [lessons, setLessons] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [expandedLanguages, setExpandedLanguages] = useState({})
  const [toast, setToast] = useState(null)
  const [selectedSectionForUnits, setSelectedSectionForUnits] = useState(null)
  const [showUnitsModal, setShowUnitsModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [selectedUnitForDetails, setSelectedUnitForDetails] = useState(null)
  const [showUnitDetailsModal, setShowUnitDetailsModal] = useState(false)
  const [flagPreview, setFlagPreview] = useState(null) // Added for flag uploads
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [confirmText, setConfirmText] = useState('')

  const normalizeLanguageCode = (code) => {
    if (!code) return ''
    const mapping = {
      am: 'amharic', amharic: 'amharic',
      ti: 'tigrinya', tigrinya: 'tigrinya',
      om: 'oromo', oromo: 'oromo',
      so: 'somali', somali: 'somali',
      gez: 'geez', geez: 'geez',
      en: 'english', english: 'english'
    }
    return mapping[code.toLowerCase()] || code.toLowerCase()
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const { data: langData, error: langError } = await supabase
        .from('languages')
        .select('*')
        .order('sort_order')

      if (langError || !langData || langData.length === 0) {
        setLanguages(availableLanguages.map((l, i) => ({
          id: l.code,
          code: l.code,
          name: l.name,
          native_name: l.nativeName,
          flag: l.flag,
          script: l.script,
          is_active: true,
          is_target: true,
          sort_order: i
        })))
      } else {
        // Ensure no duplicates by code and filter out short codes if full names exist
        const uniqueLangs = []
        const seenNames = new Set()
        const fullNames = ['amharic', 'tigrinya', 'oromo', 'somali', 'geez', 'english']

        // Priority to full names
        langData.forEach(l => {
          if (fullNames.includes(l.code)) {
            uniqueLangs.push(l)
            seenNames.add(l.code)
          }
        })

        // Then add others if not already seen (and not a short-code version of what we have)
        const shortToFull = { am: 'amharic', ti: 'tigrinya', om: 'oromo', so: 'somali', gez: 'geez', en: 'english' }
        langData.forEach(l => {
          if (!fullNames.includes(l.code) && !seenNames.has(l.code)) {
            const mapped = shortToFull[l.code]
            if (!mapped || !seenNames.has(mapped)) {
              uniqueLangs.push(l)
              seenNames.add(l.code)
            }
          }
        })
        setLanguages(uniqueLangs)
      }

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .order('language', { ascending: true })
        .order('level', { ascending: true })
      setLessons(lessonData || [])

      try {
        const { data: unitData } = await supabase.from('units').select('*').order('sort_order')
        setUnits(unitData || [])
      } catch { setUnits([]) }

      try {
        const { data: exerciseData } = await supabase.from('exercises').select('*').order('sort_order')
        setExercises(exerciseData || [])
      } catch { setExercises([]) }

    } catch (error) {
      console.error('Error fetching content:', error)
      showToast('Error loading content', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUnit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const unitData = {
      language_code: selectedSectionForUnits.lang,
      title: formData.get('title'),
      description: formData.get('description'),
      sort_order: parseInt(formData.get('sort_order')) || 0,
      is_published: true,
      updated_at: new Date().toISOString()
    }

    try {
      if (editingItem && editingItem.type === 'unit') {
        const { error } = await supabase.from('units').update(unitData).eq('id', editingItem.id)
        if (error) throw error
        setUnits(prev => prev.map(u => u.id === editingItem.id ? { ...u, ...unitData } : u))
        showToast('Unit updated successfully!', 'success')
      } else {
        const { data, error } = await supabase.from('units').insert([unitData]).select().single()
        if (error) throw error
        setUnits(prev => [...prev, data])
        showToast('Unit added successfully!', 'success')
      }
      setShowModal(null)
      setEditingItem(null)
    } catch (err) {
      console.error('Error saving unit:', err)
      showToast('Error saving unit', 'error')
    }
  }

  const handleDeleteUnit = async (unitId) => {
    const unit = units.find(u => u.id === unitId)
    setDeleteConfirm({
      id: unitId,
      type: 'unit',
      name: unit?.title || `Unit ${unit?.sort_order}`,
      onConfirm: async () => {
        const { error } = await supabase.from('units').delete().eq('id', unitId)
        if (error) throw error
        setUnits(prev => prev.filter(u => u.id !== unitId))
        showToast('Unit deleted successfully!', 'success')
      }
    })
    setConfirmText('')
  }

  const handleSaveLesson = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const lessonData = {
      language: formData.get('language'),
      title: formData.get('title'),
      description: formData.get('description'),
      level: parseInt(formData.get('level')) || 1,
      unit_id: formData.get('unit_id') === 'null' ? null : formData.get('unit_id'),
      is_published: formData.get('is_published') === 'on',
      xp_reward: parseInt(formData.get('xp_reward')) || 10,
      updated_at: new Date().toISOString()
    }

    try {
      if (editingItem && editingItem.type === 'lesson') {
        const { error } = await supabase.from('lessons').update(lessonData).eq('id', editingItem.id)
        if (error) throw error
        setLessons(prev => prev.map(l => l.id === editingItem.id ? { ...l, ...lessonData } : l))
        showToast('Lesson updated successfully!', 'success')
      } else {
        const { data, error } = await supabase.from('lessons').insert([lessonData]).select().single()
        if (error) throw error
        setLessons(prev => [...prev, data])
        showToast('Lesson added successfully!', 'success')
      }
      setShowModal(null)
      setEditingItem(null)
    } catch (err) {
      console.error('Error saving lesson:', err)
      showToast('Error saving lesson', 'error')
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId)
    setDeleteConfirm({
      id: lessonId,
      type: 'lesson',
      name: lesson?.title || 'this lesson',
      onConfirm: async () => {
        const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
        if (error) throw error
        setLessons(prev => prev.filter(l => l.id !== lessonId))
        showToast('Lesson deleted successfully!', 'success')
      }
    })
    setConfirmText('')
  }

  const handleShowUnitDetails = (lang, unitIdx) => {
    // Find the real unit in DB if it exists
    const dbUnit = units.find(u =>
      normalizeLanguageCode(u.language_code) === normalizeLanguageCode(lang) &&
      u.sort_order === unitIdx
    )

    // For mock/placeholder, we'll just show what we have
    setSelectedUnitForDetails({
      lang,
      unitIdx,
      dbUnit,
      lessons: lessons.filter(l =>
        (normalizeLanguageCode(l.language) === normalizeLanguageCode(lang) && l.unitId === unitIdx) || // mock lessons
        (dbUnit && l.unit_id === dbUnit.id) // real lessons
      )
    })
    setShowUnitDetailsModal(true)
  }


  // User requested "at least 500 lessons per language".
  // We enforce this by independently mocking lessons for any language that has 0 real lessons in Supabase.
  useEffect(() => {
    if (!loading && languages.length > 0) {
      const languagesWithNoLessons = languages.filter(lang =>
        !lessons.some(l => l.language === lang.code)
      )

      if (languagesWithNoLessons.length > 0) {
        let allNewMockLessons = []
        const shortToFull = {
          am: 'amharic', amharic: 'amharic',
          ti: 'tigrinya', tigrinya: 'tigrinya',
          om: 'oromo', oromo: 'oromo',
          so: 'somali', somali: 'somali',
          gez: 'geez', geez: 'geez',
          en: 'english', english: 'english'
        }

        languagesWithNoLessons.forEach(lang => {
          const learning = shortToFull[lang.code.toLowerCase()] || lang.code.toLowerCase()
          // For English learners, default native to Amharic. For others, English.
          let native = learning === 'english' ? 'amharic' : 'english'

          let units = getAllUnits(native, learning)

          // Fallback if the first choice has no content
          if (!units || units.length === 0) {
            const possibleNatives = ['english', 'amharic', 'tigrinya']
            for (const pNative of possibleNatives) {
              if (pNative === learning) continue
              const pUnits = getAllUnits(pNative, learning)
              if (pUnits && pUnits.length > 0) {
                units = pUnits
                native = pNative
                break
              }
            }
          }

          if (units && units.length > 0) {
            units.forEach(unit => {
              unit.lessons.forEach(lesson => {
                allNewMockLessons.push({
                  ...lesson,
                  language: lang.code, // Keep original code for state consistency
                  level: unit.sectionId,
                  xp_reward: 10,
                  is_published: true
                })
              })
            })
          }
        })

        if (allNewMockLessons.length > 0) {
          setLessons(prev => [...prev, ...allNewMockLessons])
        }
      }
    }
  }, [loading, languages.length, lessons.length])

  const handleSaveExercise = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const exerciseData = {
      type: formData.get('type'),
      question: formData.get('question'),
      correct_answer: formData.get('answer'),
      options: formData.get('options')?.split(',').map(s => s.trim()) || [],
      updated_at: new Date().toISOString()
    }

    try {
      if (editingItem && !editingItem.id.toString().startsWith('custom-')) {
        const { error } = await supabase.from('exercises').update(exerciseData).eq('id', editingItem.id)
        if (error) throw error
        setExercises(prev => prev.map(ex => ex.id === editingItem.id ? { ...ex, ...exerciseData } : ex))
        showToast('Exercise updated successfully!', 'success')
      } else {
        // For custom/mock or new exercises
        const newEx = {
          id: editingItem?.id || `custom-${Date.now()}`,
          ...exerciseData,
          created_at: editingItem?.created_at || new Date().toISOString()
        }
        if (editingItem) {
          setExercises(prev => prev.map(ex => ex.id === editingItem.id ? newEx : ex))
          showToast('Mock exercise updated!', 'success')
        } else {
          setExercises([newEx, ...exercises])
          showToast('Exercise created successfully!', 'success')
        }
      }
      setShowModal(null)
      setEditingItem(null)
    } catch (err) {
      console.error('Error saving exercise:', err)
      showToast('Error saving exercise', 'error')
    }
  }

  const handleDeleteExercise = async (exId) => {
    const exercise = exercises.find(ex => ex.id === exId)
    setDeleteConfirm({
      id: exId,
      type: 'exercise',
      name: (exercise?.question?.substring(0, 20) + (exercise?.question?.length > 20 ? '...' : '')) || 'this exercise',
      onConfirm: async () => {
        if (!exId.toString().startsWith('custom-')) {
          const { error } = await supabase.from('exercises').delete().eq('id', exId)
          if (error) throw error
        }
        setExercises(prev => prev.filter(ex => ex.id !== exId))
        showToast('Exercise deleted successfully!', 'success')
      }
    })
    setConfirmText('')
  }

  const handleFlagUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setFlagPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteLanguage = async (langId) => {
    const lang = languages.find(l => l.id === langId)
    setDeleteConfirm({
      id: langId,
      type: 'language',
      name: lang?.name || 'this language',
      onConfirm: async () => {
        const { error } = await supabase.from('languages').delete().eq('id', langId)
        if (error) throw error
        setLanguages(prev => prev.filter(l => l.id !== langId))
        showToast('Language deleted successfully!', 'success')
      }
    })
    setConfirmText('')
  }

  const handleSaveLanguage = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const langData = {
      code: formData.get('code'),
      name: formData.get('name'),
      native_name: formData.get('native_name'),
      flag: flagPreview || formData.get('flag') || '🏳️',
      script: formData.get('script') || 'latin',
      is_active: true
    }

    try {
      if (editingItem) {
        const { error } = await supabase.from('languages').update(langData).eq('id', editingItem.id)
        if (error) throw error
        setLanguages(prev => prev.map(l => l.id === editingItem.id ? { ...l, ...langData } : l))
        showToast('Language updated successfully!', 'success')
      } else {
        const { data, error } = await supabase.from('languages').insert([langData]).select().single()
        if (error) throw error
        setLanguages(prev => [...prev, data])
        showToast('Language added successfully!', 'success')
      }
      setShowModal(null)
      setEditingItem(null)
      setFlagPreview(null)
    } catch (err) {
      console.error('Error saving language:', err)
      showToast('Error saving language', 'error')
    }
  }


  const sections = [
    { id: 'languages', label: 'Languages', icon: Globe, count: languages.length, color: 'text-brand-primary' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, count: lessons.length, color: 'text-[#ffc800]' },
    { id: 'exercises', label: 'Exercises', icon: FileQuestion, count: exercises.length, color: 'text-[#1cb0f6]' },
  ]

  const lessonsByLanguage = languages.reduce((acc, lang) => {
    acc[lang.code] = lessons.reduce((levelAcc, lesson) => {
      const lessonLang = normalizeLanguageCode(lesson.language)
      if (lessonLang !== normalizeLanguageCode(lang.code)) return levelAcc

      const level = lesson.level || 1
      if (!levelAcc[level]) levelAcc[level] = []
      levelAcc[level].push(lesson)
      return levelAcc
    }, {})
    return acc
  }, {})

  const toggleLanguageExpand = (lang) => {
    setExpandedLanguages(prev => ({ ...prev, [lang]: !prev[lang] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-['Nunito'] pb-20">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Section Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap border-2 ${activeSection === section.id
              ? 'bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 text-[#1cb0f6] border-[#84d8ff] dark:border-[#1cb0f6]'
              : 'bg-bg-card dark:bg-[#1a2c35] text-text-main dark:text-text-alt border-border-main hover:bg-bg-alt'
              }`}
          >
            <section.icon size={20} className={activeSection === section.id ? 'text-[#1cb0f6]' : section.color} />
            <span className="uppercase tracking-wide">{section.label}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeSection === section.id ? 'bg-[#1cb0f6] text-white' : 'bg-border-main text-text-main dark:text-text-alt'
              }`}>
              {section.count}
            </span>
          </button>
        ))}
      </div>

      {/* Manage Units Modal */}
      <Modal
        isOpen={showUnitsModal}
        onClose={() => setShowUnitsModal(false)}
        title={`Manage Section ${selectedSectionForUnits?.sectionId}: ${selectedSectionForUnits?.title}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {Array.from({ length: 15 }).map((_, i) => {
            const unitOrder = (selectedSectionForUnits?.sectionId - 1) * 15 + i + 1
            const unit = units.find(u =>
              normalizeLanguageCode(u.language_code) === normalizeLanguageCode(selectedSectionForUnits?.lang) &&
              u.sort_order === unitOrder
            )

            return (
              <div key={unit?.id || `slot-${unitOrder}`} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${unit ? 'bg-bg-alt border-border-main hover:border-brand-primary/30' : 'bg-bg-card border-dashed border-border-main opacity-60'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 ${unit ? 'bg-bg-card border-border-main' : 'bg-bg-alt border-border-main'}`}>
                    {unitOrder}
                  </div>
                  <div>
                    <h4 className={`font-black text-sm ${unit ? 'text-text-main' : 'text-text-alt'}`}>
                      {unit?.title || unitTopics[selectedSectionForUnits?.sectionId - 1]?.[i] || 'New Unit'}
                    </h4>
                    <p className="text-[10px] font-bold text-text-alt uppercase tracking-widest">
                      {unit ? (
                        `${lessons.filter(l => l.unit_id === unit.id).length} Lessons • ${unit.is_published ? 'Enabled' : 'Disabled'}`
                      ) : (
                        `5 lessons available • Draft`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {unit ? (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingItem({ ...unit, type: 'unit' }); setShowModal('unit') }}
                        className="p-2 text-text-alt hover:text-brand-primary hover:bg-white rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="p-2 text-text-alt hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingItem({
                          language_code: selectedSectionForUnits.lang,
                          sort_order: unitOrder
                        });
                        setShowModal('unit')
                      }}
                      className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-brand-primary/20 transition-all"
                    >
                      + Create
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6">
          <button onClick={() => setShowUnitsModal(false)} className="w-full duo-btn duo-btn-white text-xs uppercase tracking-widest">Done</button>
        </div>
      </Modal>

      {/* Languages Section */}
      {activeSection === 'languages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
            <div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Languages</h2>
              <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Manage available courses</p>
            </div>
            <button
              onClick={() => { setShowModal('language'); setEditingItem(null) }}
              className="duo-btn duo-btn-green px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus size={18} /> ADD LANGUAGE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map(lang => (
              <div key={lang.id} className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-6 hover:border-brand-primary/30 transition-all shadow-sm group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl group-hover:scale-110 transition-transform">{lang.flag || getFlag(lang.code)}</span>
                    <div>
                      <h3 className="text-text-main font-black text-lg leading-tight">{lang.name}</h3>
                      <p className="text-text-alt font-bold text-sm">{lang.native_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingItem(lang); setShowModal('language') }}
                      className="p-2 text-text-alt hover:text-[#1cb0f6] hover:bg-[#ddf4ff] rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteLanguage(lang.id)}
                      className="p-2 text-text-alt hover:text-[#ff4b4b] hover:bg-[#fee2e2] rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="px-2.5 py-1 bg-bg-alt text-text-main dark:text-text-alt rounded-lg border border-border-main">{lang.code}</span>
                  <span className="px-2.5 py-1 bg-bg-alt text-text-main dark:text-text-alt rounded-lg border border-border-main">{lang.script || 'latin'}</span>
                  <span className={`px-2.5 py-1 rounded-lg border ${lang.is_active !== false ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-[#ff4b4b]/10 text-[#ff4b4b] border-[#ff4b4b]/20'}`}>
                    {lang.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Section */}
      {activeSection === 'lessons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
            <div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Lessons</h2>
              <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Curriculum structure</p>
            </div>
            <button
              onClick={() => { setShowModal('lesson'); setEditingItem(null) }}
              className="duo-btn duo-btn-green px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus size={18} /> ADD LESSON
            </button>
          </div>

          <div className="space-y-8">
            {Object.entries(lessonsByLanguage).map(([lang, levels]) => (
              <div key={lang} className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleLanguageExpand(lang)}
                  className="w-full p-6 flex items-center justify-between hover:bg-[#f7f7f7] dark:hover:bg-[#37464f]/30 transition-all border-b-2 border-border-main"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getFlag(lang)}</span>
                    <div className="text-left">
                      <h3 className="text-text-main font-black text-xl uppercase tracking-tight">{lang}</h3>
                      <p className="text-text-alt font-black uppercase tracking-widest text-[10px] mt-1">
                        10 SECTIONS • 150 UNITS • {Object.values(levels).flat().length} LESSONS
                      </p>
                    </div>
                  </div>
                  {expandedLanguages[lang] ? <ChevronDown size={24} className="text-text-alt" /> : <ChevronRight size={24} className="text-text-alt" />}
                </button>

                {expandedLanguages[lang] && (
                  <div className="p-4 space-y-4 bg-bg-alt/30">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sectionId => {
                      const sectionLessons = Object.values(levels[sectionId] || []).flat()
                      const sectionTitle = ['Foundations', 'Explore', 'Expand', 'Communicate', 'Express', 'Interact', 'Master', 'Advance', 'Specialize', 'Perfect'][sectionId - 1]
                      return (
                        <div key={sectionId} className="bg-bg-card dark:bg-[#1a2c35] rounded-2xl border-2 border-border-main overflow-hidden">
                          <div className="px-6 py-4 flex items-center justify-between border-b-2 border-border-main bg-bg-alt/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-xs">{sectionId}</div>
                              <div>
                                <h4 className="text-text-main font-black text-sm uppercase tracking-wide">{sectionTitle}</h4>
                                <p className="text-text-alt font-bold text-[10px] tracking-widest uppercase">{sectionLessons.length} Lessons Available</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSectionForUnits({ lang, sectionId, title: sectionTitle })
                                setShowUnitsModal(true)
                              }}
                              className="text-brand-primary font-black text-[10px] uppercase hover:underline"
                            >
                              Manage Units
                            </button>
                          </div>

                          <div className="p-2 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {Array.from({ length: 15 }).map((_, i) => {
                              const unitId = (sectionId - 1) * 15 + i + 1
                              const dbUnit = units.find(u =>
                                normalizeLanguageCode(u.language_code) === normalizeLanguageCode(lang) &&
                                u.sort_order === unitId
                              )
                              const hasContent = sectionLessons.some(l => l.unitId === unitId) || !!dbUnit
                              return (
                                <div key={unitId}
                                  onClick={() => handleShowUnitDetails(lang, unitId)}
                                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer hover:border-brand-primary/50 shadow-sm hover:shadow-md ${hasContent ? 'bg-brand-primary/5 border-brand-primary/20' : 'bg-bg-alt/50 border-dashed border-border-main'}`}
                                >
                                  <span className="text-[10px] font-black text-text-alt">UNIT {unitId}</span>
                                  <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-brand-primary' : 'bg-border-main'}`} />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises Section */}
      {activeSection === 'exercises' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
            <div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Exercises</h2>
              <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Interactive content</p>
            </div>
            <button
              onClick={() => { setShowModal('exercise'); setEditingItem(null) }}
              className="duo-btn duo-btn-green px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus size={18} /> ADD EXERCISE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map(exercise => (
              <div key={exercise.id} className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-6 hover:border-brand-primary/30 transition-all shadow-sm group">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${exercise.type === 'translation' ? 'bg-[#ddf4ff] text-[#1cb0f6] border-[#84d8ff]' :
                    exercise.type === 'multiple_choice' ? 'bg-[#f3e8ff] text-[#ce82ff] border-[#d8b4fe]' :
                      exercise.type === 'fill_blank' ? 'bg-[#fef9c3] text-[#ffc800] border-[#fde047]' :
                        'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                    }`}>
                    {exercise.type?.replace('_', ' ')}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(exercise); setShowModal('exercise') }} className="p-2 text-text-alt hover:text-brand-primary hover:bg-bg-alt rounded-xl transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteExercise(exercise.id)} className="p-2 text-text-alt hover:text-red-500 hover:bg-bg-alt rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-text-main font-black text-lg mb-3 leading-tight group-hover:text-brand-primary transition-colors">{exercise.question}</p>
                <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main">
                  <p className="text-text-alt font-black text-[10px] uppercase tracking-widest mb-1">Correct Answer</p>
                  <p className="text-brand-primary font-black">{exercise.correct_answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals at the end of return */}

      {/* Language Modal */}
      {showModal === 'language' && (
        <Modal isOpen={true} onClose={() => { setShowModal(null); setEditingItem(null); setFlagPreview(null); }} title={editingItem ? 'Edit Language' : 'Add New Language'}>
          <form onSubmit={handleSaveLanguage} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Code (e.g. am, en)</label>
                <input required name="code" defaultValue={editingItem?.code} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Name (English)</label>
                <input required name="name" defaultValue={editingItem?.name} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Native Name</label>
                <input required name="native_name" defaultValue={editingItem?.native_name} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Script (e.g. geez, latin)</label>
                <input name="script" defaultValue={editingItem?.script || 'geez'} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
            </div>

            <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main space-y-3">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Flag Identity</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-bg-card rounded-2xl border-2 border-border-main flex items-center justify-center text-4xl overflow-hidden shadow-inner group relative">
                  {flagPreview || editingItem?.flag ? (
                    (flagPreview || editingItem?.flag).length > 4 ? (
                      <img src={flagPreview || editingItem?.flag} className="w-full h-full object-cover" alt="Flag" />
                    ) : (
                      <span>{flagPreview || editingItem?.flag}</span>
                    )
                  ) : (
                    <Globe size={32} className="text-text-alt opacity-20" />
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Plus className="text-white" size={24} />
                    <input type="file" accept="image/*" onChange={handleFlagUpload} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    name="flag"
                    placeholder="Paste emoji or emoji string"
                    defaultValue={(!flagPreview && editingItem?.flag?.length <= 4) ? editingItem?.flag : ''}
                    className="w-full bg-bg-card border-2 border-border-main rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-brand-primary"
                  />
                  <p className="text-[9px] font-bold text-text-alt uppercase tracking-tight">Emoji or Upload Image for custom flags</p>
                </div>
              </div>
            </div>
            <div className="duo-btn-group flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(null)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
              <button type="submit" className="flex-1 duo-btn duo-btn-blue">{editingItem ? 'UPDATE' : 'CREATE'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Lesson Modal */}
      {showModal === 'lesson' && (
        <Modal isOpen={true} onClose={() => { setShowModal(null); setEditingItem(null); }} title={editingItem?.type === 'lesson' ? 'Edit Lesson' : 'Add New Lesson'}>
          <form onSubmit={handleSaveLesson} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Language</label>
                <select required name="language" defaultValue={editingItem?.language || 'amharic'} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary">
                  {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Section / Level</label>
                <input type="number" required name="level" defaultValue={editingItem?.level || 1} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Unit</label>
              <select name="unit_id" defaultValue={editingItem?.unit_id || editingItem?.dbUnit?.id || 'null'} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary">
                <option value="null">No specific unit</option>
                {units.filter(u => normalizeLanguageCode(u.language_code) === normalizeLanguageCode(editingItem?.language || 'amharic')).map(u => <option key={u.id} value={u.id}>Unit {u.sort_order}: {u.title}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Title</label>
              <input required name="title" defaultValue={editingItem?.title} placeholder="e.g. Basic Greetings" className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Description</label>
              <textarea name="description" defaultValue={editingItem?.description} placeholder="Brief summary" className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary resize-none" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">XP Reward</label>
                <input type="number" name="xp_reward" defaultValue={editingItem?.xp_reward || 10} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="is_published" id="is_published_lesson" defaultChecked={editingItem?.is_published !== false} className="w-5 h-5 accent-brand-primary" />
                <label htmlFor="is_published_lesson" className="text-xs font-black uppercase text-text-alt tracking-widest">Published</label>
              </div>
            </div>
            <div className="duo-btn-group flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(null)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
              <button type="submit" className="flex-1 duo-btn duo-btn-blue">{editingItem?.type === 'lesson' ? 'UPDATE' : 'CREATE'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Exercise Modal */}
      {showModal === 'exercise' && (
        <Modal isOpen={true} onClose={() => { setShowModal(null); setEditingItem(null); }} title={editingItem ? 'Edit Exercise' : 'Add New Exercise'}>
          <form onSubmit={handleSaveExercise} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Type</label>
              <select name="type" defaultValue={editingItem?.type || 'translation'} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary">
                <option value="translation">Translation</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="listening">Listening</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Question</label>
              <textarea required name="question" defaultValue={editingItem?.question} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary resize-none" rows={2} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Answer (Selection for MC)</label>
              <input required name="answer" defaultValue={editingItem?.correct_answer} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Options (Comma separated for Multiple Choice)</label>
              <textarea name="options" defaultValue={editingItem?.options?.join(', ')} placeholder="Option 1, Option 2, Option 3" className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary resize-none" rows={2} />
            </div>
            <div className="duo-btn-group flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(null)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
              <button type="submit" className="flex-1 duo-btn duo-btn-blue">{editingItem ? 'UPDATE' : 'CREATE'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Unit Modal */}
      {showModal === 'unit' && (
        <Modal isOpen={true} onClose={() => { setShowModal(null); setEditingItem(null); }} title={editingItem ? 'Edit Unit' : 'Add New Unit'}>
          <form onSubmit={handleSaveUnit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Title</label>
              <input required name="title" defaultValue={editingItem?.title} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Sort Order</label>
              <input type="number" required name="sort_order" defaultValue={editingItem?.sort_order || 1} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
            </div>
            <div className="duo-btn-group flex gap-3 pt-4">
              <button type="button" onClick={() => setShowModal(null)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
              <button type="submit" className="flex-1 duo-btn duo-btn-blue">{editingItem ? 'UPDATE' : 'CREATE'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Unit Details Modal */}
      <Modal isOpen={showUnitDetailsModal} onClose={() => setShowUnitDetailsModal(false)} title={selectedUnitForDetails?.dbUnit?.title || `Unit ${selectedUnitForDetails?.unitIdx}`}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {selectedUnitForDetails?.lessons.map((lesson, i) => (
            <div key={lesson.id} className="p-4 bg-bg-alt rounded-2xl border-2 border-border-main hover:border-brand-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-text-main text-sm">{lesson.title}</h4>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem({ ...lesson, type: 'lesson' }); setShowModal('lesson') }} className="p-1.5 text-text-alt hover:text-brand-primary hover:bg-white rounded-lg transition-all"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 text-text-alt hover:text-red-500 hover:bg-white rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-text-alt font-bold line-clamp-1">{lesson.description}</p>
            </div>
          ))}
          {selectedUnitForDetails?.lessons.length === 0 && <div className="text-center py-10"><BookOpen size={48} className="mx-auto text-text-alt mb-3 opacity-20" /><p className="text-text-alt font-bold">No lessons yet</p></div>}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setShowUnitDetailsModal(false)} className="flex-1 duo-btn duo-btn-white text-xs">CLOSE</button>
          <button onClick={() => { setEditingItem({ language: selectedUnitForDetails?.lang, unit_id: selectedUnitForDetails?.dbUnit?.id || null, level: Math.floor((selectedUnitForDetails?.unitIdx - 1) / 15) + 1 }); setShowModal('lesson') }} className="flex-1 duo-btn duo-btn-green flex items-center justify-center gap-2 text-xs"><Plus size={18} /> ADD LESSON</button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-bg-card dark:bg-[#131f24] rounded-[32px] w-full max-w-md border-2 border-red-500/30 shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
              <h3 className="text-xl font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                <Trash2 size={24} /> DELETE ITEM
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-2 hover:bg-bg-alt rounded-lg text-text-alt hover:text-text-main"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-text-main font-bold">
                You are about to permanently delete this {deleteConfirm.type}:
              </p>
              <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/20">
                <p className="font-black text-red-400">{deleteConfirm.name}</p>
              </div>

              <p className="text-text-alt text-sm">
                This action cannot be undone. Type <span className="font-black text-red-500">{deleteConfirm.name}</span> to confirm:
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type ${deleteConfirm.name} to confirm`}
                className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-red-500 text-center uppercase tracking-widest"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 duo-btn duo-btn-white"
                >
                  CANCEL
                </button>
                <button
                  onClick={async () => {
                    if (confirmText.toLowerCase() === deleteConfirm.name.toLowerCase()) {
                      try {
                        await deleteConfirm.onConfirm()
                        setDeleteConfirm(null)
                        setConfirmText('')
                      } catch (err) {
                        console.error('Delete failed:', err)
                        showToast('Error performing deletion', 'error')
                      }
                    }
                  }}
                  disabled={confirmText.toLowerCase() !== deleteConfirm.name.toLowerCase()}
                  className={`flex-1 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${confirmText.toLowerCase() === deleteConfirm.name.toLowerCase()
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_0_#b91c1c]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentTab
