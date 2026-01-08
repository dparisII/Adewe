import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, Crown, Heart, Users, Building2,
  Copy, CheckCircle, XCircle, X, Loader2, Star, Tag
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Toast component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${type === 'success'
      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
      : 'bg-red-500/20 border-red-500/50 text-red-400'
      }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
        <X size={16} />
      </button>
    </div>
  )
}

const plans = [
  {
    id: 'super',
    name: 'Super Adewe',
    price_monthly_etb: 499,
    price_monthly: 8.99,
    period: 'month',
    description: 'Ad-free experience with unlimited hearts',
    features: [
      'Unlimited Hearts',
      'No interruptions (no ads)',
      'Personalized Practice',
      'Offline Access'
    ],
    icon: Crown,
    color: 'text-[#ffc800]',
    bg: 'bg-[#ffc800]/10',
    border: 'border-[#ffc800]'
  },
  {
    id: 'super_family',
    name: 'Super Family',
    price_monthly_etb: 1299,
    price_monthly: 14.99,
    period: 'month',
    description: 'Protect all your family\'s hearts',
    features: [
      'Everything in Super',
      'Up to 6 family members',
      'Family dashboard',
      'One bill for all'
    ],
    icon: Users,
    color: 'text-[#1cb0f6]',
    bg: 'bg-[#1cb0f6]/10',
    border: 'border-[#1cb0f6]',
    popular: true
  },
  {
    id: 'max',
    name: 'Adewe Max',
    price_monthly_etb: 899,
    price_monthly: 16.99,
    period: 'month',
    description: 'Advanced AI features for deep learning',
    features: [
      'Everything in Super',
      'AI Roleplay',
      'Explain My Answer',
      'Smart Review'
    ],
    icon: Star,
    color: 'text-[#ff4b4b]',
    bg: 'bg-[#ff4b4b]/10',
    border: 'border-[#ff4b4b]'
  },
  {
    id: 'max_family',
    name: 'Max Family',
    price_monthly_etb: 1999,
    price_monthly: 24.99,
    period: 'month',
    description: 'The ultimate learning for everyone',
    features: [
      'Everything in Max',
      'Up to 6 family members',
      'Family performance insights',
      'Priority Support'
    ],
    icon: Building2,
    color: 'text-[#ce82ff]',
    bg: 'bg-[#ce82ff]/10',
    border: 'border-[#ce82ff]'
  }
]

