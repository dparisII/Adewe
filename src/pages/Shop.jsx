import { useState, useEffect } from 'react'
import { ShoppingBag, Gem, Heart, Flame, Star, Check, Lock, Loader2, Tag } from 'lucide-react'
import useStore from '../store/useStore'
import { supabase } from '../lib/supabase'
import { canPurchase, applyItemEffect } from '../data/shopData'

function Shop() {
  const { gems, hearts, streak, spendGems, inventory, addToInventory, refillHearts, addXp, addGems, enableUnlimitedHearts } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('power-ups')
  const [purchaseMessage, setPurchaseMessage] = useState(null)
  const [shopItems, setShopItems] = useState([])
  const [loading, setProjectLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  const categories = [
    { id: 'power-ups', name: 'Power-Ups', icon: Star },
    { id: 'cosmetics', name: 'Cosmetics', icon: ShoppingBag },
    { id: 'upgrades', name: 'Upgrades', icon: Flame },
    { id: 'special', name: 'Special', icon: Gem },
  ]

  // Fetch shop items from database
  useEffect(() => {
    fetchShopItems()
  }, [])

  const fetchShopItems = async () => {
    setProjectLoading(true)
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setShopItems(data || [])
    } catch (error) {
      console.error('Error fetching shop items:', error)
      setShopItems([])
    } finally {
      setProjectLoading(false)
    }
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    setAppliedPromo(null)

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        setPromoError('Invalid or expired promo code')
        return
      }

      if (data.max_uses && data.uses_count >= data.max_uses) {
        setPromoError('Usage limit reached')
        return
      }

      const hasDiscount = data.discount_percent > 0 || data.discount_amount > 0
      if (!hasDiscount) {
        setPromoError('No discount configured')
        return
      }

      setAppliedPromo(data)
    } catch (err) {
      setPromoError('Failed to apply promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handlePurchase = (item) => {
    let finalPrice = item.price

    // Apply promo if applicable to this item
    if (appliedPromo) {
      const isApplicable = appliedPromo.applicable_to_type === 'all' ||
        (appliedPromo.applicable_to_type === 'item' && appliedPromo.applicable_to_ids?.includes(item.id))

      if (isApplicable) {
        if (appliedPromo.discount_percent) {
          finalPrice = Math.floor(item.price * (1 - appliedPromo.discount_percent / 100))
        } else if (appliedPromo.discount_amount) {
          finalPrice = Math.max(0, item.price - appliedPromo.discount_amount)
        }
      }
    }

    const purchaseCheck = canPurchase({ ...item, price: finalPrice }, gems, inventory)

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

  // Filter items by category
  const items = shopItems.filter(item => item.category === selectedCategory)

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

        {/* Promo Code */}
        <div className="bg-bg-card rounded-xl border-2 border-border-main p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="text-brand-secondary" size={18} />
            <span className="text-gray-900 dark:text-white font-bold text-sm">Have a promo code?</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
              placeholder="ENTER CODE"
              className="flex-1 p-3 bg-bg-alt border-2 border-border-main rounded-xl text-gray-900 dark:text-white font-black uppercase focus:outline-none focus:border-brand-primary"
              disabled={appliedPromo}
            />
            {appliedPromo ? (
              <button
                onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                className="px-4 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={applyPromoCode}
                disabled={promoLoading || !promoCode.trim()}
                className="px-6 py-3 bg-brand-primary text-white font-black rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
              >
                {promoLoading ? <Loader2 size={16} className="animate-spin" /> : 'APPLY'}
              </button>
            )}
          </div>
          {promoError && <p className="text-red-500 text-xs mt-2 font-bold">{promoError}</p>}
          {appliedPromo && (
            <p className="text-brand-primary text-xs mt-2 font-black flex items-center gap-1">
              <Check size={14} /> PROMO APPLIED! {appliedPromo.applicable_to_type === 'item' ? 'Applies to specific items.' : 'Discount active on all items.'}
            </p>
          )}
        </div>
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
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-brand-primary animate-spin" />
            </div>
          ) : items && items.length > 0 ? items.map((item) => {
            const owned = isOwned(item.id)
            const canBuy = gems >= item.price

            return (
              <div
                key={item.id}
                className={`bg-bg-card rounded-xl p-3 md:p-4 border-2 border-border-main hover:border-brand-primary/50 transition-all duration-300 ${!item.is_active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-bg-alt rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 border-2 border-border-main">
                    {item.icon || '🎁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 dark:text-white font-black text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 font-medium">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 font-black">
                          <Gem size={16} />
                          <span className={appliedPromo && (appliedPromo.applicable_to_type === 'all' || (appliedPromo.applicable_to_type === 'item' && appliedPromo.applicable_to_ids?.includes(item.id))) ? 'line-through opacity-50 text-xs' : ''}>
                            {item.price}
                          </span>
                          {appliedPromo && (appliedPromo.applicable_to_type === 'all' || (appliedPromo.applicable_to_type === 'item' && appliedPromo.applicable_to_ids?.includes(item.id))) && (
                            <span className="text-brand-primary">
                              {appliedPromo.discount_percent
                                ? Math.floor(item.price * (1 - appliedPromo.discount_percent / 100))
                                : Math.max(0, item.price - appliedPromo.discount_amount)}
                            </span>
                          )}
                        </div>
                      </div>
                      {owned && item.type !== 'consumable' ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-black uppercase tracking-wide">
                          <Check size={16} />
                          Owned
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canBuy || !item.is_active}
                          className={`px-4 py-2 rounded-xl font-black text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 ${canBuy && item.is_active
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
          }) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-[#1a2c35] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 font-bold">No items available in this category</p>
            </div>
          )}
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
