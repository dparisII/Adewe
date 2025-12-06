import { Heart, Gem, Zap, Shield, Clock } from 'lucide-react'
import useStore from '../store/useStore'

function Shop() {
  const { gems, hearts, spendGems, refillHearts } = useStore()

  const items = [
    {
      id: 'hearts-refill',
      name: 'Heart Refill',
      description: 'Refill all your hearts to 5',
      icon: <Heart className="text-red-500 fill-red-500" size={32} />,
      price: 350,
      action: () => {
        if (gems >= 350 && hearts < 5) {
          spendGems(350)
          refillHearts()
          return true
        }
        return false
      },
      disabled: hearts >= 5,
    },
    {
      id: 'streak-freeze',
      name: 'Streak Freeze',
      description: 'Protect your streak for one day',
      icon: <Shield className="text-blue-400" size={32} />,
      price: 200,
      action: () => {
        if (gems >= 200) {
          spendGems(200)
          return true
        }
        return false
      },
      disabled: false,
    },
    {
      id: 'double-xp',
      name: 'Double XP Boost',
      description: 'Earn double XP for 15 minutes',
      icon: <Zap className="text-yellow-400" size={32} />,
      price: 100,
      action: () => {
        if (gems >= 100) {
          spendGems(100)
          return true
        }
        return false
      },
      disabled: false,
    },
    {
      id: 'timer-boost',
      name: 'Extra Time',
      description: 'Get extra time on timed challenges',
      icon: <Clock className="text-green-400" size={32} />,
      price: 150,
      action: () => {
        if (gems >= 150) {
          spendGems(150)
          return true
        }
        return false
      },
      disabled: false,
    },
  ]

  const handlePurchase = (item) => {
    if (gems < item.price) {
      alert('Not enough gems!')
      return
    }
    if (item.disabled) {
      alert('This item is not available right now.')
      return
    }
    const success = item.action()
    if (success) {
      alert(`Successfully purchased ${item.name}!`)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
          <p className="text-gray-400">Spend your gems on power-ups</p>
        </div>

        {/* Gems Balance */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 mb-8 border border-blue-500/30">
          <div className="flex items-center justify-center gap-3">
            <Gem className="text-blue-400" size={32} />
            <span className="text-3xl font-bold text-white">{gems}</span>
            <span className="text-gray-400">gems available</span>
          </div>
        </div>

        {/* Shop Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-[#1a2c35] rounded-xl p-4 border border-[#3c5a6a] ${
                item.disabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#2a3f4a] rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={item.disabled || gems < item.price}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    item.disabled || gems < item.price
                      ? 'bg-[#3c5a6a] text-gray-500 cursor-not-allowed'
                      : 'bg-[#58cc02] hover:bg-[#4caf00] text-white'
                  }`}
                >
                  <Gem size={16} />
                  {item.price}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Earn More Gems */}
        <div className="mt-8 bg-[#1a2c35] rounded-xl p-6 border border-[#3c5a6a]">
          <h2 className="text-lg font-bold text-white mb-4">Earn More Gems</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-green-400">✓</span>
              Complete lessons to earn gems
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-green-400">✓</span>
              Maintain your daily streak
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-green-400">✓</span>
              Unlock achievements
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