function Subscribe() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [step, setStep] = useState(1) // 1: select plan, 2: payment details, 3: submit reference
  const [currency, setCurrency] = useState('ETB')
  const [bankAccounts, setBankAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [copied, setCopied] = useState(false)
  const [copyId, setCopyId] = useState('')
  const [tiers, setTiers] = useState([])
  const [paymentForm, setPaymentForm] = useState({
    transaction_reference: '',
    payer_name: '',
    payer_phone: '',
    bank_name: ''
  })
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState(null) // { code, discount_percent, discount_amount }
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    fetchBankSettings()
    fetchTiers()
  }, [])

  const fetchTiers = async () => {
    setLoading(true)
    try {
      // Fetch subscription tiers from database
      const { data: dbTiers, error: dbError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('sort_order')

      if (dbError) throw dbError

      if (dbTiers && dbTiers.length > 0) {
        // Map database tiers to UI configurations
        const mappedTiers = dbTiers.filter(t => t.name !== 'Free' && t.is_visible !== false).map(tier => {
          const nameLower = tier.name.toLowerCase()
          let config = {}

          if (nameLower.includes('family') && (nameLower.includes('max') || nameLower.includes('premium'))) {
            config = { icon: Building2, color: 'text-[#ff4b4b]', bg: 'bg-[#ff4b4b]/10', border: 'border-[#ff4b4b]', popular: false }
          } else if (nameLower.includes('max')) {
            config = { icon: Star, color: 'text-[#ff4b4b]', bg: 'bg-[#ff4b4b]/10', border: 'border-[#ff4b4b]', popular: false }
          } else if (nameLower.includes('family')) {
            config = { icon: Users, color: 'text-[#1cb0f6]', bg: 'bg-[#1cb0f6]/10', border: 'border-[#1cb0f6]', popular: true }
          } else {
            config = { icon: Crown, color: 'text-[#ffc800]', bg: 'bg-[#ffc800]/10', border: 'border-[#ffc800]', popular: true }
          }

          return {
            ...tier,
            id: tier.id,
            period: 'month',
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            border: config.border,
            popular: tier.is_popular !== undefined ? tier.is_popular : config.popular,
            features: Array.isArray(tier.features) ? tier.features : JSON.parse(tier.features || '[]')
          }
        })
        setTiers(mappedTiers)
      }
    } catch (err) {
      console.error('Error fetching tiers:', err)
      setTiers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBankSettings = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('local_payment_settings')
        .select('*')
        .single()

      if (data && data.bank_accounts) {
        setBankAccounts(data.bank_accounts)
      } else if (data) {
        setBankAccounts([{
          bank_name: data.bank_name,
          account_name: data.account_name,
          account_number: data.account_number,
          currency: data.currency
        }])
      }
    } catch (error) {
      console.log('Bank settings not available')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitPayment = async (e) => {
    e.preventDefault()

    if (!user) {
      setToast({ message: 'Please login first', type: 'error' })
      navigate('/login')
      return
    }

    if (!paymentForm.transaction_reference) {
      setToast({ message: 'Please enter your transaction reference', type: 'error' })
      return
    }

    // Map plan to database tier
    let tierId = selectedPlan.id

    // If for some reason we still need matching (e.g. legacy logic)
    if (selectedPlan.db_tier) {
      tierId = selectedPlan.db_tier.id
    }

    const price = currency === 'ETB' ? selectedPlan.price_monthly_etb : selectedPlan.price_monthly
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('local_payment_requests')
        .insert([{
          user_id: user.id,
          tier_id: tierId,
          amount: price,
          currency: currency,
          transaction_reference: paymentForm.transaction_reference,
          bank_name: paymentForm.bank_name,
          payer_name: paymentForm.payer_name,
          payer_phone: paymentForm.payer_phone,
          status: 'pending'
        }])

      if (error) throw error

      setToast({ message: 'Payment submitted! We will verify and activate your subscription.', type: 'success' })
      setStep(4) // Success step
    } catch (error) {
      console.error('CRITICAL: Error submitting payment:', error)
      setToast({ message: `Submission failed: ${error.message || 'Please try again'}`, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const showToast = (message, type) => setToast({ message, type })

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

      // Check usage limit
      if (data.max_uses && data.uses_count >= data.max_uses) {
        setPromoError('This promo code has reached its usage limit')
        return
      }

      // Check expiry
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setPromoError('This promo code has expired')
        return
      }

      // Check if promo has any discount configured
      const hasDiscount = data.discount_percent > 0 || data.discount_amount > 0
      if (!hasDiscount) {
        setPromoError('This promo code has no discount configured')
        return
      }

      setAppliedPromo({
        id: data.id,
        code: data.code,
        discount_percent: data.discount_percent || 0,
        discount_amount: data.discount_amount || 0
      })

      const discountText = data.discount_percent > 0
        ? `${data.discount_percent}% off`
        : `${data.discount_amount} ${currency} off`
      showToast(`Promo code applied! ${discountText}`, 'success')
    } catch (err) {
      console.error('Error applying promo:', err)
      setPromoError('Failed to apply promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const getDiscountedPrice = () => {
    const basePrice = currency === 'ETB' ? selectedPlan?.price_monthly_etb : selectedPlan?.price_monthly
    if (!appliedPromo || !basePrice) return basePrice

    if (appliedPromo.discount_percent) {
      return (basePrice * (1 - appliedPromo.discount_percent / 100)).toFixed(2)
    }
    if (appliedPromo.discount_amount) {
      return Math.max(0, basePrice - appliedPromo.discount_amount).toFixed(2)
    }
    return basePrice
  }

  return (
    <div className="min-h-screen bg-bg-main dark:bg-[#131f24]">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="px-6 py-4 border-b border-border-main dark:border-[#3c5a6a]/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center gap-2 text-text-alt hover:text-text-main dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-text-main dark:text-white font-bold">Upgrade to Premium</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-brand-secondary text-white' : 'bg-bg-card dark:bg-[#1a2c35] text-text-alt'
                  }`}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-brand-secondary' : 'bg-bg-card dark:bg-[#1a2c35]'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Plan */}
          {step === 1 && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="bg-bg-card dark:bg-[#1a2c35] p-1 rounded-xl flex gap-1 border-2 border-border-main dark:border-[#3c5a6a]/30">
                  <button
                    onClick={() => setCurrency('ETB')}
                    className={`px-6 py-2 rounded-lg font-black transition-all ${currency === 'ETB' ? 'bg-brand-secondary text-white shadow-lg' : 'text-text-alt hover:text-text-main dark:hover:text-white'}`}
                  >
                    ETB
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-6 py-2 rounded-lg font-black transition-all ${currency === 'USD' ? 'bg-brand-secondary text-white shadow-lg' : 'text-text-alt hover:text-text-main dark:hover:text-white'}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {tiers.map((plan) => {
                  const price = currency === 'ETB' ? plan.price_monthly_etb : plan.price_monthly
                  const isSelected = selectedPlan?.id === plan.id

                  return (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan)
                        setStep(2)
                      }}
                      className={`relative p-6 rounded-3xl border-2 text-left transition-all ${isSelected
                        ? `${plan.border} ${plan.bg} shadow-lg shadow-${plan.color.split('[')[1].split(']')[0]}/10`
                        : 'border-border-main dark:border-[#3c5a6a]/30 bg-bg-card dark:bg-[#1a2c35] hover:border-brand-secondary/50 shadow-sm'
                        }`}
                    >
                      {plan.popular && (
                        <span className={`inline-block px-2 py-1 ${plan.bg} ${plan.color} text-xs font-bold rounded-full mb-3 uppercase tracking-widest`}>
                          MOST POPULAR
                        </span>
                      )}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${plan.bg} ${plan.color}`}>
                        <plan.icon size={24} />
                      </div>
                      <h3 className="text-text-main dark:text-white font-black text-lg">{plan.name}</h3>
                      <p className="text-text-alt dark:text-slate-400 text-sm mb-3 min-h-[40px]">{plan.description}</p>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-black text-text-main dark:text-white">{currency === 'USD' ? '$' : ''}{price}</span>
                        <span className="text-text-alt dark:text-slate-400 text-sm font-bold uppercase">{currency === 'ETB' ? 'ETB' : '/mo'}</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-text-main dark:text-slate-300 font-bold">
                            <Check size={14} className={plan.color} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Bank Transfer Details */}
          {step === 2 && selectedPlan && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Make Payment</h2>
                <p className="text-text-alt dark:text-slate-400">Transfer {currency === 'ETB' ? selectedPlan.price_monthly_etb : selectedPlan.price_monthly} {currency} to one of our accounts</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="text-brand-secondary animate-spin" />
                </div>
              ) : bankAccounts.length > 0 ? (
                <div className="max-w-md mx-auto space-y-4">
                  {bankAccounts.filter(acc => acc.currency === currency || !acc.currency).map((acc, idx) => (
                    <div key={idx} className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#3c5a6a]/30 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Building2 size={24} className="text-brand-secondary" />
                        <h3 className="text-text-main dark:text-white font-bold">{acc.bank_name}</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-bg-main dark:bg-[#131f24] rounded-lg">
                          <p className="text-text-alt dark:text-slate-400 text-xs">Account Name</p>
                          <p className="text-text-main dark:text-white font-medium">{acc.account_name}</p>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-bg-main dark:bg-[#131f24] rounded-lg">
                          <div>
                            <p className="text-text-alt dark:text-slate-400 text-xs">Account Number</p>
                            <p className="text-text-main dark:text-white font-mono font-bold text-lg">{acc.account_number}</p>
                          </div>
                          <button
                            onClick={() => { copyToClipboard(acc.account_number); setCopyId(acc.account_number) }}
                            className="p-2 text-text-alt hover:text-text-main dark:text-slate-400 dark:hover:text-white"
                          >
                            {copied && copyId === acc.account_number ? <Check size={18} className="text-brand-secondary" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Section */}
                  <div className="bg-bg-card dark:bg-[#1a2c35] rounded-xl border border-border-main dark:border-[#3c5a6a]/30 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={18} className="text-brand-secondary" />
                      <span className="text-text-main dark:text-white font-bold text-sm">Have a promo code?</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                        placeholder="Enter code"
                        className="flex-1 p-3 bg-bg-main dark:bg-[#131f24] border border-border-main dark:border-[#3c5a6a]/30 rounded-lg text-text-main dark:text-white font-mono uppercase focus:outline-none focus:border-brand-secondary"
                        disabled={appliedPromo}
                      />
                      {appliedPromo ? (
                        <button
                          onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                          className="px-4 py-3 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={applyPromoCode}
                          disabled={promoLoading || !promoCode.trim()}
                          className="px-4 py-3 bg-brand-secondary text-white font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {promoLoading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                        </button>
                      )}
                    </div>
                    {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
                    {appliedPromo && (
                      <div className="mt-2 flex items-center gap-2 text-brand-secondary text-sm font-bold">
                        <CheckCircle size={16} />
                        {appliedPromo.discount_percent > 0
                          ? `${appliedPromo.discount_percent}% discount applied!`
                          : `${appliedPromo.discount_amount} ${currency} discount applied!`
                        }
                      </div>
                    )}
                  </div>

                  <div className="bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl p-4 text-center">
                    <p className="text-brand-secondary text-xs uppercase font-black tracking-widest mb-1">Total to Pay</p>
                    {appliedPromo && (
                      <p className="text-text-alt dark:text-slate-400 text-sm line-through">
                        {currency === 'USD' ? '$' : ''}{currency === 'ETB' ? selectedPlan.price_monthly_etb : selectedPlan.price_monthly} {currency}
                      </p>
                    )}
                    <p className="text-brand-secondary font-bold text-2xl">
                      {currency === 'USD' ? '$' : ''}{getDiscountedPrice()} {currency}
                    </p>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-4 bg-brand-secondary text-white font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-secondary/20 active:scale-95"
                  >
                    I've Made the Payment
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Bank transfer is not available at the moment</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Submit Reference */}
          {step === 3 && selectedPlan && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Submit Payment Details</h2>
                <p className="text-text-alt dark:text-slate-400">Enter your transaction reference number</p>
              </div>

              <form onSubmit={handleSubmitPayment} className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-text-alt dark:text-slate-400 text-sm mb-1">Transaction Reference (FT/Invoice No) *</label>
                  <input
                    type="text"
                    value={paymentForm.transaction_reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                    placeholder="e.g., FT123456789"
                    className="w-full p-3 bg-bg-card dark:bg-[#1a2c35] border border-border-main dark:border-[#3c5a6a]/30 rounded-lg text-text-main dark:text-white font-mono focus:outline-none focus:border-brand-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-text-alt dark:text-slate-400 text-sm mb-1">Your Name</label>
                  <input
                    type="text"
                    value={paymentForm.payer_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_name: e.target.value })}
                    placeholder="Name used for transfer"
                    className="w-full p-3 bg-bg-card dark:bg-[#1a2c35] border border-border-main dark:border-[#3c5a6a]/30 rounded-lg text-text-main dark:text-white focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div>
                  <label className="block text-text-alt dark:text-slate-400 text-sm mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={paymentForm.payer_phone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_phone: e.target.value })}
                    placeholder="e.g., 0911234567"
                    className="w-full p-3 bg-bg-card dark:bg-[#1a2c35] border border-border-main dark:border-[#3c5a6a]/30 rounded-lg text-text-main dark:text-white focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div>
                  <label className="block text-text-alt dark:text-slate-400 text-sm mb-1">Bank Used</label>
                  <select
                    value={paymentForm.bank_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bank_name: e.target.value })}
                    className="w-full p-3 bg-bg-card dark:bg-[#1a2c35] border border-border-main dark:border-[#3c5a6a]/30 rounded-lg text-text-main dark:text-white focus:outline-none focus:border-brand-secondary"
                  >
                    <option value="">Select bank</option>
                    <option value="CBE">Commercial Bank of Ethiopia</option>
                    <option value="Awash">Awash Bank</option>
                    <option value="Dashen">Dashen Bank</option>
                    <option value="Abyssinia">Bank of Abyssinia</option>
                    <option value="Telebirr">Telebirr</option>
                    <option value="CBE Birr">CBE Birr</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-brand-secondary text-white font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-secondary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-brand-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Payment Submitted!</h2>
              <p className="text-text-alt dark:text-slate-400 mb-8 max-w-md mx-auto">
                We've received your payment details. Our team will verify your payment and activate your subscription within 24 hours.
              </p>
              <button
                onClick={() => navigate('/learn')}
                className="px-6 py-3 bg-brand-secondary text-white font-bold rounded-xl hover:brightness-110 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Subscribe
