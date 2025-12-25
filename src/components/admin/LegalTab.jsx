import { useState, useEffect } from 'react'
import { FileText, Save, Plus, Edit, Eye, Clock, Check, X, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
  }

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${colors[type]}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
        <X size={16} />
      </button>
    </div>
  )
}

const documentTypes = [
  { id: 'privacy_policy', label: 'Privacy Policy', icon: '🔒' },
  { id: 'terms_of_use', label: 'Terms of Use', icon: '📜' },
  { id: 'disclaimer', label: 'Disclaimer', icon: '⚠️' },
  { id: 'cookies_policy', label: 'Cookies Policy', icon: '🍪' },
  { id: 'gdpr', label: 'GDPR Compliance', icon: '🇪🇺' },
]

function LegalTab() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingDoc, setEditingDoc] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('type')

      if (error) {
        console.log('Legal documents table may not exist yet')
        // Try localStorage fallback
        const localData = localStorage.getItem('legal_documents')
        if (localData) {
          try {
            setDocuments(JSON.parse(localData))
          } catch (e) {
            setDocuments([])
          }
        } else {
          setDocuments([])
        }
      } else {
        setDocuments(data || [])
      }
    } catch (error) {
      console.log('Legal documents table may not exist yet')
      // Try localStorage fallback
      const localData = localStorage.getItem('legal_documents')
      if (localData) {
        try {
          setDocuments(JSON.parse(localData))
        } catch (e) {
          setDocuments([])
        }
      } else {
        setDocuments([])
      }
    } finally {
      setLoading(false)
    }
  }

  const saveDocument = async (doc) => {
    try {
      const existingDoc = documents.find(d => d.type === doc.type)

      if (existingDoc) {
        const { error } = await supabase
          .from('legal_documents')
          .update({
            title: doc.title,
            content: doc.content,
            is_published: doc.is_published,
            version: (existingDoc.version || 1) + 1,
            published_at: doc.is_published ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingDoc.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('legal_documents')
          .insert([{
            type: doc.type,
            title: doc.title,
            content: doc.content,
            is_published: doc.is_published,
            version: 1,
            published_at: doc.is_published ? new Date().toISOString() : null,
          }])

        if (error) throw error
      }

      fetchDocuments()
      setEditingDoc(null)
      showToast('Document saved successfully!')
    } catch (error) {
      console.error('Error saving document:', error)
      // Fallback to localStorage
      const savedDocs = JSON.parse(localStorage.getItem('legal_documents') || '[]')
      const idx = savedDocs.findIndex(d => d.type === doc.type)
      if (idx >= 0) {
        savedDocs[idx] = { ...doc, updated_at: new Date().toISOString() }
      } else {
        savedDocs.push({ ...doc, updated_at: new Date().toISOString() })
      }
      localStorage.setItem('legal_documents', JSON.stringify(savedDocs))
      showToast('Document saved locally', 'success')
      setEditingDoc(null)
    }
  }

  const getDocumentByType = (type) => {
    return documents.find(d => d.type === type)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-main">Legal Documents</h2>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map(docType => {
          const doc = getDocumentByType(docType.id)
          return (
            <div key={docType.id} className="bg-bg-card rounded-xl border border-border-main p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{docType.icon}</span>
                  <div>
                    <h3 className="text-text-main font-bold">{docType.label}</h3>
                    {doc && (
                      <p className="text-text-alt text-sm">Version {doc.version || 1}</p>
                    )}
                  </div>
                </div>
                {doc?.is_published ? (
                  <span className="px-2 py-1 bg-brand-primary/20 text-brand-primary text-xs rounded-full flex items-center gap-1">
                    <Check size={12} /> Published
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Draft
                  </span>
                )}
              </div>

              {doc ? (
                <>
                  <p className="text-text-alt text-sm mb-4 line-clamp-2">
                    {doc.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-alt mb-4">
                    <Clock size={12} />
                    Updated: {new Date(doc.updated_at).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <p className="text-text-alt text-sm mb-4">No content yet. Click to add.</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDoc({ ...doc, type: docType.id, title: doc?.title || docType.label })}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors"
                >
                  <Edit size={16} />
                  {doc ? 'Edit' : 'Create'}
                </button>
                {doc && (
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      {editingDoc && (
        <DocumentEditor
          document={editingDoc}
          onSave={saveDocument}
          onClose={() => setEditingDoc(null)}
        />
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  )
}

// Document Editor Modal
function DocumentEditor({ document, onSave, onClose }) {
  const [form, setForm] = useState({
    type: document?.type || '',
    title: document?.title || '',
    content: document?.content || '',
    is_published: document?.is_published ?? false,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  // Simple toolbar for basic formatting
  const insertTag = (tag) => {
    const textarea = window.document.getElementById('content-editor')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = form.content.substring(start, end)

    let newText = ''
    switch (tag) {
      case 'h1':
        newText = `<h1>${selectedText || 'Heading 1'}</h1>`
        break
      case 'h2':
        newText = `<h2>${selectedText || 'Heading 2'}</h2>`
        break
      case 'p':
        newText = `<p>${selectedText || 'Paragraph text'}</p>`
        break
      case 'ul':
        newText = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`
        break
      case 'bold':
        newText = `<strong>${selectedText || 'Bold text'}</strong>`
        break
      default:
        newText = selectedText
    }

    const newContent = form.content.substring(0, start) + newText + form.content.substring(end)
    setForm({ ...form, content: newContent })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border-main flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main">Edit {form.title}</h2>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-brand-primary">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-text-alt text-sm mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Simple Toolbar */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => insertTag('h1')} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 text-sm">H1</button>
            <button onClick={() => insertTag('h2')} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 text-sm">H2</button>
            <button onClick={() => insertTag('p')} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 text-sm">Paragraph</button>
            <button onClick={() => insertTag('ul')} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 text-sm">List</button>
            <button onClick={() => insertTag('bold')} className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 text-sm font-bold">B</button>
          </div>

          <div>
            <label className="block text-text-alt text-sm mb-1">Content (HTML)</label>
            <textarea
              id="content-editor"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full p-3 bg-bg-alt border border-border-main rounded-lg text-text-main font-mono text-sm focus:outline-none focus:border-brand-primary resize-none"
              placeholder="<h1>Document Title</h1>
<p>Your content here...</p>"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-border-main">
            <div>
              <p className="text-text-main font-medium">Publish this document</p>
              <p className="text-text-alt text-sm">Make this document publicly visible</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_published: !form.is_published })}
              className={`relative w-14 h-8 rounded-full transition-colors ${form.is_published ? 'bg-brand-primary' : 'bg-gray-300'
                }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${form.is_published ? 'translate-x-7' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border-main flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-bg-alt text-text-main rounded-lg hover:bg-border-main"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-brand-primary text-white rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={18} />
                Save Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Document Preview Modal
function DocumentPreview({ document, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-bg-alt">
          <h2 className="text-lg font-bold text-text-main">{document.title}</h2>
          <button onClick={onClose} className="p-2 text-text-alt hover:text-text-main">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </div>
        <div className="p-4 border-t bg-bg-alt text-center text-sm text-text-alt">
          Version {document.version || 1} • Last updated: {new Date(document.updated_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default LegalTab
