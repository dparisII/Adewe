import { useNavigate } from 'react-router-dom'
import { Lock, Star, CheckCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { getLessons } from '../data/lessons'
import { getLanguage } from '../data/languages'

function Home() {
  const navigate = useNavigate()
  const { nativeLanguage, learningLanguage, completedLessons } = useStore()
  
  const lessonData = getLessons(nativeLanguage, learningLanguage)
  const targetLanguage = getLanguage(learningLanguage)

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">
            Lessons for this language pair are coming soon!
          </p>
          <button
            onClick={() => navigate('/select-language')}
            className="bg-[#58cc02] text-white px-6 py-3 rounded-xl font-bold"
          >
            Choose Another Language
          </button>
        </div>
      </div>
    )
  }

  const isLessonUnlocked = (unitIndex, lessonIndex) => {
    if (unitIndex === 0 && lessonIndex === 0) return true
    
    // Check if previous lesson in same unit is completed
    if (lessonIndex > 0) {
      const prevLesson = lessonData.units[unitIndex].lessons[lessonIndex - 1]
      return completedLessons.includes(`${learningLanguage}-${prevLesson.id}`)
    }
    
    // Check if last lesson of previous unit is completed
    if (unitIndex > 0) {
      const prevUnit = lessonData.units[unitIndex - 1]
      const lastLesson = prevUnit.lessons[prevUnit.lessons.length - 1]
      return completedLessons.includes(`${learningLanguage}-${lastLesson.id}`)
    }
    
    return false
  }

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(`${learningLanguage}-${lessonId}`)
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-[#1a2c35] px-6 py-3 rounded-full mb-4">
            <span className="text-3xl">{targetLanguage?.flag}</span>
            <span className="text-white font-bold text-xl">
              {targetLanguage?.name}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Your Learning Path</h1>
        </div>

        {/* Units */}
        <div className="space-y-12">
          {lessonData.units.map((unit, unitIndex) => (
            <div key={unit.id} className="relative">
              {/* Unit Header */}
              <div className="bg-gradient-to-r from-[#58cc02] to-[#4caf00] rounded-xl p-4 mb-6">
                <h2 className="text-white font-bold text-xl">{unit.title}</h2>
                <p className="text-white/80">{unit.description}</p>
              </div>

              {/* Lessons Path */}
              <div className="flex flex-col items-center">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const unlocked = isLessonUnlocked(unitIndex, lessonIndex)
                  const completed = isLessonCompleted(lesson.id)
                  
                  // Zigzag pattern
                  const offset = lessonIndex % 2 === 0 ? '-50px' : '50px'

                  return (
                    <div
                      key={lesson.id}
                      className="relative"
                      style={{ marginLeft: offset }}
                    >
                      {/* Connecting Line */}
                      {lessonIndex < unit.lessons.length - 1 && (
                        <div
                          className="absolute top-full left-1/2 w-1 h-8 bg-[#3c5a6a]"
                          style={{ transform: 'translateX(-50%)' }}
                        />
                      )}

                      {/* Lesson Button */}
                      <button
                        onClick={() =>
                          unlocked && navigate(`/lesson/${unit.id}/${lesson.id}`)
                        }
                        disabled={!unlocked}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all mb-8 ${
                          completed
                            ? 'bg-[#58cc02] hover:bg-[#4caf00] shadow-lg shadow-[#58cc02]/30'
                            : unlocked
                            ? 'bg-[#58cc02] hover:bg-[#4caf00] animate-pulse-green'
                            : 'bg-[#3c5a6a] cursor-not-allowed'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle size={36} className="text-white" />
                        ) : unlocked ? (
                          <Star size={36} className="text-white" />
                        ) : (
                          <Lock size={28} className="text-gray-500" />
                        )}

                        {/* Lesson Info Tooltip */}
                        <div
                          className={`absolute ${
                            lessonIndex % 2 === 0 ? 'left-full ml-4' : 'right-full mr-4'
                          } top-1/2 -translate-y-1/2 bg-[#1a2c35] rounded-lg px-4 py-2 whitespace-nowrap`}
                        >
                          <p className="text-white font-semibold text-sm">
                            {lesson.title}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {lesson.exercises.length} exercises
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a2c35] px-6 py-3 rounded-full">
            <CheckCircle size={20} className="text-[#58cc02]" />
            <span className="text-gray-400">
              {completedLessons.filter(l => l.startsWith(learningLanguage)).length} of {lessonData.units.reduce((acc, unit) => acc + unit.lessons.length, 0)} lessons completed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
