import { useCallback, useEffect, useRef } from 'react'

// Sound URLs - using reliable CDN-hosted sounds
const SOUNDS = {
    correct: 'https://d35aaqx5ub95lt.cloudfront.net/sounds/3e562cbea0706788e04e76a6d66e5114.mp3',
    error: 'https://d35aaqx5ub95lt.cloudfront.net/sounds/f0b6ab4396d5840fd28372de57b1d99f.mp3',
    complete: 'https://d35aaqx5ub95lt.cloudfront.net/sounds/2aae0059c25f77fe715694c9f13111f1.mp3',
    click: 'https://d35aaqx5ub95lt.cloudfront.net/sounds/26529a9e38c29415b4f69904944d3725.mp3',
}

// Create audio elements outside component to persist across renders
const audioCache = {}

const preloadSound = (name, url) => {
    if (!audioCache[name]) {
        audioCache[name] = new Audio(url)
        audioCache[name].preload = 'auto'
        audioCache[name].volume = 1.0
        audioCache[name].load()
    }
    return audioCache[name]
}

// Preload all sounds
Object.entries(SOUNDS).forEach(([name, url]) => {
    preloadSound(name, url)
})

export const useSound = () => {
    const soundEnabled = useRef(true)

    // Check localStorage for sound preference
    useEffect(() => {
        const savedPreference = localStorage.getItem('adewe-sound-enabled')
        if (savedPreference !== null) {
            soundEnabled.current = savedPreference === 'true'
        }
    }, [])

    const playSound = useCallback((soundName) => {
        if (!soundEnabled.current) return

        const audio = audioCache[soundName]
        if (audio) {
            audio.currentTime = 0
            audio.play().catch((err) => {
                console.warn(`Autoplay blocked or failed for ${soundName}:`, err)
            })
        }
    }, [])

    const playCorrect = useCallback(() => playSound('correct'), [playSound])
    const playError = useCallback(() => playSound('error'), [playSound])
    const playComplete = useCallback(() => playSound('complete'), [playSound])
    const playClick = useCallback(() => playSound('click'), [playSound])

    const toggleSound = useCallback(() => {
        soundEnabled.current = !soundEnabled.current
        localStorage.setItem('adewe-sound-enabled', soundEnabled.current.toString())
        return soundEnabled.current
    }, [])

    const isSoundEnabled = useCallback(() => soundEnabled.current, [])

    return {
        playCorrect,
        playError,
        playComplete,
        playClick,
        toggleSound,
        isSoundEnabled,
    }
}

export default useSound
