import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AnalyticsTracker() {
    const location = useLocation()

    useEffect(() => {
        const trackVisit = async () => {
            try {
                // Simple visitor fingerprint using localStorage
                let visitorId = localStorage.getItem('adewe_visitor_id')
                if (!visitorId) {
                    visitorId = crypto.randomUUID()
                    localStorage.setItem('adewe_visitor_id', visitorId)
                }

                const userResponse = await supabase.auth.getUser()
                const user = userResponse.data.user

                // Fetch IP address
                let ip = 'unknown'

                // If running locally or on LAN, use the hostname
                const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.startsWith('192.168.') ||
                    window.location.hostname.startsWith('10.')

                if (isLocal) {
                    ip = `${window.location.hostname} (LAN)`
                    // Determine more accurate platform info if possible
                } else {
                    try {
                        const ipRes = await fetch('https://api.ipify.org?format=json')
                        const ipData = await ipRes.json()
                        ip = ipData.ip
                    } catch (ipErr) {
                        console.error('Failed to fetch IP:', ipErr)
                    }
                }

                // Track visit
                await supabase.from('site_visits').insert({
                    visitor_id: visitorId,
                    page_path: location.pathname,
                    user_id: user?.id || null,
                    metadata: {
                        ip,
                        browser: navigator.userAgent,
                        platform: navigator.platform
                    }
                })
            } catch (err) {
                console.error('Failed to track visit:', err)
            }
        }

        trackVisit()
    }, [location.pathname])

    useEffect(() => {
        const handleError = async (event) => {
            const error = event.error || event.reason
            const message = error?.message || 'Unknown error'
            const stack = error?.stack || ''

            console.error('Captured app error:', message)

            try {
                // Log error to Supabase
                await supabase.from('site_visits').insert({
                    visitor_id: localStorage.getItem('adewe_visitor_id') || 'unknown',
                    page_path: location.pathname,
                    metadata: {
                        type: 'error',
                        message,
                        stack: stack.slice(0, 500)
                    }
                })
            } catch (err) {
                // Ignore errors during error logging
            }
        }

        window.addEventListener('error', handleError)
        window.addEventListener('unhandledrejection', handleError)
        return () => {
            window.removeEventListener('error', handleError)
            window.removeEventListener('unhandledrejection', handleError)
        }
    }, [location.pathname])

    return null
}

export default AnalyticsTracker
