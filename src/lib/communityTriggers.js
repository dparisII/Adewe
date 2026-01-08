import { supabase } from './supabase'

/**
 * Triggers a community auto-post based on user milestones.
 * @param {string} userId - The ID of the user who achieved the milestone.
 * @param {string} type - The type of milestone (e.g., 'first_lesson', 'milestone_50xp', 'new_friend', 'new_language').
 * @param {object} metadata - Optional metadata for the post.
 */
export const triggerMilestone = async (userId, type, metadata = {}) => {
    try {
        // 1. Fetch trigger settings
        const { data: settingsData, error: settingsError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'community_auto_posts')
            .single()

        if (settingsError || !settingsData?.value) {
            console.warn('Auto-post settings not found or disabled')
            return
        }

        const config = settingsData.value[type]
        if (!config || !config.enabled) return

        // 2. Prevent duplicate auto-posts for the same milestone (except reusable ones like 'new_friend')
        if (type !== 'new_friend' && type !== 'new_language') {
            const { data: existingPost } = await supabase
                .from('community_posts')
                .select('id')
                .eq('user_id', userId)
                .eq('auto_post_type', type)
                .single()

            if (existingPost) return // Already posted this milestone
        }

        // 3. Fetch user info for the post
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single()

        if (!profile) return

        // 4. Create the post
        const message = config.message.replace('[username]', profile.username)

        const { error: postError } = await supabase
            .from('community_posts')
            .insert({
                user_id: userId,
                content: `**${profile.username}** ${message}`,
                auto_post_type: type,
                metadata: metadata,
                created_at: new Date().toISOString()
            })

        if (postError) throw postError

        console.log(`Auto-post triggered for ${type}: ${profile.username}`)
    } catch (error) {
        console.error('Failed to trigger milestone auto-post:', error)
    }
}
