import { useState } from 'react'
import { ShoppingBag, Gem, Heart, Flame, Star, Check, Lock } from 'lucide-react'
import useStore from '../store/useStore'
import { shopItems, getItemsByCategory, canPurchase, applyItemEffect } from '../data/shopData'

function Shop() {
  const { gems, hearts, streak, spendGems, inventory, addToInventory, refillHearts, addXp, addGems, enableUnlimitedHearts } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('power-ups')
  const [purchaseMessage, setPurchaseMessage] = useState(null)

  const categories = [
    { id: 'power-ups', name: 'Power-Ups', icon: Star },
    { id: 'cosmetics', name: 'Cosmetics', icon: ShoppingBag },
    { id: 'upgrades', name: 'Upgrades', icon: Flame },
    { id: 'special', name: 'Special', icon: Gem },
  ]

  const handlePurchase = (item) => {
    const purchaseCheck = canPurchase(item, gems, inventory)

    if (!purchaseCheck.canPurchase) {
      setPurchaseMessage({ type: 'error', text: purchaseCheck.reason })
      setTimeout(() => setPurchaseMessage(null), 3000)
      return
    }

    // Deduct gems
    spendGems(item.price)

    // Add to inventory
    addToInventory(item)

    // Apply immediate effects
    applyItemEffect(item, { refillHearts, addXp, addGems, enableUnlimitedHearts })

    setPurchaseMessage({ type: 'success', text: `Purchased ${item.name}!` })
    setTimeout(() => setPurchaseMessage(null), 3000)
  }

  const items = getItemsByCategory(selectedCategory)

  const isOwned = (itemId) => {
    return inventory.some(i => i.id === itemId)
  }

  return (
    <div className="min-h-screen md:p-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-purple-400" size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Shop</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Spend your gems on power-ups and upgrades</p>
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className={`mb-4 p-4 rounded-xl text-center font-bold ${purchaseMessage.type === 'success' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
            }`}>
            {purchaseMessage.text}
          </div>
        )}

        {/* Gems Balance */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 md:p-4 mb-6 border border-blue-500/30">
          <div className="flex items-center justify-center gap-2">
            <Gem className="text-blue-500 dark:text-blue-400" size={20} />
            <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{gems}</span>
            <span className="text-blue-600 dark:text-blue-300 font-bold uppercase tracking-widest text-xs">gems</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto pb-2 mb-4 -mx-1">
          <div className="flex gap-1.5 px-1 min-w-min">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-card text-gray-500 dark:text-gray-400 hover:bg-bg-alt border border-border-main'
                  }`}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Items */}
        <div className="space-y-3">
          {items.map((item) => {
            const owned = isOwned(item.id)
            const canBuy = gems >= item.price

            return (
              <div
                key={item.id}
                className="bg-bg-card rounded-xl p-3 md:p-4 border-2 border-border-main hover:border-brand-primary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-bg-alt rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 border-2 border-border-main">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 dark:text-white font-black text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 font-medium">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 font-black">
                        <Gem size={16} />
                        {item.price}
                      </div>
                      {owned && item.type !== 'consumable' ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-black uppercase tracking-wide">
                          <Check size={16} />
                          Owned
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canBuy}
                          className={`px-4 py-2 rounded-xl font-black text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 ${canBuy
                            ? 'bg-brand-primary hover:brightness-110 text-white border-brand-primary/50'
                            : 'bg-bg-alt text-gray-400 border-border-main cursor-not-allowed'
                            }`}
                        >
                          {canBuy ? 'BUY' : <Lock size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Earn More Gems */}
        <div className="mt-8 bg-bg-card rounded-xl p-6 border-2 border-border-main transition-colors duration-300">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Earn More Gems</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold">
              <span className="text-green-500">✓</span>
              Complete lessons to earn gems
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold">
              <span className="text-green-500">✓</span>
              Maintain your daily streak
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold">
              <span className="text-green-500">✓</span>
              Unlock achievements
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
