import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Bell, Activity, BarChart2,
  MessageCircle, Settings, ChevronDown, LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DemoBadge from '../shared/DemoBadge'
import { signOut } from '../../utils/authSession'
import { allAlerts } from '../../data/clinicianData'

const criticalCount = allAlerts.filter(a => a.severity === 'red').length

const RAIL_ICONS = [
  { Icon: LayoutDashboard, to: '/clinician/dashboard',   title: 'Dashboard',   exact: true },
  { Icon: Users,           to: '/clinician/patients',    title: 'Patients',    exact: false },
  { Icon: Bell,            to: '/clinician/alerts',      title: 'Alerts',      exact: true,  badge: criticalCount },
  { Icon: MessageCircle,   to: '/clinician/messages',    title: 'Messaging',   exact: true },
  { Icon: Activity,        to: '/clinician/sensor-data', title: 'Sensor Data', exact: true },
  { Icon: BarChart2,       to: '/clinician/reports',     title: 'Reports',     exact: true },
]

function isRailActive(item, pathname) {
  if (item.to === '/clinician/patients') {
    return pathname === item.to || /^\/clinician\/patient\//.test(pathname)
  }
  return item.exact ? pathname === item.to : pathname.startsWith(item.to)
}

function RailIconButton({ item, pathname }) {
  const [hovered, setHovered] = useState(false)
  const active = isRailActive(item, pathname)
  const { Icon, to, title, badge } = item

  const iconColor = active ? '#4F52C4' : hovered ? '#374151' : '#6B7280'
  const pillBg   = active ? '#EEF2FF' : hovered ? '#F3F4F6' : 'transparent'

  return (
    <Link
      to={to}
      title={title}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 52,
        height: 40,
        flexShrink: 0,
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: pillBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} color={iconColor} strokeWidth={1.8} />
      </div>
      {badge > 0 && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 6,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#DC2626',
          color: 'white',
          fontSize: 8,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid white',
          lineHeight: 1,
        }}>
          {badge}
        </span>
      )}
    </Link>
  )
}

const NAV_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 34,
  padding: '0 10px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  textDecoration: 'none',
  cursor: 'pointer',
  marginBottom: 2,
}

function SectionLabel({ label, first }) {
  return (
    <p style={{
      fontSize: 10,
      fontWeight: 500,
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      padding: `${first ? 12 : 16}px 10px 6px`,
      margin: 0,
    }}>
      {label}
    </p>
  )
}

export default function ClinicianLayout({ children }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  const displayName = user?.name || 'Sarah Mitchell'
  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F5F7' }}>
      <DemoBadge />

      {/* ── Icon Rail (52px) ── */}
      <aside style={{
        width: 52,
        flexShrink: 0,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
      }}>
        {/* Logo mark */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#EEF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#4F52C4', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>S</span>
        </div>

        {/* Nav icons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          {RAIL_ICONS.map(item => (
            <RailIconButton key={item.to} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Bottom: Settings + Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 4 }}>
          <button
            type="button"
            title="Settings"
            style={{
              width: 40,
              height: 40,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <Settings size={20} color="#9CA3AF" strokeWidth={1.8} />
          </button>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#4F52C4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'default',
          }}>
            {initials}
          </div>
        </div>
      </aside>

      {/* ── Nav Panel (188px) ── */}
      <aside style={{
        width: 188,
        flexShrink: 0,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Workspace card */}
        <div style={{ padding: 12, borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: menuOpen ? '#F3F4F6' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                borderRadius: 8,
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#4F52C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </p>
                <p style={{ fontSize: 9, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                  Clinical Portal
                </p>
              </div>
              <ChevronDown
                size={14}
                color="#9CA3AF"
                strokeWidth={1.8}
                style={{
                  flexShrink: 0,
                  transform: menuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E8EAED',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '4px 0',
                  zIndex: 300,
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => signOut()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 12px',
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
                  <LogOut size={14} color="#6B7280" strokeWidth={1.8} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
          <SectionLabel label="Workspace" first />

          <NavLink
            to="/clinician/dashboard"
            end
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={14} color={isActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/clinician/alerts"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => (
              <>
                <Bell size={14} color={isActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                <span style={{ flex: 1 }}>Alerts</span>
                {criticalCount > 0 && (
                  <span style={{
                    background: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '0 5px',
                    lineHeight: '16px',
                    minWidth: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {criticalCount}
                  </span>
                )}
              </>
            )}
          </NavLink>

          <SectionLabel label="Patients" />

          <NavLink
            to="/clinician/patients"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: (isActive || /^\/clinician\/patient\//.test(pathname)) ? '#EEF2FF' : 'transparent',
              color: (isActive || /^\/clinician\/patient\//.test(pathname)) ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => {
              const active = isActive || /^\/clinician\/patient\//.test(pathname)
              return (
                <>
                  <Users size={14} color={active ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                  <span>Patients</span>
                </>
              )
            }}
          </NavLink>

          <NavLink
            to="/clinician/messages"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => (
              <>
                <MessageCircle size={14} color={isActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                <span>Messaging</span>
              </>
            )}
          </NavLink>

          <SectionLabel label="Data" />

          <NavLink
            to="/clinician/sensor-data"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => (
              <>
                <Activity size={14} color={isActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                <span>Sensor Data</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/clinician/reports"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => (
              <>
                <BarChart2 size={14} color={isActive ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                <span>Reports</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Sign out */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '10px 8px 12px' }}>
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 10px',
              height: 34,
              width: '100%',
              fontSize: 13,
              fontWeight: 500,
              color: '#6B7280',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#374151' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6B7280' }}
          >
            <LogOut size={14} color="currentColor" strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', background: '#F4F5F7', minWidth: 0, transition: 'opacity 0.15s ease' }}>
        {children}
      </main>
    </div>
  )
}
