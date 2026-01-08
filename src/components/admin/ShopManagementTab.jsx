import { useState, useEffect } from 'react'
import { ShoppingBag, Plus, Edit2, Trash2, Check, X, Tag, Gem, Heart, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { shopItems as localShopItems } from '../../data/shopData'

const ShopItemCard = ({ item, onToggle, onEdit, onDelete }) => (
    <div className={`bg-bg-card border-2 border-border-main rounded-2xl p-5 shadow-sm transition-all hover:border-brand-primary/30 ${!item.is_available && 'opacity-60 bg-gray-50'}`}>
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-bg-alt rounded-xl flex items-center justify-center text-2xl shadow-inner border-2 border-border-main">
                {item.icon}
            </div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => onToggle(item)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${item.is_available ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.is_available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <button onClick={() => onEdit(item)} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"><Edit2 size={18} /></button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
            </div>
        </div>
        <div className="space-y-1">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                {item.name}
                {!item.is_available && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black">UNAVAILABLE</span>}
            </h3>
            <p className="text-xs text-text-alt font-bold line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-brand-secondary font-black">
                    <Gem size={14} fill="currentColor" />
                    <span>{item.price}</span>
                </div>
                {/* Category tag is redundant if grouped, but good for quick verify */}
                <span className="text-[10px] font-black uppercase tracking-widest text-text-alt bg-bg-alt px-2 py-1 rounded-lg">
                    {item.category}
                </span>
            </div>
        </div>
    </div>
)

function ShopManagementTab() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [confirmText, setConfirmText] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        icon: '📦',
        category: 'power-ups',
        is_available: true
    })

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('shop_items')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setItems(data || [])
        } catch (err) {
            console.error('Error fetching shop items:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            icon: item.icon,
            category: item.category,
            is_available: item.is_available
        })
        setIsEditing(true)
    }

    const handleAddNew = () => {
        setEditingItem(null)
        setFormData({
            name: '',
            description: '',
            price: 100,
            icon: '✨',
            category: 'power-ups',
            is_available: true
        })
        setIsEditing(true)
    }

    const handleDelete = async (id) => {
        const item = items.find(i => i.id === id)
        setDeleteConfirm({
            id: id,
            type: 'shop item',
            name: item?.name || 'this item',
            onConfirm: async () => {
                const { error } = await supabase
                    .from('shop_items')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                fetchItems()
            }
        })
        setConfirmText('')
    }

    const handleSeedDefaults = async () => {
        setDeleteConfirm({
            type: 'action',
            name: 'SEED DEFAULTS',
            onConfirm: async () => {
                setLoading(true)
                try {
                    const itemsToInsert = localShopItems.map(item => ({
                        slug: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        icon: item.icon,
                        category: item.category,
                        is_available: true
                    }))

                    const { error } = await supabase
                        .from('shop_items')
                        .upsert(itemsToInsert, { onConflict: 'slug' })

                    if (error) throw error
                    fetchItems()
                } catch (err) {
                    console.error('Error seeding items:', err)
                    alert('Error seeding items: ' + err.message)
                } finally {
                    setLoading(false)
                }
            }
        })
        setConfirmText('')
    }

    const handleToggle = async (item) => {
        // Optimistic update
        const newStatus = !item.is_available
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: newStatus } : i))

        // Sync DB
        const { error } = await supabase.from('shop_items').update({ is_available: newStatus }).eq('id', item.id)

        if (error) {
            // Revert
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: !newStatus } : i))
            console.error('Toggle failed:', error)
            alert('Failed to toggle status')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('shop_items')
                    .update(formData)
                    .eq('id', editingItem.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('shop_items')
                    .insert([formData])
                if (error) throw error
            }
            setIsEditing(false)
            fetchItems()
        } catch (err) {
            console.error('Error saving item:', err)
            alert('Error saving item: ' + err.message)
        }
    }

    const categories = [
        { id: 'hearts', label: 'Hearts', icon: <Heart size={16} /> },
        { id: 'gems', label: 'Gems', icon: <Gem size={16} /> },
        { id: 'power-ups', label: 'Power-ups', icon: <Zap size={16} /> },
        { id: 'cosmetics', label: 'Cosmetics', icon: <Tag size={16} /> },
        { id: 'upgrades', label: 'Upgrades', icon: <Plus size={16} /> },
        { id: 'special', label: 'Special', icon: <ShoppingBag size={16} /> },
    ]

    if (loading && items.length === 0) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Shop Inventory</h2>
                    <p className="text-sm text-text-alt font-bold">Manage available items, prices, and availability</p>
                </div>
                <div className="flex gap-3">
                    {items.length === 0 && (
                        <button
                            onClick={handleSeedDefaults}
                            className="duo-btn duo-btn-white border-brand-primary text-brand-primary flex items-center gap-2"
                        >
                            <Zap size={20} />
                            SEED DEFAULTS
                        </button>
                    )}
                    <button
                        onClick={handleAddNew}
                        className="duo-btn duo-btn-blue flex items-center gap-2"
                    >
                        <Plus size={20} />
                        ADD ITEM
                    </button>
                </div>
            </div>

            <div className="space-y-12 pb-20">
                {categories.map(category => {
                    const categoryItems = items.filter(i => i.category === category.id)
                    if (categoryItems.length === 0) return null

                    return (
                        <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-3 border-b-2 border-border-main pb-2">
                                <div className="p-2 bg-text-main text-white rounded-lg">
                                    {category.icon}
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    {category.label}
                                </h3>
                                <span className="text-xs font-bold bg-bg-alt px-2 py-1 rounded-full text-text-alt">{categoryItems.length}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryItems.map(item => (
                                    <ShopItemCard
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggle}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}

                {/* Uncategorized Items */}
                {items.filter(i => !categories.find(c => c.id === i.category)).length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b-2 border-border-main pb-2">
                            <div className="p-2 bg-gray-400 text-white rounded-lg">
                                <Tag size={16} />
                            </div>
                            <h3 className="text-lg font-black text-gray-500 uppercase tracking-wider">Other</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.filter(i => !categories.find(c => c.id === i.category)).map(item => (
                                <ShopItemCard
                                    key={item.id}
                                    item={item}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-bg-card rounded-[32px] w-full max-w-md border-2 border-border-main shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-bg-alt rounded-lg"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-alt">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-alt">Display Icon</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary h-20 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-alt">Price (Gems)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-text-alt">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    checked={formData.is_available}
                                    onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                                    className="w-5 h-5 rounded-lg border-2 border-border-main accent-brand-primary"
                                />
                                <label htmlFor="is_available" className="font-bold text-sm text-text-main">Item is available in shop</label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
                                <button type="submit" className="flex-1 duo-btn duo-btn-blue">SAVE ITEM</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] backdrop-blur-md" style={{ margin: 0, padding: '1rem' }}>
                    <div className="bg-bg-card dark:bg-[#131f24] rounded-[32px] w-full max-w-md border-2 border-red-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
                            <h3 className="text-xl font-black text-red-500 uppercase tracking-wide flex items-center gap-2">
                                <Trash2 size={24} /> {deleteConfirm.type === 'action' ? 'CONFIRM ACTION' : 'DELETE ITEM'}
                            </h3>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 hover:bg-bg-alt rounded-lg text-text-alt hover:text-text-main"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-text-main font-bold">
                                {deleteConfirm.type === 'action' ? 'Are you sure you want to' : 'You are about to permanently delete this'} {deleteConfirm.type}:
                            </p>
                            <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/20">
                                <p className="font-black text-red-400">{deleteConfirm.name}</p>
                            </div>

                            <p className="text-text-alt text-sm">
                                This action cannot be undone. Type <span className="font-black text-red-500">{deleteConfirm.name}</span> to confirm:
                            </p>

                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={`Type ${deleteConfirm.name} to confirm`}
                                className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-red-500 text-center uppercase tracking-widest"
                            />

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 duo-btn duo-btn-white"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirmText.toLowerCase() === deleteConfirm.name.toLowerCase()) {
                                            try {
                                                await deleteConfirm.onConfirm()
                                                setDeleteConfirm(null)
                                                setConfirmText('')
                                            } catch (err) {
                                                console.error('Action/Delete failed:', err)
                                            }
                                        }
                                    }}
                                    disabled={confirmText.toLowerCase() !== deleteConfirm.name.toLowerCase()}
                                    className={`flex-1 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${confirmText.toLowerCase() === deleteConfirm.name.toLowerCase()
                                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_0_#b91c1c]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {deleteConfirm.type === 'action' ? 'CONFIRM' : 'DELETE'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShopManagementTab
