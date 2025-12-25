import { useMemo } from 'react'

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function FillBlankExercise({
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
      <h2 className="text-xl md:text-2xl font-bold text-text-main dark:text-white mb-2">
        Fill in the blank
      </h2>
      <p className="text-text-alt mb-6 md:mb-8">Complete the sentence</p>

      {/* Sentence with blank */}
      <div className="bg-bg-card rounded-xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-border-main">
        <p className="text-lg md:text-2xl text-text-main dark:text-white leading-relaxed">
          {exercise.sentence.split('___').map((part, index, array) => (
            <span key={index}>
              {part}
              {index < array.length - 1 && (
                <span
                  className={`inline-block min-w-[80px] md:min-w-[100px] mx-1 md:mx-2 px-2 md:px-4 py-1 rounded-lg border-b-4 text-base md:text-xl ${selectedAnswer
                    ? isChecked
                      ? isCorrect
                        ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                        : 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400'
                      : 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                    : 'bg-bg-alt border-border-main text-text-alt'
                    }`}
                >
                  {selectedAnswer || '?'}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrectAnswer = option === exercise.answer

          let buttonStyle = 'border-border-main bg-bg-card hover:bg-bg-alt hover:border-brand-primary/50'
          let textStyle = 'text-text-main dark:text-white'

          if (isChecked) {
            if (isCorrectAnswer) {
              buttonStyle = 'border-green-500 bg-green-500/20'
              textStyle = 'text-green-600 dark:text-green-400'
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-red-500 bg-red-500/20'
              textStyle = 'text-red-600 dark:text-red-400'
            } else {
              buttonStyle = 'border-border-main bg-bg-card opacity-50'
            }
          } else if (isSelected) {
            buttonStyle = 'border-brand-primary bg-brand-primary/10'
            textStyle = 'text-brand-primary'
          }

          return (
            <button
              key={index}
              onClick={() => !isChecked && setSelectedAnswer(option)}
              disabled={isChecked}
              className={`p-4 rounded-xl border-2 text-center transition-all ${buttonStyle}`}
            >
              <span
                className={`text-lg font-semibold ${textStyle}`}
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

export default FillBlankExercise
