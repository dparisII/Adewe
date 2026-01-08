import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Heart, Check, Volume2 } from 'lucide-react'
import useStore from '../store/useStore'
import { getLesson } from '../data/sectionsData'
import TranslationExercise from '../components/exercises/TranslationExercise'
import MatchingExercise from '../components/exercises/MatchingExercise'
import MultipleChoiceExercise from '../components/exercises/MultipleChoiceExercise'
import FillBlankExercise from '../components/exercises/FillBlankExercise'
import { useSound } from '../hooks/useSound'

import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { triggerMilestone } from '../lib/communityTriggers'

function Lesson() {
  const { unitId, lessonId } = useParams()
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()
  const {
    nativeLanguage,
    learningLanguage,
    hearts,
    loseHeart,
    addXp,
    incrementStreak,
    completeLesson,
    completedLessons,
    recordMistake,
    addGems
  } = useStore()

  const lesson = getLesson(nativeLanguage, learningLanguage, unitId, lessonId)

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [shuffledExercises, setShuffledExercises] = useState([])
  const [boxState, setBoxState] = useState('closed') // closed, opening, opened
  const [boxReward, setBoxReward] = useState(0)
  const { playCorrect, playError, playComplete, playClick } = useSound()

  useEffect(() => {
    if (!lesson) {
      navigate('/learn')
    } else {
      // Robust shuffle: Fisher-Yates
      const exercises = [...lesson.exercises]
      for (let i = exercises.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
      }
      setShuffledExercises(exercises)
    }
  }, [lesson, navigate])

  if (!lesson || shuffledExercises.length === 0) return null

  const currentExercise = shuffledExercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex) / shuffledExercises.length) * 100

  const recordAttempt = async (isCorrect, answer) => {
    // Record to local store for Immediate Admin visibility
    if (!isCorrect) {
      recordMistake({
        exercise_id: currentExercise.id || `${lessonId}-${currentExerciseIndex}`,
        exercise_type: currentExercise.type,
        correct_answer: currentExercise.answer,
        wrong_answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
        language: learningLanguage,
        user_id: profile?.id || 'guest'
      })
    }

    if (!profile?.id) return

    try {
      // 1. Try the robust RPC function
      const { error: rpcError } = await supabase.rpc('log_exercise_attempt', {
        p_user_id: profile.id,
        p_exercise_id: currentExercise.id || `${lessonId}-${currentExerciseIndex}`,
        p_lesson_id: lessonId,
        p_language: learningLanguage,
        p_exercise_type: currentExercise.type,
        p_question: currentExercise.question || currentExercise.text || 'Exercise',
        p_correct_answer: typeof currentExercise.answer === 'object' ? JSON.stringify(currentExercise.answer) : String(currentExercise.answer || ''),
        p_user_answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer || ''),
        p_is_correct: isCorrect,
        p_time_spent: null,
        p_error_type: null
      })

      // 2. Fallback to direct insert if RPC failed (likely function not created)
      if (rpcError) {
        console.warn('RPC log_exercise_attempt failed, falling back to direct insert:', rpcError)
        await supabase.from('exercise_attempts').insert({
          user_id: profile.id,
          exercise_id: currentExercise.id || `${lessonId}-${currentExerciseIndex}`,
          lesson_id: lessonId,
          language: learningLanguage,
          exercise_type: currentExercise.type,
          question: currentExercise.question || currentExercise.text || 'Exercise',
          correct_answer: typeof currentExercise.answer === 'object' ? JSON.stringify(currentExercise.answer) : String(currentExercise.answer || ''),
          user_answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer || ''),
          is_correct: isCorrect
        })
      }
    } catch (err) {
      console.error('Failed to record attempt:', err)
    }
  }

  const handleCheck = () => {
    if (!selectedAnswer) return

    let correct = false

    if (currentExercise.type === 'matching') {
      // Check if completed without mistakes
      correct = selectedAnswer?.completed === true
    } else if (currentExercise.type === 'translation' || currentExercise.type === 'fillBlank') {
      correct = selectedAnswer === currentExercise.answer
    } else if (currentExercise.type === 'multipleChoice') {
      correct = selectedAnswer === currentExercise.answer
    }

    setIsCorrect(correct)
    setIsChecked(true)
    recordAttempt(correct, selectedAnswer)

    if (correct) {
      setXpEarned((prev) => prev + 10)
      setCorrectAnswers((prev) => prev + 1)
      playCorrect()
    } else {
      loseHeart()
      playError()
    }
  }

  const handleContinue = () => {
    if (hearts === 0 && !isCorrect) {
      navigate('/learn')
      return
    }

    if (currentExerciseIndex < shuffledExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsChecked(false)
      setIsCorrect(false)
    } else {
      // Lesson complete - play celebration sound
      playComplete()
      const newXp = (profile?.xp || 0) + xpEarned
      const lessonKey = `${learningLanguage}-${lessonId}`
      const newCompletedLessons = Array.from(new Set([...(profile?.completed_lessons || []), lessonKey]))

      // Update local store
      addXp(xpEarned)
      incrementStreak()
      completeLesson(lessonId, learningLanguage)

      // Update Supabase
      updateProfile({
        xp: newXp,
        completed_lessons: newCompletedLessons
      }).catch(err => console.error('Failed to sync progress:', err))

      // Trigger Milestones
      if (newCompletedLessons.length === 1) {
        triggerMilestone(profile.id, 'first_lesson')
      }
      if (newXp >= 50) {
        triggerMilestone(profile.id, 'milestone_50xp')
      }

      setShowResults(true)
    }
  }

  const handleExit = () => {
    navigate('/learn')
  }

  const handleOpenBox = () => {
    if (boxState !== 'closed') return
    playClick()
    setBoxState('opening')

    // Tiered rewards based on lesson context
    let minGems = 3
    let maxGems = 25

    // Check if it's a unit or section completion (based on lessonId/unitId naming conventions)
    const isUnitComplete = lessonId?.toString().toLowerCase().includes('final') ||
      lessonId?.toString().toLowerCase().includes('unit')
    const isSectionComplete = lessonId?.toString().toLowerCase().includes('section')

    if (isSectionComplete) {
      minGems = 100
      maxGems = 500
    } else if (isUnitComplete) {
      minGems = 50
      maxGems = 300
    } else {
      // Standard lesson rewards: 3, 10, 15, max 25
      const options = [3, 10, 15, 25]
      const reward = options[Math.floor(Math.random() * options.length)]

      setTimeout(() => {
        setBoxReward(reward)
        addGems(reward)
        setBoxState('opened')
        playComplete()
      }, 1200)
      return
    }

    setTimeout(() => {
      const reward = Math.floor(Math.random() * (maxGems - minGems + 1)) + minGems
      setBoxReward(reward)
      addGems(reward)
      setBoxState('opened')
      playComplete()
    }, 1200)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#131f24] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-2 border-[#e5e5e5] dark:border-[#37464f] animate-bounce-in">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Lesson Complete!</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">You're making amazing progress!</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#f7f7f7] dark:bg-[#2a3f4a] rounded-2xl p-5 border-b-4 border-[#e5e5e5] dark:border-[#1a2c35]">
              <p className="text-[#ffc800] font-black text-3xl">+{xpEarned}</p>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">XP Earned</p>
            </div>
            <div className="bg-[#f7f7f7] dark:bg-[#2a3f4a] rounded-2xl p-5 border-b-4 border-[#e5e5e5] dark:border-[#1a2c35]">
              <p className="text-brand-primary font-black text-3xl">
                {Math.round((correctAnswers / lesson.exercises.length) * 100)}%
              </p>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Accuracy</p>
            </div>
          </div>

          {/* Mystery Box Reward */}
          <div className="mb-8 p-6 bg-gradient-to-b from-brand-secondary/5 to-brand-secondary/20 rounded-3xl border-2 border-brand-secondary/30 relative overflow-hidden group">
            <h3 className="text-brand-secondary font-black text-sm uppercase tracking-widest mb-4">Mystery Reward!</h3>

            <div
              onClick={handleOpenBox}
              className={`relative cursor-pointer transition-all duration-500 transform ${boxState === 'closed' ? 'hover:scale-110' : ''}`}
            >
              {boxState === 'closed' && (
                <div className="text-7xl animate-bounce-slow drop-shadow-xl select-none">🎁</div>
              )}

              {boxState === 'opening' && (
                <div className="text-7xl animate-ping opacity-75 select-none">🎁</div>
              )}

              {boxState === 'opened' && (
                <div className="animate-bounce-in">
                  <div className="text-6xl mb-2 drop-shadow-lg select-none">💎</div>
                  <p className="text-brand-secondary font-black text-3xl animate-pulse">+{boxReward}</p>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Diamonds Found!</p>
                </div>
              )}

              {boxState === 'closed' && (
                <p className="mt-4 text-brand-secondary font-black text-xs uppercase tracking-widest animate-pulse">Tap to open!</p>
              )}
            </div>

            {/* Sparkle effects for opened state */}
            {boxState === 'opened' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 left-3/4 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-75"></div>
                <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-150"></div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-brand-primary hover:brightness-110 text-white font-black py-4 rounded-2xl transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 uppercase tracking-widest"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={28} strokeWidth={3} />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-4 bg-gray-200 dark:bg-[#37464f] rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-2">
            <Heart
              size={28}
              className={hearts > 0 ? 'text-[#ff4b4b] fill-[#ff4b4b]' : 'text-gray-300 dark:text-gray-600'}
              strokeWidth={2.5}
            />
            <span className={`font-black text-xl ${hearts > 0 ? 'text-[#ff4b4b]' : 'text-gray-300 dark:text-gray-600'}`}>{hearts}</span>
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
        className={`border-t-2 px-4 py-6 md:py-8 safe-area-bottom transition-colors duration-300 ${isChecked
          ? isCorrect
            ? 'bg-[#d7ffb8] dark:bg-[#1a2c35] border-[#a5ed6e] dark:border-brand-primary'
            : 'bg-[#ffdfe0] dark:bg-[#1a2c35] border-[#ffb8bb] dark:border-[#ff4b4b]'
          : 'bg-bg-main border-border-main'
          }`}
      >
        <div className="max-w-4xl mx-auto">
          {isChecked && (
            <div className="flex items-center gap-4 mb-6 animate-slide-up">
              {isCorrect ? (
                <>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check size={32} className="text-brand-primary" strokeWidth={4} />
                  </div>
                  <div>
                    <p className="text-[#46a302] dark:text-brand-primary font-black text-xl md:text-2xl uppercase tracking-wide">Excellent!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <X size={32} className="text-[#ff4b4b]" strokeWidth={4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#ea2b2b] dark:text-[#ff4b4b] font-black text-xl md:text-2xl uppercase tracking-wide truncate">Correct solution:</p>
                    <p className="text-[#ea2b2b] dark:text-[#ff4b4b] font-bold text-lg break-words">
                      {currentExercise.answer}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={isChecked ? handleContinue : handleCheck}
            disabled={!selectedAnswer && !isChecked}
            className={`w-full py-4 rounded-2xl font-black text-lg md:text-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 uppercase tracking-widest ${selectedAnswer || isChecked
              ? isChecked
                ? isCorrect
                  ? 'bg-brand-primary border-[#46a302] text-white'
                  : 'bg-[#ff4b4b] border-[#ea2b2b] text-white'
                : 'bg-brand-primary border-[#46a302] text-white'
              : 'bg-gray-200 dark:bg-[#37464f] text-gray-400 dark:text-gray-500 border-transparent cursor-not-allowed'
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
