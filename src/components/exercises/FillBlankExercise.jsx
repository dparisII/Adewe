function FillBlankExercise({
  exercise,
  selectedAnswer,
  setSelectedAnswer,
  isChecked,
  isCorrect,
}) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        Fill in the blank
      </h2>
      <p className="text-gray-400 mb-8">Complete the sentence</p>

      {/* Sentence with blank */}
      <div className="bg-[#1a2c35] rounded-xl p-6 mb-8">
        <p className="text-xl md:text-2xl text-white">
          {exercise.sentence.split('___').map((part, index, array) => (
            <span key={index}>
              {part}
              {index < array.length - 1 && (
                <span
                  className={`inline-block min-w-[100px] mx-2 px-4 py-1 rounded-lg border-b-4 ${
                    selectedAnswer
                      ? isChecked
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02]'
                      : 'bg-[#2a3f4a] border-[#3c5a6a] text-gray-400'
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
      <div className="grid grid-cols-2 gap-3">
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
              className={`p-4 rounded-xl border-2 text-center transition-all ${buttonStyle}`}
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

export default FillBlankExercise
