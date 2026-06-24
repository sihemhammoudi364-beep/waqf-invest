import { useState } from 'react'
import { useStore } from '../store/AppContext'
import DashboardLayout, {
  StatCard, Card, Badge, GoldBtn, OutlineBtn,
  TR, THead, Modal, Field, Input, Select, Textarea,
  ProgressBar, Stepper, GOLD, GREEN,
} from '../components/DashboardLayout'

// ── Country list ──────────────────────────────────────────────────────────────
const COUNTRIES = ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'UK', 'USA', 'France', 'Germany', 'Spain', 'Italy', 'Canada', 'Australia', 'Turkey', 'China', 'Other']

// ── File upload (UI only) ─────────────────────────────────────────────────────
function FileUpload({ id, label = 'انقر لرفع الملف' }) {
  const [file, setFile] = useState(null)
  return (
    <label htmlFor={id} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '16px 20px',
      border: `2px dashed ${file ? GOLD : '#DDDFD9'}`, borderRadius: 10,
      background: file ? `${GOLD}08` : '#FAFAF7', cursor: 'pointer',
      transition: 'all 0.2s ease', textAlign: 'center',
    }}>
      <input id={id} type="file" style={{ display: 'none' }}
        onChange={e => setFile(e.target.files[0]?.name || null)} accept="image/*,.pdf" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={file ? GOLD : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17,8 12,3 7,8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <span style={{ fontSize: 13, color: file ? GOLD : '#9CA3AF', fontWeight: file ? 600 : 400 }}>
        {file || label}
      </span>
    </label>
  )
}

