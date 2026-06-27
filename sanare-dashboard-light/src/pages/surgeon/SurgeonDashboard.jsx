import { Link } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { clinicianRoster, patientDataMap } from '../../data/clinicianData'

const RTS_BADGES = {
  green:  { label: 'RTS Ready', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  yellow: { label: 'Monitor',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  red:    { label: 'Not Ready', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

function getRtsStatus(s) {
  const metCount = [s.symmetryIndex >= 90, s.rom >= 125, s.jointStrengthIndex >= 80].filter(Boolean).length
  if (metCount === 3) return RTS_BADGES.green
  if (s.symmetryIndex < 70) return RTS_BADGES.red
  return RTS_BADGES.yellow
}

export default function SurgeonDashboard() {
  const rtsReady = clinicianRoster.filter(row => {
    const s = patientDataMap[row.id]?.currentWeekSummary
    if (!s) return false
    return s.symmetryIndex >= 90 && s.rom >= 125 && s.jointStrengthIndex >= 80
  }).length

  const atRisk = clinicianRoster.filter(r => r.rtm === 'At Risk').length

  return (
    <SurgeonLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Surgical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Overview</span>
        </div>
      </div>

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            Post-op recovery at a glance · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Active patients', value: clinicianRoster.length, accent: '#4F52C4' },
            { label: 'RTS ready', value: rtsReady, accent: '#16A34A' },
            { label: 'Needs attention', value: atRisk, accent: '#DC2626' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="card" style={{ padding: '18px 20px', borderLeft: `3px solid ${accent}` }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 600, color: '#111827' }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Recent patients</h2>
          <Link to="/surgeon/patients" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 13 }}>
            <Users size={14} />
            View all patients
          </Link>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {clinicianRoster.map((row, idx) => {
            const s = patientDataMap[row.id]?.currentWeekSummary
            const rts = s ? getRtsStatus(s) : RTS_BADGES.yellow
            return (
              <Link
                key={row.id}
                to={`/surgeon/patient/${row.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '14px 20px',
                  textDecoration: 'none',
                  borderBottom: idx < clinicianRoster.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' }}>{row.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
                    {row.injury} · Week {row.week} · ROM {row.rom}
                  </p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                  background: rts.bg, color: rts.color, border: `1px solid ${rts.border}`,
                }}>
                  {rts.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </SurgeonLayout>
  )
}
