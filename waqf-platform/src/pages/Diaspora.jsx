import { useState } from 'react'
import { useStore } from '../store/AppContext'
import DashboardLayout, {
  StatCard, Card, Badge, GoldBtn, OutlineBtn,
  TR, THead, Modal, Field, Input, Select, Textarea,
  ProgressBar, GOLD, GREEN,
} from '../components/DashboardLayout'

// ── Waqf type badge ────────────────────────────────────────────────────────────
function WaqfTypeBadge({ type }) {
  const isDaem = !type || type === 'دائم'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: isDaem ? '#D1FAE5' : '#FEF9C7',
      color: isDaem ? '#065F46' : '#854D0E',
      fontSize: 11, fontWeight: 600, padding: '3px 10px',
      borderRadius: 99, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDaem ? '#10B981' : GOLD }} />
      {type || 'دائم'}
    </span>
  )
}

// ── Static project catalogue ───────────────────────────────────────────────────
const projects = [
  { id: 'PRJ-001', name: 'مدرسة قرآنية — سيدي بلعباس', goal: 5000000, raised: 3200000, desc: 'بناء مدرسة قرآنية لـ 200 طفل في منطقة محرومة.', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
  { id: 'PRJ-002', name: 'مركز صحي — وهران',             goal: 12000000, raised: 7500000, desc: 'مركز صحي عصري يخدم 5 000 مواطن في الأحياء الشعبية.', img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80' },
  { id: 'PRJ-003', name: 'بئر ماء — الأغواط',            goal: 2000000,  raised: 1900000, desc: 'حفر بئر مائية لتأمين مياه الشرب لـ 500 أسرة.', img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80' },
]

const countries = [
  { country: 'فرنسا 🇫🇷',   donors: 142, total: '€ 2.1 م'    },
  { country: 'كندا 🇨🇦',     donors: 67,  total: 'CA$ 890 ألف' },
  { country: 'الإمارات 🇦🇪', donors: 89,  total: 'AED 1.4 م'  },
  { country: 'المملكة 🇸🇦',  donors: 51,  total: 'SAR 620 ألف' },
  { country: 'بلجيكا 🇧🇪',   donors: 33,  total: '€ 340 ألف'  },
]

const navSections = [
  {
    label: 'لوحتي',
    items: [
      { id: 'overview',  label: 'الرئيسية',        icon: 'dashboard', badge: 0 },
      { id: 'register',  label: 'إنشاء وقف جديد',  icon: 'plus',      badge: 0 },
      { id: 'my-waqfs',  label: 'أوقافي',          icon: 'building',  badge: 0 },
      { id: 'projects',  label: 'مشاريع للتمويل',  icon: 'globe',     badge: 0 },
    ],
  },
  {
    label: 'حسابي',
    items: [
      { id: 'settings', label: 'الإعدادات', icon: 'settings', badge: 0 },
    ],
  },
]

// ── Project card ───────────────────────────────────────────────────────────────
function ProjectCard({ proj, onFund }) {
  const pct = Math.round((proj.raised / proj.goal) * 100)
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${hov ? GOLD : '#EAEDE8'}`, boxShadow: hov ? '0 12px 36px rgba(27,67,50,0.12)' : '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.2s ease' }}
    >
      <img src={proj.img} alt={proj.name} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: GREEN, marginBottom: 6 }}>{proj.name}</div>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 14 }}>{proj.desc}</p>
        <ProgressBar pct={pct} label="التمويل" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 13, color: '#6B7280' }}><span className="num">{pct}%</span> من الهدف</div>
          <GoldBtn small onClick={() => onFund(proj)}>تمويل هذا المشروع</GoldBtn>
        </div>
      </div>
    </div>
  )
}

// ── Sections ───────────────────────────────────────────────────────────────────
function Overview({ user, contributions, setActive, onFund }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #2D6A4F 100%)`, borderRadius: 14, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>أهلاً {user.name.split(' ')[0]}!</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>مساهماتك تبني أوقافاً دائمة في الجزائر.</div>
        </div>
        <GoldBtn onClick={() => setActive('register')}>إنشاء وقف جديد ←</GoldBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard label="أوقافي"            value={contributions.length} icon="building" />
        <StatCard label="قيد المراجعة"      value={contributions.filter(r => r.status === 'قيد المراجعة').length} icon="inbox" accent="#F59E0B" />
        <StatCard label="مقبولة"            value={contributions.filter(r => r.status === 'مقبول').length} icon="check" accent={GREEN} />
        <StatCard label="المشاريع الممولة"  value="3" icon="globe" accent="#3B82F6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <Card title="مساهماتي الأخيرة">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <THead cols={['الرقم', 'النوع', 'الولاية', 'القيمة', 'التاريخ', 'الحالة']} />
              <tbody>
                {contributions.slice(0, 5).map(c => (
                  <TR key={c.id} cells={[
                    <span style={{ color: GOLD, fontWeight: 600 }}>{c.id}</span>,
                    c.type, c.wilaya || '—', c.value, c.date,
                    <Badge key="b" status={c.status} />,
                  ]} />
                ))}
              </tbody>
            </table>
            {contributions.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لم تقدّم أي مساهمات بعد</div>
            )}
          </div>
        </Card>

        <Card title="الجالية حسب البلد">
          {countries.map((c, i) => (
            <div key={c.country} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < countries.length - 1 ? '1px solid #F3F4F2' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: GREEN }}>{c.country}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{c.donors} متبرع</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{c.total}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card title="مشاريع تحتاج تمويلك" action={() => setActive('projects')} actionLabel="عرض الكل ←">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: 20 }}>
          {projects.slice(0, 2).map(p => <ProjectCard key={p.id} proj={p} onFund={onFund} />)}
        </div>
      </Card>
    </div>
  )
}

function Register({ user, onSubmit }) {
  const [form, setForm] = useState({
    name:             user.name,
    country:          user.country || 'فرنسا',
    type:             'أرض',
    wilaya:           'الجزائر العاصمة',
    value:            '',
    desc:             '',
    waqfType:         'دائم',
    waqfDuration:     '',
    waqfStartDate:    '',
    waqfBeneficiary:  '',
  })
  const [fatwaOpen, setFatwaOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(e2 => ({ ...e2, [k]: '' })) }

  const handleSubmit = () => {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'هذا الحقل مطلوب'
    if (!form.value.trim()) errs.value = 'هذا الحقل مطلوب'
    if (!form.desc.trim())  errs.desc  = 'هذا الحقل مطلوب'
    if (form.waqfType === 'مؤقت' && !form.waqfDuration) errs.waqfDuration = 'هذا الحقل مطلوب'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    onSubmit(form)
    setForm(f => ({ ...f, value: '', desc: '', waqfDuration: '', waqfStartDate: '', waqfBeneficiary: '' }))
  }

  return (
    <Card title="تسجيل وقف جديد">
      <div style={{ padding: 24, maxWidth: 640 }}>
        {/* Basic waqf fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="اسمك الكامل">
            <Input placeholder="الاسم واللقب" value={form.name} onChange={set('name')} />
          </Field>
          <Field label="بلد الإقامة">
            <Select value={form.country} onChange={set('country')}
              options={['فرنسا', 'كندا', 'الإمارات', 'المملكة العربية السعودية', 'بلجيكا', 'ألمانيا', 'إيطاليا', 'بريطانيا']} />
          </Field>
          <Field label="الولاية الوقفية">
            <Select value={form.wilaya} onChange={set('wilaya')}
              options={['الجزائر العاصمة', 'وهران', 'قسنطينة', 'سيدي بلعباس', 'تلمسان', 'الأغواط']} />
          </Field>
          <Field label="نوع الملك الموقوف">
            <Select value={form.type} onChange={set('type')}
              options={['أرض', 'عقار', 'فلاحي', 'تجاري', 'تعليمي', 'صحي', 'نقدي']} />
          </Field>
          <Field label="القيمة التقديرية (€)">
            <Input placeholder="مثال: 45000" type="number" value={form.value} onChange={set('value')} style={errors.value ? { borderColor: '#EF4444' } : {}} />
            {errors.value && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.value}</div>}
          </Field>
        </div>
        <Field label="وصف الوقف">
          <Textarea placeholder="اكتب وصفاً مفصلاً للملك الموقوف ومقره وغرضه..." value={form.desc} onChange={set('desc')} rows={4} />
          {errors.desc && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.desc}</div>}
        </Field>

        {/* Waqf type selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: GREEN, marginBottom: 10 }}>نوع الوقف</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['دائم', 'مؤقت'].map(wt => (
              <button
                key={wt}
                type="button"
                onClick={() => setForm(f => ({ ...f, waqfType: wt }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${form.waqfType === wt ? (wt === 'دائم' ? GREEN : GOLD) : '#E5E7EB'}`,
                  background: form.waqfType === wt ? (wt === 'دائم' ? `${GREEN}10` : `${GOLD}12`) : '#fff',
                  fontSize: 14, fontWeight: 600,
                  color: form.waqfType === wt ? (wt === 'دائم' ? GREEN : GOLD) : '#6B7280',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${form.waqfType === wt ? (wt === 'دائم' ? GREEN : GOLD) : '#D1D5DB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {form.waqfType === wt && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: wt === 'دائم' ? GREEN : GOLD }} />
                  )}
                </span>
                وقف {wt}
              </button>
            ))}
          </div>
        </div>

        {/* Temporary waqf extra fields + fatwa */}
        {form.waqfType === 'مؤقت' && (
          <div style={{ marginBottom: 20, padding: 16, background: `${GOLD}08`, borderRadius: 10, border: `1px solid ${GOLD}30` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
              <Field label="مدة الوقف (سنوات)">
                <Input type="number" placeholder="مثال: 10" value={form.waqfDuration} onChange={set('waqfDuration')} />
                {errors.waqfDuration && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.waqfDuration}</div>}
              </Field>
              <Field label="تاريخ بداية الوقف">
                <Input type="date" value={form.waqfStartDate} onChange={set('waqfStartDate')} />
              </Field>
            </div>
            <Field label="الجهة المستفيدة خلال المدة">
              <Input placeholder="مثال: مدرسة قرآنية، دار أيتام، مركز صحي..." value={form.waqfBeneficiary} onChange={set('waqfBeneficiary')} />
            </Field>

            {/* Fatwa box — official text */}
            <div style={{ background: '#F0F7F4', borderRight: `3px solid ${GOLD}`, borderRadius: 12, padding: '20px 24px', marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>السند الشرعي والقانوني للوقف المؤقت</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.85, margin: '0 0 14px', direction: 'rtl' }}>
                أقرّ قانون الأوقاف الجزائري الجديد رقم 25-06 الوقف المؤقت لأول مرة، آخذاً بمذهب الإمام مالك الذي يجيز تحديد مدة للوقف.
              </p>
              <button
                type="button"
                onClick={() => setFatwaOpen(o => !o)}
                style={{ fontSize: 13, color: GOLD, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ textDecoration: 'underline' }}>{fatwaOpen ? 'إخفاء التفاصيل' : 'اقرأ الفتوى كاملة'}</span>
                <span style={{ transform: fatwaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', display: 'inline-block', fontSize: 11 }}>▾</span>
              </button>
              <div style={{ maxHeight: fatwaOpen ? 1400 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                <div style={{ paddingTop: 16, borderTop: `1px dashed ${GOLD}50`, marginTop: 14, direction: 'rtl' }}>

                  {/* أولاً */}
                  <p style={{ fontSize: 15, fontWeight: 600, color: GREEN, marginBottom: 10 }}>أولاً: قانون الأوقاف الجزائري الجديد رقم 25-06</p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, marginBottom: 10 }}>
                    صدر القانون رقم 25-06 المؤرخ في 23 محرم 1447هـ الموافق 19 يوليو 2025م المتعلق بالأوقاف، في الجريدة الرسمية العدد 47، وألغى الأحكام السابقة التي كانت تشترط التأبيد.
                  </p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, marginBottom: 10 }}>وأعاد القانون تعريف الوقف رسمياً على النحو التالي:</p>
                  <div style={{ borderRight: `3px solid ${GOLD}`, background: `${GOLD}0A`, borderRadius: '0 8px 8px 0', padding: '12px 16px', margin: '0 0 12px' }}>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, fontStyle: 'italic', margin: 0 }}>
                      "الوقف هو حبس مال عن التملك بصفة مؤبدة أو مؤقتة، والتصدق بالمنفعة على وجه من وجوه البر والخير العامة أو الخاصة أو المشتركة."
                    </p>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, marginBottom: 8 }}>وأقرّ المشرّع الجزائري لأول مرة ثلاثة مستجدات رئيسية:</p>
                  <ol style={{ fontSize: 13, color: '#374151', lineHeight: 1.9, paddingRight: 18, marginBottom: 18 }}>
                    <li style={{ marginBottom: 6 }}><strong style={{ color: GREEN }}>الوقف المؤقت:</strong> يمكن وقف العقار أو المال لمدة محددة (كخمس أو عشر سنوات) تعود بعدها العين لملك الواقف أو ورثته.</li>
                    <li style={{ marginBottom: 6 }}>الوقف المشترك.</li>
                    <li>الوقف الخاص.</li>
                  </ol>

                  {/* ثانياً */}
                  <p style={{ fontSize: 15, fontWeight: 600, color: GREEN, marginBottom: 10 }}>ثانياً: السند الفقهي والفتوى المعتمدة</p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85, marginBottom: 10 }}>استند القانون الجديد على مرجعيتين أساسيتين:</p>
                  <ul style={{ fontSize: 13, color: '#374151', lineHeight: 1.9, paddingRight: 18, marginBottom: 14 }}>
                    <li style={{ marginBottom: 10 }}>
                      <strong style={{ color: GREEN }}>المذهب المالكي (المرجعية الفقهية الرسمية للجزائر):</strong> يجيز السادة المالكية تأقيت الوقف، باعتباره تبرعاً بالمنفعة لا بالرقبة، والمنفعة يجوز تمليكها مؤقتاً كالإجارة والعارية.
                    </li>
                    <li>
                      <strong style={{ color: GREEN }}>مجمع الفقه الإسلامي الدولي (القرار رقم 139، الدورة 15):</strong> "يجوز التوقيت في الوقف لزمن معين أو بإنهاء غرض محدد، وينتهي الوقف بانتهاء المدة."
                    </li>
                  </ul>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.85 }}>
                    وبهذا التشريع، انضمت الجزائر رسمياً إلى الدول الإسلامية التي فتحت الباب للوقف المؤقت (مصر، الكويت، الإمارات) كأداة مرنة لتفعيل الدور التنموي والاقتصادي للأملاك الوقفية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#991B1B', fontSize: 13 }}>
            يرجى تعبئة جميع الحقول المطلوبة
          </div>
        )}
        <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
          ملاحظة: سيتم مراجعة طلبك من قبل فريق الديوان الوطني خلال 5-7 أيام عمل.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <GoldBtn onClick={handleSubmit}>إرسال الطلب</GoldBtn>
          <OutlineBtn onClick={() => {}}>حفظ مسودة</OutlineBtn>
        </div>
      </div>
    </Card>
  )
}

function MyWaqfs({ contributions }) {
  return (
    <Card title={`أوقافي المسجّلة (${contributions.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['الرقم', 'النوع', 'الولاية', 'القيمة', 'نوع الوقف', 'التاريخ', 'الحالة', '']} />
          <tbody>
            {contributions.map(c => (
              <TR key={c.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{c.id}</span>,
                  c.type, c.wilaya || '—', c.value,
                  <WaqfTypeBadge key="wt" type={c.waqfType} />,
                  c.date,
                  <Badge key="b" status={c.status} />,
                ]}
                actions={[<OutlineBtn key="v" small onClick={() => {}}>التفاصيل</OutlineBtn>]}
              />
            ))}
          </tbody>
        </table>
        {contributions.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>لم تسجّل أي أوقاف بعد</div>
        )}
      </div>
    </Card>
  )
}

// ── Fund project modal ─────────────────────────────────────────────────────────
function FundModal({ proj, onClose }) {
  if (!proj) return null
  return (
    <Modal title={`تمويل — ${proj.name}`} open={!!proj} onClose={onClose}>
      <div style={{ background: `${GREEN}08`, borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>{proj.name}</div>
        <ProgressBar pct={Math.round((proj.raised / proj.goal) * 100)} label="تقدم التمويل" />
      </div>
      <Field label="مبلغ التبرع (€)">  <Input placeholder="مثال: 5000" type="number" onChange={() => {}} /></Field>
      <Field label="طريقة الدفع">      <Select options={['تحويل بنكي', 'PayPal', 'بطاقة ائتمانية']} onChange={() => {}} /></Field>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <OutlineBtn onClick={onClose}>إلغاء</OutlineBtn>
        <GoldBtn onClick={onClose}>تأكيد التبرع</GoldBtn>
      </div>
    </Modal>
  )
}

function Settings({ user, onSave, showToast }) {
  const [form, setForm] = useState({ ...user })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const save = () => { onSave(form); showToast('تم حفظ التغييرات') }
  return (
    <Card title="ملفي الشخصي">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          <Field label="الاسم الكامل">     <Input value={form.name    || ''} onChange={set('name')}    /></Field>
          <Field label="بلد الإقامة">      <Select value={form.country || 'فرنسا'} onChange={set('country')} options={['فرنسا', 'كندا', 'الإمارات', 'المملكة العربية السعودية', 'بلجيكا']} /></Field>
          <Field label="البريد الإلكتروني"><Input value={form.email   || ''} onChange={set('email')}   /></Field>
          <Field label="رقم الهاتف">       <Input value={form.phone   || ''} onChange={set('phone')}   /></Field>
        </div>
        <div style={{ marginTop: 20 }}><GoldBtn onClick={save}>حفظ التغييرات</GoldBtn></div>
      </div>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Diaspora() {
  const { state, actions, showToast } = useStore()
  const [active, setActive]           = useState('overview')
  const [fundTarget, setFundTarget]   = useState(null)

  const user          = state.users.diaspora
  const contributions = state.diasporaRequests.filter(r => r.donorKey === 'diaspora')
  const notifications = state.notifications
  const notifCount    = notifications.filter(n => !n.read).length

  const meta = {
    overview:   { title: 'لوحة المغترب',     subtitle: 'ادعم الأوقاف وابنِ مستقبلاً مستداماً' },
    register:   { title: 'إنشاء وقف جديد',   subtitle: 'سجّل وقفاً جديداً للمراجعة' },
    'my-waqfs': { title: 'أوقافي',            subtitle: 'مساهماتك الوقفية المسجّلة' },
    projects:   { title: 'مشاريع للتمويل',    subtitle: 'مشاريع تحتاج مساهمتك' },
    settings:   { title: 'الإعدادات',          subtitle: 'إعدادات حسابك' },
  }
  const { title, subtitle } = meta[active] || meta.overview

  const handleRegister = (form) => {
    const flags = { 'فرنسا': '🇫🇷', 'كندا': '🇨🇦', 'الإمارات': '🇦🇪', 'المملكة العربية السعودية': '🇸🇦', 'بلجيكا': '🇧🇪', 'ألمانيا': '🇩🇪', 'إيطاليا': '🇮🇹', 'بريطانيا': '🇬🇧' }
    const countryLabel = `${form.country} ${flags[form.country] || '🌍'}`
    actions.submitDiaspora(
      form.name, 'diaspora',
      countryLabel,
      form.type, form.wilaya,
      `€ ${Number(form.value).toLocaleString()}`,
      form.desc,
      form.waqfType,
      form.waqfDuration,
      form.waqfStartDate,
      form.waqfBeneficiary,
    )
    showToast('تم إرسال طلبك بنجاح — سيتم مراجعته من قبل الديوان')
    setActive('my-waqfs')
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
        actions={active === 'overview' ? <GoldBtn onClick={() => setActive('register')}>+ إنشاء وقف</GoldBtn> : null}
      >
        {active === 'overview'  && <Overview user={user} contributions={contributions} setActive={setActive} onFund={setFundTarget} />}
        {active === 'register'  && <Register user={user} onSubmit={handleRegister} />}
        {active === 'my-waqfs'  && <MyWaqfs contributions={contributions} />}
        {active === 'projects'  && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {projects.map(p => <ProjectCard key={p.id} proj={p} onFund={setFundTarget} />)}
          </div>
        )}
        {active === 'settings' && <Settings user={user} onSave={p => actions.saveUser('diaspora', p)} showToast={showToast} />}
      </DashboardLayout>

      <FundModal proj={fundTarget} onClose={() => setFundTarget(null)} />
    </>
  )
}