// ── Static catalogue ───────────────────────────────────────────────────────────
const opportunities = [
  { id: 'WQF-001', name: 'Strategic Land — Hydra, Algiers', sector: 'Commercial', wilaya: 'Algiers',     minAmount: '$ 80 000', duration: '10 years', goal: 2000000, raised: 1200000, desc: 'Prime waqf land in central Algiers suitable for a modern commercial complex.', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
  { id: 'WQF-004', name: 'Agricultural Estate — Constantine', sector: 'Agriculture', wilaya: 'Constantine', minAmount: '$ 30 000', duration: '15 years', goal: 800000, raised: 320000, desc: 'Large agricultural waqf estate equipped with modern irrigation. High yield potential.', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80' },
  { id: 'WQF-006', name: 'Historic Market — Tlemcen', sector: 'Commercial', wilaya: 'Tlemcen', minAmount: '$ 120 000', duration: '20 years', goal: 3000000, raised: 2100000, desc: 'Iconic historic market in the old city. Rare tourism investment opportunity.', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
]

const regions = [
  { name: 'Algiers',     projects: 12, investors: 38, total: '$ 4.2 M' },
  { name: 'Oran',        projects: 8,  investors: 24, total: '$ 2.8 M' },
  { name: 'Constantine', projects: 6,  investors: 17, total: '$ 1.5 M' },
  { name: 'Tlemcen',     projects: 4,  investors: 11, total: '$ 900 K' },
]

const faqs = [
  { q: 'Who can invest through this platform?', a: 'Any foreign investor or international company can apply. Investments are subject to Algerian regulation and Diwan approval.' },
  { q: 'What sectors are open to foreign waqf investment?', a: 'Commercial, agricultural, educational, and healthcare sectors are open. Tourism and real estate are in evaluation.' },
  { q: 'What is the minimum investment period?', a: 'The minimum is 5 years. Most waqf properties are offered for 10 to 25-year terms with renewable contracts.' },
  { q: 'How are returns distributed?', a: 'Returns are distributed annually after Diwan audit. 10–20% is reinvested into the waqf endowment fund.' },
]

const navSections = [
  {
    label: 'My Portal',
    items: [
      { id: 'overview',   label: 'Overview',    icon: 'dashboard', badge: 0 },
      { id: 'register',   label: 'Register',    icon: 'plus',      badge: 0 },
      { id: 'browse',     label: 'Browse',      icon: 'building',  badge: 0 },
      { id: 'my-funding', label: 'My Funding',  icon: 'money',     badge: 0 },
    ],
  },
  {
    label: 'Support',
    items: [
      { id: 'faq',     label: 'FAQ',     icon: 'help',  badge: 0 },
      { id: 'contact', label: 'Contact', icon: 'inbox', badge: 0 },
    ],
  },
]

// ── Opportunity card ───────────────────────────────────────────────────────────
function OppCard({ opp, onFund }) {
  const pct = Math.round((opp.raised / opp.goal) * 100)
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${hov ? GOLD : '#EAEDE8'}`, boxShadow: hov ? '0 12px 36px rgba(27,67,50,0.12)' : '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.2s ease' }}
    >
      <img src={opp.img} alt={opp.name} style={{ width: '100%', height: 155, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: GREEN, marginBottom: 3 }}>{opp.name}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{opp.wilaya} · {opp.sector}</div>
          </div>
          <span style={{ background: `${GOLD}18`, color: GOLD, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{opp.duration}</span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 14, marginTop: 8 }}>{opp.desc}</p>
        <ProgressBar pct={pct} label={`Min: ${opp.minAmount}`} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}><span className="num">{pct}%</span> funded</div>
          <GoldBtn small onClick={() => onFund(opp)}>Apply Now ←</GoldBtn>
        </div>
      </div>
    </div>
  )
}

// ── Apply modal (2-step) ───────────────────────────────────────────────────────
function FundModal({ opp, user, onClose, onSubmit }) {
  const [step, setStep]     = useState(1)
  const [amount, setAmount] = useState('')
  const [duration, setDur]  = useState('10 years')
  const [desc, setDesc]     = useState('')
  const [name, setName]     = useState(user?.name || '')
  const [country, setCntry] = useState(user?.country || 'UAE')

  const handleSubmit = () => {
    if (!amount) return
    onSubmit(opp, amount, duration, desc, name, country)
    setStep(1); setAmount(''); setDur('10 years'); setDesc('')
    onClose()
  }

  if (!opp) return null
  return (
    <Modal title={`Apply — ${opp.name}`} open={!!opp} onClose={() => { onClose(); setStep(1) }} width={560}>
      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {['Investment Details', 'Company Info'].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px', background: step > i ? GOLD : step === i + 1 ? GREEN : '#E5E7EB', color: step >= i + 1 ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
            <div style={{ fontSize: 11, color: step === i + 1 ? GREEN : '#9CA3AF', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ background: `${GREEN}08`, borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>{opp.name} — {opp.wilaya}</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Sector: {opp.sector} · Term: {opp.duration}</div>
          </div>
          <Field label="Investment Amount (USD)"><Input placeholder="e.g. 100000" value={amount} onChange={e => setAmount(e.target.value)} type="number" /></Field>
          <Field label="Proposed Term"><Select value={duration} onChange={e => setDur(e.target.value)} options={['5 years', '10 years', '15 years', '20 years', '25 years']} /></Field>
          <Field label="Business Description"><Textarea placeholder="Describe your investment project and added value..." value={desc} onChange={e => setDesc(e.target.value)} /></Field>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
            <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
            <GoldBtn onClick={() => setStep(2)}>Next →</GoldBtn>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Field label="Full Name / Company Name"><Input placeholder="Ibrahim Hassan / Hassan Investments LLC" value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Nationality / Country"><Select value={country} onChange={e => setCntry(e.target.value)} options={['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'UK', 'USA', 'France', 'Germany', 'Other']} /></Field>
          <Field label="Contact Email"><Input placeholder="i.hassan@example.com" type="email" onChange={() => {}} /></Field>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
            <OutlineBtn onClick={() => setStep(1)}>← Back</OutlineBtn>
            <GoldBtn onClick={handleSubmit}>Submit Application</GoldBtn>
          </div>
        </>
      )}
    </Modal>
  )
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E9EFEA', borderRight: `3px solid ${GOLD}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: open ? '#F0F7F4' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 600, color: GREEN, gap: 16 }}>
        {q}
        <span style={{ fontSize: 18, color: GOLD, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease', display: 'inline-block' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <p style={{ padding: '0 20px 16px', fontSize: 14, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{a}</p>
      </div>
    </div>
  )
}

// ── Sections ───────────────────────────────────────────────────────────────────
function Overview({ user, myFunding, setActive, onFund }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2D6A4F 100%)`, borderRadius: 14, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome, {user.name.split(' ')[0]}!</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Explore waqf investment opportunities across Algeria's key regions.</div>
        </div>
        <GoldBtn onClick={() => setActive('register')}>Register Interest ←</GoldBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard label="My Applications"   value={myFunding.length} icon="file" />
        <StatCard label="Active"             value={myFunding.filter(r => r.status === 'مقبول').length} icon="money" accent={GREEN} />
        <StatCard label="Under Review"       value={myFunding.filter(r => r.status === 'قيد المراجعة').length} icon="inbox" accent="#F59E0B" />
        <StatCard label="Opportunities"      value={opportunities.length} icon="globe" accent="#3B82F6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <Card title="My Funding Applications">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <THead cols={['Ref', 'Project', 'Sector', 'Amount', 'Date', 'Status']} />
              <tbody>
                {myFunding.slice(0, 5).map(r => (
                  <TR key={r.id} cells={[
                    <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                    r.project, r.sector, r.amount, r.date,
                    <Badge key="b" status={r.status} />,
                  ]} />
                ))}
              </tbody>
            </table>
            {myFunding.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No applications yet</div>
            )}
          </div>
        </Card>

        <Card title="Opportunities by Region">
          {regions.map((r, i) => (
            <div key={r.name} style={{ padding: '12px 20px', borderBottom: i < regions.length - 1 ? '1px solid #F3F4F2' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: GREEN }}>{r.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: GOLD }}>{r.total}</span>
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.projects} projects · {r.investors} investors</div>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Featured Opportunities" action={() => setActive('browse')} actionLabel="Browse All ←">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: 20 }}>
          {opportunities.slice(0, 2).map(o => <OppCard key={o.id} opp={o} onFund={onFund} />)}
        </div>
      </Card>
    </div>
  )
}

function Register({ user, onSubmit }) {
  const [step, setStep] = useState(1)
  const [passport, setPassport] = useState({
    fullName:    user.name    || '',
    passportNo:  '',
    nationality: user.country || 'UAE',
    residence:   user.country || 'UAE',
    expiryDate:  '',
  })
  const [invest, setInvest] = useState({
    sector: user.sector || 'Commercial',
    range:  user.range  || '$ 50K – 100K',
    desc:   '',
  })

  const setP = k => e => setPassport(f => ({ ...f, [k]: e.target.value }))
  const setI = k => e => setInvest(f => ({ ...f, [k]: e.target.value }))

  const valid1 = passport.fullName && passport.passportNo && passport.expiryDate

  return (
    <Card title="تسجيل المستثمر الأجنبي — Foreign Investor Registration">
      <div style={{ padding: 24, maxWidth: 640 }}>
        <Stepper steps={['بيانات جواز السفر', 'معلومات الاستثمار']} current={step} />

        {step === 1 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="الاسم الكامل (كما في جواز السفر) — Full Name as in Passport">
                  <Input placeholder="Ibrahim Hassan" value={passport.fullName} onChange={setP('fullName')} />
                </Field>
              </div>
              <Field label="رقم جواز السفر — Passport No.">
                <Input placeholder="A12345678" value={passport.passportNo} onChange={setP('passportNo')} />
              </Field>
              <Field label="الجنسية — Nationality">
                <Select value={passport.nationality} onChange={setP('nationality')} options={COUNTRIES} />
              </Field>
              <Field label="بلد الإقامة — Country of Residence">
                <Select value={passport.residence} onChange={setP('residence')} options={COUNTRIES} />
              </Field>
              <Field label="تاريخ انتهاء صلاحية الجواز — Passport Expiry">
                <Input type="date" value={passport.expiryDate} onChange={setP('expiryDate')} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="صورة جواز السفر (اختياري) — Passport Scan (optional)">
                  <FileUpload id="passport-img" label="Click to upload passport image / PDF" />
                </Field>
              </div>
            </div>
            <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '12px 16px', margin: '4px 0 20px', fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
              Note: Your registration will be reviewed by the Diwan team within 5–7 business days.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <GoldBtn onClick={() => valid1 && setStep(2)}>التالي / Next →</GoldBtn>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="القطاع المفضل — Preferred Sector">
                <Select value={invest.sector} onChange={setI('sector')}
                  options={['Commercial', 'Agriculture', 'Education', 'Healthcare', 'Tourism', 'Mixed']} />
              </Field>
              <Field label="نطاق الاستثمار — Investment Range">
                <Select value={invest.range} onChange={setI('range')}
                  options={['$ 10K – 50K', '$ 50K – 100K', '$ 100K – 500K', '$ 500K – 1M', '$ 1M+']} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="أهداف الاستثمار — Investment Objective">
                  <Textarea placeholder="Describe your investment goals and expected contribution..." value={invest.desc} onChange={setI('desc')} rows={4} />
                </Field>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 4 }}>
              <OutlineBtn onClick={() => setStep(1)}>← Back / رجوع</OutlineBtn>
              <GoldBtn onClick={() => onSubmit({ ...passport, ...invest })}>إرسال / Submit Registration</GoldBtn>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

function MyFunding({ myFunding }) {
  return (
    <Card title={`My Funding Applications (${myFunding.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['Ref', 'Project', 'Sector', 'Amount', 'Date', 'Status', '']} />
          <tbody>
            {myFunding.map(r => (
              <TR key={r.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                  r.project, r.sector, r.amount, r.date,
                  <Badge key="b" status={r.status} />,
                ]}
                actions={[<OutlineBtn key="v" small onClick={() => {}}>Details</OutlineBtn>]}
              />
            ))}
          </tbody>
        </table>
        {myFunding.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>No applications yet</div>
        )}
      </div>
    </Card>
  )
}

