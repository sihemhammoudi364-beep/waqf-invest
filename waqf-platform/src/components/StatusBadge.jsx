const configs = {
  'متاح':          { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'محجوز':         { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'قيد الدراسة':   { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  'مقبول':         { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'مرفوض':         { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  'قيد المراجعة':  { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'مسجل':          { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'قيد المعالجة':  { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  'نشط':           { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'معلق':          { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'مكتمل':         { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
}

export default function StatusBadge({ status, size = 'md' }) {
  const cfg = configs[status] || { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' }
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${px}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {status}
    </span>
  )
}
