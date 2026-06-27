import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, TrendingUp, ClipboardList, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DemoBadge from '../shared/DemoBadge'

const NAV_LINKS = [
  { to: '/patient/home', label: 'Home' },
  { to: '/patient/log', label: 'Log' },
  { to: '/patient/messages', label: 'Messages' },
]

const RECOVERY_MENU = [
  {
    to: '/patient/progress',
    label: 'Your Progress',
    description: 'Milestones & recovery timeline',
    Icon: TrendingUp,
  },
  {
    to: '/patient/rehab-plan',
    label: 'Rehab Plan',
    description: 'Phase goals & prescribed exercises',
    Icon: ClipboardList,
  },
  {
    to: '/patient/insights',
    label: 'Weekly Highlights',
    description: 'Wins & easy-to-read trend charts',
    Icon: Sparkles,
  },
]

const RECOVERY_PATHS = RECOVERY_MENU.map(item => item.to)

const NAV_HEIGHT = 52
const NAV_TOP_OFFSET = 20
const NAV_SIDE_INSET = 24
const NAV_MAX_WIDTH = 1120

function NavItem({ to, label }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        color: isActive ? '#4F52C4' : hovered ? '#374151' : '#6B7280',
        background: isActive ? '#EEF2FF' : hovered ? '#F3F4F6' : 'transparent',
        display: 'inline-block',
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </NavLink>
  )
}

function RecoveryNavDropdown() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const closeTimer = useRef(null)

  const isActive = RECOVERY_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  function handleEnter() {
    clearCloseTimer()
    setHovered(true)
    setOpen(true)
  }

  function handleLeave() {
    setHovered(false)
    scheduleClose()
  }

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  useEffect(() => () => clearCloseTimer(), [])

  const highlight = isActive || open || hovered

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 14px',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          color: highlight ? '#4F52C4' : '#6B7280',
          background: highlight ? '#EEF2FF' : 'transparent',
        }}
      >
        Recovery
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>

      {open && (
        <div
          role="menu"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 248,
            background: '#FFFFFF',
            border: '1px solid #E8EAED',
            borderRadius: 14,
            boxShadow: '0 12px 32px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)',
            padding: 6,
            zIndex: 200,
          }}
        >
          {RECOVERY_MENU.map(({ to, label, description, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              role="menuitem"
              onClick={() => setOpen(false)}
              style={({ isActive: itemActive }) => ({
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                background: itemActive ? '#EEF2FF' : 'transparent',
                transition: 'background 0.15s ease',
              })}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
              onMouseLeave={e => {
                const active = pathname === to
                e.currentTarget.style.background = active ? '#EEF2FF' : 'transparent'
              }}
            >
              {({ isActive: itemActive }) => (
                <>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: itemActive ? '#FFFFFF' : '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={itemActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: itemActive ? '#4F52C4' : '#111827' }}>
                      {label}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.35 }}>
                      {description}
                    </p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const displayName = user?.name ?? 'Alex Chen'

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function handleLogout() {
    logout()
    window.location.replace('/login')
  }

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          background: open ? '#F3F4F6' : 'transparent',
          border: 'none',
          padding: '4px 8px 4px 4px',
          borderRadius: 999,
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#F9FAFB' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <img
          src="https://i.pravatar.cc/32?img=11"
          alt={displayName}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #E8EAED',
          }}
        />
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{displayName}</span>
        <ChevronDown
          size={14}
          color="#9CA3AF"
          strokeWidth={2}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
        />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 168,
            background: '#FFFFFF',
            border: '1px solid #E8EAED',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            padding: '4px 0',
            zIndex: 200,
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={14} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function FloatingTopNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 12) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: NAV_TOP_OFFSET,
        left: NAV_SIDE_INSET,
        right: NAV_SIDE_INSET,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: NAV_MAX_WIDTH,
          height: NAV_HEIGHT,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 16,
          background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: scrolled
            ? '0 12px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
            : '0 8px 32px rgba(15,23,42,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
          transition: 'box-shadow 0.25s ease, background 0.25s ease',
        }}
      >
        <div style={{ minWidth: 100 }}>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#4F52C4',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}>
            Sanaré
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavItem to="/patient/home" label="Home" />
          <RecoveryNavDropdown />
          {NAV_LINKS.filter(item => item.to !== '/patient/home').map(({ to, label }) => (
            <NavItem key={to} to={to} label={label} />
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 100,
          justifyContent: 'flex-end',
        }}>
          <button
            type="button"
            aria-label="Notifications"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <Bell size={18} color="#6B7280" strokeWidth={1.8} />
            <span style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#DC2626',
              border: '1.5px solid white',
            }} />
          </button>
          <UserMenu />
        </div>
      </nav>
    </div>
  )
}

export default function PatientLayout({ children }) {
  const mainPaddingTop = NAV_TOP_OFFSET + NAV_HEIGHT + 28

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <DemoBadge />
      <FloatingTopNav />
      <main style={{
        paddingTop: mainPaddingTop,
        minHeight: '100vh',
        background: '#F7F8FA',
        width: '100%',
      }}>
        {children}
      </main>
    </div>
  )
}
