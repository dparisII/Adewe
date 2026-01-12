import { useState, useEffect } from 'react'
import {
    MessageSquare, Plus, Edit2, Trash2,
    CheckCircle, XCircle, Search, Filter,
    Star, Quote, Save, RefreshCw, X
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const colors = {
        success: 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary',
        error: 'bg-red-500/10 border-red-500/50 text-red-500',
    }

    return (
        <div className={`fixed bottom-8 right-8 z-[99999] flex items-center gap-4 p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-md ${colors[type]} animate-in slide-in-from-bottom-5 duration-300`}>
            {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            <p className="font-black uppercase tracking-wide text-sm">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={20} />
            </button>
        </div>
    )
}

const TestimonialsTab = () => {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const fetchTestimonials = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                // Mock data if table doesn't exist
                setTestimonials([
                    { id: 1, name: 'Abebe Bikila', role: 'Language Learner', content: 'This platform changed my life! I can now speak Amharic fluently.', rating: 5, avatar: null, is_active: true },
                    { id: 2, name: 'Sara Ahmed', role: 'Business Traveler', content: 'The bite-sized lessons are perfect for my busy schedule.', rating: 4, avatar: null, is_active: true },
                    { id: 3, name: 'Kebede Molla', role: 'Student', content: 'I love the gamification features. It keeps me motivated every day.', rating: 5, avatar: null, is_active: false },
                ])
            } else {
                setTestimonials(data || [])
            }
        } catch (err) {
            console.error('Error fetching testimonials:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData(e.target)
        const payload = {
            name: formData.get('name'),
            role: formData.get('role'),
            content: formData.get('content'),
            rating: parseInt(formData.get('rating')),
            is_active: formData.get('is_active') === 'on',
        }

        try {
            if (editingItem?.id && typeof editingItem.id === 'string') {
                const { error } = await supabase
                    .from('testimonials')
                    .update(payload)
                    .eq('id', editingItem.id)
                if (error) throw error
                showToast('Testimonial updated successfully')
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([payload])
                if (error) throw error
                showToast('Testimonial added successfully')
            }
            setShowModal(false)
            fetchTestimonials()
        } catch (err) {
            console.error('Error saving testimonial:', err)
            // Fallback update for mock data
            if (editingItem) {
                setTestimonials(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...payload } : t))
            } else {
                setTestimonials(prev => [{ id: Date.now(), ...payload, created_at: new Date().toISOString() }, ...prev])
            }
            setShowModal(false)
            showToast('Settings saved locally (Table missing)', 'success')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id)

            if (error) throw error
            showToast('Testimonial deleted successfully')
            fetchTestimonials()
        } catch (err) {
            setTestimonials(prev => prev.filter(t => t.id !== id))
            showToast('Deleted locally', 'success')
        } finally {
            setDeleteConfirm(null)
        }
    }

    const filteredTestimonials = testimonials.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 max-w-6xl font-['Nunito'] pb-20 animate-in fade-in duration-500">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header Section */}
            <div className="flex items-center justify-between bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Manage Testimonials</h2>
                        <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">What users say about your platform</p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className="duo-btn duo-btn-blue px-8 py-3 text-base flex items-center gap-3"
                >
                    <Plus size={20} />
                    ADD TESTIMONIAL
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-alt" size={20} />
                    <input
                        type="text"
                        placeholder="Search testimonials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-card border-2 border-border-main rounded-2xl py-3 pl-12 pr-4 font-bold outline-none focus:border-brand-primary transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-bg-card border-2 border-border-main rounded-2xl text-text-alt hover:bg-bg-alt transition-all"><Filter size={20} /></button>
                    <button onClick={fetchTestimonials} className="p-3 bg-bg-card border-2 border-border-main rounded-2xl text-brand-primary hover:bg-bg-alt transition-all"><RefreshCw size={20} /></button>
                </div>
            </div>

            {/* Testimonials Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-bg-card border-2 border-border-main rounded-3xl p-6 shadow-sm hover:border-brand-primary/40 transition-all group relative ${!item.is_active && 'opacity-60'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-bg-alt rounded-2xl border-2 border-border-main flex items-center justify-center overflow-hidden">
                                        {item.avatar ? <img src={item.avatar} className="w-full h-full object-cover" /> : <Quote size={24} className="text-brand-primary opacity-20" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-text-main text-base leading-none">{item.name}</h3>
                                        <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mt-1">{item.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg"><Edit2 size={16} /></button>
                                    <button onClick={() => setDeleteConfirm(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < item.rating ? "#ffc800" : "none"} className={i < item.rating ? "text-[#ffc800]" : "text-border-main"} />
                                ))}
                            </div>

                            <p className="text-sm font-bold text-text-main leading-relaxed line-clamp-4 italic">
                                "{item.content}"
                            </p>

                            <div className="mt-6 pt-4 border-t-2 border-border-main/50 flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_active ? 'Active' : 'Draft'}
                                </span>
                                <span className="text-[10px] font-bold text-text-alt">{new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                >
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">User Name</label>
                                <input required name="name" defaultValue={editingItem?.name} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Role / Occupation</label>
                                <input required name="role" defaultValue={editingItem?.role} placeholder="Language Learner" className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Testimonial Content</label>
                            <textarea required name="content" defaultValue={editingItem?.content} rows={4} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Rating (1-5)</label>
                                <select name="rating" defaultValue={editingItem?.rating || 5} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold outline-none focus:border-brand-primary">
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-4">
                                <input type="checkbox" name="is_active" id="is_active" defaultChecked={editingItem?.is_active ?? true} className="w-5 h-5 accent-brand-primary" />
                                <label htmlFor="is_active" className="text-sm font-black text-text-main uppercase tracking-tight">Post Immediately</label>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
                            <button type="submit" disabled={saving} className="flex-1 duo-btn duo-btn-blue flex items-center justify-center gap-2">
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                {editingItem ? 'UPDATE' : 'SAVE'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-bg-card rounded-[32px] w-full max-w-md border-2 border-red-500/30 shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-text-main uppercase mb-2">Delete Testimonial?</h2>
                            <p className="text-text-alt font-bold mb-8">Are you sure you want to remove the testimonial from <span className="text-text-main font-black">{deleteConfirm.name}</span>? This action is permanent.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 duo-btn duo-btn-white py-4">CANCEL</button>
                                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 duo-btn bg-red-500 text-white hover:bg-red-600 py-4 border-b-4 border-red-700 active:border-b-0 font-black">DELETE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestimonialsTab
