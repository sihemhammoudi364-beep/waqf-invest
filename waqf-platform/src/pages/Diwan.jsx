import { useState } from 'react'
import { useStore } from '../store/AppContext'
import DashboardLayout, {
  StatCard, Card, Badge, GoldBtn, OutlineBtn,
  TR, THead, Modal, Field, Input, Select, Textarea,
  GOLD, GREEN,
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

// ── Bar chart ──────────────────────────────────────────────────────────────────
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
const MAX_V  = 30

function BarChart({ investCount }) {
  const values = [14, 18, 22, 17, 25, investCount > 0 ? 30 + investCount : 30]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110, padding: '8px 0 0' }}>
      {MONTHS.map((m, i) => (
        <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: '100%',
            height: Math.round((values[i] / Math.max(...values)) * 88),
            background: i === MONTHS.length - 1 ? GOLD : `${GREEN}55`,
            borderRadius: '4px 4px 0 0', minHeight: 6,
          }} />
          <span style={{ fontSize: 9, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{m}</span>
        </div>
      ))}
    </div>
  )
}

// ── Sections ───────────────────────────────────────────────────────────────────
function Overview({ waqfProperties, investmentRequests, diasporaRequests, foreignRequests }) {
  const pendingAll = [
    ...investmentRequests.filter(r => r.status === 'قيد المراجعة'),
    ...diasporaRequests.filter(r => r.status === 'قيد المراجعة'),
    ...foreignRequests.filter(r => r.status === 'قيد المراجعة'),
  ]

  const recentActivity = [
    ...(investmentRequests.slice(0, 2).map(r => ({ text: `طلب استثمار جديد من ${r.investor}`, time: r.date, dot: GOLD }))),
    ...(diasporaRequests.slice(0, 2).map(r => ({ text: `طلب وقف جديد من ${r.donor}`, time: r.date, dot: GREEN }))),
  ].slice(0, 4)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard label="إجمالي الأملاك"   value={waqfProperties.length} sub="ملكاً وقفياً"    icon="building" />
        <StatCard label="استثمارات نشطة"   value={investmentRequests.filter(r => r.status === 'مقبول').length} sub="عقداً سارياً" icon="money" accent={GREEN} />
        <StatCard label="طلبات معلّقة"     value={pendingAll.length} sub="تنتظر المراجعة"  icon="inbox"    accent="#F59E0B" />
        <StatCard label="إجمالي الطلبات"   value={investmentRequests.length + diasporaRequests.length + foreignRequests.length} sub="طلب مسجّل" icon="chart" accent="#3B82F6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <Card title="طلبات الاستثمار الشهرية">
          <div style={{ padding: '12px 20px 20px' }}>
            <BarChart investCount={investmentRequests.filter(r => r.date.includes('يونيو')).length} />
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>المقارنة الشهرية — 2026</p>
          </div>
        </Card>
        <Card title="أحدث النشاطات">
          <div>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 20px', borderBottom: i < recentActivity.length - 1 ? '1px solid #F3F4F2' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, marginTop: 4, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, color: GREEN, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد أنشطة بعد</div>
            )}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <Card title="أحدث الأملاك الوقفية">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <THead cols={['المرجع', 'الولاية', 'الحالة']} />
              <tbody>
                {waqfProperties.slice(0, 4).map(p => (
                  <TR key={p.id} cells={[p.id, p.wilaya, <Badge key="b" status={p.status} />]} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="أحدث طلبات الاستثمار">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <THead cols={['المستثمر', 'المبلغ', 'الحالة']} />
              <tbody>
                {investmentRequests.slice(0, 4).map(r => (
                  <TR key={r.id} cells={[r.investor, r.amount, <Badge key="b" status={r.status} />]} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function PropertyDetailModal({ prop, onClose }) {
  if (!prop) return null
  const pct = prop.fundingGoal > 0 ? Math.round((prop.fundingRaised / prop.fundingGoal) * 100) : 0
  const fmt = n => (n || 0).toLocaleString('fr-DZ') + ' دج'
  return (
    <Modal title={`تفاصيل الملك — ${prop.id}`} open={!!prop} onClose={onClose} width={520}>
      <div style={{ background: `${GREEN}06`, borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: GREEN, marginBottom: 6 }}>{prop.name}</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>📍 {prop.wilaya}</span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>📐 <span className="num">{prop.surface}</span></span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>🏷️ {prop.type}</span>
        </div>
      </div>
      {prop.desc && <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>{prop.desc}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#F9FAF8', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>هدف التمويل</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}><span className="num">{prop.fundingGoal > 0 ? fmt(prop.fundingGoal) : '—'}</span></div>
        </div>
        <div style={{ background: '#F9FAF8', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>المُجمَّع</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}><span className="num">{prop.fundingRaised > 0 ? fmt(prop.fundingRaised) : '—'}</span></div>
        </div>
      </div>
      {prop.fundingGoal > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
            <span>نسبة التمويل</span><span style={{ fontWeight: 700, color: GREEN }}><span className="num">{pct}%</span></span>
          </div>
          <div style={{ height: 8, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${GREEN}, ${GOLD})`, borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge status={prop.status} />
        <OutlineBtn onClick={onClose}>إغلاق</OutlineBtn>
      </div>
    </Modal>
  )
}

function Properties({ properties, onAdd }) {
  const [filter, setFilter] = useState('الكل')
  const [selected, setSelected] = useState(null)
  const types = ['الكل', 'أرض', 'عقار', 'فلاحي', 'تجاري', 'تعليمي', 'صحي']
  const filtered = filter === 'الكل' ? properties : properties.filter(p => p.type === filter)
  return (
    <>
      <Card title={`الأملاك الوقفية (${properties.length})`}>
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', flexWrap: 'wrap', borderBottom: '1px solid #F3F4F2' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: filter === t ? GREEN : '#F3F4F2', color: filter === t ? '#fff' : '#4B5563' }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <THead cols={['المرجع', 'الاسم', 'الولاية', 'النوع', 'المساحة', 'الحالة', '']} />
            <tbody>
              {filtered.map(p => (
                <TR key={p.id}
                  cells={[
                    <span style={{ color: GOLD, fontWeight: 600 }}>{p.id}</span>,
                    p.name, p.wilaya, p.type, p.surface,
                    <Badge key="b" status={p.status} />,
                  ]}
                  actions={[
                    <OutlineBtn key="v" small onClick={() => setSelected(p)}>عرض</OutlineBtn>,
                  ]}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد أملاك في هذه الفئة</div>
          )}
        </div>
      </Card>
      <PropertyDetailModal prop={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function Investments({ requests, onApprove, onReject }) {
  return (
    <Card title={`طلبات الاستثمار (${requests.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['الرقم', 'المستثمر', 'الملك', 'القطاع', 'المبلغ', 'التاريخ', 'الحالة', '']} />
          <tbody>
            {requests.map(r => (
              <TR key={r.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                  r.investor, r.property, r.sector, r.amount, r.date,
                  <Badge key="b" status={r.status} />,
                ]}
                actions={r.status === 'قيد المراجعة' ? [
                  <GoldBtn key="a" small onClick={() => onApprove('investment', r.id)}>قبول</GoldBtn>,
                  <OutlineBtn key="r" small danger onClick={() => onReject('investment', r.id)}>رفض</OutlineBtn>,
                ] : [
                  <OutlineBtn key="v" small onClick={() => {}}>التفاصيل</OutlineBtn>,
                ]}
              />
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد طلبات</div>
        )}
      </div>
    </Card>
  )
}

function DiasporaSection({ requests, onApprove, onReject }) {
  return (
    <Card title={`طلبات الجالية الجزائرية (${requests.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['الرقم', 'المانح', 'البلد', 'النوع', 'نوع الوقف', 'القيمة', 'التاريخ', 'الحالة', '']} />
          <tbody>
            {requests.map(r => (
              <TR key={r.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                  r.donor, r.country, r.type,
                  <WaqfTypeBadge key="wt" type={r.waqfType} />,
                  r.value, r.date,
                  <Badge key="b" status={r.status} />,
                ]}
                actions={r.status === 'قيد المراجعة' ? [
                  <GoldBtn key="a" small onClick={() => onApprove('diaspora', r.id)}>قبول</GoldBtn>,
                  <OutlineBtn key="r" small danger onClick={() => onReject('diaspora', r.id)}>رفض</OutlineBtn>,
                ] : [
                  <OutlineBtn key="v" small onClick={() => {}}>التفاصيل</OutlineBtn>,
                ]}
              />
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد طلبات</div>
        )}
      </div>
    </Card>
  )
}

function ForeignSection({ requests, onApprove, onReject }) {
  return (
    <Card title={`طلبات المستثمرين الأجانب (${requests.length})`}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['الرقم', 'المستثمر', 'المشروع', 'القطاع', 'المبلغ', 'التاريخ', 'الحالة', '']} />
          <tbody>
            {requests.map(r => (
              <TR key={r.id}
                cells={[
                  <span style={{ color: GOLD, fontWeight: 600 }}>{r.id}</span>,
                  r.investor, r.project, r.sector, r.amount, r.date,
                  <Badge key="b" status={r.status} />,
                ]}
                actions={r.status === 'قيد المراجعة' ? [
                  <GoldBtn key="a" small onClick={() => onApprove('foreign', r.id)}>قبول</GoldBtn>,
                  <OutlineBtn key="r" small danger onClick={() => onReject('foreign', r.id)}>رفض</OutlineBtn>,
                ] : [
                  <OutlineBtn key="v" small onClick={() => {}}>التفاصيل</OutlineBtn>,
                ]}
              />
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>لا توجد طلبات</div>
        )}
      </div>
    </Card>
  )
}

function Reports() {
  const reports = [
    { title: 'تقرير الربع الثاني 2026',  date: '30 يونيو 2026', size: '2.4 MB', type: 'PDF'  },
    { title: 'إحصاءات الأملاك الوقفية', date: '15 مايو 2026',  size: '1.8 MB', type: 'XLSX' },
    { title: 'تقرير الاستثمارات السنوي', date: '1 يناير 2026', size: '5.2 MB', type: 'PDF'  },
    { title: 'دراسة الجدوى — قسنطينة',  date: '20 أبريل 2026', size: '3.1 MB', type: 'PDF'  },
  ]
  return (
    <Card title="التقارير والإحصاءات">
      {reports.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < reports.length - 1 ? '1px solid #F3F4F2' : 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: r.type === 'PDF' ? '#FEE2E2' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: r.type === 'PDF' ? '#991B1B' : '#065F46' }}>{r.type}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: GREEN }}>{r.title}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{r.date} · {r.size}</div>
          </div>
          <OutlineBtn small onClick={() => {}}>تحميل</OutlineBtn>
        </div>
      ))}
    </Card>
  )
}

function Settings({ user, onSave, showToast }) {
  const [form, setForm] = useState({ ...user })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const save = () => { onSave(form); showToast('تم حفظ التغييرات') }
  return (
    <Card title="إعدادات الحساب">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          <Field label="الاسم الكامل">    <Input value={form.name  || ''} onChange={set('name')}  /></Field>
          <Field label="الدور">            <Input value={form.role  || ''} onChange={set('role')}  /></Field>
          <Field label="البريد الإلكتروني"><Input value={form.email || ''} onChange={set('email')} /></Field>
          <Field label="رقم الهاتف">      <Input value={form.phone || ''} onChange={set('phone')} /></Field>
        </div>
        <div style={{ marginTop: 20 }}><GoldBtn onClick={save}>حفظ التغييرات</GoldBtn></div>
      </div>
    </Card>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Diwan() {
  const { state, actions, showToast } = useStore()
  const [active, setActive] = useState('overview')
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', wilaya: 'الجزائر العاصمة', type: 'أرض', surface: '', desc: '' })
  const setAF = k => e => setAddForm(f => ({ ...f, [k]: e.target.value }))

  const user               = state.users.diwan
  const waqfProperties     = state.waqfProperties
  const investmentRequests = state.investmentRequests
  const diasporaRequests   = state.diasporaRequests
  const foreignRequests    = state.foreignRequests
  const notifications      = state.notifications
  const notifCount         = notifications.filter(n => !n.read).length

  const pendingInvest   = investmentRequests.filter(r => r.status === 'قيد المراجعة').length
  const pendingDiaspora = diasporaRequests.filter(r => r.status === 'قيد المراجعة').length
  const pendingForeign  = foreignRequests.filter(r => r.status === 'قيد المراجعة').length

  const navSections = [
    {
      label: 'القائمة الرئيسية',
      items: [
        { id: 'overview',    label: 'لوحة القيادة',           icon: 'dashboard', badge: 0              },
        { id: 'properties',  label: 'الأملاك الوقفية',        icon: 'building',  badge: 0              },
        { id: 'investments', label: 'طلبات الاستثمار',        icon: 'money',     badge: pendingInvest  },
        { id: 'diaspora',    label: 'طلبات الجالية',          icon: 'globe',     badge: pendingDiaspora },
        { id: 'foreign',     label: 'طلبات الأجانب',          icon: 'map',       badge: pendingForeign },
        { id: 'reports',     label: 'التقارير',                icon: 'chart',     badge: 0              },
      ],
    },
    {
      label: 'إدارة',
      items: [
        { id: 'settings', label: 'الإعدادات', icon: 'settings', badge: 0 },
      ],
    },
  ]

  const meta = {
    overview:    { title: 'لوحة القيادة',         subtitle: 'نظرة عامة على منظومة الأوقاف الوطنية' },
    properties:  { title: 'الأملاك الوقفية',      subtitle: 'إدارة وتصنيف الأملاك المسجلة' },
    investments: { title: 'طلبات الاستثمار',      subtitle: 'مراجعة وقبول طلبات المستثمرين' },
    diaspora:    { title: 'طلبات الجالية',         subtitle: 'طلبات تسجيل الأوقاف من المغتربين' },
    foreign:     { title: 'طلبات المستثمرين الأجانب', subtitle: 'طلبات التمويل من المستثمرين الدوليين' },
    reports:     { title: 'التقارير',              subtitle: 'التقارير الدورية والإحصاءات' },
    settings:    { title: 'الإعدادات',             subtitle: 'إعدادات المنصة والحساب' },
  }
  const { title, subtitle } = meta[active] || meta.overview

  const handleApprove = (bucket, id) => {
    actions.approve(bucket, id)
    showToast('تمت الموافقة على الطلب')
  }
  const handleReject = (bucket, id) => {
    actions.reject(bucket, id)
    showToast('تم رفض الطلب', 'error')
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
        actions={active === 'properties' ? <GoldBtn onClick={() => setAddModal(true)}>+ إضافة ملك وقفي</GoldBtn> : null}
      >
        {active === 'overview'    && <Overview waqfProperties={waqfProperties} investmentRequests={investmentRequests} diasporaRequests={diasporaRequests} foreignRequests={foreignRequests} />}
        {active === 'properties'  && <Properties properties={waqfProperties} onAdd={() => setAddModal(true)} />}
        {active === 'investments' && <Investments requests={investmentRequests} onApprove={handleApprove} onReject={handleReject} />}
        {active === 'diaspora'    && <DiasporaSection requests={diasporaRequests} onApprove={handleApprove} onReject={handleReject} />}
        {active === 'foreign'     && <ForeignSection requests={foreignRequests} onApprove={handleApprove} onReject={handleReject} />}
        {active === 'reports'     && <Reports />}
        {active === 'settings'    && <Settings user={user} onSave={p => actions.saveUser('diwan', p)} showToast={showToast} />}
      </DashboardLayout>

      <Modal title="إضافة ملك وقفي جديد" open={addModal} onClose={() => setAddModal(false)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="اسم الملك *"><Input placeholder="مثال: مسجد النور — أرض وقفية" value={addForm.name} onChange={setAF('name')} /></Field>
          <Field label="الولاية"><Select value={addForm.wilaya} onChange={setAF('wilaya')} options={['الجزائر العاصمة', 'وهران', 'قسنطينة', 'سيدي بلعباس', 'تلمسان', 'سطيف', 'عنابة']} /></Field>
          <Field label="النوع"><Select value={addForm.type} onChange={setAF('type')} options={['أرض', 'عقار', 'فلاحي', 'تجاري', 'تعليمي', 'صحي']} /></Field>
          <Field label="المساحة (م²) *"><Input placeholder="1200" type="number" value={addForm.surface} onChange={setAF('surface')} /></Field>
        </div>
        <Field label="الوصف"><Textarea placeholder="وصف الملك الوقفي..." value={addForm.desc} onChange={setAF('desc')} /></Field>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <OutlineBtn onClick={() => setAddModal(false)}>إلغاء</OutlineBtn>
          <GoldBtn onClick={() => {
            if (!addForm.name.trim() || !addForm.surface) { showToast('يرجى تعبئة الحقول المطلوبة', 'error'); return }
            actions.addProperty(addForm.name, addForm.wilaya, addForm.type, addForm.surface, addForm.desc)
            setAddModal(false)
            setAddForm({ name: '', wilaya: 'الجزائر العاصمة', type: 'أرض', surface: '', desc: '' })
            showToast('تم إضافة الملك الوقفي بنجاح')
          }}>حفظ الملك</GoldBtn>
        </div>
      </Modal>
    </>
  )
}
