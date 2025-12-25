import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Lock, Star, CheckCircle, BookOpen, ChevronLeft, ChevronRight, X, Globe, Trophy, Zap, Target, Award } from 'lucide-react'
import useStore from '../store/useStore'
import { getSections } from '../data/sectionsData'
import { getLanguage } from '../data/languages'

function Home() {
  const navigate = useNavigate()
  const { nativeLanguage, learningLanguage, learningLanguages, setCurrentSection, completedLessons } = useStore()
  const [showSectionModal, setShowSectionModal] = useState(false)

  const currentLangData = learningLanguages.find(l => l.code === learningLanguage)
  const currentSectionIndex = currentLangData?.currentSection || 0

  const sections = getSections(nativeLanguage, learningLanguage)
  const targetLanguage = getLanguage(learningLanguage)

  if (!sections) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">
            Lessons for this language pair are coming soon!
          </p>
          <button
            onClick={() => navigate('/select-language')}
            className="duo-btn duo-btn-green px-6 py-3"
          >
            Choose Another Language
          </button>
        </div>
      </div>
    )
  }

  const currentSection = sections[currentSectionIndex]

  const isLessonUnlocked = (sectionIndex, unitIndex, lessonIndex) => {
    // First lesson is always unlocked
    if (sectionIndex === 0 && unitIndex === 0 && lessonIndex === 0) return true

    // Check if previous sections are completed (simplified for now: if user can see this section, it's unlocked)
    if (sectionIndex > currentSectionIndex) return false

    const currentUnit = sections[sectionIndex].units[unitIndex]

    // Check if previous lesson in same unit is completed
    if (lessonIndex > 0) {
      const prevLesson = currentUnit.lessons[lessonIndex - 1]
      return completedLessons.includes(`${learningLanguage}-${prevLesson.id}`)
    }

    // Check if last lesson of previous unit is completed
    if (unitIndex > 0) {
      const prevUnit = sections[sectionIndex].units[unitIndex - 1]
      const lastLesson = prevUnit.lessons[prevUnit.lessons.length - 1]
      return completedLessons.includes(`${learningLanguage}-${lastLesson.id}`)
    }

    // Check if last lesson of previous section is completed
    if (sectionIndex > 0 && unitIndex === 0) {
      const prevSection = sections[sectionIndex - 1]
      const lastUnit = prevSection.units[prevSection.units.length - 1]
      const lastLesson = lastUnit.lessons[lastUnit.lessons.length - 1]
      return completedLessons.includes(`${learningLanguage}-${lastLesson.id}`)
    }

    return false
  }

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(`${learningLanguage}-${lessonId}`)
  }

  const handleSectionChange = (index) => {
    setCurrentSection(learningLanguage, index)
  }

  return (
    <div className="min-h-screen">
      {/* Section Header - Vibrant banner */}
      <div className="bg-brand-secondary border-b-2 border-brand-secondary-dark">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => handleSectionChange(Math.max(0, currentSectionIndex - 1))}
                disabled={currentSectionIndex === 0}
                className="text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-center sm:text-left min-w-0 flex-1 px-2">
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider truncate">SECTION {currentSection.id} - {currentSection.name}</p>
                <h2 className="text-white font-black text-xl truncate">{currentSection.description}</h2>
              </div>
              <button
                onClick={() => handleSectionChange(Math.min(sections.length - 1, currentSectionIndex + 1))}
                disabled={currentSectionIndex === sections.length - 1}
                className="text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <button
              onClick={() => setShowSectionModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary-dark text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-[2px]"
            >
              <BookOpen size={18} />
              <span>GUIDEBOOK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Progress */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest">Section {currentSection.id} of {sections.length}</p>
          <div className="flex-1 max-w-xs h-3 bg-gray-200 dark:bg-[#37464f] rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-500"
              style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">{currentSection.units.length} units</p>
        </div>
      </div>

      {/* Learning Path */}
      <div className="max-w-2xl mx-auto px-4 pb-24 overflow-x-hidden">
        {currentSection.units.map((unit, unitIndex) => (
          <div key={unit.id} className="relative">
            {/* Lessons in circular path */}
            <div className="flex flex-col items-center py-4">
              {unit.lessons.map((lesson, lessonIndex) => {
                const unlocked = isLessonUnlocked(currentSectionIndex, unitIndex, lessonIndex)
                const completed = isLessonCompleted(lesson.id)
                const isFirst = currentSectionIndex === 0 && unitIndex === 0 && lessonIndex === 0

                // Create a winding path pattern
                const patterns = [
                  { x: 0 },
                  { x: -50 },
                  { x: -80 },
                  { x: -50 },
                  { x: 0 },
                  { x: 50 },
                  { x: 80 },
                  { x: 50 },
                ]
                const patternIndex = lessonIndex % patterns.length
                const offset = patterns[patternIndex].x

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                    style={{ marginLeft: offset }}
                  >
                    {/* START button for first lesson */}
                    {isFirst && unlocked && !completed && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-brand-primary text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest animate-bounce shadow-lg relative">
                          START
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-primary rotate-45" />
                        </div>
                      </div>
                    )}

                    {/* Lesson Circle */}
                    <button
                      onClick={() => unlocked && navigate(`/lesson/${unit.id}/${lesson.id}`)}
                      disabled={!unlocked}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all border-b-8 active:border-b-0 active:translate-y-2 ${completed
                        ? 'bg-brand-primary border-brand-primary-dark shadow-lg'
                        : unlocked
                          ? 'bg-brand-primary border-brand-primary-dark shadow-lg ring-4 ring-brand-primary/30'
                          : 'bg-gray-200 dark:bg-[#37464f] border-gray-300 dark:border-[#2a3f4a]'
                        }`}
                    >
                      {completed ? (
                        <CheckCircle size={32} className="text-white" />
                      ) : unlocked ? (
                        <Star size={32} className="text-white" />
                      ) : (
                        <Lock size={28} className="text-gray-400 dark:text-[#58687a]" />
                      )}

                      {/* Crown for completed */}
                      {completed && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#131f24]">
                          <span className="text-sm">👑</span>
                        </div>
                      )}
                    </button>

                    {/* Connecting path to next lesson */}
                    {lessonIndex < unit.lessons.length - 1 && (
                      <div className="h-10 w-3 bg-gray-200 dark:bg-[#37464f] my-1 rounded-full" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Unit divider */}
            {unitIndex < currentSection.units.length - 1 && (
              <div className="flex items-center justify-center my-12">
                <div className="flex-1 h-1 bg-border-main rounded-full" />
                <div className="px-6 py-3 bg-bg-card rounded-2xl border-2 border-border-main shadow-sm transition-colors duration-300">
                  <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest">
                    Unit {currentSection.units[unitIndex + 1]?.id}: {currentSection.units[unitIndex + 1]?.title}
                  </p>
                </div>
                <div className="flex-1 h-1 bg-gray-200 dark:bg-[#37464f] rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section Selector Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-bg-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border-2 border-border-main shadow-2xl flex flex-col transition-colors duration-300">
            <div className="p-6 border-b-2 border-black/10 flex items-center justify-between bg-brand-secondary">
              <div className="flex items-center gap-3 text-white">
                <BookOpen size={24} />
                <h2 className="text-xl font-black uppercase tracking-wide">Course Sections</h2>
              </div>
              <button
                onClick={() => setShowSectionModal(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {sections.map((section, index) => {
                const isCurrent = index === currentSectionIndex
                const isUnlocked = index <= currentSectionIndex || (index > 0 && sections[index - 1].units.every(u => u.lessons.every(l => isLessonCompleted(l.id))))

                return (
                  <button
                    key={section.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      handleSectionChange(index)
                      setShowSectionModal(false)
                    }}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${isCurrent
                      ? 'border-brand-primary bg-brand-primary/5'
                      : isUnlocked
                        ? 'border-border-main hover:border-brand-primary/30 hover:bg-bg-alt'
                        : 'border-border-main opacity-60 grayscale cursor-not-allowed'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${isCurrent ? 'bg-brand-primary text-white' : 'bg-bg-alt text-text-alt'
                      }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-black text-xs uppercase tracking-widest ${isCurrent ? 'text-brand-primary' : 'text-gray-400'}`}>
                          Section {section.id}
                        </p>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xl font-black ${isCurrent ? 'text-brand-primary' : 'text-gray-900 dark:text-white'}`}>
                        {section.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mt-1">
                        {section.description}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs font-black text-gray-400">
                          <Target size={14} />
                          {section.units.length} UNITS
                        </div>
                        <div className="flex items-center gap-1 text-xs font-black text-gray-400">
                          <Zap size={14} />
                          {section.units.reduce((acc, u) => acc + u.lessons.length, 0)} LESSONS
                        </div>
                      </div>
                    </div>

                    {!isUnlocked && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <Lock size={24} className="text-gray-300 dark:text-gray-600" />
                      </div>
                    )}

                    {isUnlocked && !isCurrent && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={24} className="text-brand-primary" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-6 border-t-2 border-border-main bg-bg-alt">
              <p className="text-center text-text-alt text-sm font-bold">
                Complete more lessons to unlock new sections!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
