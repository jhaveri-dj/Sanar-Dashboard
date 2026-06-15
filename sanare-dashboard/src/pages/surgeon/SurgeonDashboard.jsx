import { Link } from 'react-router-dom'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'

function getRtsStatus(s) {
  const metCount = [s.symmetryIndex >= 90, s.rom >= 125, s.jointStrengthIndex >= 80].filter(Boolean).length
  if (metCount === 3) return { label: 'RTS Ready', color: '#10B981', key: 'green' }
  if (s.symmetryIndex < 70) return { label: 'Not Ready', color: '#EF4444', key: 'red' }
  return { label: 'Monitor', color: '#F59E0B', key: 'yellow' }
}

function getStatusLine(s) {
  if (s.symmetryIndex < 70) return 'Intervention needed'
  if (s.symmetryIndex < 90 || s.rom < 125 || s.jointStrengthIndex < 80) return 'Symmetry lagging'
  return 'On track'
}

function StatusIcon({ statusKey, size = 15 }) {
  const c = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }[statusKey]
  if (statusKey === 'green') return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
  if (statusKey === 'yellow') return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
}

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
}

export default function SurgeonDashboard() {
  return (
    <SurgeonLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 32px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Welcome back</p>
          <h1 style={{ color: '#F9FAFB', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Dr. James Ortiz</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, margin: '6px 0 0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ color: '#F9FAFB', fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }}>Post-Op Patient Roster</h2>
          <span style={{ background: 'rgba(139,92,246,0.12)', color: '#C4B5FD', fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 999, border: '1px solid rgba(139,92,246,0.25)' }}>
            {patients.length} patients
          </span>
        </div>

        {/* Patient cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {patients.map(p => {
            const s = patientDataMap[p.id].currentWeekSummary
            const rts = getRtsStatus(s)
            const status = getStatusLine(s)

            return (
              <div key={p.id} style={{ ...CARD, borderLeft: `3px solid ${rts.color}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>

                  {/* Patient identity — fixed width so columns align across rows */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 340, flexShrink: 0 }}>
                    <div className={`bg-gradient-to-br ${p.avatarColor}`} style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {p.initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ color: '#F9FAFB', fontSize: 17, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                      <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 500, margin: '3px 0 0' }}>{p.age}y · {p.graftType} · {p.affectedLeg} knee</p>
                      <p style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500, margin: '2px 0 0' }}>Week {p.weekInRecovery} · RTS target {p.projectedRTSDate}</p>
                    </div>
                  </div>

                  {/* LSI column — fixed width, right aligned */}
                  <div style={{ width: 90, flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>LSI</p>
                    <p style={{ color: rts.color, fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', margin: 0, textShadow: `0 0 16px ${rts.color}40` }}>{s.symmetryIndex}%</p>
                  </div>

                  {/* Status badge column — fixed width */}
                  <div style={{ width: 140, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: rts.color, fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 999, background: rts.color + '18', border: `1px solid ${rts.color}55` }}>
                      <StatusIcon statusKey={rts.key} size={14}/>
                      {rts.label}
                    </span>
                  </div>

                  {/* Status line column — flexes to fill */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#CBD5E1', fontSize: 14, fontWeight: 600, margin: 0 }}>{status}</p>
                  </div>

                  {/* CTA — fixed, right edge */}
                  <Link to={`/surgeon/patient/${p.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#8B5CF6', color: 'white', fontSize: 14, fontWeight: 700, padding: '10px 18px', borderRadius: 10, flexShrink: 0, textDecoration: 'none' }} className="hover:bg-[#7C3AED] transition-colors">
                    View Detail
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SurgeonLayout>
  )
}
