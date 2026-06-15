import { Link } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'

function getAdherenceColor(pct) {
  if (pct >= 80) return '#10B981'
  if (pct >= 65) return '#F59E0B'
  return '#EF4444'
}

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
  overflow: 'hidden',
}
const DIVIDER = '1px solid rgba(255,255,255,0.07)'

export default function Dashboard() {
  return (
    <ClinicianLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 32px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#60A5FA', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Welcome back</p>
          <h1 style={{ color: '#F9FAFB', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Sarah Mitchell</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, margin: '6px 0 0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ color: '#F9FAFB', fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>Patient Roster</h2>
          <span style={{ background: 'rgba(59,130,246,0.12)', color: '#93C5FD', fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 999, border: '1px solid rgba(59,130,246,0.25)' }}>
            {patients.length} patients assigned
          </span>
        </div>

        {/* Patient cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {patients.map(p => {
            const data = patientDataMap[p.id]
            const s = data.currentWeekSummary
            const patientAlerts = data.alerts
            const romTrend = s.rom - s.romPrevWeek

            const statCells = [
              { label: 'Phase',      value: `Phase ${p.currentPhase.number}`, sub: p.currentPhase.name, color: '#60A5FA' },
              { label: 'Week',       value: `${p.weekInRecovery} / 52`, sub: `${Math.round((p.weekInRecovery / p.totalWeeks) * 100)}% complete`, color: '#E5E7EB' },
              { label: 'ROM',        value: `${s.rom}°`, sub: `${romTrend >= 0 ? '+' : ''}${romTrend}° this week`, color: '#60A5FA' },
              { label: 'Adherence',  value: `${s.adherence}%`, sub: `${s.completedSessions} / ${s.prescribedSessions} sessions`, color: getAdherenceColor(s.adherence) },
              { label: 'Symmetry',   value: `${s.symmetryIndex}%`, sub: s.symmetryIndex >= 70 ? 'On target' : 'Below threshold', color: s.symmetryIndex >= 80 ? '#10B981' : s.symmetryIndex >= 70 ? '#F59E0B' : '#EF4444' },
              { label: 'Joint Strength', value: `${s.jointStrengthIndex}%`, sub: s.jointStrengthIndex >= 80 ? 'On target' : s.jointStrengthIndex >= 60 ? 'Building' : 'Below target', color: s.jointStrengthIndex >= 80 ? '#10B981' : s.jointStrengthIndex >= 60 ? '#F59E0B' : '#EF4444' },
            ]

            return (
              <div key={p.id} style={CARD}>

                {/* Card header */}
                <div style={{ padding: '20px 24px', borderBottom: DIVIDER, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className={`bg-gradient-to-br ${p.avatarColor}`} style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {p.initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ color: '#F9FAFB', fontSize: 17, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                        {patientAlerts.length > 0 && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', fontSize: 12, fontWeight: 700, padding: '2px 9px', borderRadius: 999, border: '1px solid rgba(239,68,68,0.3)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} className="animate-pulse"/>
                            {patientAlerts.length} alert{patientAlerts.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 500, margin: '3px 0 0' }}>{p.age}y · {p.graftType} · {p.affectedLeg} knee</p>
                    </div>
                  </div>
                  <Link to={`/clinician/patient/${p.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#3B82F6', color: 'white', fontSize: 14, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }} className="hover:bg-[#2563EB] transition-colors">
                    View Detail
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 md:grid-cols-6">
                  {statCells.map(({ label, value, sub, color }, i) => (
                    <div key={label} style={{ padding: '14px 20px', borderLeft: i > 0 ? DIVIDER : 'none', borderTop: i >= 3 ? DIVIDER : 'none' }} className={i >= 3 ? 'md:!border-t-0' : ''}>
                      <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 5px' }}>{label}</p>
                      <p style={{ color, fontSize: 20, fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: '-0.3px' }}>{value}</p>
                      <p style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500, margin: '3px 0 0' }}>{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Session dates footer */}
                <div style={{ padding: '14px 24px', borderTop: DIVIDER, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13 }}>
                    <span style={{ color: '#9CA3AF', fontWeight: 500 }}>Last session <span style={{ color: '#F9FAFB', fontWeight: 600 }}>{new Date(p.lastSessionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
                    <span style={{ color: '#9CA3AF', fontWeight: 500 }}>Next session <span style={{ color: '#60A5FA', fontWeight: 600 }}>{new Date(p.nextSessionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
                    <span style={{ color: '#9CA3AF', fontWeight: 500 }}>Projected RTS <span style={{ color: '#F9FAFB', fontWeight: 600 }}>{p.projectedRTSDate}</span></span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ClinicianLayout>
  )
}
