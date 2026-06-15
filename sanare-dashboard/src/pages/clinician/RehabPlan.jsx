import { useParams } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { rehabPhaseMap } from '../../data/clinicianData'
import { patients } from '../../data/patients'

const DIFFICULTY_COLORS = {
  Easy:   { bg: 'rgba(16,185,129,0.12)', text: '#10B981', border: 'rgba(16,185,129,0.3)' },
  Medium: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  Hard:   { bg: 'rgba(239,68,68,0.12)',  text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
}

const PHASE_STATUS_STYLES = {
  completed: { ring: '#10B981', bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
  current:   { ring: '#3B82F6', bg: 'rgba(59,130,246,0.18)', text: '#60A5FA' },
  upcoming:  { ring: '#374151', bg: 'rgba(255,255,255,0.04)', text: '#94A3B8' },
}

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  padding: '24px 26px',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
}
const EYEBROW = { color: '#60A5FA', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }
const TITLE   = { color: 'white', fontSize: 21, fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }

export default function RehabPlan() {
  const { id } = useParams()
  const p = patients.find(pt => pt.id === id) || patients[0]
  const rehabPhases = rehabPhaseMap[p.id] || rehabPhaseMap['alex-chen-001']
  const currentPhaseData = rehabPhases.find(ph => ph.status === 'current')

  return (
    <ClinicianLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 32px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <p style={EYEBROW}>{p.name} · Week {p.weekInRecovery}</p>
          <h1 style={{ color: '#F9FAFB', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Rehabilitation Plan</h1>
        </div>

        {/* Current phase highlight */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(59,130,246,0.16), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }}/>
          <div style={{ position: 'relative', background: 'linear-gradient(160deg, #16243F 0%, #141C2D 55%, #11141E 100%)', border: '1px solid rgba(59,130,246,0.22)', borderRadius: 20, padding: '26px 30px', boxShadow: '0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#60A5FA', fontWeight: 900, fontSize: 22 }}>P{currentPhaseData.number}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h2 style={{ color: '#F9FAFB', fontSize: 21, fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>Phase {currentPhaseData.number}: {currentPhaseData.name}</h2>
                  <span style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(59,130,246,0.3)' }}>Current Phase</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, margin: 0 }}>{currentPhaseData.weekRange}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {currentPhaseData.goals.map(goal => (
                    <span key={goal} style={{ fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1', padding: '5px 13px', borderRadius: 999 }}>{goal}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Roadmap */}
        <div style={{ ...CARD, marginBottom: 20 }}>
          <div style={{ marginBottom: 22 }}>
            <p style={EYEBROW}>Phase Progression</p>
            <h2 style={TITLE}>Recovery Roadmap</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'rgba(255,255,255,0.1)' }}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {rehabPhases.map(phase => {
                const st = PHASE_STATUS_STYLES[phase.status]
                return (
                  <div key={phase.number} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${st.ring}`, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                      {phase.status === 'completed' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      ) : phase.status === 'current' ? (
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3B82F6' }} className="animate-pulse"/>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 700 }}>{phase.number}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: phase.status === 'current' ? 'rgba(59,130,246,0.08)' : phase.status === 'completed' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${phase.status === 'current' ? 'rgba(59,130,246,0.25)' : phase.status === 'completed' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.07)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                        <p style={{ color: st.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Phase {phase.number}: {phase.name}</p>
                        <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>{phase.weekRange}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                        {phase.goals.map(goal => (
                          <span key={goal} style={{ fontSize: 12, fontWeight: 500, color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 7 }}>{goal}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Exercise Protocol */}
        <div style={{ ...CARD, marginBottom: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={EYEBROW}>Prescribed Exercises</p>
            <h2 style={TITLE}>Phase {currentPhaseData.number} Protocol</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500, margin: '6px 0 0' }}>{currentPhaseData.exercises.length} exercises · {currentPhaseData.weekRange}</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Exercise', 'Sets', 'Reps', 'Frequency', 'Difficulty'].map(h => (
                    <th key={h} style={{ textAlign: 'left', color: '#9CA3AF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 12, paddingRight: 24, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPhaseData.exercises.map((ex, i) => {
                  const dc = DIFFICULTY_COLORS[ex.difficulty]
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 24px 14px 0', color: '#F9FAFB', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{ex.name}</td>
                      <td style={{ padding: '14px 24px 14px 0', color: '#CBD5E1', fontSize: 14 }}>{ex.sets}</td>
                      <td style={{ padding: '14px 24px 14px 0', color: '#CBD5E1', fontSize: 14 }}>{ex.reps}</td>
                      <td style={{ padding: '14px 24px 14px 0', color: '#CBD5E1', fontSize: 14, whiteSpace: 'nowrap' }}>{ex.frequency}</td>
                      <td style={{ padding: '14px 0' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 999, color: dc.text, background: dc.bg, border: `1px solid ${dc.border}` }}>{ex.difficulty}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Notes */}
        <div style={CARD}>
          <div style={{ marginBottom: 16 }}>
            <p style={EYEBROW}>Clinical Note</p>
            <h2 style={TITLE}>Notes</h2>
          </div>
          <div style={{ borderLeft: '2px solid rgba(59,130,246,0.4)', paddingLeft: 18 }}>
            <p style={{ color: '#D1D5DB', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{p.notes}</p>
          </div>
          <p style={{ color: '#94A3B8', fontSize: 12, margin: '14px 0 0' }}>Read-only · Notes updated by Sarah Mitchell</p>
        </div>

      </div>
    </ClinicianLayout>
  )
}
