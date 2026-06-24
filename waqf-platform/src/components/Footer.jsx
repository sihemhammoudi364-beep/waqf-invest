import { useNavigate } from 'react-router-dom'

const GOLD  = '#D4A017'
const BG    = '#0F2D1F'

const socials = [
  {
    label: 'Facebook',
    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'X',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'LinkedIn',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'YouTube',
    d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

const quickLinks = [
  ['الرئيسية',              '/'],
  ['واجهة الديوان',         '/diwan'],
  ['المستثمرون المحليون',   '/investisseurs'],
  ['الجالية الجزائرية',    '/diaspora'],
  ['المستثمرون الأجانب',   '/etrangers'],
]

const contact = [
  { icon: '✉', text: 'contact@waqf-dz.gov.dz' },
  { icon: '📞', text: '+213 21 XX XX XX' },
  { icon: '📍', text: 'الجزائر العاصمة، الجزائر' },
  { icon: '🕐', text: 'الأحد – الخميس: 08:00 – 16:30' },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer dir="rtl" style={{ background: BG, color: '#fff' }}>
      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand + desc + social */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="شعار" style={{ width: 44, height: 44, objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>المنصة الجزائرية للأوقاف</div>
                <div style={{ color: GOLD, fontSize: 12, marginTop: 2 }}>نمو واستدامة</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
              منصة رقمية متكاملة تسعى لتحقيق التنمية المستدامة من خلال إحياء الوقف الإسلامي
              وربط المانحين بالمشاريع الوقفية في الجزائر.
            </p>

            {/* Social icons — outlined circles 36px */}
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = GOLD
                    e.currentTarget.style.background = `${GOLD}18`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    style={{ width: 14, height: 14, fill: 'rgba(255,255,255,0.5)', transition: 'fill 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.fill = GOLD}
                    onMouseLeave={e => e.currentTarget.style.fill = 'rgba(255,255,255,0.5)'}
                  >
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h4 style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              روابط سريعة
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quickLinks.map(([label, path]) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              تواصل معنا
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contact.map(c => (
                <li key={c.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter / CTA */}
          <div>
            <h4 style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              ابق على اطلاع
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              اشترك لتلقي آخر أخبار المشاريع والفرص الوقفية مباشرة في بريدك الإلكتروني.
            </p>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                dir="rtl"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: 13, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
              <button
                style={{
                  background: GOLD, color: '#1a0c00', fontWeight: 700,
                  fontSize: 13, padding: '10px 0', borderRadius: 10,
                  border: 'none', cursor: 'pointer', width: '100%',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                اشتراك
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>
            © 2024 المنصة الجزائرية للأوقاف — جميع الحقوق محفوظة
          </p>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 6 }}>
            تحت إشراف وزارة الشؤون الدينية والأوقاف
          </p>
        </div>
      </div>
    </footer>
  )
}
