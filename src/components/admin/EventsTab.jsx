import { useState, useEffect } from 'react'
import {
    Calendar, Plus, Edit2, Trash2,
    CheckCircle, XCircle, Search,
    Save, RefreshCw, X, Clock, MapPin,
    Users, Gift, Trophy
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

const EventCard = ({ event, onEdit, onDelete }) => (
    <div
        onClick={() => onEdit(event)}
        className="bg-bg-card border-2 border-border-main rounded-3xl p-6 shadow-sm hover:border-brand-primary/40 transition-all group cursor-pointer relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => onEdit(event)} className="p-2 bg-white rounded-xl shadow-lg text-brand-primary hover:scale-110 transition-transform"><Edit2 size={16} /></button>
            <button onClick={() => onDelete(event.id)} className="p-2 bg-white rounded-xl shadow-lg text-red-500 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
        </div>

        <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-bg-alt rounded-2xl border-2 border-border-main flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                {event.icon || '🎉'}
            </div>
            <div>
                <h3 className="font-black text-text-main text-lg group-hover:text-brand-primary transition-colors">{event.title}</h3>
                <div className="flex items-center gap-2 text-text-alt font-bold text-xs">
                    <Calendar size={12} />
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>

        <p className="text-sm font-bold text-text-alt mb-6 line-clamp-2 leading-relaxed">
            {event.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-bg-alt p-3 rounded-2xl border border-border-main/50 text-center">
                <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mb-1">Participants</p>
                <div className="flex items-center justify-center gap-1 font-black text-text-main">
                    <Users size={14} className="text-brand-primary" />
                    <span>{event.participant_count || 0}</span>
                </div>
            </div>
            <div className="bg-bg-alt p-3 rounded-2xl border border-border-main/50 text-center">
                <p className="text-[10px] font-black uppercase text-text-alt tracking-widest mb-1">Reward</p>
                <div className="flex items-center justify-center gap-1 font-black text-text-main">
                    <Gift size={14} className="text-brand-accent" />
                    <span>{event.reward_xp || 0} XP</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2 border-border-main/50">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${event.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {event.status}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-alt">
                <Clock size={12} />
                <span>{event.duration_days} Days Left</span>
            </div>
        </div>
    </div>
)

const EventsTab = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchEvents()
    }, [])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: false })

            if (error) {
                // Mock data
                setEvents([
                    { id: 1, title: 'Amharic Speed Run', description: 'Complete 10 lessons in 24 hours to win double diamonds!', start_date: new Date().toISOString(), duration_days: 1, participant_count: 1240, reward_xp: 500, status: 'active', icon: '⚡' },
                    { id: 2, title: 'Tigrinya Weekend', description: 'Practice with native speakers in our community forum and earn the Weekend Warrior badge.', start_date: new Date().toISOString(), duration_days: 3, participant_count: 850, reward_xp: 200, status: 'scheduled', icon: '🌍' },
                    { id: 3, title: 'Achievement Quest', description: 'New achievement types are here! Be among the first to unlock them for special rewards.', start_date: new Date().toISOString(), duration_days: 7, participant_count: 3100, reward_xp: 1000, status: 'active', icon: '🏆' },
                ])
            } else {
                setEvents(data || [])
            }
        } catch (err) {
            console.error('Error fetching events:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData(e.target)
        const payload = {
            title: formData.get('title'),
            description: formData.get('description'),
            start_date: formData.get('start_date'),
            duration_days: parseInt(formData.get('duration_days')),
            reward_xp: parseInt(formData.get('reward_xp')),
            status: formData.get('status'),
            icon: formData.get('icon'),
        }

        try {
            if (editingItem?.id && typeof editingItem.id === 'string') {
                const { error } = await supabase
                    .from('events')
                    .update(payload)
                    .eq('id', editingItem.id)
                if (error) throw error
                showToast('Event updated successfully')
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([payload])
                if (error) throw error
                showToast('Event created successfully')
            }
            setShowModal(false)
            fetchEvents()
        } catch (err) {
            // Mock update
            if (editingItem) {
                setEvents(prev => prev.map(ev => ev.id === editingItem.id ? { ...ev, ...payload } : ev))
            } else {
                setEvents(prev => [{ id: Date.now(), ...payload, participant_count: 0 }, ...prev])
            }
            setShowModal(false)
            showToast('Changes saved locally', 'success')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id)
            if (error) throw error
            showToast('Event deleted')
            fetchEvents()
        } catch (err) {
            setEvents(prev => prev.filter(ev => ev.id !== id))
            showToast('Deleted locally', 'success')
        } finally {
            setDeleteConfirm(null)
        }
    }

    const filteredEvents = events.filter(ev =>
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 max-w-6xl font-['Nunito'] pb-20 animate-in fade-in duration-500">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header Section */}
            <div className="flex items-center justify-between bg-bg-card dark:bg-[#1a2c35] p-6 rounded-3xl border-2 border-border-main dark:border-[#37464f] shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Community Events</h2>
                        <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-1">Global challenges and time-limited events</p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className="duo-btn duo-btn-blue px-8 py-3 text-base flex items-center gap-3"
                >
                    <Plus size={20} />
                    CREATE EVENT
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-alt" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-card border-2 border-border-main rounded-2xl py-3 pl-12 pr-4 font-bold outline-none focus:border-brand-primary transition-all"
                    />
                </div>
                <button onClick={fetchEvents} className="p-3 bg-bg-card border-2 border-border-main rounded-2xl text-brand-primary hover:bg-bg-alt transition-all"><RefreshCw size={20} /></button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={(ev) => { setEditingItem(ev); setShowModal(true); }}
                            onDelete={(id) => setDeleteConfirm(events.find(ev => ev.id === id))}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingItem ? 'Edit Event' : 'Create New Event'}
                >
                    <form onSubmit={handleSave} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Icon (Emoji)</label>
                                <input required name="icon" defaultValue={editingItem?.icon || '🎉'} className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Status</label>
                                <select name="status" defaultValue={editingItem?.status || 'active'} className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary">
                                    <option value="active">Active</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Event Title</label>
                            <input required name="title" defaultValue={editingItem?.title} placeholder="Weekend Warrior" className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Description</label>
                            <textarea required name="description" defaultValue={editingItem?.description} rows={3} className="w-full bg-bg-alt border-2 border-border-main rounded-2xl p-4 font-bold outline-none focus:border-brand-primary resize-none" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Start Date</label>
                                <input required type="date" name="start_date" defaultValue={editingItem?.start_date?.split('T')[0] || new Date().toISOString().split('T')[0]} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">Duration (Days)</label>
                                <input required type="number" name="duration_days" defaultValue={editingItem?.duration_days || 1} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-text-alt tracking-widest">XP Reward</label>
                                <input required type="number" name="reward_xp" defaultValue={editingItem?.reward_xp || 100} className="w-full bg-bg-alt border-2 border-border-main rounded-xl p-3 font-bold text-xs" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 duo-btn duo-btn-white">CANCEL</button>
                            <button type="submit" disabled={saving} className="flex-1 duo-btn duo-btn-blue flex items-center justify-center gap-2">
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                {editingItem ? 'UPDATE EVENT' : 'CREATE EVENT'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-bg-card rounded-[32px] w-full max-w-md border-2 border-red-500/30 shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-text-main uppercase mb-2">Delete Event?</h2>
                            <p className="text-text-alt font-bold mb-8">Are you sure you want to remove <span className="text-text-main font-black">{deleteConfirm.title}</span>? This cannot be undone.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 duo-btn duo-btn-white py-4">CANCEL</button>
                                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 duo-btn bg-red-500 text-white hover:bg-red-600 py-4 border-b-4 border-red-700 active:border-b-0 font-black">DELETE EVENT</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EventsTab
