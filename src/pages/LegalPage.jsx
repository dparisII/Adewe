import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBranding } from '../context/BrandingContext'
import { supabase } from '../lib/supabase'

function LegalPage() {
    const { docId } = useParams()
    const { branding } = useBranding()
    const [doc, setDoc] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fallback for paths like /privacy or /terms
    const currentDocId = docId || (window.location.pathname.includes('privacy') ? 'privacy_policy' : 'terms_of_use')

    useEffect(() => {
        fetchDoc()
    }, [currentDocId])

    const fetchDoc = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('legal_documents')
                .select('*')
                .eq('type', currentDocId)
                .single()

            if (data && !error) {
                setDoc(data)
            }
        } catch (error) {
            console.error('Error fetching legal doc:', error)
        } finally {
            setLoading(false)
        }
    }

    const title = doc?.title || (currentDocId === 'privacy_policy' ? 'Privacy Policy' : 'Terms of Service')

    return (
        <div className="min-h-screen bg-white dark:bg-[#131f24] font-['Nunito'] transition-colors duration-300">
            {/* Header */}
            <header className="h-[70px] border-b-2 border-[#e5e5e5] dark:border-[#37464f] flex items-center sticky top-0 bg-white dark:bg-[#131f24] z-50 transition-colors">
                <div className="max-w-[1050px] mx-auto w-full px-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        {branding?.logo_url ? (
                            <img src={branding.logo_url} alt="Logo" className="h-8 w-8 object-contain" />
                        ) : (
                            <span className="text-3xl">🦉</span>
                        )}
                        <span className="text-2xl font-black text-brand-primary tracking-tighter uppercase">
                            {branding?.site_name || 'ADEWE'}
                        </span>
                    </Link>
                    <Link
                        to="/login"
                        className="duo-btn duo-btn-outline py-2 px-6 text-sm"
                    >
                        Log In
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8">{title}</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : doc ? (
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-text-alt text-sm mb-8 font-bold">Last updated: {new Date(doc.updated_at).toLocaleDateString()}</p>
                        <div
                            className="legal-content text-text-main leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-bg-alt rounded-3xl border-2 border-dashed border-border-main">
                        <p className="text-text-alt font-bold">This legal document hasn't been published yet.</p>
                        <p className="text-text-alt text-sm mt-2">Please check back later or contact support.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-[#e5e5e5] dark:border-[#37464f] py-12 px-6 bg-white dark:bg-[#131f24] mt-auto transition-colors">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm font-bold">
                    &copy; {new Date().getFullYear()} {branding?.site_name || 'Adewe'}. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default LegalPage
