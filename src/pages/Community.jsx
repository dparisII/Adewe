import { useState, useEffect } from 'react'
import {
    MessageSquare, Heart, Send, Share2, MoreHorizontal,
    Search, Users, TrendingUp, Filter, Plus, ArrowLeft, Loader2, PartyPopper, MessageCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { triggerMilestone } from '../lib/communityTriggers'

function Community() {
    const { profile } = useAuth()
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [followingIds, setFollowingIds] = useState(new Set())

    useEffect(() => {
        if (profile?.id) {
            fetchFollowing()
        }
    }, [profile?.id])

    const fetchFollowing = async () => {
        try {
            const { data, error } = await supabase
                .from('user_follows')
                .select('followed_id')
                .eq('follower_id', profile.id)

            if (error) throw error
            setFollowingIds(new Set(data.map(f => f.followed_id)))
        } catch (err) {
            console.error('Error fetching following:', err)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
          *,
          profiles:user_id (username, avatar_url),
          likes:post_likes (user_id),
          comments:post_comments (id)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (err) {
            console.error('Error fetching posts:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!newPost.trim() || !profile) return

        setSubmitting(true)
        try {
            const { error } = await supabase
                .from('community_posts')
                .insert({
                    user_id: profile.id,
                    content: newPost
                })

            if (error) throw error
            setNewPost('')
            fetchPosts()
        } catch (err) {
            console.error('Error creating post:', err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleCelebrate = async (postId, hasCelebrated) => {
        if (!profile) return
        try {
            if (hasCelebrated) {
                await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', profile.id)
            } else {
                await supabase
                    .from('post_likes')
                    .insert({
                        post_id: postId,
                        user_id: profile.id
                    })
            }
            fetchPosts()
        } catch (err) {
            console.error('Error celebrating:', err)
        }
    }

    const getRelativeTime = (dateString) => {
        const now = new Date()
        const past = new Date(dateString)
        const diffInMs = now - past
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h`
        return `${Math.floor(diffInHours / 24)}d`
    }

    const getPostContextIcon = (type) => {
        // Character emotes for various milestones
        const emotes = ["🦉", "🐻", "🦒", "🦊", "🦁"]
        return emotes[Math.floor(Math.random() * emotes.length)]
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 pb-32">
            <header className="mb-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Friend updates</h1>
            </header>

            {/* Simple Create Post Input */}
            <div className="bg-bg-card border-b-4 border-border-main rounded-2xl p-4 shadow-sm">
                <form onSubmit={handleCreatePost} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary font-black text-xl shrink-0 border-2 border-brand-primary/30">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            profile?.username?.[0]?.toUpperCase() || 'U'
                        )}
                    </div>
                    <input
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your progress..."
                        className="flex-1 bg-bg-alt border-2 border-border-main rounded-xl px-4 py-3 text-text-main placeholder-text-alt focus:outline-none focus:border-brand-primary transition-all font-bold"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newPost.trim()}
                        className="duo-btn duo-btn-blue h-12 px-6 flex items-center justify-center"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-brand-primary" size={40} />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => {
                        const hasCelebrated = post.likes?.some(l => l.user_id === profile?.id)
                        const reactionCount = post.likes?.length || 0

                        return (
                            <div key={post.id} className="bg-bg-card border-2 border-border-main rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                                <div className="flex gap-4">
                                    {/* Profile Avatar */}
                                    <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0 border-2 border-border-main shadow-inner relative">
                                        {post.profiles?.avatar_url ? (
                                            <img src={post.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-lg">
                                                {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        {/* Activity Icon overlay if it's a milestone */}
                                        {post.auto_post_type && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-full border-2 border-white flex items-center justify-center text-[10px]">
                                                {post.auto_post_type === 'milestone_50xp' ? '⚡' : '✨'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex-1 pr-12">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-[17px] text-gray-900 dark:text-white">
                                                {post.profiles?.username || 'Learner'}
                                            </h3>
                                            <span className="text-text-alt text-sm font-bold">• {getRelativeTime(post.created_at)}</span>
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 font-bold mb-4 leading-relaxed">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleCelebrate(post.id, hasCelebrated)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${hasCelebrated
                                                        ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary'
                                                        : 'bg-bg-alt border-border-main text-brand-primary hover:bg-bg-alt/80'
                                                    }`}
                                            >
                                                <PartyPopper size={18} className={hasCelebrated ? 'animate-bounce' : ''} />
                                                {hasCelebrated ? 'CELEBRATED' : 'CELEBRATE'}
                                            </button>

                                            <button className="flex items-center gap-2 text-text-alt hover:text-brand-primary transition-all p-2 rounded-lg font-black text-sm">
                                                <MessageCircle size={20} />
                                                {post.comments?.length || 0}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decorative Character Icon */}
                                    <div className="absolute right-4 top-4 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="text-5xl grayscale hover:grayscale-0 transition-all">
                                            {getPostContextIcon()}
                                        </span>
                                    </div>
                                </div>

                                {/* Reactions Counter at bottom right if any */}
                                {reactionCount > 0 && (
                                    <div className="absolute bottom-4 right-5 flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-border-main shadow-sm">
                                        <span className="text-xs">🎉</span>
                                        <span className="text-[10px] font-black text-brand-secondary">{reactionCount}</span>
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-20 bg-bg-card border-2 border-dashed border-border-main rounded-2xl">
                        <Users size={48} className="text-text-alt mx-auto mb-4 opacity-50" />
                        <p className="text-text-alt font-black">No updates yet from friends.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Community
