import { useState, useEffect } from 'react'
import { Save, RefreshCw, Megaphone, CheckCircle, XCircle, X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const colors = {
        success: 'bg-[#ddf4ff] border-[#84d8ff] text-[#1cb0f6]',
        error: 'bg-[#fee2e2] border-[#ef4444] text-[#991b1b]',
    }

    return (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-4 p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-sm ${colors[type]} font-['Nunito'] font-black uppercase tracking-wide animate-bounce-subtle`}>
            {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            <p className="text-sm">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={20} />
            </button>
        </div>
    )
}

function CommunitySettingsTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [settings, setSettings] = useState({
        first_lesson: { enabled: true, xp: 10, message: "just completed their first lesson! 🎓" },
        milestone_50xp: { enabled: true, xp: 50, message: "reached the 50 XP milestone! ⚡" },
        new_friend: { enabled: true, message: "just made a new friend! 🤝" },
        new_language: { enabled: true, message: "started learning a new language! 🌍" }
    })

    const [newTrigger, setNewTrigger] = useState({
        id: '',
        message: '',
        xp: 0,
        enabled: true
    })

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*')
                .eq('key', 'community_auto_posts')
                .single()

            if (data && !error) {
                setSettings(data.value)
            }
        } catch (error) {
            console.log('Using default community settings')
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async (updatedSettings) => {
        setSaving(true)
        const targetSettings = updatedSettings || settings
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'community_auto_posts',
                    value: targetSettings,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error
            showToast('Community settings saved!', 'success')
            if (updatedSettings) setSettings(updatedSettings)
        } catch (error) {
            console.error('Error saving settings:', error)
            showToast('Error saving settings', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleAddTrigger = (e) => {
        e.preventDefault()
        if (!newTrigger.id || !newTrigger.message) return

        const key = newTrigger.id.toLowerCase().replace(/\s+/g, '_')
        const updated = {
            ...settings,
            [key]: {
                enabled: newTrigger.enabled,
                message: newTrigger.message,
                ...(newTrigger.xp > 0 && { xp: newTrigger.xp })
            }
        }
        setSettings(updated)
        setShowAddModal(false)
        setNewTrigger({ id: '', message: '', xp: 0, enabled: true })
        saveSettings(updated) // Proactively save
    }

    const removeTrigger = (id) => {
        if (!confirm('Are you sure you want to remove this trigger?')) return
        const updated = { ...settings }
        delete updated[id]
        setSettings(updated)
        saveSettings(updated) // Proactively save
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-5xl font-['Nunito'] pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-text-main uppercase tracking-tight text-brand-primary">Community Auto-Posts</h2>
                    <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Configure automated milestone updates</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="duo-btn duo-btn-white px-8 py-3 text-base flex items-center gap-3"
                    >
                        <Plus size={20} />
                        ADD TRIGGER
                    </button>
                    <button
                        onClick={() => saveSettings()}
                        disabled={saving}
                        className="duo-btn duo-btn-blue px-8 py-3 text-base flex items-center gap-3"
                    >
                        {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                        {saving ? 'SAVING...' : 'SAVE SETTINGS'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings).map(([id, config]) => (
                    <div key={id} className={`bg-bg-card dark:bg-[#1a2c35] rounded-3xl border-2 border-border-main dark:border-[#37464f] p-6 shadow-sm hover:border-brand-primary/30 transition-all ${!config.enabled && 'opacity-60'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-text-main uppercase tracking-wide flex items-center gap-3">
                                <Megaphone size={20} className="text-brand-primary" />
                                {id.replace(/_/g, ' ')}
                            </h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => removeTrigger(id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, [id]: { ...config, enabled: !config.enabled } })}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${config.enabled ? 'bg-brand-primary' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${config.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {config.xp !== undefined && (
                                <div>
                                    <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2">XP Threshold</label>
                                    <input
                                        type="number"
                                        value={config.xp}
                                        onChange={(e) => setSettings({ ...settings, [id]: { ...config, xp: parseInt(e.target.value) } })}
                                        className="w-full p-3 bg-bg-alt border-2 border-border-main rounded-xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all text-sm"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-text-alt font-black text-[10px] uppercase tracking-widest mb-2">Auto-Post Message</label>
                                <textarea
                                    value={config.message}
                                    onChange={(e) => setSettings({ ...settings, [id]: { ...config, message: e.target.value } })}
                                    rows={3}
                                    className="w-full p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-text-main font-bold focus:outline-none focus:border-brand-primary transition-all resize-none text-sm"
                                />
                                <p className="text-text-alt text-[10px] italic mt-2">Example: "[Username] {config.message}"</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-bg-card rounded-[32px] w-full max-w-md border-2 border-border-main shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Milestone Trigger</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-alt rounded-lg transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddTrigger} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <select
                                    value={newTrigger.id}
                                    onChange={e => setNewTrigger({ ...newTrigger, id: e.target.value })}
                                    className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary transition-all"
                                >
                                    <option value="">Select or type...</option>
                                    <option value="streak_7">7 Day Streak</option>
                                    <option value="streak_30">30 Day Streak</option>
                                    <option value="milestone_100xp">100 XP Milestone</option>
                                    <option value="milestone_500xp">500 XP Milestone</option>
                                    <option value="new_friend">New Friend</option>
                                    <option value="item_purchase">Shop Purchase</option>
                                    <option value="perfect_lesson">Perfect Lesson</option>
                                </select>
                                <input
                                    type="text"
                                    value={newTrigger.id}
                                    onChange={e => setNewTrigger({ ...newTrigger, id: e.target.value })}
                                    placeholder="Or type custom ID..."
                                    className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary transition-all mt-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Post Message</label>
                                <textarea
                                    required
                                    value={newTrigger.message}
                                    onChange={e => setNewTrigger({ ...newTrigger, message: e.target.value })}
                                    placeholder="just achieved a daily streak! 🔥"
                                    className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary h-24 resize-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Optional XP Threshold</label>
                                <input
                                    type="number"
                                    value={newTrigger.xp}
                                    onChange={e => setNewTrigger({ ...newTrigger, xp: parseInt(e.target.value) })}
                                    className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary transition-all"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
                                <button type="submit" className="flex-1 duo-btn duo-btn-blue">ADD TRIGGER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommunitySettingsTab
