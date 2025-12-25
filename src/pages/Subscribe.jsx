import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, Crown, Heart, Users, Building2,
  Copy, CheckCircle, XCircle, X, Loader2
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
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic access',
    features: ['5 hearts per day', 'Basic lessons', '2 languages'],
    icon: Heart
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    period: 'month',
    currency: 'ETB',
    description: 'Full access',
    features: ['Unlimited hearts', 'All lessons', 'All languages', 'No ads', 'Offline mode'],
    icon: Crown,
    popular: true
  },
  {
    id: 'family',
    name: 'Family',
    price: 499,
    period: 'month',
    currency: 'ETB',
    description: 'For families',
    features: ['Everything in Premium', 'Up to 6 members', 'Family dashboard'],
    icon: Users
  }
]

function Subscribe() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [step, setStep] = useState(1) // 1: select plan, 2: payment details, 3: submit reference
  const [bankSettings, setBankSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [copied, setCopied] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    transaction_reference: '',
    payer_name: '',
    payer_phone: '',
    bank_name: ''
  })

  useEffect(() => {
    fetchBankSettings()
  }, [])

  const fetchBankSettings = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('local_payment_settings')
        .select('*')
        .eq('is_enabled', true)
        .single()

      if (data) {
        setBankSettings(data)
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

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('local_payment_requests')
        .insert([{
          user_id: user.id,
          tier_id: selectedPlan.id,
          amount: selectedPlan.price,
          currency: selectedPlan.currency || 'ETB',
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
      console.error('Error submitting payment:', error)
      setToast({ message: 'Error submitting payment. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const showToast = (message, type) => setToast({ message, type })

  return (
    <div className="min-h-screen bg-[#131f24]">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="px-6 py-4 border-b border-[#3c5a6a]/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-white font-bold">Upgrade to Premium</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-emerald-500 text-white' : 'bg-[#1a2c35] text-slate-500'
                  }`}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-emerald-500' : 'bg-[#1a2c35]'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Plan */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
                <p className="text-slate-400">Select the plan that works best for you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.filter(p => p.price > 0).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan)
                      setStep(2)
                    }}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${plan.popular
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-[#3c5a6a]/30 bg-[#1a2c35] hover:border-[#3c5a6a]'
                      }`}
                  >
                    {plan.popular && (
                      <span className="inline-block px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-3">
                        POPULAR
                      </span>
                    )}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${plan.popular ? 'bg-emerald-500 text-white' : 'bg-[#131f24] text-slate-400'
                      }`}>
                      <plan.icon size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{plan.description}</p>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 text-sm">{plan.currency}/{plan.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check size={14} className="text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Bank Transfer Details */}
          {step === 2 && selectedPlan && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Make Payment</h2>
                <p className="text-slate-400">Transfer {selectedPlan.price} {selectedPlan.currency} to our bank account</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="text-emerald-500 animate-spin" />
                </div>
              ) : bankSettings ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-[#1a2c35] rounded-xl border border-[#3c5a6a]/30 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 size={24} className="text-emerald-500" />
                      <h3 className="text-white font-bold">Bank Transfer Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-[#131f24] rounded-lg">
                        <div>
                          <p className="text-slate-400 text-xs">Bank Name</p>
                          <p className="text-white font-medium">{bankSettings.bank_name}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-[#131f24] rounded-lg">
                        <div>
                          <p className="text-slate-400 text-xs">Account Name</p>
                          <p className="text-white font-medium">{bankSettings.account_name}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-[#131f24] rounded-lg">
                        <div>
                          <p className="text-slate-400 text-xs">Account Number</p>
                          <p className="text-white font-mono font-bold text-lg">{bankSettings.account_number}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bankSettings.account_number)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/30 rounded-lg"
                        >
                          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <div>
                          <p className="text-emerald-400 text-xs">Amount to Pay</p>
                          <p className="text-emerald-400 font-bold text-xl">{selectedPlan.price} {bankSettings.currency}</p>
                        </div>
                      </div>
                    </div>

                    {bankSettings.instructions && (
                      <p className="mt-4 text-sm text-slate-400 bg-[#131f24] p-3 rounded-lg">
                        ℹ️ {bankSettings.instructions}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
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
                <h2 className="text-2xl font-bold text-white mb-2">Submit Payment Details</h2>
                <p className="text-slate-400">Enter your transaction reference number</p>
              </div>

              <form onSubmit={handleSubmitPayment} className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Transaction Reference (FT/Invoice No) *</label>
                  <input
                    type="text"
                    value={paymentForm.transaction_reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                    placeholder="e.g., FT123456789"
                    className="w-full p-3 bg-[#1a2c35] border border-[#3c5a6a]/30 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-1">Your Name</label>
                  <input
                    type="text"
                    value={paymentForm.payer_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_name: e.target.value })}
                    placeholder="Name used for transfer"
                    className="w-full p-3 bg-[#1a2c35] border border-[#3c5a6a]/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={paymentForm.payer_phone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payer_phone: e.target.value })}
                    placeholder="e.g., 0911234567"
                    className="w-full p-3 bg-[#1a2c35] border border-[#3c5a6a]/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-1">Bank Used</label>
                  <select
                    value={paymentForm.bank_name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bank_name: e.target.value })}
                    className="w-full p-3 bg-[#1a2c35] border border-[#3c5a6a]/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
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
                  className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                We've received your payment details. Our team will verify your payment and activate your subscription within 24 hours.
              </p>
              <button
                onClick={() => navigate('/learn')}
                className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
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
