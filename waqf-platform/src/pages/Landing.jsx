import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { waqfProperties } from '../data/mockData'

// ── Design tokens (match CSS vars) ───────────────────────────────────────────
const GOLD  = '#D4A017'
const GREEN = '#1B4332'

// ── IntersectionObserver scroll reveal ───────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '', isFloat = false }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const fired = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true
        const start = performance.now()
        const dur = 1800
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(isFloat ? +(target * eased).toFixed(1) : Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, isFloat])
  return <span ref={ref}>{val}{suffix}</span>
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className={`faq-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm leading-relaxed" style={{ color: GREEN }}>{q}</span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            border: `1.5px solid ${GOLD}`,
            color: GOLD,
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.25s ease',
          }}
        >+</span>
      </button>
      <div className={`faq-body ${open ? 'open' : ''}`}>
        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: `${GREEN}99` }}>{a}</p>
      </div>
    </div>
  )
}

// ── Project card ──────────────────────────────────────────────────────────────
const imgMap = {
  1: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
  6: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
}
const typeLabel = { فلاحي: '🌾 فلاحي', صناعي: '🏭 صناعي', تجاري: '🏪 تجاري' }

function ProjectCard({ p }) {
  const pct = Math.min(100, Math.round((p.fundingRaised / p.fundingGoal) * 100))
  const donors = Math.round(p.fundingRaised / 850000)
  return (
    <div
      className="flex flex-col overflow-hidden bg-white"
      style={{
        borderRadius: 12,
        border: '1px solid #E5EBE7',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(27,67,50,0.14)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'
      }}
    >
      {/* Image — fixed 200px, object-cover */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 200 }}>
        <img
          src={imgMap[p.id]}
          alt={p.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
        <span
          className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.92)', color: GREEN, backdropFilter: 'blur(4px)' }}
        >
          {typeLabel[p.type]}
        </span>
        <div className="absolute bottom-3 right-3 left-3">
          <div className="text-white font-bold text-sm leading-tight">{p.name}</div>
          <div className="text-white/70 text-xs mt-0.5">📍 {p.wilaya}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-4 p-6">
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: `${GREEN}80` }}>
          {p.description}
        </p>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: `${GREEN}70` }}>التمويل المُجمَّع</span>
            <span className="font-bold" style={{ color: GREEN }}>{pct}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: `${GREEN}55` }}>
            <span>{(p.fundingRaised / 1e6).toFixed(1)} م دج جُمع</span>
            <span>{donors} مشترك</span>
          </div>
        </div>

        <button
          className="mt-auto w-full font-bold py-2.5 rounded-xl text-sm text-white"
          style={{ background: GREEN, transition: 'background 0.2s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0F2D1F'}
          onMouseLeave={e => e.currentTarget.style.background = GREEN}
        >
          استثمر الآن ←
        </button>
      </div>
    </div>
  )
}

// ── SVG Icons for categories ──────────────────────────────────────────────────
const CatIcons = {
  mosque:   <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><path d="M16 3C13.5 3 11 5.5 11 8v1.5H6v17h20V9.5h-5V8c0-2.5-2.5-5-5-5z" stroke={GREEN} strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 3s-1.5 1.5-1.5 5h3c0-3.5-1.5-5-1.5-5z" fill={GOLD} opacity=".5"/><rect x="13" y="18" width="6" height="8" rx="3" stroke={GREEN} strokeWidth="1.3"/></svg>,
  book:     <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><path d="M8 6h10a2.5 2.5 0 012.5 2.5v15A2.5 2.5 0 0118 26H8V6z" stroke={GREEN} strokeWidth="1.6"/><path d="M20.5 6H22a2.5 2.5 0 012.5 2.5v15A2.5 2.5 0 0122 26h-1.5" stroke={GOLD} strokeWidth="1.6"/><path d="M11 11h8M11 15h8M11 19h5" stroke={GREEN} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  health:   <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><path d="M16 27s-10-6.5-10-13a6.5 6.5 0 0110-5.5 6.5 6.5 0 0110 5.5c0 6.5-10 13-10 13z" stroke={GREEN} strokeWidth="1.6" fill="#E9F2ED"/><path d="M13.5 16h5M16 13.5v5" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  leaf:     <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><path d="M6 26c0 0 3-14 18-18 0 0-1.5 14-16 14z" stroke={GREEN} strokeWidth="1.6" fill="#E9F2ED"/><path d="M6 26l8-8" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  hands:    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><path d="M5 18v-3.5a1.5 1.5 0 013 0V17l3.5-3.5a1.5 1.5 0 012.1 2.1L11 18h1.5l5-5a1.5 1.5 0 012.1 2.1L16 18h10a1.5 1.5 0 010 3l-5 1.5L14 25H5V18z" stroke={GREEN} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  building: <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6"><rect x="5" y="10" width="22" height="18" rx="2" stroke={GREEN} strokeWidth="1.6"/><path d="M10 28V18h5v10M17 28V18h5v10" stroke={GREEN} strokeWidth="1.3"/><path d="M5 15l11-7 11 7" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
}

// ── Data ──────────────────────────────────────────────────────────────────────
const statsData = [
  { target: 500, suffix: '+', label: 'عقار وقفي مسجل' },
  { target: 48,  suffix: '',  label: 'ولاية مشمولة' },
  { target: 120, suffix: '+', label: 'مستثمر نشط' },
  { target: 3.2, suffix: ' مليار', label: 'دج قيمة الأصول', isFloat: true },
]

const portals = [
  { emoji: '🏛️', title: 'واجهة الديوان',       desc: 'إدارة العقارات وطلبات الاستثمار',      path: '/diwan',        color: GREEN },
  { emoji: '💼', title: 'المستثمرون المحليون',  desc: 'استعرض الفرص وقدّم عروض استثمارية',  path: '/investisseurs', color: '#92400E' },
  { emoji: '🌍', title: 'الجالية الجزائرية',   desc: 'سجّل وقفك من أي مكان في العالم',     path: '/diaspora',      color: '#1D4ED8' },
  { emoji: '🌐', title: 'المستثمرون الأجانب',  desc: 'بوابة التمويل الدولي والمانحين',      path: '/etrangers',     color: '#5B21B6' },
]

const categories = [
  { icon: CatIcons.mosque,   title: 'أوقاف المساجد',   desc: 'تطوير وترميم المساجد والأماكن الدينية', bg: '#E9F2ED' },
  { icon: CatIcons.book,     title: 'التعليم والبحث',   desc: 'دعم المدارس والجامعات والبحث العلمي',  bg: '#FEF3C7' },
  { icon: CatIcons.health,   title: 'الصحة والرعاية',   desc: 'وحدات صحية للمناطق المحرومة والريفية', bg: '#FFF0F3' },
  { icon: CatIcons.leaf,     title: 'الزراعة والتنمية', desc: 'مشاريع زراعية لتحقيق الأمن الغذائي',   bg: '#F0FDF4' },
  { icon: CatIcons.hands,    title: 'كفالة الأيتام',    desc: 'صناديق تأمين مستقبل الأطفال المحتاجين',bg: '#FFF7ED' },
  { icon: CatIcons.building, title: 'البنية التحتية',   desc: 'مشاريع تنموية في المناطق الريفية',     bg: '#EEF2FF' },
]

const steps = [
  { n: '01', emoji: '✍️', title: 'سجّل حسابك',  desc: 'أنشئ حسابك في دقيقتين وأكمل التحقق من هويتك بأمان وسرية تامة.' },
  { n: '02', emoji: '🔍', title: 'اختر مشروعك', desc: 'استعرض مئات الفرص الوقفية المصنفة حسب اهتمامك وقدرتك المالية.' },
  { n: '03', emoji: '📊', title: 'ساهم وتابع',  desc: 'أودع مساهمتك وتابع أثرها الحقيقي لحظة بلحظة عبر لوحة التحكم.' },
]

const faqs = [
  { q: 'ما هو الوقف الإسلامي؟', a: 'الوقف هو تخصيص مال أو عقار لله تعالى لأغراض خيرية تعود بالنفع على المجتمع، ويبقى أصل المال محفوظاً وتُستثمر عوائده في الخير باستمرار.' },
  { q: 'كيف تضمن المنصة الشرعية والشفافية؟', a: 'جميع المشاريع مراجعة من قِبل هيئة شرعية مستقلة، ويتم نشر تقارير دورية شفافة عن كل وقف مع إمكانية تتبع المساهمة آنياً.' },
  { q: 'هل يمكنني المساهمة من خارج الجزائر؟', a: 'نعم، نرحب بالمساهمات من الجالية الجزائرية والمستثمرين الأجانب. تتوفر وسائل دفع دولية آمنة ومتعددة تشمل التحويل البنكي والبطاقات الدولية.' },
  { q: 'ما الحد الأدنى للمساهمة؟', a: 'لا يوجد حد أدنى — كل مساهمة، مهما كانت صغيرة، تُحدث أثراً حقيقياً ومستمراً. يمكنك البدء بأي مبلغ يناسب إمكانياتك.' },
  { q: 'كيف أتابع تأثير وقفي؟', a: 'عبر لوحة تحكم مخصصة لك، تتيح تقارير ربع سنوية ومؤشرات أثر اجتماعي مفصّلة لكل مشروع ساهمت فيه مع صور ومستجدات ميدانية.' },
]

// ── Section header helper ─────────────────────────────────────────────────────
function SectionHeader({ label, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12 reveal">
      <span
        className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-4"
        style={{
          color: GOLD,
          background: light ? 'rgba(255,255,255,0.15)' : 'rgba(212,160,23,0.12)',
          border: `1px solid ${light ? 'rgba(255,255,255,0.2)' : 'rgba(212,160,23,0.25)'}`,
        }}
      >
        {label}
      </span>
      <h2
        className="font-heading font-semibold mb-3"
        style={{ color: light ? '#fff' : GREEN }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-lg mx-auto" style={{ color: light ? 'rgba(255,255,255,0.6)' : '#6B7280', fontSize: 16 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  useReveal()

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF7' }} dir="rtl">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ height: 'calc(100vh - 64px)', background: '#050d08' }}
      >
        {/* BG video */}
        <video
          src="/herobg.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: 0.7,
            pointerEvents: 'none', userSelect: 'none',
          }}
        />

        {/* Overlay — spec: to bottom black→#1B4332 */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(27,67,50,0.82) 100%)',
          }}
        />

        {/* Content — min-height 80vh, vertically centered, explicit spacing */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-6"
          style={{ minHeight: '80vh', justifyContent: 'center' }}
        >
          {/* Eyebrow */}
          <div className="hero-anim ha-d1" style={{ marginBottom: 28 }}>
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <img src="/logo.png" alt="" className="w-5 h-5 object-contain flex-shrink-0" />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                المنصة الجزائرية الرسمية للأوقاف
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
            </div>
          </div>

          {/* Brand name */}
          <div className="hero-anim ha-d2" style={{ marginBottom: 16, textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                fontWeight: 700,
                color: GOLD,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif',
                textShadow: `0 0 40px ${GOLD}55`,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              WAQF INVEST
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', fontWeight: 400 }}>
              المنصة الجزائرية للأوقاف
            </div>
          </div>

          {/* Headline */}
          <h1
            className="hero-anim ha-d3 font-heading"
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#fff',
              textShadow: '0 2px 32px rgba(0,0,0,0.5)',
              maxWidth: 680,
              letterSpacing: '-0.01em',
              marginBottom: 24,
            }}
          >
            استثمر في الأوقاف{' '}
            <span style={{
              background: `linear-gradient(90deg, ${GOLD} 0%, #e8c867 60%, ${GOLD} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              اصنع أثراً خالداً
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-anim ha-d4"
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: 'clamp(1rem, 1.8vw, 1.1rem)',
              lineHeight: 1.8,
              maxWidth: 600,
              letterSpacing: '0.01em',
              marginBottom: 40,
            }}
          >
            منصة رقمية تربط العقارات الوقفية بالمستثمرين —
            مشاريع حقيقية، شفافية كاملة، وأثر اجتماعي دائم.
          </p>

          {/* CTAs */}
          <div className="hero-anim ha-d5 flex flex-col sm:flex-row items-center" style={{ gap: 16, marginBottom: 36 }}>
            <button
              onClick={() => navigate('/investisseurs')}
              style={{
                background: GOLD,
                color: '#1a0c00',
                fontWeight: 700,
                fontSize: 15,
                padding: '12px 36px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(212,160,23,0.42)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,160,23,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,160,23,0.42)' }}
            >
              ابدأ الاستثمار الآن ←
            </button>
            <button
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                padding: '12px 36px',
                borderRadius: 12,
                border: '1.5px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
            >
              استكشف المشاريع
            </button>
          </div>

          {/* Trust signals */}
          <div className="hero-anim ha-d5 flex flex-wrap items-center justify-center gap-6">
            {[
              { dot: '#4ade80', label: 'هيئة شرعية معتمدة' },
              { dot: '#60a5fa', label: 'بيانات مشفرة' },
              { dot: GOLD,      label: 'تقارير شفافة دورية' },
            ].map(t => (
              <span key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <div style={{ width: 20, height: 32, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, borderRadius: 99, background: GOLD, opacity: 0.6, animation: 'bounce 1s infinite' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #EEF0EB' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {statsData.map((s, i) => (
              <div
                key={s.label}
                className={`reveal reveal-d${i + 1} text-center py-10`}
                style={{
                  borderLeft: i > 0 ? '1px solid #EEF0EB' : 'none',
                  padding: '2.5rem 1rem',
                }}
              >
                <div
                  className="font-heading font-bold mb-1"
                  style={{ fontSize: 36, lineHeight: 1, color: GOLD }}
                >
                  <Counter target={s.target} suffix={s.suffix} isFloat={s.isFloat} />
                </div>
                <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PORTALS — compact horizontal cards
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="portals" style={{ padding: '80px 24px', background: '#FAFAF7' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="بوابات المنصة"
            title="اختر دورك"
            subtitle="أربع واجهات مخصصة — ادخل إلى لوحتك مباشرة"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portals.map((p, i) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className={`reveal reveal-d${i + 1} flex items-center gap-4 text-right w-full`}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid rgba(212,160,23,0.2)',
                  padding: '16px 20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = GOLD
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    background: `${p.color}14`,
                  }}
                >
                  {p.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: GREEN }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</div>
                </div>
                <span style={{ color: GOLD, fontSize: 18, flexShrink: 0 }}>←</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="categories" style={{ padding: '80px 24px', background: '#fff' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="الفئات"
            title="اختر مجال وقفك"
            subtitle="كل فئة تمثل حاجة حقيقية — ساهم في المجال الذي يلامس قلبك"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <button
                key={c.title}
                className={`reveal reveal-d${(i % 3) + 1} flex items-center gap-4 text-right w-full`}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid #EAEDE8',
                  padding: '20px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = GOLD
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#EAEDE8'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: c.bg,
                  }}
                >
                  {c.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: GREEN }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: '80px 24px', background: '#F0F7F4' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="الآلية"
            title="كيف تشارك؟"
            subtitle="ثلاث خطوات بسيطة تفصلك عن وقف يُذكر جيلاً بعد جيل"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute"
              style={{
                top: 40, right: 'calc(16.7% + 24px)', left: 'calc(16.7% + 24px)',
                height: 1, background: `linear-gradient(to left, ${GOLD}30, ${GOLD}, ${GOLD}30)`,
              }}
            />

            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`reveal reveal-d${i + 1} text-center relative`}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '36px 28px 28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(212,160,23,0.18)',
                }}
              >
                <div
                  style={{
                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                    width: 32, height: 32, borderRadius: '50%',
                    background: GREEN, color: '#fff',
                    fontSize: 11, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(27,67,50,0.35)',
                  }}
                >{s.n}</div>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{s.emoji}</div>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: GREEN, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURED PROJECTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="featured" style={{ padding: '80px 24px', background: '#FAFAF7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 reveal">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-3"
                style={{ color: GOLD, background: 'rgba(212,160,23,0.1)', border: `1px solid rgba(212,160,23,0.2)` }}
              >
                الفرص المتميزة
              </span>
              <h2 className="font-heading font-semibold" style={{ color: GREEN }}>أوقاف متميزة</h2>
            </div>
            <button
              onClick={() => navigate('/investisseurs')}
              style={{ color: GREEN, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = GREEN}
            >
              عرض الكل ←
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {waqfProperties.map((p, i) => (
              <div key={p.id} className={`reveal reveal-d${(i % 3) + 1}`}>
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: GREEN, position: 'relative', overflow: 'hidden' }}>
        {/* subtle Islamic pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ageo" width="60" height="60" patternUnits="userSpaceOnUse">
              <g stroke="#D4A017" strokeWidth="0.5" fill="none">
                <polygon points="30,6 42,16 50,30 42,44 30,54 18,44 10,30 18,16"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ageo)"/>
        </svg>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-6"
                style={{ color: GOLD, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                من نحن
              </span>
              <h2 className="font-heading font-semibold text-white mb-5">عن منصة<br/>أوقاف الجزائر</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>
                منصة أوقاف الجزائر تربط المانحين بالمشاريع الوقفية ذات الأثر الحقيقي في كل ربوع الوطن،
                تحت إشراف وزارة الشؤون الدينية، بأعلى معايير الشفافية والحوكمة الشرعية.
              </p>
              <div className="grid grid-cols-3 gap-5 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {[
                  { emoji: '⚖️', label: 'الحوكمة الشرعية' },
                  { emoji: '💚', label: 'الأثر الاجتماعي' },
                  { emoji: '🔍', label: 'الشفافية الكاملة' },
                ].map(f => (
                  <div key={f.label} className="text-center">
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{f.emoji}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600 }}>{f.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '+500', label: 'عقار وقفي', sub: 'في 48 ولاية', d: 1 },
                { val: '100%', label: 'شفافية',    sub: 'تقارير دورية', d: 2 },
                { val: '48',   label: 'ولاية',     sub: 'تغطية وطنية', d: 3 },
                { val: '3.2B', label: 'دج أصول',   sub: 'قيمة مُدارة', d: 4 },
              ].map(c => (
                <div
                  key={c.label}
                  className={`reveal reveal-d${c.d} text-center`}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 12,
                    padding: '24px 16px',
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, fontFamily: 'Amiri, serif' }}>{c.val}</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 4 }}>{c.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FAFAF7' }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            label="الأسئلة الشائعة"
            title="لديك سؤال؟"
            subtitle="إجابات على أكثر التساؤلات شيوعاً حول منصة الأوقاف"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} className={`reveal reveal-d${Math.min(i + 1, 5)}`}>
                <FAQItem q={f.q} a={f.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="reveal text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${GREEN} 0%, #0F2D1F 100%)`,
              borderRadius: 20,
              padding: '72px 48px',
              boxShadow: '0 24px 64px rgba(27,67,50,0.28)',
            }}
          >
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cgeo" width="50" height="50" patternUnits="userSpaceOnUse">
                  <g stroke="#D4A017" strokeWidth="0.5" fill="none">
                    <polygon points="25,5 35,14 42,25 35,36 25,45 15,36 8,25 15,14"/>
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cgeo)"/>
            </svg>

            <div className="relative">
              <div style={{ fontSize: 52, marginBottom: 20 }}>🕌</div>
              <h2
                className="font-heading"
                style={{ fontWeight: 700, color: '#fff', marginBottom: 16 }}
              >
                ابدأ رحلتك الوقفية <span style={{ color: GOLD }}>اليوم</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.62)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.8, fontSize: 15 }}>
                انضم إلى آلاف المانحين الذين يبنون إرثاً خيرياً دائماً في الجزائر.
                كل وقف، مهما صغر، يُحدث أثراً لا يُنسى.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/etrangers')}
                  style={{
                    background: GOLD, color: '#1a0c00', fontWeight: 700,
                    fontSize: 15, padding: '14px 40px', borderRadius: 12, border: 'none',
                    cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,160,23,0.4)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  ✨ أنشئ وقفاً الآن
                </button>
                <button
                  onClick={() => navigate('/investisseurs')}
                  style={{
                    background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600,
                    fontSize: 15, padding: '14px 40px', borderRadius: 12,
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer', transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  🔍 استعرض الفرص
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
