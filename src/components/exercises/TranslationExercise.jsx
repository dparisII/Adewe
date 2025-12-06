import { Volume2 } from 'lucide-react'

function TranslationExercise({
  exercise,
  selectedAnswer,
  setSelectedAnswer,
  isChecked,
  isCorrect,
}) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        Translate this word
      </h2>
      <p className="text-gray-400 mb-8">Select the correct translation</p>

      {/* Word to translate */}
      <div className="bg-[#1a2c35] rounded-xl p-6 mb-8 flex items-center gap-4">
        <button className="w-12 h-12 bg-[#58cc02] rounded-full flex items-center justify-center hover:bg-[#4caf00] transition-colors">
          <Volume2 size={24} className="text-white" />
        </button>
        <span className="text-2xl md:text-3xl font-bold text-white">
          {exercise.question}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((option, index) => {
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
