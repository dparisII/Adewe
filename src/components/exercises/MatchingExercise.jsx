import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

function MatchingExercise({ exercise, setSelectedAnswer, isChecked }) {
  const [leftSelected, setLeftSelected] = useState(null)
  const [rightSelected, setRightSelected] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [wrongPair, setWrongPair] = useState(null)
  const [mistakes, setMistakes] = useState(0)

  // Shuffle right side options
  const [shuffledRight] = useState(() =>
    [...exercise.pairs].sort(() => Math.random() - 0.5)
  )

  useEffect(() => {
    if (matchedPairs.length === exercise.pairs.length) {
      // Pass mistake count along with completion status
      setSelectedAnswer({ completed: true, mistakes })
    }
  }, [matchedPairs, exercise.pairs.length, setSelectedAnswer, mistakes])

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
      setMistakes(prev => prev + 1)
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
      <h2 className="text-xl md:text-2xl font-bold text-text-main dark:text-white mb-2">
        Match the pairs
      </h2>
      <p className="text-text-alt mb-6 md:mb-8">Tap the matching pairs</p>

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
                className={`relative px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 w-full transition-all text-sm md:text-base min-h-[60px] flex items-center justify-center ${isMatched
                    ? 'border-green-500 bg-green-500/20 opacity-50'
                    : isWrong
                      ? 'border-red-500 bg-red-500/20 animate-shake'
                      : isSelected
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-border-main bg-bg-card hover:border-brand-primary/50'
                  }`}
              >
                <span
                  className={`font-semibold break-words whitespace-normal text-center ${isMatched ? 'text-green-600 dark:text-green-400' : isSelected ? 'text-brand-primary' : 'text-text-main dark:text-white'
                    }`}
                >
                  {pair.left}
                </span>
                {isMatched && (
                  <Check
                    size={14}
                    className="absolute top-1 right-1 text-green-600 dark:text-green-400"
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
                className={`relative px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 w-full transition-all text-sm md:text-base min-h-[60px] flex items-center justify-center ${isMatched
                    ? 'border-green-500 bg-green-500/20 opacity-50'
                    : isWrong
                      ? 'border-red-500 bg-red-500/20 animate-shake'
                      : isSelected
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-border-main bg-bg-card hover:border-brand-primary/50'
                  }`}
              >
                <span
                  className={`font-semibold break-words whitespace-normal text-center ${isMatched ? 'text-green-600 dark:text-green-400' : isSelected ? 'text-brand-primary' : 'text-text-main dark:text-white'
                    }`}
                >
                  {pair.right}
                </span>
                {isMatched && (
                  <Check
                    size={14}
                    className="absolute top-1 right-1 text-green-600 dark:text-green-400"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 md:mt-8 text-center">
        <span className="text-text-alt text-sm md:text-base">
          {matchedPairs.length} / {exercise.pairs.length} pairs matched
        </span>
      </div>
    </div>
  )
}

export default MatchingExercise
