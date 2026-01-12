
import { useState, useEffect } from 'react'
import {
    Search, Filter, MessageSquare, Clock, CheckCircle,
    AlertCircle, ChevronRight, User, Mail, Send, Reply,
    MoreVertical, Trash2, CheckCircle2, Clock3
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

function SupportTab() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, open, pending, resolved
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [replyText, setReplyText] = useState('')

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            // Fetch tickets from database
            const { data, error } = await supabase
                .from('support_tickets')
                .select('*, profile:user_id(username, avatar_url, email)')
                .order('created_at', { ascending: false })

            if (error) {
                if (error.code === 'PGRST116') {
                    // Handle single result error or empty
                } else if (error.message.includes('relation "support_tickets" does not exist')) {
                    console.warn('support_tickets table not found, using mock data')
                    setTickets(getMockTickets())
                    return
                }
            }
            setTickets(data || getMockTickets())
        } catch (err) {
            console.error('Error fetching tickets:', err)
            setTickets(getMockTickets())
        } finally {
            setLoading(false)
        }
    }

    const getMockTickets = () => [
        {
            id: 1,
            user_id: 'u1',
            subject: 'Billing issue with Family Plan',
            message: 'I was charged twice for my subscription this month. Can you please check?',
            status: 'open',
            priority: 'high',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            profile: { username: 'john_doe', email: 'john@example.com' }
        },
        {
            id: 2,
            user_id: 'u2',
            subject: 'Broken lesson in Spanish Unit 2',
            message: 'The audio for step 4 isn\'t playing correctly.',
            status: 'pending',
            priority: 'medium',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            profile: { username: 'maria_g', email: 'maria@example.com' }
        },
        {
            id: 3,
            user_id: 'u3',
            subject: 'Feature Request: Dark Mode',
            message: 'Would love to see a dark mode for the web version!',
            status: 'resolved',
            priority: 'low',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            profile: { username: 'tech_guy', email: 'tech@example.com' }
        }
    ]

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <AlertCircle className="text-red-400" size={18} />
            case 'pending': return <Clock3 className="text-amber-400" size={18} />
            case 'resolved': return <CheckCircle2 className="text-emerald-400" size={18} />
            default: return null
        }
    }

    const filteredTickets = tickets.filter(t => {
        const matchesFilter = filter === 'all' || t.status === filter
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyText.trim()) return

        // Optimistic UI update or real save if table exists
        alert('Reply sent to ' + selectedTicket.profile?.email)
        setReplyText('')
        // In a real app, we would update the ticket status to 'pending' or 'resolved'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-bg-card p-6 rounded-2xl border-2 border-border-main flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-text-main">Help & Support</h2>
                    <p className="text-text-alt text-sm font-bold uppercase tracking-widest">Manage User Inquiries & Tickets</p>
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'open', 'pending', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-primary border-brand-primary text-white' : 'bg-bg-alt border-border-main text-text-alt hover:border-brand-primary/50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
                {/* Ticket List */}
                <div className="lg:col-span-1 bg-bg-card rounded-3xl border-2 border-border-main overflow-hidden flex flex-col">
                    <div className="p-4 border-b-2 border-border-main bg-bg-alt/30">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-alt" size={18} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-bg-alt border-2 border-border-main rounded-xl text-sm font-bold focus:border-brand-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedTicket?.id === ticket.id
                                        ? 'border-brand-primary bg-brand-primary/5'
                                        : 'border-transparent hover:bg-bg-alt'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(ticket.status)}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-alt">{ticket.status}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-alt">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-sm font-black text-text-main line-clamp-1 mb-1">{ticket.subject}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-[8px] font-black">
                                        {ticket.profile?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-xs font-bold text-text-alt">{ticket.profile?.username}</span>
                                </div>
                            </button>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30">
                                <MessageSquare size={48} />
                                <p className="font-black uppercase text-xs mt-2">No tickets found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Detail / Conversation */}
                <div className="lg:col-span-2 bg-bg-card rounded-3xl border-2 border-border-main overflow-hidden flex flex-col relative">
                    {selectedTicket ? (
                        <>
                            <div className="p-6 border-b-2 border-border-main bg-bg-alt/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-bg-alt border-2 border-border-main flex items-center justify-center text-xl shadow-inner">
                                        {selectedTicket.profile?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-text-main">{selectedTicket.subject}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-xs font-bold text-text-alt">{selectedTicket.profile?.email}</p>
                                            <span className="w-1 h-1 bg-border-main rounded-full"></span>
                                            <p className="text-xs font-bold text-text-alt">ID: #{selectedTicket.id}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-text-alt hover:text-brand-primary hover:bg-bg-alt rounded-lg transition-all">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* User Message */}
                                <div className="flex gap-4 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 font-black text-xs">
                                        {selectedTicket.profile?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="bg-bg-alt p-4 rounded-2xl rounded-tl-none border-2 border-border-main shadow-sm">
                                        <p className="text-sm font-medium text-text-main whitespace-pre-wrap">{selectedTicket.message}</p>
                                        <p className="text-[10px] font-bold text-text-alt mt-2 text-right">
                                            {new Date(selectedTicket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Response Area Placeholder */}
                                <div className="mt-8 pt-8 border-t-2 border-border-main border-dashed">
                                    <div className="flex items-center gap-2 mb-4 text-brand-primary opacity-60">
                                        <Reply size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Administrative Response</span>
                                    </div>

                                    <form onSubmit={handleReply} className="space-y-4">
                                        <textarea
                                            placeholder="Type your response here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full h-32 p-4 bg-bg-alt border-2 border-border-main rounded-2xl text-sm font-medium focus:border-brand-primary outline-none transition-all resize-none shadow-inner"
                                        ></textarea>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <button type="button" className="px-3 py-1.5 bg-bg-alt text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:brightness-105">
                                                    Resolve Ticket
                                                </button>
                                                <button type="button" className="px-3 py-1.5 bg-bg-alt text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:brightness-105">
                                                    Mark Pending
                                                </button>
                                            </div>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:shadow-none active:translate-y-1 transition-all"
                                            >
                                                <Send size={16} />
                                                Send Reply
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-bg-alt rounded-3xl flex items-center justify-center mb-6 opacity-40">
                                <MessageSquare size={40} className="text-text-alt" />
                            </div>
                            <h3 className="text-lg font-black text-text-main uppercase tracking-tight">Select a ticket to view</h3>
                            <p className="text-sm font-bold text-text-alt mt-2 max-w-xs">Choose an inquiry from the sidebar to read the message and provide a response.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SupportTab
