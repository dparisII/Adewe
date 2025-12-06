import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

function MatchingExercise({ exercise, setSelectedAnswer, isChecked }) {
  const [leftSelected, setLeftSelected] = useState(null)
  const [rightSelected, setRightSelected] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [wrongPair, setWrongPair] = useState(null)

  // Shuffle right side options
  const [shuffledRight] = useState(() =>
    [...exercise.pairs].sort(() => Math.random() - 0.5)
  )

  useEffect(() => {
    if (matchedPairs.length === exercise.pairs.length) {
      setSelectedAnswer(true)
    }
  }, [matchedPairs, exercise.pairs.length, setSelectedAnswer])

  const handleLeftClick = (item) => {
    if (isChecked || matchedPairs.some((p) => p.left === item)) return
    setLeftSelected(item)
    setWrongPair(null)

    if (rightSelected) {
      checkMatch(item, rightSelected)
    }
  }

  const handleRightClick = (item) => {
    if (isChecked || matchedPairs.some((p) => p.right === item)) return
    setRightSelected(item)
    setWrongPair(null)

    if (leftSelected) {
      checkMatch(leftSelected, item)
    }
  }

  const checkMatch = (left, right) => {
    const isMatch = exercise.pairs.some(
      (p) => p.left === left && p.right === right
    )

    if (isMatch) {
      setMatchedPairs((prev) => [...prev, { left, right }])
      setLeftSelected(null)
      setRightSelected(null)
    } else {
      setWrongPair({ left, right })
      setTimeout(() => {
        setLeftSelected(null)
        setRightSelected(null)
        setWrongPair(null)
      }, 500)
    }
  }

  const isLeftMatched = (item) => matchedPairs.some((p) => p.left === item)
  const isRightMatched = (item) => matchedPairs.some((p) => p.right === item)

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        Match the pairs
      </h2>
      <p className="text-gray-400 mb-6 md:mb-8">Tap the matching pairs</p>

      <div className="flex gap-2 md:gap-8 justify-center px-2">
        {/* Left Column */}
        <div className="flex flex-col gap-2 md:gap-3 flex-1 max-w-[160px] md:max-w-[200px]">
          {exercise.pairs.map((pair, index) => {
            const isMatched = isLeftMatched(pair.left)
            const isSelected = leftSelected === pair.left
            const isWrong = wrongPair?.left === pair.left

            return (
              <button
                key={index}
                onClick={() => handleLeftClick(pair.left)}
                disabled={isMatched || isChecked}
                className={`relative px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 w-full transition-all text-sm md:text-base ${
                  isMatched
                    ? 'border-green-500 bg-green-500/20 opacity-50'
                    : isWrong
                    ? 'border-red-500 bg-red-500/20 animate-shake'
                    : isSelected
                    ? 'border-[#58cc02] bg-[#58cc02]/10'
                    : 'border-[#3c5a6a] bg-[#1a2c35] hover:border-[#58cc02]'
                }`}
              >
                <span
                  className={`font-semibold truncate block ${
                    isMatched ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {pair.left}
                </span>
                {isMatched && (
                  <Check
                    size={14}
                    className="absolute top-1 right-1 text-green-400"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-2 md:gap-3 flex-1 max-w-[160px] md:max-w-[200px]">
          {shuffledRight.map((pair, index) => {
            const isMatched = isRightMatched(pair.right)
            const isSelected = rightSelected === pair.right
            const isWrong = wrongPair?.right === pair.right

            return (
              <button
                key={index}
                onClick={() => handleRightClick(pair.right)}
                disabled={isMatched || isChecked}
                className={`relative px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 w-full transition-all text-sm md:text-base ${
                  isMatched
                    ? 'border-green-500 bg-green-500/20 opacity-50'
                    : isWrong
                    ? 'border-red-500 bg-red-500/20 animate-shake'
                    : isSelected
                    ? 'border-[#58cc02] bg-[#58cc02]/10'
                    : 'border-[#3c5a6a] bg-[#1a2c35] hover:border-[#58cc02]'
                }`}
              >
                <span
                  className={`font-semibold truncate block ${
                    isMatched ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {pair.right}
                </span>
                {isMatched && (
                  <Check
                    size={14}
                    className="absolute top-1 right-1 text-green-400"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 md:mt-8 text-center">
        <span className="text-gray-400 text-sm md:text-base">
          {matchedPairs.length} / {exercise.pairs.length} pairs matched
        </span>
      </div>
    </div>
  )
}

export default MatchingExercise
