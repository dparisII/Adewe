import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Heart, Check, Volume2 } from 'lucide-react'
import useStore from '../store/useStore'
import { getLesson } from '../data/lessons'
import TranslationExercise from '../components/exercises/TranslationExercise'
import MatchingExercise from '../components/exercises/MatchingExercise'
import MultipleChoiceExercise from '../components/exercises/MultipleChoiceExercise'
import FillBlankExercise from '../components/exercises/FillBlankExercise'

function Lesson() {
  const { unitId, lessonId } = useParams()
  const navigate = useNavigate()
  const {
    nativeLanguage,
    learningLanguage,
    hearts,
    loseHeart,
    addXp,
    completeLesson,
  } = useStore()

  const lesson = getLesson(nativeLanguage, learningLanguage, unitId, lessonId)
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  useEffect(() => {
    if (!lesson) {
      navigate('/learn')
    }
  }, [lesson, navigate])

  if (!lesson) return null

  const currentExercise = lesson.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100

  const handleCheck = () => {
    if (!selectedAnswer) return

    let correct = false

    if (currentExercise.type === 'matching') {
      correct = selectedAnswer === true
    } else if (currentExercise.type === 'translation' || currentExercise.type === 'fillBlank') {
      correct = selectedAnswer === currentExercise.answer
    } else if (currentExercise.type === 'multipleChoice') {
      correct = selectedAnswer === currentExercise.answer
    }

    setIsCorrect(correct)
    setIsChecked(true)

    if (correct) {
      setXpEarned((prev) => prev + 10)
      setCorrectAnswers((prev) => prev + 1)
    } else {
      loseHeart()
    }
  }

  const handleContinue = () => {
    if (hearts === 0 && !isCorrect) {
      navigate('/learn')
      return
    }

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsChecked(false)
      setIsCorrect(false)
    } else {
      // Lesson complete
      addXp(xpEarned)
      completeLesson(lessonId, learningLanguage)
      setShowResults(true)
    }
  }

  const handleExit = () => {
    navigate('/learn')
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center p-4">
        <div className="bg-[#1a2c35] rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h1>
          <p className="text-gray-400 mb-6">Great job on finishing this lesson!</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#2a3f4a] rounded-xl p-4">
              <p className="text-yellow-400 font-bold text-2xl">+{xpEarned}</p>
              <p className="text-gray-400 text-sm">XP Earned</p>
            </div>
            <div className="bg-[#2a3f4a] rounded-xl p-4">
              <p className="text-green-400 font-bold text-2xl">
                {Math.round((correctAnswers / lesson.exercises.length) * 100)}%
              </p>
              <p className="text-gray-400 text-sm">Accuracy</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-[#58cc02] hover:bg-[#4caf00] text-white font-bold py-4 rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a2c35] border-b border-[#3c5a6a] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-[#3c5a6a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#58cc02] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <Heart
              size={24}
              className={hearts > 0 ? 'text-red-500 fill-red-500' : 'text-gray-500'}
            />
            <span className="text-white font-bold">{hearts}</span>
          </div>
        </div>
      </header>

      {/* Exercise Content */}
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          {currentExercise.type === 'translation' && (
            <TranslationExercise
              exercise={currentExercise}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              isChecked={isChecked}
              isCorrect={isCorrect}
            />
          )}

          {currentExercise.type === 'matching' && (
            <MatchingExercise
              exercise={currentExercise}
              setSelectedAnswer={setSelectedAnswer}
              isChecked={isChecked}
            />
          )}

          {currentExercise.type === 'multipleChoice' && (
            <MultipleChoiceExercise
              exercise={currentExercise}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              isChecked={isChecked}
              isCorrect={isCorrect}
            />
          )}

          {currentExercise.type === 'fillBlank' && (
            <FillBlankExercise
              exercise={currentExercise}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              isChecked={isChecked}
              isCorrect={isCorrect}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t px-4 py-4 safe-area-bottom ${
          isChecked
            ? isCorrect
              ? 'bg-green-900/30 border-green-700'
              : 'bg-red-900/30 border-red-700'
            : 'bg-[#1a2c35] border-[#3c5a6a]'
        }`}
      >
        <div className="max-w-2xl mx-auto">
          {isChecked && (
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              {isCorrect ? (
                <>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={18} className="text-white md:hidden" />
                    <Check size={24} className="text-white hidden md:block" />
                  </div>
                  <div>
                    <p className="text-green-400 font-bold text-sm md:text-base">Correct!</p>
                    <p className="text-green-300 text-xs md:text-sm">+10 XP</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <X size={18} className="text-white md:hidden" />
                    <X size={24} className="text-white hidden md:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-red-400 font-bold text-sm md:text-base">Incorrect</p>
                    <p className="text-red-300 text-xs md:text-sm truncate">
                      Correct: {currentExercise.answer}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={isChecked ? handleContinue : handleCheck}
            disabled={!selectedAnswer && !isChecked}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all ${
              selectedAnswer || isChecked
                ? isChecked
                  ? isCorrect
                    ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white'
                  : 'bg-[#58cc02] hover:bg-[#4caf00] active:bg-[#3d9902] text-white'
                : 'bg-[#3c5a6a] text-gray-500 cursor-not-allowed'
            }`}
          >
            {isChecked ? 'Continue' : 'Check'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Lesson
