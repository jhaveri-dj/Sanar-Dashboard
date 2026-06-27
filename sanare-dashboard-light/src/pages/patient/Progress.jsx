import { useEffect, useState } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'
import PatientContextHeader from '../../components/patient/PatientContextHeader'
import { milestones, currentMilestone, todayStats, activityRings, weeklyReadiness, rehabPhases, currentRehabPhase, accomplishedMilestones } from '../../data/patientData'
import PhaseStepper from '../../components/patient/PhaseStepper'
import { currentPatient } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

function statusLabel(pct) {
  if (pct >= 80) return { text: 'Great progress!', color: '#16A34A' }
  if (pct >= 60) return { text: 'Getting there',   color: '#D97706' }
  return              { text: 'Needs attention',   color: '#DC2626' }
}

function barColor(pct) {
  if (pct >= 80) return '#16A34A'
  if (pct >= 60) return '#D97706'
  return '#DC2626'
}

const latestScore = weeklyReadiness[weeklyReadiness.length - 1].score

const METRICS = [
  {
    label:    'Knee Flexibility',
    sublabel: 'How far your knee bends',
    current:  todayStats.currentRom,
    goal:     130,
    unit:     '°',
    pct:      Math.min(Math.round((todayStats.currentRom / 130) * 100), 100),
  },
  {
    label:    'Muscle Strength',
    sublabel: 'How hard your muscles are working',
    current:  activityRings.muscleActivation.current,
    goal:     100,
    unit:     '%',
    pct:      activityRings.muscleActivation.current,
  },
  {
    label:    'Left vs Right Balance',
    sublabel: 'How even both legs feel',
    current:  84,
    goal:     95,
    unit:     '%',
    pct:      Math.round((84 / 95) * 100),
  },
  {
    label:    'Overall Strength',
    sublabel: 'Estimated recovery strength',
    current:  latestScore,
    goal:     100,
    unit:     '%',
    pct:      latestScore,
  },
]

export default function Progress() {
  const [barAnimated, setBarAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBarAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const completedCount = accomplishedMilestones.length
  const totalCount     = milestones.length
  const totalPhases    = rehabPhases.length

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <PatientContextHeader
            title="Your Progress"
            facts={[
              { label: 'Recovery week', value: `Week ${currentPatient.weekInRecovery} of ${currentPatient.totalWeeks}` },
              { label: 'Phase', value: currentPatient.currentPhase.name },
              { label: 'Current goal', value: currentMilestone.name },
              { label: 'Milestones', value: `${completedCount} of ${totalCount} done` },
              { label: 'Readiness', value: `${latestScore} / 100` },
            ]}
          />

          {/* Current phase focus — milestone-based */}
          <div style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #FAFBFF 100%)',
            border: '1px solid #C7D2FE',
            borderRadius: 16, padding: '24px 28px',
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Where you are now
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '6px 0 0' }}>
              Phase {currentRehabPhase.number} of {totalPhases} — {currentRehabPhase.name}
            </p>
            <p style={{ fontSize: 14, color: '#374151', margin: '8px 0 0' }}>
              {completedCount} of {totalCount} milestones accomplished
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
              Working toward: <strong style={{ color: '#111827' }}>{currentMilestone?.name}</strong>
              {' · '}Target {new Date(currentMilestone.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
            <div style={{ marginTop: 16 }}>
              <PhaseStepper phases={rehabPhases} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {accomplishedMilestones.map(m => (
                <span
                  key={m.id}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 999,
                    background: '#FFFFFF', color: '#16A34A', border: '1px solid #BBF7D0',
                  }}
                >
                  {m.name} ✓
                </span>
              ))}
              {currentMilestone && (
                <span style={{
                  fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 999,
                  background: '#EEF2FF', color: '#4F52C4', border: '1px solid #C7D2FE',
                }}>
                  {currentMilestone.name} — in progress
                </span>
              )}
            </div>
          </div>

          {/* How You're Doing */}
          <div style={{ ...CARD }}>
            <div style={{ padding: '24px 24px 0' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>How You're Doing</h2>
            </div>
            {METRICS.map(({ label, sublabel, current, goal, unit, pct }, idx) => {
              const status = statusLabel(pct)
              const fill   = barColor(pct)
              const isLast = idx === METRICS.length - 1
              return (
                <div
                  key={label}
                  style={{
                    padding: '16px 24px',
                    borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1F2937', margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{sublabel}</p>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 16, flexShrink: 0 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: fill, fontVariantNumeric: 'tabular-nums' }}>
                        {current}{unit}
                      </span>
                      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '2px 0 0' }}>of {goal}{unit}</p>
                    </div>
                  </div>
                  <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{
                      height: '100%',
                      width: barAnimated ? `${pct}%` : '0%',
                      background: fill, borderRadius: 4, transition: 'width 1s ease',
                    }}/>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: status.color, margin: 0 }}>{status.text}</p>
                </div>
              )
            })}
          </div>

          {/* Recovery Path */}
          <div style={{ ...CARD, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Recovery Path</h2>
              <span style={{ fontSize: 13, color: '#6B7280' }}>{completedCount}/{totalCount} milestones done</span>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Connector line */}
              <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: '#E5E7EB' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {milestones.map((m) => {
                  const isComplete   = m.status === 'completed'
                  const isInProgress = m.status === 'in-progress'

                  return (
                    <div key={m.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                        background: isComplete ? '#16A34A' : isInProgress ? '#4F52C4' : '#FFFFFF',
                        border: `2px solid ${isComplete ? '#16A34A' : isInProgress ? '#4F52C4' : '#E5E7EB'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isComplete ? (
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : isInProgress ? (
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFFFFF' }}/>
                        ) : null}
                      </div>

                      {/* Content card */}
                      <div style={{
                        flex: 1,
                        background: '#FFFFFF',
                        border: `1px solid ${isComplete ? '#BBF7D0' : isInProgress ? '#C7D2FE' : '#E8EAED'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        borderLeft: `3px solid ${isComplete ? '#16A34A' : isInProgress ? '#4F52C4' : '#E5E7EB'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <p style={{
                            fontSize: 14, fontWeight: 600, margin: 0,
                            color: isComplete ? '#16A34A' : isInProgress ? '#111827' : '#6B7280',
                          }}>
                            {m.name}
                          </p>
                          {isComplete && (
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                              background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0',
                            }}>
                              Done
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>
                          {isComplete
                            ? `Completed ${new Date(m.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : isInProgress
                            ? `Target: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : `Estimated: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          }
                        </p>
                        {isInProgress && (
                          <span style={{
                            display: 'inline-block', marginTop: 8,
                            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                            background: '#EEF2FF', color: '#4F52C4', border: '1px solid #C7D2FE',
                          }}>
                            In progress
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
