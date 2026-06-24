import { useState } from 'react'
import { useStore } from '../store/AppContext'
import DashboardLayout, {
  StatCard, Card, Badge, GoldBtn, OutlineBtn,
  TR, THead, Modal, Field, Input, Select, Textarea,
  ProgressBar, Stepper, GOLD, GREEN,
} from '../components/DashboardLayout'

// ── Algerian wilayas ──────────────────────────────────────────────────────────
const WILAYAS = ['الجزائر العاصمة','وهران','قسنطينة','سطيف','الأغواط','أم البواقي','باتنة','بجاية','بشار','البليدة','البويرة','تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجلفة','جيجل','سيدي بلعباس','سكيكدة','عنابة','قالمة','المدية','مسيلة','معسكر','مستغانم','ميلة','النعامة','برج بوعريريج','بومرداس','الطارف','تيندوف','تيسمسيلت','الوادي','خنشلة','سوق أهراس','تيبازة','المنيعة','عين الدفلى','عين تيموشنت','غرداية','غليزان']

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

// ── Static opportunity catalogue ───────────────────────────────────────────────
const opportunities = [
  {
    id: 'WQF-001', name: 'أرض وقفية — حيدرة',
    sector: 'تجاري', wilaya: 'الجزائر العاصمة',
    minAmount: '5 000 000 دج', duration: '10 سنوات',
    goal: 15000000, raised: 9000000,
    desc: 'أرض استراتيجية في قلب حيدرة تصلح لإنشاء مجمع تجاري ومكتبي متكامل.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
  },
  {
    id: 'WQF-004', name: 'مزرعة وقفية — قسنطينة',
    sector: 'فلاحي', wilaya: 'قسنطينة',
    minAmount: '2 000 000 دج', duration: '15 سنة',
    goal: 8000000, raised: 3200000,
    desc: 'مزرعة وقفية واسعة مزودة بنظام ري حديث. مناسبة لمشاريع الزراعة المستدامة.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  },
  {
    id: 'WQF-006', name: 'سوق قديم — تلمسان',
    sector: 'تجاري', wilaya: 'تلمسان',
    minAmount: '8 000 000 دج', duration: '20 سنة',
    goal: 20000000, raised: 14000000,
    desc: 'سوق تاريخي في قلب المدينة القديمة. فرصة استثمارية نادرة بعائد سياحي مرتفع.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  },
]

const navSections = [
  {
    label: 'لوحتي',
    items: [
      { id: 'overview',      label: 'الرئيسية',       icon: 'dashboard', badge: 0 },
      { id: 'register',      label: 'تسجيل الهوية',   icon: 'file',      badge: 0 },
      { id: 'opportunities', label: 'الفرص المتاحة',  icon: 'building',  badge: 0 },
      { id: 'my-offers',     label: 'عروضي',          icon: 'inbox',     badge: 0 },
      { id: 'contracts',     label: 'عقودي',          icon: 'edit',      badge: 0 },
    ],
  },
  {
    label: 'حسابي',
    items: [
      { id: 'settings', label: 'الإعدادات', icon: 'settings', badge: 0 },
    ],
  },
]

// ── Registration wizard (2 steps) ─────────────────────────────────────────────
function RegisterSection({ user, onSubmit }) {
  const [step, setStep] = useState(1)
  const [personal, setPersonal] = useState({
    name:      user.name  || '',
    nin:       '',
    dob:       '',
    pob:       '',
    wilaya:    'الجزائر العاصمة',
    baladiya:  '',
    phone:     user.phone || '',
    email:     user.email || '',
  })
  const [biz, setBiz] = useState({ register: '', sector: '' })

  const setP = k => e => setPersonal(f => ({ ...f, [k]: e.target.value }))
  const setB = k => e => setBiz(f => ({ ...f, [k]: e.target.value }))

  const valid1 = personal.name && personal.nin && personal.phone && personal.email

  return (
    <Card title="تسجيل المستثمر المحلي — بيانات الهوية">
      <div style={{ padding: 24, maxWidth: 640 }}>
        <Stepper steps={['البيانات الشخصية', 'بيانات الاستثمار']} current={step} />

        {step === 1 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="الاسم واللقب">
                  <Input placeholder="يوسف بن حمزة" value={personal.name} onChange={setP('name')} />
                </Field>
              </div>
              <Field label="رقم التعريف الوطني (NIN) — رقم الهوية">
                <Input placeholder="رقم الهوية الوطنية" value={personal.nin} onChange={setP('nin')} />
              </Field>
              <Field label="تاريخ الميلاد">
                <Input type="date" value={personal.dob} onChange={setP('dob')} />
              </Field>
              <Field label="مكان الميلاد">
                <Input placeholder="مثال: وهران" value={personal.pob} onChange={setP('pob')} />
              </Field>
              <Field label="الولاية">
                <Select value={personal.wilaya} onChange={setP('wilaya')} options={WILAYAS} />
              </Field>
              <Field label="البلدية">
                <Input placeholder="اسم البلدية" value={personal.baladiya} onChange={setP('baladiya')} />
              </Field>
              <Field label="رقم الهاتف">
                <Input placeholder="+213 55 XX XX XX" value={personal.phone} onChange={setP('phone')} />
              </Field>
              <Field label="البريد الإلكتروني">
                <Input type="email" placeholder="example@mail.com" value={personal.email} onChange={setP('email')} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="صورة بطاقة الهوية (اختياري)">
                  <FileUpload id="id-card-inv" label="انقر لرفع صورة بطاقة الهوية الوطنية" />
                </Field>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <GoldBtn onClick={() => valid1 && setStep(2)}>التالي ←</GoldBtn>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="رقم السجل التجاري">
                <Input placeholder="مثال: RC 16/00-12345" value={biz.register} onChange={setB('register')} />
              </Field>
              <Field label="القطاع الاستثماري">
                <Select value={biz.sector} onChange={setB('sector')}
                  options={['تجاري', 'فلاحي', 'تعليمي', 'صحي', 'صناعي', 'خدمات', 'أخرى']} />
              </Field>
            </div>
            <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '12px 16px', margin: '4px 0 20px', fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
              ملاحظة: سيتم مراجعة طلبك من قبل فريق الديوان الوطني خلال 5-7 أيام عمل.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <OutlineBtn onClick={() => setStep(1)}>← رجوع</OutlineBtn>
              <GoldBtn onClick={() => onSubmit({ ...personal, ...biz })}>إرسال التسجيل</GoldBtn>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

// ── Opportunity card ───────────────────────────────────────────────────────────
function OpportunityCard({ opp, onApply }) {
  const pct = Math.round((opp.raised / opp.goal) * 100)
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', borderRadius: 12,
        border: `1.5px solid ${hov ? GOLD : '#EAEDE8'}`,
        boxShadow: hov ? '0 12px 36px rgba(27,67,50,0.12)' : '0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <img src={opp.img} alt={opp.name} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: GREEN, marginBottom: 3 }}>{opp.name}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{opp.wilaya} · {opp.sector}</div>
          </div>
          <span style={{ background: `${GOLD}18`, color: GOLD, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{opp.duration}</span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 14, marginTop: 8 }}>{opp.desc}</p>
        <ProgressBar pct={pct} label={`الحد الأدنى: ${opp.minAmount}`} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>تم جمع</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: GREEN }}><span className="num">{(opp.raised / 1000000).toFixed(1)}</span> مليون دج</div>
          </div>
          <GoldBtn onClick={() => onApply(opp)}>تقديم عرض ←</GoldBtn>
        </div>
      </div>
    </div>
  )
}

// ── Apply modal ────────────────────────────────────────────────────────────────
function ApplyModal({ opp, user, onClose, onSubmit }) {
  const [amount, setAmount]     = useState('')
  const [duration, setDuration] = useState('10 سنوات')
  const [desc, setDesc]         = useState('')
  const [errors, setErrors]     = useState({})

  const handleSubmit = () => {
    const errs = {}
    if (!amount)       errs.amount = 'هذا الحقل مطلوب'
    if (!desc.trim())  errs.desc   = 'هذا الحقل مطلوب'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    onSubmit(opp, amount, duration, desc)
    setAmount(''); setDuration('10 سنوات'); setDesc('')
    onClose()
  }

  if (!opp) return null
  return (
    <Modal title={`تقديم عرض — ${opp.name}`} open={!!opp} onClose={onClose} width={540}>
      <div style={{ background: `${GREEN}08`, borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>{opp.name}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{opp.wilaya} · {opp.sector} · مدة: {opp.duration}</div>
      </div>
      {Object.keys(errors).length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#991B1B', fontSize: 13 }}>
          يرجى تعبئة جميع الحقول المطلوبة
        </div>
      )}
      <Field label="مبلغ الاستثمار (دج) *">
        <Input placeholder="مثال: 10000000" value={amount} onChange={e => { setAmount(e.target.value); setErrors(er => ({ ...er, amount: '' })) }} type="number" />
        {errors.amount && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.amount}</div>}
      </Field>
      <Field label="مدة العقد المقترحة">
        <Select value={duration} onChange={e => setDuration(e.target.value)}
          options={['5 سنوات', '10 سنوات', '15 سنة', '20 سنة', '25 سنة']} />
      </Field>
      <Field label="وصف مشروعك الاستثماري *">
        <Textarea placeholder="اشرح مشروعك، أهدافك، والقيمة المضافة..." value={desc} onChange={e => { setDesc(e.target.value); setErrors(er => ({ ...er, desc: '' })) }} />
        {errors.desc && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.desc}</div>}
      </Field>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
        <OutlineBtn onClick={onClose}>إلغاء</OutlineBtn>
        <GoldBtn onClick={handleSubmit}>إرسال العرض</GoldBtn>
      </div>
    </Modal>
  )
}

// ── Sections ───────────────────────────────────────────────────────────────────
function Overview({ user, myOffers, setActive, onApply }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2D6A4F 100%)`, borderRadius: 14, padding: '24px 28px', color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>مرحباً {user.name.split(' ')[0]}!</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>تصفّح الفرص الوقفية المتاحة وابدأ رحلتك الاستثمارية اليوم.</div>
        </div>
        <GoldBtn onClick={() => setActive('opportunities')}>استعرض الفرص ←</GoldBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard label="عروضي المقدّمة"  value={myOffers.length} icon="file" />
        <StatCard label="عقود نشطة"        value={myOffers.filter(r => r.status === 'مقبول').length} icon="edit" accent={GREEN} />
        <StatCard label="قيد المراجعة"     value={myOffers.filter(r => r.status === 'قيد المراجعة').length} icon="inbox" accent="#F59E0B" />
        <StatCard label="مرفوضة"           value={myOffers.filter(r => r.status === 'مرفوض').length} icon="x" accent="#EF4444" />
      </div>

      <Card title="أبرز الفرص المتاحة" action={() => setActive('opportunities')} actionLabel="عرض الكل ←">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: '20px 20px' }}>
          {opportunities.slice(0, 2).map(o => <OpportunityCard key={o.id} opp={o} onApply={onApply} />)}
        </div>
      </Card>
    </div>
  )
}

function Opportunities({ onApply }) {
  const [search, setSearch] = useState('')
  const filtered = opportunities.filter(o => o.name.includes(search) || o.wilaya.includes(search) || o.sector.includes(search))
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <input placeholder="ابحث عن فرصة..." value={search} onChange={e => setSearch(e.target.value)} dir="rtl"
          style={{ width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #DDDFD9', fontSize: 14, outline: 'none', background: '#fff', color: GREEN }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {filtered.map(o => <OpportunityCard key={o.id} opp={o} onApply={onApply} />)}
      </div>
    </div>
  )
}

function MyOffers({ offers }) {
  return (
    <Card title={`عروضي المقدّمة (${offers.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['رقم العرض', 'الملك', 'القطاع', 'المبلغ', 'التاريخ', 'الحالة', '']} />
          <tbody>
            {offers.map(r => (
              <TR key={r.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                  r.property, r.sector, r.amount, r.date,
                  <Badge key="b" status={r.status} />,
                ]}
                actions={[<OutlineBtn key="v" small onClick={() => {}}>التفاصيل</OutlineBtn>]}
              />
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>لم تقدّم أي عروض بعد</div>
        )}
      </div>
    </Card>
  )
}

function Settings({ user, onSave, showToast }) {
  const [form, setForm] = useState({ ...user })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const save = () => { onSave(form); showToast('تم حفظ التغييرات') }
  return (
    <Card title="ملف المستثمر">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          <Field label="الاسم الكامل">     <Input value={form.name  || ''} onChange={set('name')}  /></Field>
          <Field label="الدور">             <Input value={form.role  || ''} onChange={set('role')}  /></Field>
          <Field label="البريد الإلكتروني"><Input value={form.email || ''} onChange={set('email')} /></Field>
          <Field label="رقم الهاتف">       <Input value={form.phone || ''} onChange={set('phone')} /></Field>
        </div>
        <div style={{ marginTop: 20 }}><GoldBtn onClick={save}>حفظ التغييرات</GoldBtn></div>
      </div>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Investisseurs() {
  const { state, actions, showToast } = useStore()
  const [active, setActive]           = useState('overview')
  const [applyTarget, setApplyTarget] = useState(null)

  const user          = state.users.investisseur
  const myOffers      = state.investmentRequests.filter(r => r.investorKey === 'investisseur')
  const notifications = state.notifications
  const notifCount    = notifications.filter(n => !n.read).length

  const meta = {
    overview:      { title: 'لوحة المستثمر',  subtitle: 'نظرة عامة على نشاطك الاستثماري' },
    register:      { title: 'تسجيل الهوية',   subtitle: 'أدخل بياناتك الشخصية ومعلومات الاستثمار' },
    opportunities: { title: 'الفرص المتاحة',  subtitle: 'اكتشف الأملاك الوقفية المطروحة للاستثمار' },
    'my-offers':   { title: 'عروضي',           subtitle: 'تتبّع حالة عروضك المقدّمة' },
    contracts:     { title: 'عقودي',           subtitle: 'عقود الاستثمار المبرمة' },
    settings:      { title: 'الإعدادات',       subtitle: 'إعدادات حسابك' },
  }
  const { title, subtitle } = meta[active] || meta.overview

  const handleRegister = (form) => {
    actions.saveUser('investisseur', {
      ...user,
      name:     form.name,
      nin:      form.nin,
      dob:      form.dob,
      pob:      form.pob,
      wilaya:   form.wilaya,
      baladiya: form.baladiya,
      phone:    form.phone,
      email:    form.email,
      register: form.register,
      sector:   form.sector,
    })
    showToast('تم إرسال بيانات التسجيل — سيتم التحقق منها خلال 5-7 أيام عمل')
    setActive('overview')
  }

  const handleSubmit = (opp, amount, duration, desc) => {
    actions.submitInvestment(
      user.name, 'investisseur',
      opp.id, opp.sector,
      `${Number(amount).toLocaleString('ar')} دج`,
      duration, desc,
    )
    showToast('تم إرسال طلبك بنجاح — سيتم مراجعته من قبل الديوان')
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
        notifCount={notifCount}
        notifications={notifications}
        onMarkRead={actions.markRead}
      >
        {active === 'overview'      && <Overview user={user} myOffers={myOffers} setActive={setActive} onApply={setApplyTarget} />}
        {active === 'register'      && <RegisterSection user={user} onSubmit={handleRegister} />}
        {active === 'opportunities' && <Opportunities onApply={setApplyTarget} />}
        {active === 'my-offers'     && <MyOffers offers={myOffers} />}
        {active === 'contracts'     && (
          <Card title="عقودي">
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ fontSize: 16, color: GREEN, fontWeight: 600, marginBottom: 6 }}>لا توجد عقود نشطة</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>ستظهر عقودك هنا بعد قبول عروضك</div>
            </div>
          </Card>
        )}
        {active === 'settings' && <Settings user={user} onSave={p => actions.saveUser('investisseur', p)} showToast={showToast} />}
      </DashboardLayout>

      <ApplyModal opp={applyTarget} user={user} onClose={() => setApplyTarget(null)} onSubmit={handleSubmit} />
    </>
  )
}
