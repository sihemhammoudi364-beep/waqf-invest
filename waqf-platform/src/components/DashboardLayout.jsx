import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Design tokens ─────────────────────────────────────────────────────────────
export const GOLD  = '#D4A017'
export const GREEN = '#1B4332'

// ── Inline SVG icons ──────────────────────────────────────────────────────────
export const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const s = { width: size, height: size, flexShrink: 0 }
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    building:  <><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-5h6v5"/></>,
    file:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    globe:     <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    chart:     <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    help:      <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></>,
    home:      <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
    users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    check:     <><polyline points="20,6 9,17 4,12"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arrow:     <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></>,
    money:     <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></>,
    map:       <><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"/></>,
    inbox:     <><polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></>,
    edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    book:      <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    upload:    <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  }
  return (
    <svg style={s} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CFG = {
  'متاح':         { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'محجوز':        { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  'قيد الدراسة':  { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  'قيد المراجعة': { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  'مقبول':        { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'مرفوض':        { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  'مسجل':         { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'قيد المعالجة': { bg: '#EDE9FE', color: '#5B21B6', dot: '#8B5CF6' },
  'نشط':          { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'معلق':         { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  'مكتمل':        { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
  'دائم':          { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'مؤقت':         { bg: '#FEF9C7', color: '#854D0E', dot: '#D4A017' },
}

export function Badge({ status }) {
  const c = STATUS_CFG[status] || { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.color,
      fontSize: 12, fontWeight: 600, padding: '3px 10px',
      borderRadius: 99, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, accent = GOLD }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1px solid #EAEDE8',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      padding: '20px 24px',
      display: 'flex', alignItems: 'flex-start', gap: 16,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: accent, borderRadius: '0 12px 12px 0' }} />
      {icon && (
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: `${accent}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={20} color={accent} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 4, fontFamily: 'Amiri, serif' }}>{value}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: GREEN }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
export function Card({ title, action, actionLabel = 'عرض الكل', children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1px solid #EAEDE8',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden', ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #F3F4F2',
        }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: GREEN }}>{title}</span>
          {action && (
            <button onClick={action}
              style={{ fontSize: 12, fontWeight: 600, color: GOLD, background: 'none', border: 'none', cursor: 'pointer' }}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

// ── Gold button ───────────────────────────────────────────────────────────────
export function GoldBtn({ children, onClick, small = false }) {
  return (
    <button onClick={onClick} style={{
      background: GOLD, color: '#1a0c00', fontWeight: 700,
      fontSize: small ? 12 : 14, padding: small ? '6px 14px' : '10px 22px',
      borderRadius: 8, border: 'none', cursor: 'pointer',
      transition: 'opacity 0.2s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{children}</button>
  )
}

export function OutlineBtn({ children, onClick, small = false, danger = false }) {
  const col = danger ? '#EF4444' : GREEN
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: col, fontWeight: 600,
      fontSize: small ? 12 : 14, padding: small ? '5px 13px' : '9px 21px',
      borderRadius: 8, border: `1.5px solid ${col}30`, cursor: 'pointer',
      transition: 'border-color 0.2s ease, background 0.2s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.background = `${col}08` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${col}30`; e.currentTarget.style.background = 'transparent' }}
    >{children}</button>
  )
}

// ── Table row ─────────────────────────────────────────────────────────────────
export function TR({ cells, actions }) {
  return (
    <tr style={{ borderBottom: '1px solid #F3F4F2', transition: 'background 0.15s ease' }}
      onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {cells.map((c, i) => (
        <td key={i} style={{ padding: '12px 20px', fontSize: 14, color: i === 0 ? GREEN : '#4B5563', fontWeight: i === 0 ? 500 : 400 }}>
          {c}
        </td>
      ))}
      {actions && (
        <td style={{ padding: '10px 20px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{actions}</div>
        </td>
      )}
    </tr>
  )
}

export function THead({ cols }) {
  return (
    <thead>
      <tr style={{ borderBottom: '2px solid #EAEDE8', background: '#FAFAF7' }}>
        {cols.map(c => (
          <th key={c} style={{ padding: '11px 20px', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right' }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ pct, label }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 5 }}>
        <span>{label || 'التمويل'}</span>
        <span style={{ fontWeight: 700, color: GREEN }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: '#E8F0EB', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: GREEN, borderRadius: 99, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, open, onClose, children, width = 520 }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #EAEDE8',
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: GREEN }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex' }}>
            <Icon name="x" size={20} color="#6B7280" />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ── Form field ────────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: GREEN, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

export function Input({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} dir="rtl"
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8, fontSize: 14,
        border: '1.5px solid #DDDFD9', outline: 'none', transition: 'border-color 0.2s',
        background: '#FAFAF7', color: GREEN,
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = '#DDDFD9'}
    />
  )
}

export function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} dir="rtl"
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8, fontSize: 14,
        border: '1.5px solid #DDDFD9', outline: 'none',
        background: '#FAFAF7', color: GREEN, cursor: 'pointer',
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = '#DDDFD9'}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

export function Textarea({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} dir="rtl"
      style={{
        width: '100%', padding: '9px 13px', borderRadius: 8, fontSize: 14,
        border: '1.5px solid #DDDFD9', outline: 'none', resize: 'vertical',
        background: '#FAFAF7', color: GREEN,
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = '#DDDFD9'}
    />
  )
}

// ── Stepper ───────────────────────────────────────────────────────────────────
export function Stepper({ steps, current }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, textAlign: 'center', marginBottom: 14 }}>
        خطوة {current} من {steps.length}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: current > i + 1 ? GOLD : current === i + 1 ? GREEN : '#E5E7EB',
                color: current >= i + 1 ? '#fff' : '#9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, transition: 'all 0.3s ease',
              }}>
                {current > i + 1 ? '✓' : i + 1}
              </div>
              <div style={{
                fontSize: 11, whiteSpace: 'nowrap', transition: 'color 0.3s ease',
                color: current > i + 1 ? GOLD : current === i + 1 ? GREEN : '#9CA3AF',
                fontWeight: current >= i + 1 ? 600 : 400,
              }}>{s}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 6px', marginBottom: 20,
                background: current > i + 1 ? GOLD : '#E5E7EB',
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Dashboard Layout ─────────────────────────────────────────────────────
export default function DashboardLayout({ navSections, user, active, onNavigate, title, subtitle, actions, children, notifCount = 0, notifications = [], onMarkRead, dir = 'rtl' }) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)
  const W = collapsed ? 68 : 248
  const isRTL = dir === 'rtl'

  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FAFAF7', direction: dir }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: W, flexShrink: 0,
        background: GREEN,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0,
        ...(isRTL ? { right: 0 } : { left: 0 }),
        transition: 'width 0.25s ease',
        zIndex: 40,
        boxShadow: isRTL ? '2px 0 20px rgba(0,0,0,0.15)' : '-2px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '18px 14px' : '18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}>
          <img src="/logo.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.3, whiteSpace: 'nowrap' }}>منصة الأوقاف</div>
              <div style={{ color: GOLD, fontSize: 11, marginTop: 1 }}>نمو واستدامة</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', ...(isRTL ? { marginRight: collapsed ? 'auto' : 0 } : { marginLeft: collapsed ? 'auto' : 0 }) }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <Icon name="arrow" size={16} color="currentColor" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {navSections.map(section => (
            <div key={section.label} style={{ marginBottom: 20 }}>
              {!collapsed && (
                <p style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  padding: '0 10px', marginBottom: 6,
                }}>
                  {section.label}
                </p>
              )}
              {section.items.map(item => {
                const isActive = active === item.id
                return (
                  <button key={item.id} onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: 10, padding: collapsed ? '9px 14px' : '9px 12px',
                      borderRadius: 9, marginBottom: 2, cursor: 'pointer', border: 'none',
                      background: isActive ? `${GOLD}22` : 'transparent',
                      borderRight: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                      color: isActive ? GOLD : 'rgba(255,255,255,0.55)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' } }}
                  >
                    <Icon name={item.icon} size={17} color="currentColor" />
                    {!collapsed && (
                      <>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, textAlign: isRTL ? 'right' : 'left' }}>{item.label}</span>
                        {item.badge > 0 && (
                          <span style={{
                            background: isActive ? GOLD : '#EF4444',
                            color: isActive ? '#1a0c00' : '#fff',
                            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                          }}>{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate('/')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '9px 14px' : '9px 12px',
              borderRadius: 9, cursor: 'pointer', border: 'none',
              background: 'transparent', color: 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s ease', marginBottom: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <Icon name="home" size={17} color="currentColor" />
            {!collapsed && <span style={{ fontSize: 13 }}>الصفحة الرئيسية</span>}
          </button>
          {!collapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: GOLD, color: '#1a0c00',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
              }}>{user?.name?.[0] || 'م'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{user?.role}</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', ...(isRTL ? { marginRight: W, transition: 'margin-right 0.25s ease' } : { marginLeft: W, transition: 'margin-left 0.25s ease' }) }}>

        {/* Topbar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #EAEDE8', flexShrink: 0,
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', height: 60,
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: GREEN, margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2, margin: 0 }}>{subtitle}</p>}
          </div>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FAFAF7', border: '1.5px solid #DDDFD9',
            borderRadius: 9, padding: '7px 12px', width: 220,
          }}>
            <Icon name="search" size={15} color="#9CA3AF" />
            <input placeholder={isRTL ? 'بحث...' : 'Search...'} dir={dir} style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13, color: GREEN, flex: 1, textAlign: isRTL ? 'right' : 'left',
            }} />
          </div>
          {/* Bell */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setBellOpen(o => !o); if (!bellOpen && onMarkRead) onMarkRead() }}
              style={{
                position: 'relative', width: 38, height: 38, borderRadius: 9,
                background: bellOpen ? `${GREEN}10` : '#FAFAF7',
                border: `1.5px solid ${bellOpen ? GREEN : '#DDDFD9'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              <Icon name="bell" size={17} color={bellOpen ? GREEN : '#6B7280'} />
              {notifCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, ...(isRTL ? { right: -4 } : { left: -4 }),
                  background: '#EF4444', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  minWidth: 16, height: 16, padding: '0 3px',
                  borderRadius: 99, border: '1.5px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{notifCount > 9 ? '9+' : notifCount}</span>
              )}
            </button>

            {bellOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)',
                ...(isRTL ? { left: 0 } : { right: 0 }),
                width: 320, background: '#fff', borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid #EAEDE8', zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>الإشعارات</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>{notifications.filter(n => !n.read).length} غير مقروءة</span>
                  )}
                </div>
                <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '28px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد إشعارات</div>
                  ) : notifications.slice(0, 12).map(n => (
                    <div key={n.id} style={{
                      padding: '12px 16px', borderBottom: '1px solid #F9FAF8',
                      background: n.read ? '#fff' : `${GREEN}06`,
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? '#D1D5DB' : GREEN, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: GREEN, lineHeight: 1.4, direction: 'rtl' }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* User avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: GREEN, color: GOLD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>{user?.name?.[0] || 'م'}</div>
          {/* Actions slot */}
          {actions}
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
