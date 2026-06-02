import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface Toast {
  id: number
  message: string
}

interface ToastContextValue {
  showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0
const DURATION_MS = 4000

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div className="toast-fleet">
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(243,243,243,0.5)',
          cursor: 'pointer',
          fontSize: '1rem',
          lineHeight: 1,
          padding: '0 0 0 0.75rem',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showError = useCallback((message: string) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => dismiss(id), DURATION_MS)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      {createPortal(
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '0.5rem',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
