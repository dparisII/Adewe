import { useNavigate } from 'react-router-dom'
import { Home, Compass, AlertCircle } from 'lucide-react'
import { useBranding } from '../context/BrandingContext'

function NotFound() {
    const navigate = useNavigate()
    const { branding } = useBranding()

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 font-['Nunito'] transition-colors duration-300">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Animated Owl Icon or SVG */}
                <div className="relative inline-block">
                    <div className="w-32 h-32 bg-brand-primary/10 rounded-full flex items-center justify-center animate-bounce-slow">
                        <span className="text-6xl cursor-default select-none">🦉</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-[#1a2c35] rounded-full border-4 border-brand-primary/20 flex items-center justify-center shadow-lg animate-pulse">
                        <AlertCircle className="text-brand-primary" size={24} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-8xl font-black text-brand-primary tracking-tighter">404</h1>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Oops! Page not found</h2>
                    <p className="text-text-alt font-bold max-w-sm mx-auto">
                        The page you're looking for seems to have flown away. Let's get you back on track with your learning journey!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={() => navigate('/learn')}
                        className="flex-1 duo-btn duo-btn-green flex items-center justify-center gap-3 py-4 text-base"
                    >
                        <Home size={20} />
                        BACK TO HOME
                    </button>
                    <button
                        onClick={() => navigate('/select-language')}
                        className="flex-1 duo-btn duo-btn-white flex items-center justify-center gap-3 py-4 text-base border-2 border-border-main"
                    >
                        <Compass size={20} />
                        EXPLORE
                    </button>
                </div>

                {/* Branding decoration */}
                <div className="pt-12 flex items-center justify-center gap-3">
                    <div className="w-8 h-[2px] bg-border-main" />
                    <span className="text-brand-primary font-black uppercase tracking-widest text-[10px]">
                        {branding?.site_name || 'ADEWE'}
                    </span>
                    <div className="w-8 h-[2px] bg-border-main" />
                </div>
            </div>

            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
        </div>
    )
}

export default NotFound
