import { useState, useMemo } from 'react'

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function MultipleChoiceExercise({
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
        Choose the correct answer
      </h2>
      <p className="text-text-alt mb-6 md:mb-8">Select the best option</p>

      {/* Question */}
      <div className="bg-bg-card rounded-xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-border-main">
        <span className="text-lg md:text-2xl font-bold text-text-main dark:text-white">
          {exercise.question}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2 md:gap-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrectAnswer = option === exercise.answer

          let buttonStyle = 'border-border-main bg-bg-card hover:bg-bg-alt hover:border-brand-primary/50'
          let textStyle = 'text-text-main dark:text-white'
          let circleStyle = 'border-border-main text-text-alt'

          if (isChecked) {
            if (isCorrectAnswer) {
              buttonStyle = 'border-green-500 bg-green-500/20'
              textStyle = 'text-green-600 dark:text-green-400'
              circleStyle = 'border-green-500 text-green-600 dark:text-green-400'
            } else if (isSelected && !isCorrect) {
              buttonStyle = 'border-red-500 bg-red-500/20'
              textStyle = 'text-red-600 dark:text-red-400'
              circleStyle = 'border-red-500 text-red-600 dark:text-red-400'
            } else {
              buttonStyle = 'border-border-main bg-bg-card opacity-50'
            }
          } else if (isSelected) {
            buttonStyle = 'border-brand-primary bg-brand-primary/10'
            textStyle = 'text-brand-primary'
            circleStyle = 'border-brand-primary text-brand-primary'
          }

          return (
            <button
              key={index}
              onClick={() => !isChecked && setSelectedAnswer(option)}
              disabled={isChecked}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${buttonStyle}`}
            >
              <span
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${circleStyle}`}
              >
                {String.fromCharCode(65 + index)}
              </span>
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

export default MultipleChoiceExercise
