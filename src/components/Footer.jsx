import { useBranding } from '../context/BrandingContext'

function Footer() {
  const { branding } = useBranding()

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-gray-500 text-sm">
          {branding?.copyright || `© ${new Date().getFullYear()} ${branding?.site_name || 'Adewe'}. All rights reserved.`}
        </span>
      </div>
    </footer>
  )
}

export default Footer
