import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBranding } from '../context/BrandingContext'

function LegalPage() {
    const { docId } = useParams()
    const { branding } = useBranding()

    // Allow routing via /legal/:docId or specific paths mapped to this component
    // Using a simple switch on the last path segment or prop would also work
    const isPrivacy = docId === 'privacy' || window.location.pathname.includes('privacy')
    const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service'

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

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {isPrivacy ? (
                        <>
                            <p>Last updated: {new Date().toLocaleDateString()}</p>

                            <h3>1. Information We Collect</h3>
                            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>

                            <h3>2. How We Use Your Information</h3>
                            <p>We use the information we collect to provide, maintain, and improve our services, such as to administration of your account, process payments, and provide customer support.</p>

                            <h3>3. Sharing of Information</h3>
                            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third party service providers, with your consent, or in response to a request for information.</p>

                            <h3>4. Security</h3>
                            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                        </>
                    ) : (
                        <>
                            <p>Last updated: {new Date().toLocaleDateString()}</p>

                            <h3>1. Acceptance of Terms</h3>
                            <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the service.</p>

                            <h3>2. Changes to Terms</h3>
                            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.</p>

                            <h3>3. Access and Use of the Service</h3>
                            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>

                            <h3>4. Accounts</h3>
                            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-[#e5e5e5] dark:border-[#37464f] py-12 px-6 bg-white dark:bg-[#131f24] mt-auto transition-colors">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} {branding?.site_name || 'Adewe'}. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default LegalPage
