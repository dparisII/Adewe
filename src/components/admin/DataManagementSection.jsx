import { useState } from 'react'
import { Download, Upload, Database, FileJson, CheckCircle, AlertCircle, Loader2, RefreshCw, HardDrive } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function DataManagementSection() {
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(null) // 'export-users', 'import-users', etc.
    const [toast, setToast] = useState(null)

    const dataTypes = [
        { id: 'profiles', label: 'Users', icon: Database, description: 'User profiles and account data' },
        { id: 'lessons', label: 'Contents', icon: FileJson, description: 'Lessons, units, and curriculum' },
        { id: 'ads', label: 'Ads', icon: MegaphoneIcon, description: 'Advertising campaigns and settings' },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquareIcon, description: 'User success stories and reviews' },
        { id: 'events', label: 'Events', icon: CalendarIcon, description: 'Community events and challenges' },
        { id: 'documents', label: 'Documents', icon: FileTextIcon, description: 'uploaded documents and resources' },
    ]

    // Simple icon components to avoid import errors if not available in lucide-react specific version
    // But since we use lucide-react generally, let's import them properly or use fallbacks
    // I'll import distinct icons at the top.

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 4000)
    }

    const handleExport = async (table) => {
        try {
            setProcessing(`export-${table}`)

            // Special handling for "All Data" not implemented per row, but we could if needed.
            // Here we export specific table.
            const { data, error } = await supabase.from(table).select('*')

            if (error) throw error

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${table}_backup_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            showToast(`${table} exported successfully`)
        } catch (err) {
            console.error(err)
            showToast(`Failed to export ${table}: ${err.message}`, 'error')
        } finally {
            setProcessing(null)
        }
    }

    const handleImport = async (table, event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
            setProcessing(`import-${table}`)
            const text = await file.text()
            const data = JSON.parse(text)

            if (!Array.isArray(data)) throw new Error('Invalid JSON format. Expected an array of records.')

            const { error } = await supabase.from(table).upsert(data)

            if (error) throw error

            showToast(`${table} imported successfully (${data.length} records)`)
        } catch (err) {
            console.error(err)
            showToast(`Failed to import ${table}: ${err.message}`, 'error')
        } finally {
            setProcessing(null)
            event.target.value = '' // Reset input
        }
    }

    const handleExportAll = async () => {
        try {
            setProcessing('export-all')
            const allData = {}

            for (const type of dataTypes) {
                const { data, error } = await supabase.from(type.id).select('*')
                if (!error && data) {
                    allData[type.id] = data
                }
            }

            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `full_backup_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()

            showToast('Full backup exported successfully')
        } catch (err) {
            console.error(err)
            showToast('Partially failed to export all data', 'error')
        } finally {
            setProcessing(null)
        }
    }

    // Pseudo-implementation for restoring everything
    // It's risky because of foreign key constraints order.
    // For now, I'll simpler implementation: just try to upsert each key.
    const handleRestoreAll = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!confirm('WARNING: This will overwrite existing data. Are you sure?')) {
            event.target.value = ''
            return
        }

        try {
            setProcessing('import-all')
            const text = await file.text()
            const allData = JSON.parse(text)

            let successCount = 0

            // Order matters for relational data, but simplistic approach for now:
            // profiles first, then content, then others.
            const processingOrder = ['profiles', 'lessons', 'events', 'testimonials', 'ads', 'documents']

            for (const table of processingOrder) {
                if (allData[table] && Array.isArray(allData[table])) {
                    const { error } = await supabase.from(table).upsert(allData[table])
                    if (!error) successCount++
                }
            }
            // Also handle keys that are not in the explicit order but present in file
            for (const key in allData) {
                if (!processingOrder.includes(key) && Array.isArray(allData[key])) {
                    const { error } = await supabase.from(key).upsert(allData[key])
                    if (!error) successCount++
                }
            }

            showToast(`Full restore completed. Processed ${successCount} tables.`)
        } catch (err) {
            console.error(err)
            showToast(`Failed to restore backup: ${err.message}`, 'error')
        } finally {
            setProcessing(null)
            event.target.value = ''
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[99999] p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary'
                    }`}>
                    {toast.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                    <p className="font-black uppercase tracking-wide text-sm">{toast.message}</p>
                </div>
            )}

            <div className="bg-bg-card rounded-3xl border-2 border-border-main p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-text-main uppercase flex items-center gap-3">
                            <HardDrive className="text-brand-primary" size={28} />
                            Data Management
                        </h2>
                        <p className="text-text-alt font-bold uppercase tracking-widest text-xs mt-2">
                            Backup, restore, and manage your platform's data
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportAll}
                            disabled={processing}
                            className="duo-btn duo-btn-green px-6 py-3 flex items-center gap-2 text-sm"
                        >
                            {processing === 'export-all' ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            BACKUP ALL
                        </button>
                        <label className={`duo-btn duo-btn-blue px-6 py-3 flex items-center gap-2 text-sm cursor-pointer ${processing && 'opacity-50 pointer-events-none'}`}>
                            {processing === 'import-all' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                            RESTORE ALL
                            <input type="file" accept=".json" className="hidden" onChange={handleRestoreAll} disabled={processing} />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dataTypes.map((type) => {
                        const Icon = type.icon
                        return (
                            <div key={type.id} className="bg-bg-alt border-2 border-border-main rounded-2xl p-6 hover:border-brand-primary/40 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-bg-card rounded-xl flex items-center justify-center shadow-sm">
                                            <Icon className="text-text-main group-hover:text-brand-primary transition-colors" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-text-main uppercase">{type.label}</h3>
                                            <p className="text-[10px] font-bold text-text-alt uppercase tracking-wide">{type.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleExport(type.id)}
                                        disabled={!!processing}
                                        className="flex-1 py-2 px-4 rounded-xl border-2 border-border-main bg-bg-card hover:bg-bg-alt hover:border-brand-primary/30 text-text-main font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
                                    >
                                        {processing === `export-${type.id}` ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                                        Export
                                    </button>
                                    <label className={`flex-1 py-2 px-4 rounded-xl border-2 border-border-main bg-bg-card hover:bg-bg-alt hover:border-blue-500/30 text-text-main font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${processing && 'opacity-50'}`}>
                                        {processing === `import-${type.id}` ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                        Import
                                        <input type="file" accept=".json" className="hidden" onChange={(e) => handleImport(type.id, e)} disabled={!!processing} />
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-4">
                    <AlertCircle className="text-blue-500 shrink-0" size={20} />
                    <div>
                        <h4 className="font-black text-blue-600 text-sm uppercase mb-1">Backup Recommendation</h4>
                        <p className="text-xs text-text-alt leading-relaxed">
                            Regularly download a full backup of your data. Restoring data can overwrite existing records if IDs match. Always verify your JSON files before importing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Icon proxies to avoid import errors if not standard
function MegaphoneIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg> }
function MessageSquareIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> }
function CalendarIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> }
function FileTextIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> }

export default DataManagementSection
