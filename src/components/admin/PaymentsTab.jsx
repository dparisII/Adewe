import { useState, useEffect } from 'react'
import {
  CreditCard, DollarSign, Settings, Tag, Plus, Edit,
  Trash2, Check, X, TrendingUp, Users, Calendar, CheckCircle, XCircle,
  Building2, Clock, Eye, Save, RefreshCw, ChevronDown, ChevronRight
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
  }

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${colors[type]}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
        <X size={16} />
      </button>
    </div>
  )
}

function PaymentsTab() {
  const [activeSection, setActiveSection] = useState('overview')
  const [tiers, setTiers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [promoCodes, setPromoCodes] = useState([])
  const [paymentRequests, setPaymentRequests] = useState([])
  const [expandedSections, setExpandedSections] = useState({
    bankSettings: true,
    paymentRequests: true,
    subscriptionTiers: true,
    transactions: true,
    promoCodes: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  const [localPaymentSettings, setLocalPaymentSettings] = useState({
    is_enabled: true,
    bank_name: 'Commercial Bank of Ethiopia',
    account_name: 'Adewe Language Learning',
    account_number: '1000123456789',
    instructions: 'Transfer the exact amount and send us your transaction reference number (FT/Invoice No) for verification.',
    currency: 'ETB'
  })

  const ethiopianBanks = [
    'Commercial Bank of Ethiopia',
    'Awash Bank',
    'Dashen Bank',
    'Bank of Abyssinia',
    'Wegagen Bank',
    'United Bank',
    'Nib International Bank',
    'Cooperative Bank of Oromia',
    'Lion International Bank',
    'Oromia International Bank',
    'Zemen Bank',
    'Bunna International Bank',
    'Berhan International Bank',
    'Abay Bank',
    'Addis International Bank',
    'Debub Global Bank',
    'Enat Bank',
    'Gadaa Bank',
    'Goh Betoch Bank',
    'Hijra Bank',
    'Shabelle Bank',
    'Siinqee Bank',
    'Tsedey Bank',
    'Telebirr',
    'CBE Birr',
    'Other'
  ]
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showTierModal, setShowTierModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch subscription tiers
      const { data: tiersData } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('sort_order')
      setTiers(tiersData || [])

      // Fetch transactions
      const { data: transData } = await supabase
        .from('payment_transactions')
        .select('*, profiles(username, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      setTransactions(transData || [])

      // Fetch promo codes
      const { data: promoData } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false })
      setPromoCodes(promoData || [])

      // Fetch local payment settings
      const { data: localSettings } = await supabase
        .from('local_payment_settings')
        .select('*')
        .single()
      if (localSettings) setLocalPaymentSettings(localSettings)

      // Fetch payment requests
      const { data: requests } = await supabase
        .from('local_payment_requests')
        .select('*, profiles(username, email), subscription_tiers(name)')
        .order('created_at', { ascending: false })
      setPaymentRequests(requests || [])
    } catch (error) {
      console.log('Payment tables may not exist yet')
    } finally {
      setLoading(false)
    }
  }

  const saveLocalPaymentSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('local_payment_settings')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          ...localPaymentSettings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      showToast('Payment settings saved!')
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Error saving settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updatePaymentRequest = async (id, status, notes = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('local_payment_requests')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // If approved, create subscription for user
      if (status === 'approved') {
        const request = paymentRequests.find(r => r.id === id)
        if (request) {
          await supabase.from('user_subscriptions').upsert({
            user_id: request.user_id,
            tier_id: request.tier_id,
            status: 'active',
            payment_provider: 'local_bank',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }

      showToast(`Payment ${status}!`)
      fetchData()
    } catch (error) {
      console.error('Error updating request:', error)
      showToast('Error updating request', 'error')
    }
  }

  const saveTier = async (data) => {
    try {
      const { error } = editingItem
        ? await supabase.from('subscription_tiers').update(data).eq('id', editingItem.id)
        : await supabase.from('subscription_tiers').insert([data])

      if (error) throw error

      showToast(editingItem ? 'Tier updated!' : 'Tier created!')
      fetchData()
      setShowTierModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving tier:', error)
      showToast('Error saving subscription tier', 'error')
    }
  }

  const deleteTier = async (id) => {
    if (!confirm('Delete this subscription tier?')) return
    try {
      const { error } = await supabase.from('subscription_tiers').delete().eq('id', id)
      if (error) throw error
      showToast('Tier deleted!')
      fetchData()
    } catch (error) {
      console.error('Error deleting tier:', error)
      showToast('Error deleting tier', 'error')
    }
  }

  const savePromoCode = async (data) => {
    try {
      const { error } = editingItem
        ? await supabase.from('promo_codes').update(data).eq('id', editingItem.id)
        : await supabase.from('promo_codes').insert([data])

      if (error) throw error

      showToast(editingItem ? 'Promo code updated!' : 'Promo code created!')
      fetchData()
      setShowPromoModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving promo code:', error)
      showToast('Error saving promo code', 'error')
    }
  }

  const deletePromoCode = async (id) => {
    if (!confirm('Delete this promo code?')) return
    try {
      const { error } = await supabase.from('promo_codes').delete().eq('id', id)
      if (error) throw error
      showToast('Promo code deleted!')
      fetchData()
    } catch (error) {
      console.error('Error deleting promo code:', error)
      showToast('Error deleting promo code', 'error')
    }
  }

  // Calculate stats
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const thisMonthRevenue = transactions
    .filter(t => {
      const date = new Date(t.created_at)
      const now = new Date()
      return t.status === 'completed' &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'local', label: 'Bank Transfer', icon: Building2, badge: paymentRequests.filter(r => r.status === 'pending').length },
          { id: 'tiers', label: 'Subscription Tiers', icon: CreditCard },
          { id: 'transactions', label: 'Transactions', icon: DollarSign },
          { id: 'promos', label: 'Promo Codes', icon: Tag },
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeSection === section.id
              ? 'bg-brand-primary text-white'
              : 'bg-bg-card text-text-alt hover:text-text-main'
              }`}
          >
            <section.icon size={18} />
            <span>{section.label}</span>
            {section.badge > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-gray-900 text-xs rounded-full">
                {section.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Local Bank Transfer Section */}
      {activeSection === 'local' && (
        <div className="space-y-6">
          {/* Bank Account Settings */}
          <div className="bg-bg-card rounded-xl border border-border-main">
            <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('bankSettings')}>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Building2 size={20} /> Bank Account Settings
              </h3>
              <div className="flex items-center gap-2">
                {expandedSections.bankSettings && (
                  <button
                    onClick={(e) => { e.stopPropagation(); saveLocalPaymentSettings(); }}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                )}
                {expandedSections.bankSettings ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </div>

            {expandedSections.bankSettings && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-alt text-sm mb-1">Bank Name</label>
                    <select
                      value={localPaymentSettings.bank_name}
                      onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, bank_name: e.target.value })}
                      className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
                    >
                      {ethiopianBanks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-alt text-sm mb-1">Account Name</label>
                    <input
                      type="text"
                      value={localPaymentSettings.account_name}
                      onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, account_name: e.target.value })}
                      className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
                      placeholder="Adewe Language Learning"
                    />
                  </div>
                  <div>
                    <label className="block text-text-alt text-sm mb-1">Account Number</label>
                    <input
                      type="text"
                      value={localPaymentSettings.account_number}
                      onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, account_number: e.target.value })}
                      className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main font-mono"
                      placeholder="1000123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-text-alt text-sm mb-1">Currency</label>
                    <select
                      value={localPaymentSettings.currency}
                      onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, currency: e.target.value })}
                      className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
                    >
                      <option value="ETB">ETB (Ethiopian Birr)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-text-alt text-sm mb-1">Payment Instructions</label>
                    <textarea
                      value={localPaymentSettings.instructions}
                      onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, instructions: e.target.value })}
                      rows={3}
                      className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
                      placeholder="Instructions for users..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-text-main font-medium">Enable Bank Transfer Payments</p>
                        <p className="text-text-alt text-sm">Allow users to pay via bank transfer</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocalPaymentSettings({ ...localPaymentSettings, is_enabled: !localPaymentSettings.is_enabled })}
                        className={`relative w-14 h-8 rounded-full transition-colors ${localPaymentSettings.is_enabled ? 'bg-brand-primary' : 'bg-gray-300'
                          }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${localPaymentSettings.is_enabled ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pending Payment Requests */}
          <div className="bg-bg-card rounded-xl border border-border-main">
            <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection('paymentRequests')}>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Clock size={20} /> Payment Requests
                {paymentRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                    {paymentRequests.filter(r => r.status === 'pending').length} pending
                  </span>
                )}
              </h3>
              {expandedSections.paymentRequests ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>

            {expandedSections.paymentRequests && (
              <div className="px-6 pb-6">

                {paymentRequests.length === 0 ? (
                  <div className="text-center py-8 text-text-alt">
                    <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No payment requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentRequests.map(request => (
                      <div key={request.id} className={`p-4 rounded-lg border ${request.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        request.status === 'approved' ? 'bg-brand-primary/10 border-brand-primary/30' :
                          'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                request.status === 'approved' ? 'bg-brand-primary/20 text-brand-primary' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                {request.status.toUpperCase()}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {new Date(request.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-text-main font-medium">
                              {request.profiles?.username || request.profiles?.email || 'Unknown User'}
                            </p>
                            <p className="text-text-alt text-sm">
                              Plan: {request.subscription_tiers?.name || 'Unknown'} •
                              Amount: {request.amount} {request.currency}
                            </p>
                            <p className="text-text-alt text-sm mt-1">
                              <span className="text-text-alt">Reference:</span> {request.transaction_reference}
                            </p>
                            {request.payer_name && (
                              <p className="text-text-alt text-sm">
                                Payer: {request.payer_name} {request.payer_phone && `(${request.payer_phone})`}
                              </p>
                            )}
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updatePaymentRequest(request.id, 'approved')}
                                className="flex items-center gap-1 px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason (optional):')
                                  updatePaymentRequest(request.id, 'rejected', reason || '')
                                }}
                                className="flex items-center gap-1 px-3 py-2 bg-red-500 text-gray-900 rounded-lg hover:bg-red-600"
                              >
                                <X size={16} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-card rounded-xl p-6 border border-border-main">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-brand-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-main">${totalRevenue.toFixed(2)}</p>
                  <p className="text-text-alt text-sm">Total Revenue</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-card rounded-xl p-6 border border-border-main">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-main">${thisMonthRevenue.toFixed(2)}</p>
                  <p className="text-text-alt text-sm">This Month</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-card rounded-xl p-6 border border-border-main">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-main">{transactions.length}</p>
                  <p className="text-text-alt text-sm">Total Transactions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Providers */}
          <div className="bg-bg-card rounded-xl border border-border-main p-6">
            <h3 className="text-lg font-bold text-text-main mb-4">Payment Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Stripe', icon: '💳', status: 'Not configured', color: 'bg-purple-500' },
                { name: 'Chapa', icon: '🇪🇹', status: 'Not configured', color: 'bg-brand-primary' },
                { name: 'PayPal', icon: '🅿️', status: 'Not configured', color: 'bg-blue-500' },
              ].map(provider => (
                <div key={provider.name} className="bg-bg-alt rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <p className="text-text-main font-medium">{provider.name}</p>
                      <p className="text-text-alt text-sm">{provider.status}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-lg text-sm hover:bg-brand-primary/30">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tiers Section */}
      {activeSection === 'tiers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-main">Subscription Tiers</h2>
            <button
              onClick={() => { setShowTierModal(true); setEditingItem(null) }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:brightness-110"
            >
              <Plus size={18} /> Add Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map(tier => (
              <div key={tier.id} className={`bg-bg-card rounded-xl border ${tier.name === 'Premium' ? 'border-brand-primary' : 'border-border-main'} p-6`}>
                {tier.name === 'Premium' && (
                  <span className="inline-block px-2 py-1 bg-brand-primary text-white text-xs rounded-full mb-3">Popular</span>
                )}
                <h3 className="text-xl font-bold text-text-main mb-1">{tier.name}</h3>
                <p className="text-text-alt text-sm mb-4">{tier.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-text-main">${tier.price_monthly}</span>
                  <span className="text-text-alt">/month</span>
                </div>
                <p className="text-text-alt text-sm mb-4">or ${tier.price_yearly}/year</p>

                <ul className="space-y-2 mb-6">
                  {(tier.features || []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-alt text-sm">
                      <Check size={16} className="text-brand-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingItem(tier); setShowTierModal(true) }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => deleteTier(tier.id)}
                    className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Section */}
      {activeSection === 'transactions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-text-main">Recent Transactions</h2>

          <div className="bg-bg-card rounded-xl border border-border-main overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-alt">
                <tr>
                  <th className="text-left p-4 text-text-alt font-medium">User</th>
                  <th className="text-left p-4 text-text-alt font-medium">Amount</th>
                  <th className="text-left p-4 text-text-alt font-medium">Status</th>
                  <th className="text-left p-4 text-text-alt font-medium">Provider</th>
                  <th className="text-left p-4 text-text-alt font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.map(tx => (
                  <tr key={tx.id} className="border-t border-border-main">
                    <td className="p-4">
                      <p className="text-text-main">{tx.profiles?.username || 'Unknown'}</p>
                      <p className="text-text-alt text-sm">{tx.profiles?.email}</p>
                    </td>
                    <td className="p-4 text-text-main font-bold">${tx.amount} {tx.currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${tx.status === 'completed' ? 'bg-brand-primary/20 text-brand-primary' :
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-200 text-gray-500'
                        }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-alt capitalize">{tx.payment_provider || '-'}</td>
                    <td className="p-4 text-text-alt text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promo Codes Section */}
      {activeSection === 'promos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-main">Promo Codes</h2>
            <button
              onClick={() => { setShowPromoModal(true); setEditingItem(null) }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:brightness-110"
            >
              <Plus size={18} /> Add Promo Code
            </button>
          </div>

          <div className="bg-bg-card rounded-xl border border-border-main overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-alt">
                <tr>
                  <th className="text-left p-4 text-text-alt font-medium">Code</th>
                  <th className="text-left p-4 text-text-alt font-medium">Discount</th>
                  <th className="text-left p-4 text-text-alt font-medium">Uses</th>
                  <th className="text-left p-4 text-text-alt font-medium">Valid Until</th>
                  <th className="text-left p-4 text-text-alt font-medium">Status</th>
                  <th className="text-left p-4 text-text-alt font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.length > 0 ? promoCodes.map(promo => (
                  <tr key={promo.id} className="border-t border-border-main">
                    <td className="p-4">
                      <code className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded font-mono">
                        {promo.code}
                      </code>
                    </td>
                    <td className="p-4 text-text-main">
                      {promo.discount_type === 'percentage'
                        ? `${promo.discount_value}%`
                        : `$${promo.discount_value}`}
                    </td>
                    <td className="p-4 text-text-alt">
                      {promo.current_uses} / {promo.max_uses || '∞'}
                    </td>
                    <td className="p-4 text-text-alt text-sm">
                      {promo.valid_until
                        ? new Date(promo.valid_until).toLocaleDateString()
                        : 'No expiry'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${promo.is_active ? 'bg-brand-primary/20 text-brand-primary' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingItem(promo); setShowPromoModal(true) }}
                          className="p-1.5 text-text-alt hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deletePromoCode(promo.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No promo codes yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tier Modal */}
      {showTierModal && (
        <TierModal
          tier={editingItem}
          onSave={saveTier}
          onClose={() => { setShowTierModal(false); setEditingItem(null) }}
        />
      )}

      {/* Promo Modal */}
      {showPromoModal && (
        <PromoModal
          promo={editingItem}
          onSave={savePromoCode}
          onClose={() => { setShowPromoModal(false); setEditingItem(null) }}
        />
      )}
    </div>
  )
}

// Tier Modal
function TierModal({ tier, onSave, onClose }) {
  const [form, setForm] = useState({
    name: tier?.name || '',
    description: tier?.description || '',
    price_monthly: tier?.price_monthly || 0,
    price_yearly: tier?.price_yearly || 0,
    currency: tier?.currency || 'USD',
    features: tier?.features || [],
    is_active: tier?.is_active ?? true,
    sort_order: tier?.sort_order || 0,
  })
  const [featureInput, setFeatureInput] = useState('')

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden border-2 border-border-main shadow-2xl flex flex-col">
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-alt/50">
          <div>
            <h2 className="text-xl font-black text-text-main">{tier ? 'Edit Subscription' : 'New Subscription'}</h2>
            <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Tier Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Plan Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Super Learner"
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="What makes this tier special?"
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Monthly ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_monthly}
                  onChange={(e) => setForm({ ...form, price_monthly: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Yearly ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_yearly}
                  onChange={(e) => setForm({ ...form, price_yearly: parseFloat(e.target.value) })}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Features</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a benefit..."
                  className="flex-1 p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 bg-brand-primary text-white font-black rounded-2xl hover:brightness-110 shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-1 transition-all"
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-brand-primary/10 border-2 border-brand-primary/20 rounded-xl group">
                    <span className="text-brand-primary font-bold text-sm">{f}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })}
                      className="text-brand-primary hover:text-red-500 transition-colors"
                    >
                      <X size={14} className="stroke-[3px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
              <div>
                <p className="text-text-main font-black text-sm uppercase tracking-widest">Active Status</p>
                <p className="text-text-alt text-xs font-bold">Visible to users when enabled</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className={`relative w-14 h-8 rounded-full transition-all ${form.is_active ? 'bg-brand-primary' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-bg-alt text-text-alt font-black rounded-2xl border-2 border-border-main hover:bg-border-main transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest"
            >
              {tier ? 'Save Changes' : 'Create Tier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Promo Modal
function PromoModal({ promo, onSave, onClose }) {
  const [form, setForm] = useState({
    code: promo?.code || '',
    discount_type: promo?.discount_type || 'percentage',
    discount_value: promo?.discount_value || 10,
    max_uses: promo?.max_uses || null,
    valid_until: promo?.valid_until ? promo.valid_until.split('T')[0] : '',
    is_active: promo?.is_active ?? true,
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-border-main flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main">{promo ? 'Edit Promo Code' : 'Add Promo Code'}</h2>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="p-4 space-y-4">
          <div>
            <label className="block text-text-alt text-sm mb-1">Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g., SAVE20"
              className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main font-mono uppercase"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-alt text-sm mb-1">Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-text-alt text-sm mb-1">Value</label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) })}
                className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-alt text-sm mb-1">Max Uses</label>
              <input
                type="number"
                value={form.max_uses || ''}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Unlimited"
                className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
              />
            </div>
            <div>
              <label className="block text-text-alt text-sm mb-1">Valid Until</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            Active
          </label>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-bg-alt text-text-main rounded-lg hover:bg-border-main">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90">{promo ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentsTab
