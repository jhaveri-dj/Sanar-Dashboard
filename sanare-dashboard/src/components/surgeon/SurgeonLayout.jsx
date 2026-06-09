import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DemoBadge from '../shared/DemoBadge'

function IconHome() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

const NAV_ITEMS = [
  { path: '/surgeon/dashboard', label: 'Dashboard', Icon: IconHome },
]

export default function SurgeonLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      <DemoBadge />

      {/* Desktop sidebar */}
      <aside className="w-60 fixed inset-y-0 left-0 bg-[#070B14] border-r border-[#1F2937] flex-col z-40 hidden md:flex">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center border-b border-[#1F2937] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.2 4.5 9.5 4.5 9.5S12.5 9.2 12.5 6c0-2.5-2-4.5-4.5-4.5z" fill="white"/>
                <circle cx="8" cy="6" r="1.8" fill="rgba(139,92,246,0.8)"/>
              </svg>
            </div>
            <div>
              <p className="text-[#F9FAFB] font-bold text-sm leading-none tracking-tight">Sanaré</p>
              <p className="text-[#6B7280] text-xs mt-0.5">Surgeon Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[#4B5563] text-xs font-medium uppercase tracking-widest px-3 mb-3">Navigation</p>
          {NAV_ITEMS.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1F2937] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1F2937]'
                }`
              }
            >
              <Icon />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-[#1F2937] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              JO
            </div>
            <div className="min-w-0">
              <p className="text-[#F9FAFB] text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-[#6B7280] text-xs">Orthopedic Surgeon</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-[#9CA3AF] hover:text-[#F9FAFB] bg-white/5 hover:bg-white/10 rounded-lg py-2 transition-colors duration-150"
          >
            <IconLogout />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#070B14] border-b border-[#1F2937] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.2 4.5 9.5 4.5 9.5S12.5 9.2 12.5 6c0-2.5-2-4.5-4.5-4.5z" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-bold text-sm">Sanaré Surgical</span>
        </div>
        <button onClick={handleLogout} className="text-[#6B7280] hover:text-white">
          <IconLogout />
        </button>
      </div>

      {/* Main content */}
      <main className="md:ml-60 flex-1 min-w-0 overflow-auto mt-14 md:mt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
