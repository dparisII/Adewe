import { useState, useEffect } from 'react'
import {
  CreditCard, DollarSign, Settings, Tag, Plus, Edit,
  Trash2, Check, X, TrendingUp, Users, Calendar, CheckCircle, XCircle,
  Building2, Clock, Eye, Save, RefreshCw, RotateCw, ChevronDown, ChevronRight,
  Zap, Crown, Shield, Rocket, Heart, AlertCircle, Archive, EyeOff,
  FileText, Mail, Download, MoreVertical, ExternalLink, Ban, Timer
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
  const [userSubscriptions, setUserSubscriptions] = useState([])
  const [paymentRequests, setPaymentRequests] = useState([])
  const [expandedSections, setExpandedSections] = useState({
    userSubscriptions: true,
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
    bank_accounts: [
      {
        id: crypto.randomUUID(),
        bank_name: 'Commercial Bank of Ethiopia',
        account_name: 'Adewe Language Learning',
        account_number: '1000123456789',
        currency: 'ETB'
      }
    ],
    instructions: 'Transfer the exact amount and send us your transaction reference number (FT/Invoice No) for verification.'
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
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm, isDestructive, needsInput }

  // Local state for provider settings (in a real app, fetch from DB)
  const [providerSettings, setProviderSettings] = useState({
    'Stripe': { active: false, public_key: '', secret_key: '', is_test_mode: true },
    'Chapa': { active: true, public_key: '', secret_key: '', is_test_mode: true },
    'PayPal': { active: false, client_id: '', secret_key: '', is_test_mode: true },
  })
  const [showArchive, setShowArchive] = useState(false)
  const [archiveFilter, setArchiveFilter] = useState('all')

  const saveProviderSettings = (data) => {
    setProviderSettings(prev => ({
      ...prev,
      [data.name]: {
        active: data.is_active,
        public_key: data.public_key,
        secret_key: data.secret_key,
        merchant_id: data.merchant_id,
        is_test_mode: data.is_test_mode
      }
    }))
    setShowProviderModal(false)
    showToast(`${data.name} configuration saved!`)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    console.log('Fetching payment data...')
    try {
      // Fetch subscription tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('sort_order')

      if (tiersError) {
        console.error('Error fetching tiers:', tiersError)
      }
      setTiers(tiersData || [])

      // Fetch transactions
      const { data: transData, error: transError } = await supabase
        .from('payment_transactions')
        .select('*, profiles(username, email)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (transError) {
        console.error('Error fetching transactions:', transError)
      }
      setTransactions(transData || [])

      // Fetch payment requests
      console.log('Fetching payment requests...')
      const { data: requests, error: requestsError } = await supabase
        .from('local_payment_requests')
        .select(`
          *,
          profiles:user_id(username, email),
          tier:tier_id(name)
        `)
        .order('created_at', { ascending: false })

      if (requestsError) {
        console.error('Error fetching payment requests:', requestsError)
      } else {
        console.log('Fetched requests:', requests?.length || 0)
      }
      setPaymentRequests(requests || [])

      // Fetch promo codes
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (promoError) {
        console.error('Error fetching promo codes:', promoError)
      }
      setPromoCodes(promoData || [])

      // Fetch local payment settings
      const { data: localSettings, error: settingsError } = await supabase
        .from('local_payment_settings')
        .select('*')
        .single()

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching local settings:', settingsError)
      }

      if (localSettings) {
        setLocalPaymentSettings({
          ...localSettings,
          bank_accounts: localSettings.bank_accounts || (localSettings.bank_name ? [{
            id: crypto.randomUUID(),
            bank_name: localSettings.bank_name,
            account_name: localSettings.account_name,
            account_number: localSettings.account_number,
            currency: localSettings.currency || 'ETB'
          }] : [])
        })
      }

      setPaymentRequests(requests || [])

      // Fetch user subscriptions
      const { data: userSubs, error: subsError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          profiles:user_id(username, email),
          tier:tier_id(name)
        `)
        .order('created_at', { ascending: false })

      if (subsError) {
        console.error('Error fetching user subscriptions:', subsError)
        showToast('Error fetching subs: ' + subsError.message, 'error')
      } else {
        console.log('User Subs Data:', userSubs)
        if (!userSubs || userSubs.length === 0) {
          console.log('No subscriptions returned.')
        }
      }
      setUserSubscriptions(userSubs || [])

    } catch (error) {
      console.error('Unexpected error in fetchData:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveLocalPaymentSettings = async () => {
    setSaving(true)
    try {
      // Ensure we only send valid columns to the database
      const settingsPayload = {
        id: '00000000-0000-0000-0000-000000000001',
        is_enabled: localPaymentSettings.is_enabled,
        bank_accounts: localPaymentSettings.bank_accounts,
        instructions: localPaymentSettings.instructions,
        updated_at: new Date().toISOString()
      }

      console.log('Saving settings:', settingsPayload)

      const { error } = await supabase
        .from('local_payment_settings')
        .upsert(settingsPayload)

      if (error) throw error
      showToast('Payment settings saved!')
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Error saving settings: ' + error.message, 'error')
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

      // If approved, create subscription for user AND transaction record
      if (status === 'approved') {
        const request = paymentRequests.find(r => r.id === id)
        if (request) {
          // 1. Create/Update Subscription
          const { data: subData, error: subError } = await supabase.from('user_subscriptions').upsert({
            user_id: request.user_id,
            tier_id: request.tier_id,
            status: 'active',
            payment_provider: 'local_bank',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }).select().single()

          if (subError) throw subError

          // 2. Create Transaction Record
          const { error: transError } = await supabase.from('payment_transactions').insert({
            user_id: request.user_id,
            subscription_id: subData.id,
            amount: request.amount,
            currency: request.currency,
            status: 'completed',
            payment_provider: 'local_bank',
            external_transaction_id: request.transaction_reference,
            metadata: {
              payer_name: request.payer_name,
              bank_name: request.bank_name,
              request_id: request.id
            }
          })

          if (transError) console.error('Error creating transaction record:', transError)
        }
      }

      showToast(`Payment ${status}!`)
      fetchData()
    } catch (error) {
      console.error('Error updating request:', error)
      alert(`Error updating request: ${error.message || JSON.stringify(error)}`)
      showToast('Error updating request: ' + error.message, 'error')
    }
  }

  const saveTier = async (data) => {
    setSaving(true)
    try {
      console.log('Saving tier data:', data)
      // Ensure numeric fields are numbers
      const cleanData = {
        name: data.name,
        description: data.description,
        price_monthly: parseFloat(data.price_monthly),
        price_yearly: parseFloat(data.price_yearly),
        price_monthly_etb: parseFloat(data.price_monthly_etb || 0),
        price_yearly_etb: parseFloat(data.price_yearly_etb || 0),
        currency: data.currency,
        features: data.features,
        is_active: data.is_active,
        is_visible: data.is_visible,
        is_popular: data.is_popular,
        has_unlimited_hearts: data.has_unlimited_hearts,
        sort_order: parseInt(data.sort_order || 0)
      }

      if (editingItem && editingItem.id) {
        const { error } = await supabase.from('subscription_tiers').update(cleanData).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('subscription_tiers').insert([cleanData])
        if (error) throw error
      }

      showToast(editingItem ? 'Tier updated!' : 'Tier created!')
      fetchData()
      setShowTierModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('CRITICAL: Error saving tier:', error)
      showToast(`Error saving tier: ${error.message || JSON.stringify(error)}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteTier = (id) => {
    setConfirmModal({
      title: 'Delete Subscription Tier',
      message: 'Are you sure you want to PERMANENTLY delete this tier? This will also remove all linked subscriptions and payment requests. This action cannot be undone!',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null)
        try {
          // Step 1: Delete all user_subscriptions linked to this tier
          await supabase.from('user_subscriptions').delete().eq('tier_id', id)

          // Step 2: Delete all local_payment_requests linked to this tier
          await supabase.from('local_payment_requests').delete().eq('tier_id', id)

          // Step 3: Delete the tier itself
          const { error } = await supabase.from('subscription_tiers').delete().eq('id', id)
          if (error) throw error

          showToast('Tier deleted permanently!', 'success')
          fetchData()
        } catch (error) {
          console.error('CRITICAL: Error deleting tier:', error)
          showToast(`Delete Failed: ${error.message || error.details || 'Unknown error'}`, 'error')
        }
      }
    })
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

  const deletePromoCode = (id) => {
    setConfirmModal({
      title: 'Delete Promo Code',
      message: 'Are you sure you want to delete this promo code?',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null)
        // Optimistic UI: Remove from list immediately
        setPromoCodes(prev => prev.filter(p => p.id !== id))
        try {
          const { error } = await supabase.from('promo_codes').delete().eq('id', id)
          if (error) throw error
          showToast('Promo code deleted!', 'success')
        } catch (error) {
          console.error('Error deleting promo code:', error)
          showToast('Error deleting promo code', 'error')
          // Refresh to restore if delete failed
          fetchData()
        }
      }
    })
  }

  const cancelSubscription = (id) => {
    setConfirmModal({
      title: 'Cancel Subscription',
      message: 'Are you sure you want to cancel this user\'s subscription? They will lose access immediately.',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null)
        try {
          const { error } = await supabase
            .from('user_subscriptions')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', id)

          if (error) throw error
          showToast('Subscription cancelled')
          fetchData()
        } catch (error) {
          console.error('Error cancelling subscription:', error)
          showToast('Error cancelling subscription', 'error')
        }
      }
    })
  }

  const extendSubscription = async (id, days = 30) => {
    try {
      const sub = userSubscriptions.find(s => s.id === id)
      if (!sub) return

      const currentEnd = new Date(sub.current_period_end || Date.now())
      const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000)

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          current_period_end: newEnd.toISOString(),
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      showToast(`Subscription extended by ${days} days`)
      fetchData()
    } catch (error) {
      console.error('Error extending subscription:', error)
      showToast('Error extending subscription', 'error')
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
        <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
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
          { id: 'user_subs', label: 'User Subscriptions', icon: Users },
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

        <div className="flex-1" />
      </div>

      {/* User Subscriptions Section */}
      {activeSection === 'user_subs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-bg-card p-6 rounded-2xl border-2 border-border-main">
            <div>
              <h2 className="text-2xl font-black text-text-main">User Subscriptions</h2>
              <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Active Plans & Access Control</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                className="p-2 text-text-alt hover:text-brand-primary hover:bg-bg-alt rounded-xl transition-all border border-transparent hover:border-border-main"
                title="Refresh Data"
              >
                <RotateCw size={20} />
              </button>
              <span className="px-4 py-2 bg-bg-alt text-text-alt rounded-xl border border-border-main font-bold text-sm">
                {userSubscriptions.filter(s => s.status === 'active').length} Active
              </span>
            </div>
          </div>

          <div className="bg-bg-card rounded-3xl border-2 border-border-main overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-alt/50 border-b-2 border-border-main">
                  <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">User</th>
                  <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Tier</th>
                  <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Status</th>
                  <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Expires</th>
                  <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border-main/30">
                {userSubscriptions.length > 0 ? userSubscriptions.map(sub => (
                  <tr
                    key={sub.id}
                    onClick={() => { setEditingItem(sub); setShowSubscriptionModal(true); }}
                    className="hover:bg-bg-alt/20 transition-all group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center font-black border border-brand-primary/20 text-xs shadow-sm group-hover:scale-110 transition-transform">
                          {sub.profiles?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-text-main font-black text-sm tracking-tight">{sub.profiles?.username || 'Unknown'}</p>
                          <p className="text-text-alt text-[10px] font-bold tracking-tight">{sub.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${sub.tier?.name.toLowerCase().includes('max') ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' :
                        sub.tier?.name.toLowerCase().includes('family') ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                          'bg-bg-alt text-text-alt border-border-main'
                        }`}>
                        {sub.tier?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                        sub.status === 'expired' ? 'bg-red-500/10 text-red-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-text-main font-bold text-sm">
                          {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-text-alt text-[10px] font-black uppercase tracking-widest">
                          {sub.current_period_end && Math.ceil((new Date(sub.current_period_end) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(sub);
                          setShowSubscriptionModal(true);
                        }}
                        className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-lg transition-all"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-text-alt">
                      <Users size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="font-black uppercase tracking-[0.2em] text-xs">No active subscriptions found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )
      }

      {/* Local Bank Transfer Section */}
      {
        activeSection === 'local' && (
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
                  <div className="space-y-6">
                    {/* Global Instruction */}
                    <div className="md:col-span-2">
                      <label className="block text-text-alt text-sm mb-1 uppercase font-black tracking-widest">Global Instructions for Users</label>
                      <textarea
                        value={localPaymentSettings.instructions}
                        onChange={(e) => setLocalPaymentSettings({ ...localPaymentSettings, instructions: e.target.value })}
                        rows={2}
                        className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold outline-none focus:border-brand-primary"
                        placeholder="e.g. Please include your username in the transfer note..."
                      />
                    </div>

                    {/* Bank Accounts List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-text-alt uppercase tracking-widest">Bank Accounts</h4>
                        <button
                          onClick={() => {
                            const newAccount = {
                              id: crypto.randomUUID(),
                              bank_name: ethiopianBanks[0],
                              account_name: '',
                              account_number: '',
                              currency: 'ETB'
                            }
                            setLocalPaymentSettings({
                              ...localPaymentSettings,
                              bank_accounts: [...(localPaymentSettings.bank_accounts || []), newAccount]
                            })
                          }}
                          className="flex items-center gap-1 text-xs font-black text-brand-primary uppercase hover:underline"
                        >
                          <Plus size={14} /> Add Account
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {(localPaymentSettings.bank_accounts || []).map((acc, index) => (
                          <div key={acc.id || index} className="p-6 bg-bg-alt border-2 border-border-main rounded-2xl relative group">
                            <button
                              onClick={() => {
                                const updated = localPaymentSettings.bank_accounts.filter((_, i) => i !== index)
                                setLocalPaymentSettings({ ...localPaymentSettings, bank_accounts: updated })
                              }}
                              className="absolute top-4 right-4 p-2 text-text-alt hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Bank Name</label>
                                <select
                                  value={acc.bank_name}
                                  onChange={(e) => {
                                    const updated = [...localPaymentSettings.bank_accounts]
                                    updated[index].bank_name = e.target.value
                                    setLocalPaymentSettings({ ...localPaymentSettings, bank_accounts: updated })
                                  }}
                                  className="w-full p-3 bg-bg-card border-2 border-border-main rounded-xl text-text-main font-bold outline-none focus:border-brand-primary"
                                >
                                  {ethiopianBanks.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Account Name</label>
                                <input
                                  type="text"
                                  value={acc.account_name}
                                  onChange={(e) => {
                                    const updated = [...localPaymentSettings.bank_accounts]
                                    updated[index].account_name = e.target.value
                                    setLocalPaymentSettings({ ...localPaymentSettings, bank_accounts: updated })
                                  }}
                                  className="w-full p-3 bg-bg-card border-2 border-border-main rounded-xl text-text-main font-bold outline-none focus:border-brand-primary"
                                  placeholder="Adewe Learning"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Account Number</label>
                                <input
                                  type="text"
                                  value={acc.account_number}
                                  onChange={(e) => {
                                    const updated = [...localPaymentSettings.bank_accounts]
                                    updated[index].account_number = e.target.value
                                    setLocalPaymentSettings({ ...localPaymentSettings, bank_accounts: updated })
                                  }}
                                  className="w-full p-3 bg-bg-card border-2 border-border-main rounded-xl text-text-main font-black font-mono outline-none focus:border-brand-primary"
                                  placeholder="1000..."
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Currency</label>
                                <select
                                  value={acc.currency}
                                  onChange={(e) => {
                                    const updated = [...localPaymentSettings.bank_accounts]
                                    updated[index].currency = e.target.value
                                    setLocalPaymentSettings({ ...localPaymentSettings, bank_accounts: updated })
                                  }}
                                  className="w-full p-3 bg-bg-card border-2 border-border-main rounded-xl text-text-main font-bold outline-none focus:border-brand-primary"
                                >
                                  <option value="ETB">ETB</option>
                                  <option value="USD">USD</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-t-2 border-border-main">
                      <div>
                        <p className="text-text-main font-black uppercase tracking-tight">Enable Bank Transfer Payments</p>
                        <p className="text-text-alt text-xs font-bold">Allow users to pay via bank transfer</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocalPaymentSettings({ ...localPaymentSettings, is_enabled: !localPaymentSettings.is_enabled })}
                        className={`relative w-14 h-8 rounded-full transition-all ${localPaymentSettings.is_enabled ? 'bg-brand-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${localPaymentSettings.is_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pending Payment Requests */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50">
                <button
                  onClick={() => toggleSection('paymentRequests')}
                  className="flex items-center gap-3 hover:text-brand-secondary transition-colors"
                >
                  <Clock size={20} className="text-slate-400" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">
                    {showArchive ? 'Request History' : 'Payment Requests'}
                    {paymentRequests.filter(r => r.status === 'pending').length > 0 && !showArchive && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full ml-2">
                        {paymentRequests.filter(r => r.status === 'pending').length} pending
                      </span>
                    )}
                  </h3>
                </button>
                <div className="flex items-center gap-2">
                  {showArchive && (
                    <select
                      value={archiveFilter}
                      onChange={(e) => setArchiveFilter(e.target.value)}
                      className="p-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-brand-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowArchive(!showArchive); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showArchive
                      ? 'bg-brand-primary text-white'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'
                      }`}
                  >
                    <Archive size={14} />
                    {showArchive ? 'Active' : 'Archive'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); fetchData(); }}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-brand-secondary transition-colors"
                    title="Refresh Requests"
                  >
                    <RotateCw size={18} />
                  </button>
                  <button onClick={() => toggleSection('paymentRequests')}>
                    {expandedSections.paymentRequests ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>

              {expandedSections.paymentRequests && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  {(() => {
                    const visibleRequests = paymentRequests.filter(r => {
                      if (!showArchive) return r.status === 'pending'
                      if (archiveFilter === 'all') return r.status !== 'pending'
                      return r.status === archiveFilter
                    })

                    if (visibleRequests.length === 0) {
                      return (
                        <div className="text-center py-8 text-text-alt">
                          <Building2 size={48} className="mx-auto mb-3 opacity-50" />
                          <p>{showArchive ? 'No archived requests found' : 'No pending requests'}</p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">
                        {visibleRequests.map(request => (
                          <div key={request.id} className={`p-6 rounded-2xl border-2 transition-all hover:shadow-md ${request.status === 'pending' ? 'bg-yellow-500/5 border-yellow-500/20' :
                            request.status === 'approved' ? 'bg-brand-primary/5 border-brand-primary/20' :
                              'bg-red-500/5 border-red-500/20'
                            }`}>
                            <div className="flex flex-wrap items-start justify-between gap-6">
                              <div className="flex-1 min-w-[240px]">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                                    request.status === 'approved' ? 'bg-brand-primary/20 text-brand-primary' :
                                      'bg-red-500/20 text-red-500'
                                    }`}>
                                    {request.status}
                                  </span>
                                  <div className="flex items-center gap-1 text-text-alt text-xs font-bold">
                                    <Calendar size={12} />
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-bg-alt rounded-xl flex items-center justify-center text-text-alt font-black border border-border-main">
                                    {request.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-text-main font-black tracking-tight leading-none mb-1 text-lg">
                                      {request.profiles?.username || 'Unknown User'}
                                    </p>
                                    <p className="text-text-alt text-xs font-bold tracking-tight">
                                      {request.profiles?.email || 'No email provided'}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 p-4 bg-bg-alt/50 rounded-2xl border border-border-main/50 mb-4">
                                  <div>
                                    <p className="text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Requested Plan</p>
                                    <p className="text-text-main font-bold">
                                      {request.tier?.name || 'Unknown Tier'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-text-alt uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-brand-primary font-black">
                                      {request.amount} {request.currency}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-text-alt uppercase tracking-widest">Reference:</span>
                                    <code className="px-2 py-0.5 bg-bg-alt rounded text-text-main font-mono font-black text-sm border border-border-main">
                                      {request.transaction_reference}
                                    </code>
                                  </div>
                                  {request.bank_name && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black text-text-alt uppercase tracking-widest">Bank:</span>
                                      <span className="text-text-main font-bold text-sm">{request.bank_name}</span>
                                    </div>
                                  )}
                                  {request.payer_name && (
                                    <div className="flex items-center gap-2 text-text-main text-sm font-bold">
                                      <Users size={14} className="text-text-alt" />
                                      <span>{request.payer_name} {request.payer_phone && `(${request.payer_phone})`}</span>
                                    </div>
                                  )}
                                </div>
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
                                      setConfirmModal({
                                        title: 'Reject Payment Request',
                                        message: 'Please provide a reason for rejecting this payment request:',
                                        needsInput: true,
                                        isDestructive: true,
                                        onConfirm: (reason) => {
                                          setConfirmModal(null)
                                          updatePaymentRequest(request.id, 'rejected', reason || '')
                                        }
                                      })
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
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Overview Section */}
      {
        activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-text-main">Dashboard Overview</h2>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-main text-text-alt hover:text-brand-primary hover:border-brand-primary rounded-xl font-bold transition-all"
              >
                <RotateCw size={18} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Stats */}
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-brand-primary/10 to-transparent rounded-2xl p-6 border border-brand-primary/20 hover:border-brand-primary/50 transition-all hover:shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                    <DollarSign className="text-white" size={24} />
                  </div>
                  <div className="px-2 py-1 bg-brand-primary/10 rounded-lg border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest">
                    Revenue
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-text-main tracking-tight">${totalRevenue.toFixed(2)}</h3>
                  <p className="text-text-alt font-bold text-sm">Total Earnings</p>
                </div>
              </div>

              {/* This Month */}
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all hover:shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div className="px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-widest">
                    Monthly
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-text-main tracking-tight">${thisMonthRevenue.toFixed(2)}</h3>
                  <p className="text-text-alt font-bold text-sm">Current Month</p>
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={24} />
                  </div>
                  <div className="px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-500 text-xs font-black uppercase tracking-widest">
                    Volume
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-text-main tracking-tight">{transactions.length}</h3>
                  <p className="text-text-alt font-bold text-sm">Total Transactions</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Providers */}
              <div className="bg-bg-card rounded-3xl border-2 border-border-main p-8 shadow-sm">
                <h3 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                  <CreditCard size={24} className="text-brand-primary" />
                  Payment Gateways
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Bank Transfer',
                      icon: '🏦',
                      status: localPaymentSettings.is_enabled ? 'Active' : 'Disabled',
                      color: 'bg-green-500',
                      active: localPaymentSettings.is_enabled,
                      action: () => setActiveSection('local')
                    },
                    {
                      name: 'Stripe',
                      icon: '💳',
                      status: providerSettings['Stripe'].active ? 'Connected' : 'Not Configured',
                      color: 'bg-indigo-600',
                      active: providerSettings['Stripe'].active,
                      ...providerSettings['Stripe']
                    },
                    {
                      name: 'Chapa',
                      icon: '🇪🇹',
                      status: providerSettings['Chapa'].active ? 'Active' : 'Disabled',
                      color: 'bg-brand-primary',
                      active: providerSettings['Chapa'].active,
                      ...providerSettings['Chapa']
                    },
                    {
                      name: 'PayPal',
                      icon: '🅿️',
                      status: providerSettings['PayPal'].active ? 'Active' : 'Coming Soon',
                      color: 'bg-blue-600',
                      active: providerSettings['PayPal'].active,
                      ...providerSettings['PayPal']
                    },
                  ].map(provider => (
                    <div key={provider.name} className="bg-bg-alt/50 rounded-2xl p-4 border border-border-main hover:border-brand-primary/30 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                            {provider.icon}
                          </div>
                          <div>
                            <p className="text-text-main font-black text-lg">{provider.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${provider.active ? 'bg-brand-primary' : 'bg-gray-400'}`} />
                              <p className="text-text-alt text-xs font-bold uppercase tracking-widest">{provider.status}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (provider.name === 'Bank Transfer') {
                              provider.action()
                            } else {
                              setEditingItem(provider)
                              setShowProviderModal(true)
                            }
                          }}
                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${provider.active
                            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                            : 'bg-bg-alt text-text-alt border border-border-main hover:text-text-main'
                            }`}>
                          {provider.active ? 'Manage' : 'Configure'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions / Recent Activity Placeholder */}
              <div className="bg-bg-card rounded-3xl border-2 border-border-main p-8 shadow-sm">
                <h3 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                  <Zap size={24} className="text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveSection('tiers')}
                    className="p-4 bg-bg-alt hover:bg-bg-alt/80 rounded-2xl border-2 border-border-main text-left transition-all group"
                  >
                    <div className="w-10 h-10 bg-brand-secondary/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Edit className="text-brand-secondary" size={20} />
                    </div>
                    <p className="font-black text-text-main">Manage Tiers</p>
                    <p className="text-xs text-text-alt font-bold">Update prices & features</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('promos')}
                    className="p-4 bg-bg-alt hover:bg-bg-alt/80 rounded-2xl border-2 border-border-main text-left transition-all group"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Tag className="text-purple-500" size={20} />
                    </div>
                    <p className="font-black text-text-main">Promo Codes</p>
                    <p className="text-xs text-text-alt font-bold">Create discounts</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('local')}
                    className="p-4 bg-bg-alt hover:bg-bg-alt/80 rounded-2xl border-2 border-border-main text-left transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Building2 className="text-blue-500" size={20} />
                    </div>
                    <p className="font-black text-text-main">Bank Settings</p>
                    <p className="text-xs text-text-alt font-bold">Update account info</p>
                  </button>
                  <button
                    onClick={() => fetchData()}
                    className="p-4 bg-bg-alt hover:bg-bg-alt/80 rounded-2xl border-2 border-border-main text-left transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <RefreshCw className="text-green-500" size={20} />
                    </div>
                    <p className="font-black text-text-main">Refresh Financials</p>
                    <p className="text-xs text-text-alt font-bold">Sync latest data</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Subscription Tiers Section */}
      {
        activeSection === 'tiers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-bg-card p-6 rounded-2xl border-2 border-border-main">
              <div>
                <h2 className="text-2xl font-black text-text-main">Subscription Tiers</h2>
                <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Manage User Plans</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchData}
                  className="p-3 bg-bg-alt text-text-alt hover:text-brand-primary rounded-2xl border-2 border-border-main hover:bg-border-main transition-all"
                  title="Refresh Data"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={() => { setShowTierModal(true); setEditingItem(null) }}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest"
                >
                  <Plus size={18} className="stroke-[3px]" /> Add Tier
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map(tier => {
                const isSuper = tier.name.toLowerCase().includes('super') || tier.name === 'Premium'
                const isMax = tier.name.toLowerCase().includes('max') || tier.name === 'Family'

                const config = isSuper ? {
                  color: 'text-brand-secondary',
                  bg: 'bg-brand-secondary/10',
                  border: 'border-brand-secondary/30',
                  icon: Zap,
                } : isMax ? {
                  color: 'text-brand-primary',
                  bg: 'bg-brand-primary/10',
                  border: 'border-brand-primary/30',
                  icon: Crown,
                } : {
                  color: 'text-text-alt',
                  bg: 'bg-bg-alt',
                  border: 'border-border-main',
                  icon: Heart,
                }

                return (
                  <div key={tier.id} className={`bg-bg-card rounded-3xl border-2 ${config.border} p-8 relative flex flex-col shadow-sm hover:shadow-md transition-all ${!tier.is_visible ? 'opacity-75' : ''}`}>
                    {tier.is_popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-secondary text-white text-[10px] font-black rounded-full shadow-lg z-10 uppercase tracking-widest">
                        Most Popular
                      </div>
                    )}
                    {!tier.is_visible && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-gray-500/20 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest flex items-center gap-1">
                        <EyeOff size={12} /> Hidden
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${config.bg} ${config.color} shadow-sm border border-white/10 ${!tier.is_active ? 'grayscale opacity-50' : ''}`}>
                      <config.icon size={32} className="stroke-[2.5px]" />
                    </div>

                    <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">{tier.name}</h3>
                    <p className="text-text-alt text-sm font-bold mb-6 leading-relaxed min-h-[40px]">{tier.description}</p>

                    <div className="mb-8 p-4 bg-bg-alt/50 rounded-2xl border border-border-main/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-text-main">${tier.price_monthly}</span>
                            <span className="text-text-alt font-bold text-xs">/mo</span>
                          </div>
                          <p className="text-[10px] text-text-alt font-black uppercase tracking-widest leading-none mt-1">USD Price</p>
                        </div>
                        <div className="text-right border-l-2 border-border-main/30 pl-4">
                          <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-2xl font-black text-brand-primary">{tier.price_monthly_etb || 0}</span>
                            <span className="text-text-alt font-bold text-xs italic"> ETB</span>
                          </div>
                          <p className="text-[10px] text-text-alt font-black uppercase tracking-widest leading-none mt-1">Local Price</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border-main/30 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-alt">
                        <span>Annual: ${tier.price_yearly}</span>
                        <span className="text-brand-primary">{tier.price_yearly_etb || 0} ETB</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 mb-8">
                      <p className="text-[10px] font-black text-text-alt uppercase tracking-[0.2em] mb-4">Included Features</p>
                      {(tier.features || []).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-text-main">
                          <div className={`p-1 rounded-full ${config.bg} ${config.color}`}>
                            <Check size={12} className="stroke-[4px]" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-6 border-t-2 border-border-main/50">
                      <button
                        onClick={() => { setEditingItem(tier); setShowTierModal(true) }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-alt text-text-alt font-black rounded-2xl border-2 border-border-main hover:bg-border-main transition-all uppercase tracking-widest text-xs"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => deleteTier(tier.id)}
                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border-2 border-transparent hover:border-red-500/20"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    {!tier.is_active && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest border border-gray-200">
                        Archived
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      {/* Transactions Section */}
      {
        activeSection === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-text-main flex items-center gap-2">
                <DollarSign size={24} className="text-brand-primary" />
                Transaction History
              </h2>
              <button
                onClick={fetchData}
                className="p-3 text-text-alt hover:text-brand-primary hover:bg-bg-alt rounded-2xl transition-all border-2 border-transparent hover:border-border-main"
                title="Refresh Data"
              >
                <RotateCw size={20} />
              </button>
            </div>

            <div className="bg-bg-card rounded-3xl border-2 border-border-main overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-alt/50 border-b-2 border-border-main">
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">User</th>
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Amount</th>
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Status</th>
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Provider</th>
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]">Date</th>
                    <th className="p-4 text-[10px] font-black text-text-alt uppercase tracking-[0.2em]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border-main/30">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => { setEditingItem(tx); setShowTransactionModal(true) }}
                        className="hover:bg-bg-alt/20 transition-all cursor-pointer group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-xs">
                              {tx.profiles?.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-text-main text-sm">{tx.profiles?.username || 'Unknown User'}</div>
                              <div className="text-[10px] font-bold text-text-alt">{tx.profiles?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-black text-text-main text-sm">
                          {tx.amount} <span className="text-xs text-text-alt">{tx.currency}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${tx.status === 'completed' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-black text-text-alt uppercase tracking-wide flex items-center gap-2">
                          {tx.payment_provider === 'local_bank' && '🏦'}
                          {tx.payment_provider === 'stripe' && '💳'}
                          {tx.payment_provider === 'chapa' && '🇪🇹'}
                          {tx.payment_provider.replace('_', ' ')}
                        </td>
                        <td className="p-4 text-text-alt text-xs font-bold">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <ExternalLink size={16} className="text-text-alt opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-text-alt">
                        <div className="flex flex-col items-center gap-2">
                          <DollarSign size={48} className="text-text-alt/20" />
                          <p className="font-black uppercase tracking-widest text-xs">No transactions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {/* Promo Codes Section */}
      {
        activeSection === 'promos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-main">Promo Codes</h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchData}
                  className="p-2 text-text-alt hover:text-brand-primary hover:bg-bg-card rounded-lg transition-all border border-transparent hover:border-border-main"
                  title="Refresh Data"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={() => { setShowPromoModal(true); setEditingItem(null) }}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:brightness-110"
                >
                  <Plus size={18} /> Add Promo Code
                </button>
              </div>
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
        )
      }

      {/* Tier Modal */}
      {
        showTierModal && (
          <TierModal
            tier={editingItem}
            onSave={saveTier}
            onClose={() => { setShowTierModal(false); setEditingItem(null) }}
          />
        )
      }

      {/* Promo Modal */}
      {
        showPromoModal && (
          <PromoModal
            promo={editingItem}
            onSave={savePromoCode}
            onClose={() => { setShowPromoModal(false); setEditingItem(null) }}
          />
        )
      }

      {/* Provider Config Modal */}
      {
        showProviderModal && (
          <ProviderConfigModal
            provider={editingItem}
            onSave={saveProviderSettings}
            onClose={() => { setShowProviderModal(false); setEditingItem(null) }}
          />
        )
      }

      {/* Transaction Detail Modal */}
      {
        showTransactionModal && (
          <TransactionDetailModal
            transaction={editingItem}
            tiers={tiers}
            onClose={() => { setShowTransactionModal(false); setEditingItem(null) }}
            showToast={showToast}
          />
        )
      }

      {/* Subscription Detail Modal */}
      {
        showSubscriptionModal && (
          <SubscriptionDetailModal
            subscription={editingItem}
            onClose={() => { setShowSubscriptionModal(false); setEditingItem(null) }}
          />
        )
      }

      {/* Confirm Modal */}
      {
        confirmModal && (
          <ConfirmModal
            {...confirmModal}
            onClose={() => setConfirmModal(null)}
          />
        )
      }
    </div >
  )
}

// Tier Modal
function TierModal({ tier, onSave, onClose }) {
  const [form, setForm] = useState({
    name: tier?.name || '',
    description: tier?.description || '',
    price_monthly: tier?.price_monthly || 0,
    price_yearly: tier?.price_yearly || 0,
    price_monthly_etb: tier?.price_monthly_etb || 0,
    price_yearly_etb: tier?.price_yearly_etb || 0,
    currency: tier?.currency || 'USD',
    features: tier?.features || [],
    is_active: tier?.is_active ?? true,
    is_popular: tier?.is_popular || false,
    is_visible: tier?.is_visible ?? true,
    has_unlimited_hearts: tier?.has_unlimited_hearts || false,
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Monthly (ETB)</label>
                <input
                  type="number"
                  value={form.price_monthly_etb}
                  onChange={(e) => setForm({ ...form, price_monthly_etb: parseInt(e.target.value) })}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-brand-primary font-black focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Yearly (ETB)</label>
                <input
                  type="number"
                  value={form.price_yearly_etb}
                  onChange={(e) => setForm({ ...form, price_yearly_etb: parseInt(e.target.value) })}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-brand-primary font-black focus:border-brand-primary outline-none transition-all"
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

            <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
              <div>
                <p className="text-text-main font-black text-sm uppercase tracking-widest">Unlimited Hearts</p>
                <p className="text-text-alt text-xs font-bold">Users never lose hearts</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, has_unlimited_hearts: !form.has_unlimited_hearts })}
                className={`relative w-14 h-8 rounded-full transition-all ${form.has_unlimited_hearts ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.has_unlimited_hearts ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
                <div>
                  <p className="text-text-main font-black text-xs uppercase tracking-widest">Popular</p>
                  <p className="text-text-alt text-[10px] font-bold">Show badge</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_popular: !form.is_popular })}
                  className={`relative w-10 h-6 rounded-full transition-all ${form.is_popular ? 'bg-brand-secondary' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${form.is_popular ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
                <div>
                  <p className="text-text-main font-black text-xs uppercase tracking-widest">Visible</p>
                  <p className="text-text-alt text-[10px] font-bold">Show on page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_visible: !form.is_visible })}
                  className={`relative w-10 h-6 rounded-full transition-all ${form.is_visible ? 'bg-brand-primary' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${form.is_visible ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
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

// Payment Provider Config Modal
function ProviderConfigModal({ provider, onSave, onClose }) {
  const [form, setForm] = useState({
    name: provider?.name || '',
    is_active: provider?.active || false,
    public_key: provider?.public_key || '',
    secret_key: provider?.secret_key || '',
    merchant_id: provider?.merchant_id || '',
    webhook_secret: provider?.webhook_secret || '',
    is_test_mode: provider?.is_test_mode ?? true
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden border-2 border-border-main shadow-2xl flex flex-col">
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-alt/50">
          <div>
            <h2 className="text-xl font-black text-text-main">Configure {provider?.name}</h2>
            <p className="text-text-alt text-sm font-bold uppercase tracking-widest">{provider?.name} Integration</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="p-6 space-y-6 overflow-y-auto">
          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
            <div>
              <p className="text-text-main font-black text-sm uppercase tracking-widest">Enable Gateway</p>
              <p className="text-text-alt text-xs font-bold">Show this payment method to users</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-14 h-8 rounded-full transition-all ${form.is_active ? 'bg-brand-primary' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Test Mode */}
          <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
            <div>
              <p className="text-text-main font-black text-sm uppercase tracking-widest">Test Mode</p>
              <p className="text-text-alt text-xs font-bold">Use sandbox environment</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_test_mode: !form.is_test_mode })}
              className={`relative w-14 h-8 rounded-full transition-all ${form.is_test_mode ? 'bg-yellow-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.is_test_mode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Keys */}
          <div>
            <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Public Key</label>
            <input
              type="text"
              value={form.public_key}
              onChange={(e) => setForm({ ...form, public_key: e.target.value })}
              placeholder={provider?.name === 'Chapa' ? 'CHAPUBK-...' : 'pk_test_...'}
              className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold font-mono text-sm focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Secret Key</label>
            <div className="relative">
              <input
                type="password"
                value={form.secret_key}
                onChange={(e) => setForm({ ...form, secret_key: e.target.value })}
                placeholder={provider?.name === 'Chapa' ? 'CHASECK-...' : 'sk_test_...'}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold font-mono text-sm focus:border-brand-primary outline-none transition-all pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-alt">
                <EyeOff size={16} />
              </div>
            </div>
          </div>

          {provider?.name === 'PayPal' && (
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Merchant ID</label>
              <input
                type="text"
                value={form.merchant_id}
                onChange={(e) => setForm({ ...form, merchant_id: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold font-mono text-sm focus:border-brand-primary outline-none transition-all"
              />
            </div>
          )}

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
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
function PromoModal({ promo, onSave, onClose }) {
  const [form, setForm] = useState({
    code: promo?.code || '',
    discount_type: promo?.discount_type || 'percentage',
    discount_value: promo?.discount_value || 10,
    max_uses: promo?.max_uses || '',
    valid_until: promo?.valid_until ? promo.valid_until.split('T')[0] : '',
    is_active: promo?.is_active ?? true,
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-lg overflow-hidden border-2 border-border-main shadow-2xl flex flex-col">
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-alt/50">
          <div>
            <h2 className="text-xl font-black text-text-main">{promo ? 'Edit Promo Code' : 'New Promo Code'}</h2>
            <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Discount Options</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="p-6 space-y-6">
          <div>
            <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SAVE20"
              className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold font-mono uppercase focus:border-brand-primary outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Type</label>
              <div className="relative">
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold appearance-none focus:border-brand-primary outline-none transition-all"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-alt">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Value</label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Max Uses</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="Unlimited"
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-text-main font-black text-sm uppercase tracking-widest mb-2">Expires</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-bg-alt/30 rounded-2xl border-2 border-border-main">
            <div>
              <p className="text-text-main font-black text-sm uppercase tracking-widest">Active Status</p>
              <p className="text-text-alt text-xs font-bold">Can be used at checkout</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-14 h-8 rounded-full transition-all ${form.is_active ? 'bg-brand-primary' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex gap-4 pt-2">
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
              {promo ? 'Save Changes' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Confirm Modal
function ConfirmModal({ title, message, onConfirm, onClose, isDestructive = false, needsInput = false }) {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-sm overflow-hidden border-2 border-border-main shadow-2xl flex flex-col">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-brand-primary/10 text-brand-primary'
            }`}>
            {isDestructive ? <AlertCircle size={32} /> : <AlertCircle size={32} />}
          </div>
          <h3 className="text-xl font-black text-text-main mb-2">{title}</h3>
          <p className="text-text-alt font-bold text-sm mb-6">{message}</p>

          {needsInput && (
            <div className="mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter reason..."
                className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:border-brand-primary outline-none transition-all"
                autoFocus
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-bg-alt text-text-alt font-black rounded-xl hover:bg-border-main transition-colors uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(inputValue)}
              className={`flex-1 py-3 text-white font-black rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs ${isDestructive ? 'bg-red-500 shadow-red-500/20' : 'bg-brand-primary shadow-brand-primary/20'
                }`}
            >
              {isDestructive ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


// Transaction Detail Modal

// Transaction Detail Modal with Invoice Preview
function TransactionDetailModal({ transaction, onClose, showToast, tiers = [] }) {
  const [showPreview, setShowPreview] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)

  if (!transaction) return null

  // Resolve Tier Name
  const getTierName = () => {
    if (transaction.metadata?.tier_name) return transaction.metadata.tier_name

    // Try to match by price/currency
    const matchedTier = tiers.find(t =>
      (t.price_monthly == transaction.amount && t.currency === transaction.currency) ||
      (t.price_yearly == transaction.amount && t.currency === transaction.currency) ||
      (t.price_monthly_etb == transaction.amount && transaction.currency === 'ETB') ||
      (t.price_yearly_etb == transaction.amount && transaction.currency === 'ETB')
    )

    return matchedTier ? matchedTier.name : 'Language Learning Subscription'
  }

  const itemName = getTierName()

  // Helper to generate Invoice HTML
  const getInvoiceHtml = () => {
    const providerName = transaction.payment_provider === 'local_bank' && transaction.metadata?.bank_name
      ? transaction.metadata.bank_name
      : transaction.payment_provider?.replace('_', ' ')

    const dateStr = transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : new Date().toLocaleDateString()

    return `
      <html>
        <head>
          <title>Invoice #${transaction.id.slice(0, 8)}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e1e1e; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
            .logo { font-size: 24px; font-weight: 900; color: #58cc02; text-transform: uppercase; letter-spacing: 1px; }
            .meta { text-align: right; color: #666; font-size: 14px; }
            .bill-to { margin-bottom: 40px; }
            .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #999; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: 600; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { text-align: left; padding: 15px; background: #f9f9f9; font-size: 12px; text-transform: uppercase; color: #666; }
            .table td { padding: 15px; border-bottom: 1px solid #eee; }
            .total { text-align: right; font-size: 24px; font-weight: 900; color: #58cc02; }
            .footer { margin-top: 60px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Adewe Learning</div>
            <div class="meta">
              <p>Invoice #: ${transaction.external_transaction_id || transaction.id.slice(0, 8)}</p>
              <p>Date: ${dateStr}</p>
            </div>
          </div>
          <div class="bill-to">
            <p class="label">Bill To:</p>
            <p class="value">${transaction.profiles?.username}</p>
            <p class="value" style="font-weight: 400; font-size: 14px; color: #666;">${transaction.profiles?.email}</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Payment Method</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>

                <td>Language Learning Platform for a subscription of ${itemName}</td>
                <td style="text-transform: capitalize;">${providerName}</td>
                <td style="text-align: right;">${transaction.amount} ${transaction.currency}</td>
              </tr>

            </tbody>
          </table>
          <div class="total">
            Total: ${transaction.amount} ${transaction.currency}
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Adewe Learning Inc.</p>
          </div>
        </body>
      </html>
    `
  }

  const handlePrint = () => {
    // Open a new window for printing the invoice
    const printWindow = window.open('', '_blank')
    printWindow.document.write(getInvoiceHtml())
    printWindow.document.close()
    printWindow.print()
  }

  const handleEmail = () => {
    console.log('--- MOCK EMAIL SENT ---')
    console.log('Recipient:', transaction.profiles?.email)
    console.log('Content:', getInvoiceHtml())
    console.log('-----------------------')

    setShowEmailSent(true)
    setTimeout(() => setShowEmailSent(false), 3000)

    if (showToast) {
      showToast(`Receipt emailed to ${transaction.profiles?.email}`, 'success')
    }
  }

  const providerDisplayName = transaction.payment_provider === 'local_bank' && transaction.metadata?.bank_name
    ? transaction.metadata.bank_name
    : transaction.payment_provider?.replace('_', ' ')

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-4xl overflow-hidden border-2 border-border-main shadow-2xl flex flex-col md:flex-row h-[600px]">
        {/* Left Side: Details & Actions */}
        <div className="w-full md:w-1/3 bg-bg-alt/50 border-r border-border-main flex flex-col">
          <div className="p-6 border-b border-border-main flex items-center justify-between">
            <h2 className="text-xl font-black text-text-main">Transaction</h2>
            <button
              onClick={onClose}
              className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all relative z-[110]"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="text-center p-6 bg-bg-card rounded-2xl border-2 border-border-main">
              <div className="text-3xl font-black text-text-main mb-1">
                {transaction.amount} <span className="text-lg text-text-alt">{transaction.currency}</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${transaction.status === 'completed' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {transaction.status === 'completed' ? <CheckCircle size={12} className="stroke-[3px]" /> : <Clock size={12} />}
                {transaction.status}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                <p className="text-text-main font-bold text-sm">
                  {transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mb-1">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-xs">
                    {transaction.profiles?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-text-main font-bold text-sm">{transaction.profiles?.username}</p>
                    <p className="text-text-alt text-xs">{transaction.profiles?.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-text-alt text-[10px] font-black uppercase tracking-widest mb-1">Payment Method</p>
                <p className="text-text-main font-bold text-sm capitalize flex items-center gap-2">
                  {transaction.payment_provider === 'local_bank' ? <Building2 size={16} /> : <CreditCard size={16} />}
                  {providerDisplayName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border-main flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-brand-primary text-white font-black rounded-xl shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Download size={16} /> Print
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 py-3 bg-bg-card text-text-main font-black rounded-xl border-2 border-border-main hover:bg-border-main transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Mail size={16} /> Email
            </button>
          </div>
        </div>

        {/* Right Side: Invoice Preview */}
        <div className="w-full md:w-2/3 bg-gray-50 p-8 overflow-hidden relative hidden md:block group">
          {/* Email Sent Overlay */}
          {showEmailSent && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
              <div className="bg-white text-brand-primary p-6 rounded-full mb-4 shadow-xl animate-bounce">
                <CheckCircle size={48} weight="fill" />
              </div>
              <h3 className="text-3xl font-black mb-2">Receipt Sent!</h3>
              <p className="font-bold opacity-90">Check your inbox</p>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest z-10 shadow-sm opacity-50 hover:opacity-100 transition-opacity">
            Live Preview
          </div>

          <div className="w-full h-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
            <iframe
              srcDoc={getInvoiceHtml()}
              className="w-full h-full border-none"
              title="Invoice Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


// Subscription Detail Modal
function SubscriptionDetailModal({ subscription, onClose, onAction }) {
  if (!subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-bg-card rounded-3xl w-full max-w-lg overflow-hidden border-2 border-border-main shadow-2xl flex flex-col">
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-bg-alt/50">
          <div>
            <h2 className="text-xl font-black text-text-main">Subscription Details</h2>
            <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Manage Plan</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main hover:bg-bg-alt rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-brand-primary/10 rounded-2xl border-2 border-brand-primary/20">
            <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center text-white text-3xl shadow-lg transform rotate-3">
              <Crown weight="fill" />
            </div>
            <div>
              <p className="text-brand-primary font-black uppercase tracking-widest text-xs mb-1">Current Plan</p>
              <h3 className="text-2xl font-black text-text-main">{subscription.tier?.name || 'Unknown Plan'}</h3>
              <p className="text-text-alt font-bold text-sm">
                {subscription.status === 'active' ? 'Active & Renewing' : 'Inactive'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 hover:bg-bg-alt rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Users className="text-text-alt" size={20} />
                <div>
                  <p className="text-text-main font-bold text-sm">Subscriber</p>
                  <p className="text-text-alt text-xs">{subscription.profiles?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-main font-bold text-sm">{subscription.profiles?.username}</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 hover:bg-bg-alt rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="text-text-alt" size={20} />
                <div>
                  <p className="text-text-main font-bold text-sm">Period</p>
                  <p className="text-text-alt text-xs">{new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand-primary font-bold text-sm text-[10px] bg-brand-primary/10 px-2 py-1 rounded-lg">
                  {Math.ceil((new Date(subscription.current_period_end) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 hover:bg-bg-alt rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="text-text-alt" size={20} />
                <div>
                  <p className="text-text-main font-bold text-sm">Billing Method</p>
                  <p className="text-text-alt text-xs capitalize">{subscription.payment_provider?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-border-main grid grid-cols-2 gap-3">
            <button
              className="p-3 rounded-xl border-2 border-border-main font-black text-text-alt hover:text-text-main hover:bg-bg-alt transition-all flex items-center justify-center gap-2 text-sm"
              onClick={() => { alert('Extend functionality would go here'); onClose(); }}
            >
              <Timer size={16} />
              Extend 1 Month
            </button>
            <button
              className="p-3 rounded-xl border-2 border-red-500/20 bg-red-500/5 text-red-500 font-black hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-sm"
              onClick={() => { alert('Cancel functionality would go here'); onClose(); }}
            >
              <Ban size={16} />
              Cancel Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsTab
