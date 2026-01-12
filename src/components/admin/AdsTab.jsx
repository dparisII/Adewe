import { useState, useEffect } from 'react'
import { Megaphone, Save, Plus, Trash2, Layout, Smartphone, X, Edit, CheckCircle, Link as LinkIcon } from 'lucide-react'

function AdsTab() {
    const [adsEnabled, setAdsEnabled] = useState(true)

    const [globalSettings, setGlobalSettings] = useState({
        frequency_cap: 3,
        refresh_rate: 30,
        rewarded_bonus: 50
    })

    const [adProviders, setAdProviders] = useState([
        { id: 1, name: 'Google AdMob', type: 'Banner', status: 'Active', placement: 'Lesson Footer', frequency: 0, link: 'https://admob.google.com', zone_id: 'ca-app-pub-3940256099942544/6300978111' },
        { id: 2, name: 'Unity Ads', type: 'Interstitial', status: 'Active', placement: 'Lesson Complete', frequency: 3, link: 'https://unity.com/solutions/unity-ads', zone_id: 'Lesson_Complete_Zone' },
    ])

    // Modal & Edit State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProvider, setEditingProvider] = useState(null)
    const [formData, setFormData] = useState({
        name: '', type: 'Banner', placement: 'Home Screen', frequency: 0, status: 'Active', link: '', zone_id: ''
    })

    // Toast State
    const [toast, setToast] = useState(null)

    // Clear toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const openAddModal = () => {
        setEditingProvider(null)
        setFormData({ name: '', type: 'Banner', placement: 'Home Screen', frequency: 0, status: 'Active', link: '', zone_id: '' })
        setIsModalOpen(true)
    }

    const openEditModal = (provider) => {
        setEditingProvider(provider)
        setFormData({ ...provider })
        setIsModalOpen(true)
    }

    const handleSaveProvider = (e) => {
        e.preventDefault()
        if (editingProvider) {
            // Edit existing
            setAdProviders(adProviders.map(p => p.id === editingProvider.id ? { ...formData, id: p.id } : p))
            setToast('Provider updated successfully!')
        } else {
            // Add new
            const newId = Math.max(...adProviders.map(p => p.id), 0) + 1
            setAdProviders([...adProviders, { ...formData, id: newId }])
            setToast('Provider added successfully!')
        }
        setIsModalOpen(false)
    }

    const handleDeleteProvider = (id) => {
        if (confirm('Are you sure you want to remove this provider?')) {
            setAdProviders(adProviders.filter(p => p.id !== id))
            setToast('Provider removed.')
        }
    }

    const updateFrequency = (id, change) => {
        setAdProviders(adProviders.map(p =>
            p.id === id ? { ...p, frequency: Math.max(0, (p.frequency || 0) + change) } : p
        ))
    }

    const toggleStatus = (id) => {
        setAdProviders(adProviders.map(p =>
            p.id === id ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } : p
        ))
    }

    const handleSaveChanges = () => {
        // Here we would typically save to DB
        setToast('All changes saved successfully!')
    }

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-8 right-8 bg-[#ddf4ff] border-2 border-[#1cb0f6] text-[#1cb0f6] px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-4 z-50">
                    <CheckCircle size={24} />
                    <span className="font-black uppercase tracking-wide">{toast}</span>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1a2c35] rounded-3xl w-full max-w-md p-6 shadow-2xl border-2 border-[#e5e5e5] dark:border-[#37464f] animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                {editingProvider ? 'Edit Provider' : 'Add Provider'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProvider} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Provider Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-[#131f24] border-2 border-transparent focus:border-brand-primary rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none transition-all"
                                    placeholder="e.g. AdMob"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Ad Link / Destination URL</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-[#131f24] border-2 border-transparent focus:border-brand-primary rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-500 mb-1">Zone ID / Ad Unit ID</label>
                                <input
                                    type="text"
                                    value={formData.zone_id}
                                    onChange={e => setFormData({ ...formData, zone_id: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-[#131f24] border-2 border-transparent focus:border-brand-primary rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none transition-all"
                                    placeholder="e.g. zone-123 or ca-app-pub-..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-[#131f24] rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none appearance-none"
                                    >
                                        <option>Banner</option>
                                        <option>Interstitial</option>
                                        <option>Rewarded</option>
                                        <option>Native</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Placement</label>
                                    <select
                                        value={formData.placement}
                                        onChange={e => setFormData({ ...formData, placement: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-[#131f24] rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none appearance-none"
                                    >
                                        <option>Home Screen</option>
                                        <option>Lesson Footer</option>
                                        <option>Lesson Complete</option>
                                        <option>Shop</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Initial Frequency</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.frequency}
                                        onChange={e => setFormData({ ...formData, frequency: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-100 dark:bg-[#131f24] border-2 border-transparent focus:border-brand-primary rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-[#131f24] rounded-xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none appearance-none"
                                    >
                                        <option>Active</option>
                                        <option>Paused</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full duo-btn duo-btn-green py-3 text-base uppercase tracking-widest mt-4">
                                {editingProvider ? 'Update Provider' : 'Add Provider'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ad Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Configure monetization and ad placements</p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="duo-btn duo-btn-blue flex items-center gap-2 px-4 py-2"
                >
                    <Save size={20} />
                    Save Changes
                </button>
            </div>

            {/* Global Settings */}
            <div className="bg-white dark:bg-[#1a2c35] p-6 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f]">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wide flex items-center gap-2">
                    <Smartphone size={24} />
                    Global Settings
                </h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Enable Ads</p>
                            <p className="text-sm text-gray-500">Show ads to free users</p>
                        </div>
                        <div
                            onClick={() => setAdsEnabled(!adsEnabled)}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${adsEnabled ? 'bg-brand-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-sm transition-transform ${adsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Frequency Cap</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Max ads per session</p>
                            <input
                                type="range" min="1" max="10"
                                value={globalSettings.frequency_cap}
                                onChange={(e) => setGlobalSettings({ ...globalSettings, frequency_cap: parseInt(e.target.value) })}
                                className="w-full accent-brand-primary"
                            />
                            <div className="flex justify-between text-[10px] font-black mt-1">
                                <span>1</span>
                                <span className="text-brand-primary">{globalSettings.frequency_cap} ADS</span>
                                <span>10</span>
                            </div>
                        </div>

                        <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Auto-Refresh</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Banner rotation (sec)</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={globalSettings.refresh_rate}
                                    onChange={(e) => setGlobalSettings({ ...globalSettings, refresh_rate: parseInt(e.target.value) })}
                                    className="w-full bg-gray-100 dark:bg-[#131f24] p-2 rounded-lg font-bold text-sm"
                                />
                                <span className="text-xs font-bold">SEC</span>
                            </div>
                        </div>

                        <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Rewarded Bonus</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Gems per video</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={globalSettings.rewarded_bonus}
                                    onChange={(e) => setGlobalSettings({ ...globalSettings, rewarded_bonus: parseInt(e.target.value) })}
                                    className="w-full bg-gray-100 dark:bg-[#131f24] p-2 rounded-lg font-bold text-sm"
                                />
                                <span className="text-xs font-bold">GEMS</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Ad Providers */}
            <div className="bg-white dark:bg-[#1a2c35] p-6 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                        <Layout size={24} />
                        Ad Placements
                    </h3>
                    <button
                        onClick={openAddModal}
                        className="text-brand-primary font-bold uppercase text-sm hover:underline flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Provider
                    </button>
                </div>

                <div className="space-y-4">
                    {adProviders.map(provider => (
                        <div key={provider.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-[#131f24] rounded-xl border border-gray-200 dark:border-[#37464f] gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Megaphone size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{provider.name}</p>
                                        {provider.link && (
                                            <a href={provider.link} target="_blank" rel="noopener noreferrer" className="text-text-alt hover:text-brand-primary flex-shrink-0">
                                                <LinkIcon size={12} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase font-bold truncate">{provider.type} • {provider.placement}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
                                {/* Frequency Control */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] uppercase font-black text-gray-400">Freq (Lessons)</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() => updateFrequency(provider.id, -1)}
                                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
                                        >-</button>
                                        <span className="font-black w-4 text-center">{provider.frequency}</span>
                                        <button
                                            onClick={() => updateFrequency(provider.id, 1)}
                                            className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-sm"
                                        >+</button>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${provider.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {provider.status}
                                </span>
                                <button
                                    onClick={() => openEditModal(provider)}
                                    className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                                    title="Edit Provider"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteProvider(provider.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove Provider"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdsTab
