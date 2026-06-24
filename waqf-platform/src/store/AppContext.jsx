import { createContext, useContext, useReducer, useState, useCallback } from 'react'

// ── Date helpers ───────────────────────────────────────────────────────────────
const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
export function todayAr() {
  const d = new Date()
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
export function todayEn() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
const uid = prefix => `${prefix}-${Date.now().toString().slice(-6)}`

// ── Seed data ──────────────────────────────────────────────────────────────────
const SEED_PROPERTIES = [
  { id: 'WQF-001', name: 'مسجد النور — أرض وقفية',      wilaya: 'الجزائر العاصمة', type: 'أرض',    status: 'متاح',        surface: '1 200 م²',  desc: 'أرض وقفية محاذية لمسجد النور في حيدرة، صالحة لإنشاء مرافق دينية وتعليمية.',       fundingGoal: 30000000, fundingRaised: 8500000  },
  { id: 'WQF-002', name: 'مجمع تجاري — بئر مراد رايس', wilaya: 'الجزائر العاصمة', type: 'عقار',   status: 'محجوز',       surface: '850 م²',    desc: 'محل تجاري في قلب بئر مراد رايس بموقع استراتيجي قرب السوق الرئيسي.',              fundingGoal: 15000000, fundingRaised: 15000000 },
  { id: 'WQF-003', name: 'مدرسة قرآنية — سيدي بلعباس', wilaya: 'سيدي بلعباس',    type: 'تعليمي', status: 'قيد الدراسة', surface: '620 م²',    desc: 'مدرسة قرآنية لتحفيظ القرآن الكريم لـ 150 طفل في منطقة محرومة.',                  fundingGoal: 10000000, fundingRaised: 4500000  },
  { id: 'WQF-004', name: 'مزرعة وقفية — قسنطينة',       wilaya: 'قسنطينة',        type: 'فلاحي',  status: 'متاح',        surface: '5 400 م²',  desc: 'مزرعة وقفية واسعة مزودة بنظام ري حديث ومناسبة لمشاريع الزراعة المستدامة.',      fundingGoal: 8000000,  fundingRaised: 3200000  },
  { id: 'WQF-005', name: 'مركز صحي — وهران',             wilaya: 'وهران',           type: 'صحي',    status: 'قيد الدراسة', surface: '340 م²',    desc: 'مركز صحي عصري يخدم 5 000 مواطن في الأحياء الشعبية بوهران.',                      fundingGoal: 12000000, fundingRaised: 7500000  },
  { id: 'WQF-006', name: 'سوق قديم — تلمسان',            wilaya: 'تلمسان',          type: 'تجاري',  status: 'متاح',        surface: '2 100 م²',  desc: 'سوق تاريخي في قلب المدينة القديمة بتلمسان. فرصة استثمارية نادرة بعائد سياحي.', fundingGoal: 20000000, fundingRaised: 14000000 },
]

const SEED_INVESTMENT = [
  { id: 'INV-001', investor: 'يوسف بن حمزة',   investorKey: 'investisseur', property: 'WQF-001', sector: 'تجاري',  amount: '12 500 000 دج', duration: '10 سنوات', desc: 'مشروع مجمع تجاري حديث',   status: 'قيد المراجعة', date: '10 يونيو 2026' },
  { id: 'INV-002', investor: 'سليم بن عمر',    investorKey: 'other',        property: 'WQF-004', sector: 'فلاحي',  amount: '8 000 000 دج',  duration: '15 سنة',   desc: 'مشروع زراعي مستدام',     status: 'قيد المراجعة', date: '12 يونيو 2026' },
  { id: 'INV-003', investor: 'فاطمة الزهراء',  investorKey: 'other',        property: 'WQF-006', sector: 'تجاري',  amount: '6 200 000 دج',  duration: '10 سنوات', desc: 'إحياء السوق التاريخي',    status: 'مقبول',        date: '8 يونيو 2026'  },
  { id: 'INV-004', investor: 'رشيد لعريبي',    investorKey: 'other',        property: 'WQF-003', sector: 'تعليمي', amount: '3 500 000 دج',  duration: '5 سنوات',  desc: 'توسعة المدرسة القرآنية', status: 'مرفوض',        date: '5 يونيو 2026'  },
]

const SEED_DIASPORA = [
  { id: 'DIA-001', donor: 'عبد الرحمن بن علي', donorKey: 'diaspora', country: 'فرنسا 🇫🇷',   type: 'أرض',   wilaya: 'الجزائر العاصمة', value: '€ 45 000',    desc: 'أرض وقفية للأجيال القادمة', waqfType: 'دائم', status: 'قيد المراجعة', date: '9 يونيو 2026'  },
  { id: 'DIA-002', donor: 'نور الدين سعيدي',   donorKey: 'other',    country: 'كندا 🇨🇦',     type: 'عقار',  wilaya: 'وهران',            value: 'CA$ 80 000', desc: 'شقة وقفية للمحتاجين',       waqfType: 'دائم', status: 'مقبول',        date: '7 يونيو 2026'  },
  { id: 'DIA-003', donor: 'أميرة حمداني',       donorKey: 'other',    country: 'الإمارات 🇦🇪', type: 'فلاحي', wilaya: 'قسنطينة',         value: 'AED 110 000', desc: 'مزرعة وقفية للأيتام',       waqfType: 'مؤقت', status: 'قيد المراجعة', date: '11 يونيو 2026' },
  { id: 'DIA-004', donor: 'عبد الرحمن بن علي', donorKey: 'diaspora', country: 'فرنسا 🇫🇷',   type: 'عقار',  wilaya: 'وهران',            value: '€ 80 000',    desc: 'عقار وقفي',                 waqfType: 'دائم', status: 'مقبول',        date: '2 يونيو 2026'  },
  { id: 'DIA-005', donor: 'عبد الرحمن بن علي', donorKey: 'diaspora', country: 'فرنسا 🇫🇷',   type: 'نقدي',  wilaya: 'قسنطينة',         value: '€ 12 000',    desc: 'تبرع نقدي لمشروع البئر',    waqfType: 'مؤقت', status: 'مكتمل',        date: '20 مايو 2026'  },
]

const SEED_FOREIGN = [
  { id: 'FOR-001', investor: 'Ibrahim Hassan', investorKey: 'etrangers', project: 'WQF-001', sector: 'Commercial', amount: '$ 95 000',  duration: '10 years', desc: 'Mixed-use commercial development', status: 'قيد المراجعة', date: 'Jun 10, 2026' },
  { id: 'FOR-002', investor: 'Ibrahim Hassan', investorKey: 'etrangers', project: 'WQF-006', sector: 'Commercial', amount: '$ 200 000', duration: '20 years', desc: 'Heritage tourism complex',          status: 'مقبول',        date: 'May 5, 2026'  },
]

const SEED_USERS = {
  diwan:        { name: 'محمد الأمين بن يوسف', role: 'مدير الديوان الوطني', email: 'admin@waqf-dz.gov.dz',   phone: '+213 21 XX XX XX', country: 'الجزائر' },
  investisseur: { name: 'يوسف بن حمزة',         role: 'مستثمر محلي',         email: 'y.benhamza@example.dz',  phone: '+213 55 XX XX XX', country: 'الجزائر' },
  diaspora:     { name: 'عبد الرحمن بن علي',    role: 'مغترب — فرنسا 🇫🇷',  email: 'abderrahman@example.fr', phone: '+33 6 XX XX XX XX', country: 'فرنسا'  },
  etrangers:    { name: 'Ibrahim Hassan',        role: 'مستثمر دولي',         email: 'i.hassan@example.com',   phone: '+971 50 XXX XXXX', country: 'UAE', sector: 'Commercial', range: '$ 50K – 100K' },
}

// ── Reducer ────────────────────────────────────────────────────────────────────
const initialState = {
  waqfProperties:     SEED_PROPERTIES,
  investmentRequests: SEED_INVESTMENT,
  diasporaRequests:   SEED_DIASPORA,
  foreignRequests:    SEED_FOREIGN,
  notifications:      [],
  users:              SEED_USERS,
}

function reducer(state, action) {
  switch (action.type) {

    case 'ADD_PROPERTY':
      return {
        ...state,
        waqfProperties: [action.payload, ...state.waqfProperties],
        notifications: [
          { id: Date.now(), text: `تمت إضافة ملك وقفي جديد: ${action.payload.name}`, read: false, time: 'الآن' },
          ...state.notifications,
        ],
      }

    case 'ADD_INVESTMENT_REQUEST':
      return {
        ...state,
        investmentRequests: [action.payload, ...state.investmentRequests],
        notifications: [
          { id: Date.now(), text: `طلب استثمار جديد من ${action.payload.investor}`, read: false, time: 'الآن' },
          ...state.notifications,
        ],
      }

    case 'ADD_DIASPORA_REQUEST':
      return {
        ...state,
        diasporaRequests: [action.payload, ...state.diasporaRequests],
        notifications: [
          { id: Date.now(), text: `طلب وقف جديد من ${action.payload.donor}`, read: false, time: 'الآن' },
          ...state.notifications,
        ],
      }

    case 'ADD_FOREIGN_REQUEST':
      return {
        ...state,
        foreignRequests: [action.payload, ...state.foreignRequests],
        notifications: [
          { id: Date.now(), text: `طلب أجنبي جديد: ${action.payload.investor}`, read: false, time: 'الآن' },
          ...state.notifications,
        ],
      }

    case 'UPDATE_STATUS': {
      const { bucket, id, status } = action.payload
      const key = { investment: 'investmentRequests', diaspora: 'diasporaRequests', foreign: 'foreignRequests', property: 'waqfProperties' }[bucket]
      return { ...state, [key]: state[key].map(r => r.id === id ? { ...r, status } : r) }
    }

    case 'UPDATE_USER':
      return { ...state, users: { ...state.users, [action.payload.key]: action.payload.profile } }

    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }

    case 'MARK_NOTIF_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToast({ id, message, type })
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3200)
  }, [])

  const actions = {
    addProperty: (name, wilaya, type, surface, desc) => {
      dispatch({
        type: 'ADD_PROPERTY',
        payload: { id: uid('WQF'), name, wilaya, type, surface: surface ? `${surface} م²` : '—', status: 'قيد الدراسة', desc: desc || '', fundingGoal: 0, fundingRaised: 0 },
      })
    },
    submitInvestment: (investor, investorKey, property, sector, amount, duration, desc) => {
      dispatch({
        type: 'ADD_INVESTMENT_REQUEST',
        payload: { id: uid('INV'), investor, investorKey, property, sector, amount, duration, desc, status: 'قيد المراجعة', date: todayAr() },
      })
    },
    submitDiaspora: (donor, donorKey, country, type, wilaya, value, desc, waqfType = 'دائم', waqfDuration = '', waqfStartDate = '', waqfBeneficiary = '') => {
      dispatch({
        type: 'ADD_DIASPORA_REQUEST',
        payload: { id: uid('DIA'), donor, donorKey, country, type, wilaya, value, desc, waqfType, waqfDuration, waqfStartDate, waqfBeneficiary, status: 'قيد المراجعة', date: todayAr() },
      })
    },
    submitForeign: (investor, investorKey, project, sector, amount, duration, desc) => {
      dispatch({
        type: 'ADD_FOREIGN_REQUEST',
        payload: { id: uid('FOR'), investor, investorKey, project, sector, amount, duration, desc, status: 'قيد المراجعة', date: todayEn() },
      })
    },
    approve: (bucket, id) => dispatch({ type: 'UPDATE_STATUS', payload: { bucket, id, status: 'مقبول' } }),
    reject:  (bucket, id) => dispatch({ type: 'UPDATE_STATUS', payload: { bucket, id, status: 'مرفوض' } }),
    saveUser: (key, profile) => dispatch({ type: 'UPDATE_USER', payload: { key, profile } }),
    markRead: () => dispatch({ type: 'MARK_READ' }),
    markNotifRead: (id) => dispatch({ type: 'MARK_NOTIF_READ', payload: id }),
  }

  return (
    <AppContext.Provider value={{ state, actions, toast, showToast }}>
      {children}
    </AppContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useStore must be used inside AppProvider')
  return ctx
}
