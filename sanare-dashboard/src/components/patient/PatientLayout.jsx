import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DemoBadge from '../shared/DemoBadge'

function IconLogout() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
function IconProgress() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}
function IconLog() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}
function IconMessages() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}
function IconWins() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3a2 2 0 00-2 2v3a7 7 0 007 7 7 7 0 007-7V5a2 2 0 00-2-2M5 3H3m18 0h-2M9 21h6m-3-4v4" />
    </svg>
  )
}

const TABS = [
  { path: '/patient/home',     label: 'Home',     Icon: IconHome     },
  { path: '/patient/progress', label: 'Progress', Icon: IconProgress },
  { path: '/patient/log',      label: 'Log',      Icon: IconLog      },
  { path: '/patient/messages', label: 'Messages', Icon: IconMessages },
  { path: '/patient/insights', label: 'My Wins',  Icon: IconWins     },
]

export default function PatientLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#060810] flex">
      <DemoBadge />

      {/* Left sidebar */}
      <aside className="w-[220px] fixed inset-y-0 left-0 bg-[#070B14] border-r border-white/[0.08] flex flex-col z-40">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.2 4.5 9.5 4.5 9.5S12.5 9.2 12.5 6c0-2.5-2-4.5-4.5-4.5z" fill="white"/>
                <circle cx="8" cy="6" r="1.8" fill="rgba(59,130,246,0.8)"/>
              </svg>
            </div>
            <div>
              <p className="text-[#F9FAFB] font-bold text-sm leading-none tracking-tight">Sanaré</p>
              <p className="text-[#6B7280] text-xs mt-0.5">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[#4B5563] text-xs font-medium uppercase tracking-widest px-3 mb-3">Navigation</p>
          {TABS.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1C2333] text-[#3B82F6]'
                    : 'text-[#6B7280] hover:text-[#F9FAFB] hover:bg-white/5'
                }`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AJ
            </div>
            <div className="min-w-0">
              <p className="text-[#F9FAFB] text-xs font-semibold truncate">Alex Johnson</p>
              <p className="text-[#6B7280] text-xs">ACL Recovery · Wk 12</p>
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

      {/* Main content */}
      <main className="ml-[220px] flex-1 min-w-0 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