function Settings({ user, onSave, showToast }) {
  const [form, setForm] = useState({ ...user })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const save = () => { onSave(form); showToast('Settings saved successfully') }
  return (
    <Card title="My Profile">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          <Field label="Full Name">    <Input value={form.name    || ''} onChange={set('name')}    /></Field>
          <Field label="Country">     <Select value={form.country || 'UAE'} onChange={set('country')} options={['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'UK', 'USA', 'France', 'Germany', 'Other']} /></Field>
          <Field label="Email">       <Input value={form.email   || ''} onChange={set('email')}   /></Field>
          <Field label="Phone">       <Input value={form.phone   || ''} onChange={set('phone')}   /></Field>
          <Field label="Sector">      <Select value={form.sector || 'Commercial'} onChange={set('sector')} options={['Commercial', 'Agriculture', 'Education', 'Healthcare', 'Tourism', 'Mixed']} /></Field>
          <Field label="Invest Range"><Select value={form.range || '$ 50K – 100K'} onChange={set('range')} options={['$ 10K – 50K', '$ 50K – 100K', '$ 100K – 500K', '$ 500K – 1M', '$ 1M+']} /></Field>
        </div>
        <div style={{ marginTop: 20 }}><GoldBtn onClick={save}>Save Changes</GoldBtn></div>
      </div>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Etrangers() {
  const { state, actions, showToast } = useStore()
  const [active, setActive]           = useState('overview')
  const [fundTarget, setFundTarget]   = useState(null)

  const user          = state.users.etrangers
  const myFunding     = state.foreignRequests.filter(r => r.investorKey === 'etrangers')
  const notifications = state.notifications
  const notifCount    = notifications.filter(n => !n.read).length

  const meta = {
    overview:    { title: 'Foreign Investor Portal', subtitle: 'Invest in Algerian waqf properties' },
    register:    { title: 'Register Interest',        subtitle: 'Submit your investor profile' },
    browse:      { title: 'Browse Opportunities',     subtitle: 'Explore available waqf properties' },
    'my-funding':{ title: 'My Funding',               subtitle: 'Track your applications' },
    faq:         { title: 'FAQ',                      subtitle: 'Answers to common questions' },
    contact:     { title: 'Contact Us',               subtitle: 'Get in touch with the international desk' },
    settings:    { title: 'My Profile',               subtitle: 'Manage your account' },
  }
  const { title, subtitle } = meta[active] || meta.overview

  const handleFundSubmit = (opp, amount, duration, desc) => {
    actions.submitForeign(
      user.name, 'etrangers',
      opp.id, opp.sector,
      `$ ${Number(amount).toLocaleString()}`,
      duration, desc,
    )
    showToast('Your application has been submitted — the Diwan team will review it shortly')
    setActive('my-funding')
  }

  const handleRegister = (form) => {
    actions.saveUser('etrangers', {
      ...user,
      name:        form.fullName || user.name,
      country:     form.residence || user.country,
      passportNo:  form.passportNo,
      nationality: form.nationality,
      expiryDate:  form.expiryDate,
      sector:      form.sector,
      range:       form.range,
    })
    showToast('Registration submitted — you will be contacted within 5 business days')
    setActive('overview')
  }

  return (
    <>
      <DashboardLayout
        navSections={navSections}
        user={user}
        active={active}
        onNavigate={setActive}
        title={title}
        subtitle={subtitle}
        dir="ltr"
        notifCount={notifCount}
        notifications={notifications}
        onMarkRead={actions.markRead}
        actions={active === 'browse' ? <GoldBtn onClick={() => {}}>Advanced Filter</GoldBtn> : null}
      >
        {active === 'overview'    && <Overview user={user} myFunding={myFunding} setActive={setActive} onFund={setFundTarget} />}
        {active === 'register'    && <Register user={user} onSubmit={handleRegister} />}
        {active === 'browse'      && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <input placeholder="Search opportunities..." style={{ width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #DDDFD9', fontSize: 14, outline: 'none', background: '#fff', color: GREEN }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {opportunities.map(o => <OppCard key={o.id} opp={o} onFund={setFundTarget} />)}
            </div>
          </div>
        )}
        {active === 'my-funding' && <MyFunding myFunding={myFunding} />}
        {active === 'faq'        && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD, marginBottom: 8 }}>Frequently Asked Questions</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: GREEN, margin: 0 }}>Foreign Investor FAQ</h2>
            </div>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        )}
        {active === 'contact' && (
          <div style={{ maxWidth: 600 }}>
            <Card title="Contact the International Desk">
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Full Name">   <Input placeholder="Ibrahim Hassan" onChange={() => {}} /></Field>
                  <Field label="Email">       <Input placeholder="i.hassan@example.com" type="email" onChange={() => {}} /></Field>
                  <Field label="Country">     <Input placeholder="UAE" onChange={() => {}} /></Field>
                  <Field label="Subject">     <Input placeholder="Investment inquiry" onChange={() => {}} /></Field>
                </div>
                <Field label="Message"><Textarea placeholder="Write your message here..." onChange={() => {}} rows={5} /></Field>
                <GoldBtn onClick={() => showToast('Message sent successfully')}>Send Message</GoldBtn>
              </div>
            </Card>
          </div>
        )}
        {active === 'settings' && <Settings user={user} onSave={p => actions.saveUser('etrangers', p)} showToast={showToast} />}
      </DashboardLayout>

      <FundModal opp={fundTarget} user={user} onClose={() => setFundTarget(null)} onSubmit={handleFundSubmit} />
    </>
  )
}
