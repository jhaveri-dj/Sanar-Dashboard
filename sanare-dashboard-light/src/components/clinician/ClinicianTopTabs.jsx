import { NavLink } from 'react-router-dom'

const TABS = [
  { label: 'Overview',       to: '/clinician/dashboard',      end: true },
  { label: 'Patients',       to: '/clinician/patients' },
  { label: 'Recovery Plans', to: '/clinician/recovery-plans' },
  { label: 'Sensor Data',    to: '/clinician/sensor-data' },
  { label: 'AI Insights',    to: '/clinician/ai-insights' },
]

export default function ClinicianTopTabs() {
  return (
    <div style={{
      height: 44,
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'flex-end',
      flexShrink: 0,
    }}>
      {TABS.map(({ label, to, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={({ isActive }) => ({
            fontSize: 14,
            fontWeight: 500,
            color: isActive ? '#4F52C4' : '#374151',
            background: 'none',
            border: 'none',
            borderBottom: isActive ? '2px solid #4F52C4' : '2px solid transparent',
            padding: '0 4px 10px',
            marginRight: 24,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          })}
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}
