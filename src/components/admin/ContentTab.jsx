import { useState, useEffect } from 'react'
import {
  Plus, Edit, Trash2, ChevronRight, ChevronDown, Globe, Layers,
  BookOpen, FileQuestion, Volume2, Save, X, Mic, CheckCircle, XCircle, Gem
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { availableLanguages, getFlag } from '../../data/languageFlags'
import { getAllUnits } from '../../data/sectionsData'

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

      if (langError) {
        setLanguages(availableLanguages.slice(0, 5).map((l, i) => ({
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
        setLanguages(langData || [])
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


  // Populate with mock data from sectionsData if Supabase fails or is empty
  // User requested "10 sections and 15 units", so we enforce this structure via mock data if real data is missing.
  useEffect(() => {
    if (lessons.length === 0 && !loading) {
      // Flatten all units from all languages
      const allMockUnits = []
      const allMockLessons = []

      // Use a few dummy languages to demonstrate the structure
      const demoLangs = ['english-amharic', 'english-tigrinya']

      demoLangs.forEach(langPair => {
        const [native, learning] = langPair.split('-')
        const units = getAllUnits(native, learning)

        units.forEach(unit => {
          allMockUnits.push(unit)
          unit.lessons.forEach(lesson => {
            allMockLessons.push({
              ...lesson,
              language: learning,
              level: unit.sectionId,
              xp_reward: 10,
              is_published: true
            })
          })
        })
      })

      setLessons(allMockLessons)
    }
  }, [loading, lessons.length])

  const handleSaveExercise = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newExercise = {
      id: `custom-${Date.now()}`,
      type: formData.get('type'),
      question: formData.get('question'),
      correct_answer: formData.get('answer'),
      options: formData.get('options')?.split(',').map(s => s.trim()) || [],
      created_at: new Date().toISOString()
    }

    setExercises([newExercise, ...exercises])
    setShowModal(null)
    showToast('Exercise created successfully!', 'success')
  }


  const sections = [
    { id: 'languages', label: 'Languages', icon: Globe, count: languages.length, color: 'text-brand-primary' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, count: lessons.length, color: 'text-[#ffc800]' },
    { id: 'exercises', label: 'Exercises', icon: FileQuestion, count: exercises.length, color: 'text-[#1cb0f6]' },
  ]

  const lessonsByLanguage = lessons.reduce((acc, lesson) => {
    const lang = lesson.language || 'unknown'
    if (!acc[lang]) acc[lang] = {}
    const level = lesson.level || 1
    if (!acc[lang][level]) acc[lang][level] = []
    acc[lang][level].push(lesson)
    return acc
  }, {})

  const toggleLanguageExpand = (lang) => {
    setExpandedLanguages(prev => ({ ...prev, [lang]: !prev[lang] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
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

          <div className="space-y-6">
            {Object.entries(lessonsByLanguage).map(([lang, levels]) => (
              <div key={lang} className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleLanguageExpand(lang)}
                  className="w-full p-6 flex items-center justify-between hover:bg-[#f7f7f7] dark:hover:bg-[#37464f]/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getFlag(lang)}</span>
                    <div className="text-left">
                      <h3 className="text-text-main font-black text-xl uppercase tracking-tight">{lang}</h3>
                      <p className="text-text-alt font-black uppercase tracking-widest text-[10px] mt-1">
                        {Object.values(levels).flat().length} LESSONS • {Object.keys(levels).length} LEVELS
                      </p>
                    </div>
                  </div>
                  {expandedLanguages[lang] ? (
                    <ChevronDown size={24} className="text-text-alt" />
                  ) : (
                    <ChevronRight size={24} className="text-text-alt" />
                  )}
                </button>

                {expandedLanguages[lang] && (
                  <div className="border-t-2 border-border-main dark:border-[#37464f]">
                    {Object.entries(levels)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([level, levelLessons]) => (
                        <div key={level} className="border-b-2 border-border-main last:border-b-0">
                          <div className="px-6 py-3 bg-bg-alt flex items-center gap-3">
                            <Layers size={16} className="text-[#ce82ff]" />
                            <span className="text-[#ce82ff] font-black text-xs uppercase tracking-widest">Level {level}</span>
                            <span className="text-text-alt font-black text-[10px] uppercase tracking-widest">({levelLessons.length} LESSONS)</span>
                          </div>

                          <div className="divide-y-2 divide-border-main dark:divide-[#37464f]">
                            {levelLessons.map(lesson => (
                              <div key={lesson.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#f7f7f7]/50 dark:hover:bg-[#37464f]/20 transition-all gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                  <div className="w-12 h-12 bg-[#ddf4ff] dark:bg-[#1cb0f6]/20 rounded-2xl flex items-center justify-center border-2 border-[#84d8ff] dark:border-[#1cb0f6]/30 shadow-sm flex-shrink-0">
                                    <BookOpen size={24} className="text-[#1cb0f6]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-text-main font-black text-base truncate">{lesson.title}</p>
                                    <p className="text-text-alt font-bold text-sm line-clamp-1">{lesson.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto pl-16 md:pl-0">
                                  <div className="flex items-center gap-1.5">
                                    <Gem size={18} className="text-[#1cb0f6]" fill="#1cb0f6" />
                                    <span className="text-[#1cb0f6] font-black text-sm">+{lesson.xp_reward} XP</span>
                                  </div>
                                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${lesson.is_published !== false ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-[#ffc800]/10 text-[#ffc800] border-[#ffc800]/20'}`}>
                                    {lesson.is_published !== false ? 'Published' : 'Draft'}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => { setEditingItem(lesson); setShowModal('lesson') }}
                                      className="p-2 text-text-alt hover:text-[#1cb0f6] hover:bg-[#ddf4ff] rounded-xl transition-all"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      className="p-2 text-text-alt hover:text-[#ff4b4b] hover:bg-[#fee2e2] rounded-xl transition-all"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
              <div key={exercise.id} className="bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-6 hover:border-[#1cb0f6]/30 transition-all shadow-sm group">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${exercise.type === 'translation' ? 'bg-[#ddf4ff] text-[#1cb0f6] border-[#84d8ff]' :
                    exercise.type === 'multiple_choice' ? 'bg-[#f3e8ff] text-[#ce82ff] border-[#d8b4fe]' :
                      exercise.type === 'fill_blank' ? 'bg-[#fef9c3] text-[#ffc800] border-[#fde047]' :
                        'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                    }`}>
                    {exercise.type?.replace('_', ' ')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingItem(exercise); setShowModal('exercise') }}
                      className="p-2 text-text-alt hover:text-[#1cb0f6] hover:bg-[#ddf4ff] rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-text-alt hover:text-[#ff4b4b] hover:bg-[#fee2e2] rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-text-main font-black text-lg mb-3 leading-tight group-hover:text-[#1cb0f6] transition-colors">{exercise.question}</p>
                <div className="bg-bg-alt p-4 rounded-2xl border-2 border-border-main">
                  <p className="text-text-alt font-black text-[10px] uppercase tracking-widest mb-1">Correct Answer</p>
                  <p className="text-brand-primary font-black">{exercise.correct_answer}</p>
                </div>
                {exercise.audio_url && (
                  <div className="flex items-center gap-2 mt-4 text-[#1cb0f6] font-black text-xs uppercase tracking-widest">
                    <Volume2 size={16} /> HAS AUDIO CONTENT
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentTab
