import { useStore } from '../store/AppContext'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const isSuccess = toast.type !== 'error'
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, pointerEvents: 'none',
      animation: 'toastSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      <div style={{
        background: isSuccess ? '#1B4332' : '#DC2626',
        color: '#fff', borderRadius: 12, padding: '13px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        border: `1px solid ${isSuccess ? '#2D6A4F' : '#EF4444'}`,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: isSuccess ? '#D4A017' : 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
        }}>
          {isSuccess ? '✓' : '✕'}
        </span>
        {toast.message}
      </div>
    </div>
  )
}
