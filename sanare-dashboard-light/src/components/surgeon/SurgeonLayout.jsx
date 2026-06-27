import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Activity, BarChart2, Settings, ChevronDown, LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DemoBadge from '../shared/DemoBadge'

const RAIL_ICONS = [
  { Icon: LayoutDashboard, to: '/surgeon/dashboard',   title: 'Dashboard',   exact: true  },
  { Icon: Users,           to: '/surgeon/patients',    title: 'Patients',    exact: false },
  { Icon: Activity,        to: '/surgeon/sensor-data', title: 'Sensor Data', exact: true  },
  { Icon: BarChart2,       to: '/surgeon/reports',     title: 'Reports',     exact: true  },
]

function isRailActive(item, pathname) {
  if (item.to === '/surgeon/patients') {
    return pathname === item.to || /^\/surgeon\/patient\//.test(pathname)
  }
  return item.exact ? pathname === item.to : pathname.startsWith(item.to)
}

function RailIconButton({ item, pathname }) {
  const [hovered, setHovered] = useState(false)
  const active = isRailActive(item, pathname)
  const { Icon, to, title } = item

  const iconColor = active ? '#4F52C4' : hovered ? '#374151' : '#6B7280'
  const pillBg    = active ? '#EEF2FF' : hovered ? '#F3F4F6' : 'transparent'

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

export default function SurgeonLayout({ children }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  function handleLogout() {
    logout()
    window.location.replace('/login')
  }

  const displayName = user?.name || 'Dr. James Ortiz'
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
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
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
                Surgeon Portal
              </p>
            </div>
            <ChevronDown size={14} color="#9CA3AF" strokeWidth={1.8} style={{ flexShrink: 0 }} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
          <SectionLabel label="Workspace" first />

          <NavLink
            to="/surgeon/dashboard"
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

          <SectionLabel label="Patients" />

          <NavLink
            to="/surgeon/patients"
            style={({ isActive }) => ({
              ...NAV_ITEM,
              background: (isActive || /^\/surgeon\/patient\//.test(pathname)) ? '#EEF2FF' : 'transparent',
              color: (isActive || /^\/surgeon\/patient\//.test(pathname)) ? '#4F52C4' : '#374151',
            })}
          >
            {({ isActive }) => {
              const active = isActive || /^\/surgeon\/patient\//.test(pathname)
              return (
                <>
                  <Users size={14} color={active ? '#4F52C4' : '#6B7280'} strokeWidth={1.8} />
                  <span>Patients</span>
                </>
              )
            }}
          </NavLink>

          <SectionLabel label="Data" />

          <NavLink
            to="/surgeon/sensor-data"
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
            to="/surgeon/reports"
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
            onClick={handleLogout}
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
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', background: '#F4F5F7', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
