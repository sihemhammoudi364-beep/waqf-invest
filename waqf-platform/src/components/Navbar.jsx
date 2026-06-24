import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'الرئيسية', path: '/', hash: '' },
  { label: 'استكشف الأوقاف', path: '/', hash: '#featured' },
  { label: 'كيف تشارك', path: '/', hash: '#how' },
  { label: 'الفئات', path: '/', hash: '#categories' },
]

const portals = [
  {
    label: 'واجهة الديوان',
    path: '/diwan',
    desc: 'للمسؤولين والإداريين',
    emoji: '🏛️',
    color: '#1F6B52',
  },
  {
    label: 'المستثمرون',
    path: '/investisseurs',
    desc: 'للمستثمرين والشركات المحلية',
    emoji: '💼',
    color: '#D8B56A',
  },
  {
    label: 'الجالية',
    path: '/diaspora',
    desc: 'للجزائريين في الخارج',
    emoji: '🌍',
    color: '#2563eb',
  },
  {
    label: 'المستثمرون الأجانب',
    path: '/etrangers',
    desc: 'للمانحين الدوليين',
    emoji: '🌐',
    color: '#7c3aed',
  },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPortalOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNav = (link) => {
    setMenuOpen(false)
    setPortalOpen(false)
    if (link.hash) {
      if (pathname !== '/') {
        navigate('/')
        setTimeout(() => document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' }), 300)
      } else {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(link.path)
    }
  }

  return (
    <header
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
      style={{ boxShadow: '0 2px 20px rgba(31,107,82,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.png" alt="شعار المنصة" className="w-10 h-10 object-contain" />
            <div className="text-right leading-tight hidden sm:block">
              <div className="font-bold text-[#1E293B] text-sm leading-none">المنصة الجزائرية للأوقاف</div>
              <div className="text-[#1F6B52] text-xs mt-0.5">نمو واستدامة</div>
            </div>
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm pr-10 focus:outline-none focus:border-[#1F6B52] focus:ring-1 focus:ring-[#1F6B52] bg-[#F7F8F5] transition-all"
                dir="rtl"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Nav links + portal dropdown */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.path && !l.hash
                    ? 'bg-[#1F6B52] text-white'
                    : 'text-[#1E293B] hover:bg-[#E9F2ED] hover:text-[#1F6B52]'
                }`}
              >
                {l.label}
              </button>
            ))}

            {/* Portals dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPortalOpen(!portalOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  portalOpen
                    ? 'bg-[#1F6B52] text-white'
                    : 'text-[#1E293B] hover:bg-[#E9F2ED] hover:text-[#1F6B52]'
                }`}
              >
                لوحات التحكم
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${portalOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {portalOpen && (
                <div
                  className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  style={{ boxShadow: '0 20px 60px rgba(31,107,82,0.15)' }}
                >
                  {/* Dropdown header */}
                  <div className="px-4 py-3 bg-[#F7F8F5] border-b border-gray-100">
                    <p className="text-xs font-bold text-[#1F6B52] uppercase tracking-wider">اختر بوابتك</p>
                    <p className="text-xs text-gray-400 mt-0.5">الوصول حسب نوع المستخدم</p>
                  </div>

                  {portals.map((p) => (
                    <button
                      key={p.path}
                      onClick={() => { navigate(p.path); setPortalOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-[#F7F8F5] transition-colors group border-b border-gray-50 last:border-0 ${
                        pathname === p.path ? 'bg-[#E9F2ED]' : ''
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${p.color}15` }}
                      >
                        {p.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm transition-colors ${pathname === p.path ? 'text-[#1F6B52]' : 'text-[#1E293B] group-hover:text-[#1F6B52]'}`}>
                          {p.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{p.desc}</div>
                      </div>
                      {pathname === p.path && (
                        <div className="w-2 h-2 rounded-full bg-[#1F6B52] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/etrangers')}
              className="mr-1 text-[#1F6B52] font-bold text-sm px-3 py-2 rounded-lg hover:bg-[#E9F2ED] transition-colors"
            >
              تبرع الآن
            </button>
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden sm:block bg-[#1F6B52] hover:bg-[#174d3b] text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
              تسجيل الدخول
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l)}
                className="block w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#E9F2ED] hover:text-[#1F6B52] transition-colors"
              >
                {l.label}
              </button>
            ))}
            {/* Mobile portals */}
            <div className="px-4 pt-2 pb-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">لوحات التحكم</p>
              <div className="grid grid-cols-2 gap-2">
                {portals.map((p) => (
                  <button
                    key={p.path}
                    onClick={() => { navigate(p.path); setMenuOpen(false) }}
                    className="flex items-center gap-2 bg-[#F7F8F5] hover:bg-[#E9F2ED] rounded-xl px-3 py-2.5 text-right transition-colors"
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-xs font-semibold text-[#1E293B]">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 pt-1">
              <button className="w-full bg-[#1F6B52] text-white font-bold py-2.5 rounded-xl text-sm">
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
