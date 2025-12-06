import { useMemo } from 'react'
import { Volume2 } from 'lucide-react'

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function TranslationExercise({
  exercise,
  selectedAnswer,
  setSelectedAnswer,
  isChecked,
  isCorrect,
}) {
  // Shuffle options once when exercise loads
  const shuffledOptions = useMemo(() => shuffleArray(exercise.options), [exercise])

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        Translate this word
      </h2>
      <p className="text-gray-400 mb-6 md:mb-8">Select the correct translation</p>

      {/* Word to translate */}
      <div className="bg-[#1a2c35] rounded-xl p-4 md:p-6 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
        <button className="w-10 h-10 md:w-12 md:h-12 bg-[#58cc02] rounded-full flex items-center justify-center hover:bg-[#4caf00] transition-colors flex-shrink-0">
          <Volume2 size={20} className="text-white md:hidden" />
          <Volume2 size={24} className="text-white hidden md:block" />
        </button>
        <span className="text-xl md:text-3xl font-bold text-white">
          {exercise.question}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrectAnswer = option === exercise.answer

          let buttonStyle = 'border-[#3c5a6a] bg-[#1a2c35] hover:border-[#58cc02]'

          if (isChecked) {
            if (isCorrectAnswer) {
              buttonStyle = 'border-green-500 bg-green-500/20'
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-red-500 bg-red-500/20'
            }
          } else if (isSelected) {
            buttonStyle = 'border-[#58cc02] bg-[#58cc02]/10'
          }

          return (
            <button
              key={index}
              onClick={() => !isChecked && setSelectedAnswer(option)}
              disabled={isChecked}
              className={`p-4 rounded-xl border-2 text-left transition-all ${buttonStyle}`}
            >
              <span
                className={`text-lg font-semibold ${
                  isChecked && isCorrectAnswer
                    ? 'text-green-400'
                    : isChecked && isSelected && !isCorrect
                    ? 'text-red-400'
                    : 'text-white'
                }`}
              >
                {option}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TranslationExercise
