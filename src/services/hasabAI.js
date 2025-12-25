/**
 * Hasab AI Service
 * Text-to-Speech, Speech-to-Text, and Translation APIs
 */

const HASAB_API_BASE = 'https://api.hasabai.ai'

// Get API key from settings (stored in Supabase)
let cachedApiKey = null

export const setApiKey = (key) => {
  cachedApiKey = key
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${cachedApiKey}`,
})

/**
 * Generate Text-to-Speech audio
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (am, ti, om, so, en)
 * @param {object} options - Additional options (voice, speed, pitch)
 * @returns {Promise<{audioUrl: string, duration: number}>}
 */
export async function generateTTS(text, language, options = {}) {
  if (!cachedApiKey) {
    throw new Error('Hasab AI API key not configured')
  }

  try {
    const response = await fetch(`${HASAB_API_BASE}/tts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        text,
        lang: language,
        voice: options.voice || 'default',
        speed: options.speed || 1.0,
        pitch: options.pitch || 1.0,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'TTS generation failed')
    }

    return response.json()
  } catch (error) {
    console.error('Hasab AI TTS Error:', error)
    throw error
  }
}

/**
 * Convert Speech to Text
 * @param {string} audioUrl - URL of the audio file
 * @param {string} language - Language code
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function speechToText(audioUrl, language) {
  if (!cachedApiKey) {
    throw new Error('Hasab AI API key not configured')
  }

  try {
    const response = await fetch(`${HASAB_API_BASE}/stt`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        audioUrl,
        lang: language,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'STT conversion failed')
    }

    return response.json()
  } catch (error) {
    console.error('Hasab AI STT Error:', error)
    throw error
  }
}

/**
 * Translate text between languages
 * @param {string} text - Text to translate
 * @param {string} source - Source language code
 * @param {string} target - Target language code
 * @returns {Promise<{translation: string, confidence: number}>}
 */
export async function translate(text, source, target) {
  if (!cachedApiKey) {
    throw new Error('Hasab AI API key not configured')
  }

  try {
    const response = await fetch(`${HASAB_API_BASE}/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        text,
        source,
        target,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Translation failed')
    }

    return response.json()
  } catch (error) {
    console.error('Hasab AI Translation Error:', error)
    throw error
  }
}

/**
 * Batch generate TTS for multiple texts
 * @param {Array<{text: string, language: string}>} items
 * @returns {Promise<Array<{text: string, audioUrl: string}>>}
 */
export async function batchGenerateTTS(items) {
  if (!cachedApiKey) {
    throw new Error('Hasab AI API key not configured')
  }

  try {
    const response = await fetch(`${HASAB_API_BASE}/tts/batch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Batch TTS generation failed')
    }

    return response.json()
  } catch (error) {
    console.error('Hasab AI Batch TTS Error:', error)
    throw error
  }
}

/**
 * Check API status and usage
 * @returns {Promise<{status: string, usage: object}>}
 */
export async function checkStatus() {
  if (!cachedApiKey) {
    return { status: 'not_configured', usage: null }
  }

  try {
    const response = await fetch(`${HASAB_API_BASE}/status`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      return { status: 'error', usage: null }
    }

    return response.json()
  } catch (error) {
    return { status: 'error', usage: null }
  }
}

export default {
  setApiKey,
  generateTTS,
  speechToText,
  translate,
  batchGenerateTTS,
  checkStatus,
}
