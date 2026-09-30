import { useEffect } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info'
}

interface ToastProps {
  toast: ToastMessage | null
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-in transition-all">
      <div className="bg-[#121826] border border-amber-400/40 rounded-xl p-4 shadow-2xl shadow-amber-500/10 flex items-start gap-3.5 backdrop-blur-md">
        <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
          {toast.type === 'info' ? <Info className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
