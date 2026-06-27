import PatientLayout from '../../components/patient/PatientLayout'
import PatientContextHeader from '../../components/patient/PatientContextHeader'
import { rehabPhaseMap } from '../../data/clinicianData'
import { currentPatient } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

const DIFFICULTY = {
  Easy:   { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  Medium: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  Hard:   { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}

const PHASE_STATUS = {
  completed: { dot: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Completed' },
  current:   { dot: '#4F52C4', bg: '#EEF2FF', border: '#C7D2FE', label: 'Current' },
  upcoming:  { dot: '#D1D5DB', bg: '#F9FAFB', border: '#E5E7EB', label: 'Upcoming' },
}

export default function PatientRehabPlan() {
  const phases = rehabPhaseMap[currentPatient.id] || rehabPhaseMap['alex-chen-001']
  const currentPhase = phases.find(p => p.status === 'current')
  const exerciseCount = currentPhase?.exercises?.length ?? 0

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <PatientContextHeader
            title="Rehab Plan"
            facts={[
              { label: 'Recovery week', value: `Week ${currentPatient.weekInRecovery} of ${currentPatient.totalWeeks}` },
              { label: 'Phase', value: currentPatient.currentPhase.name },
              { label: 'Week range', value: currentPhase?.weekRange ?? currentPatient.currentPhase.weekRange },
              { label: 'Exercises', value: `${exerciseCount} prescribed` },
              { label: 'Your PT', value: currentPatient.assignedPT },
            ]}
          />

          {currentPhase && (
            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #FAFBFF 100%)',
              border: '1px solid #C7D2FE',
              borderRadius: 16,
              padding: '24px 28px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Current phase · {currentPhase.weekRange}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '8px 0 0' }}>
                Phase {currentPhase.number}: {currentPhase.name}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {currentPhase.goals.map(goal => (
                  <span
                    key={goal}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '5px 12px',
                      borderRadius: 999,
                      background: '#FFFFFF',
                      border: '1px solid #C7D2FE',
                      color: '#4338CA',
                    }}
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentPhase?.exercises && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
                  This week&apos;s exercises
                </h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
                  Prescribed by {currentPatient.assignedPT}
                </p>
              </div>
              <div>
                {currentPhase.exercises.map((exercise, idx) => {
                  const diff = DIFFICULTY[exercise.difficulty] || DIFFICULTY.Medium
                  const isLast = idx === currentPhase.exercises.length - 1
                  return (
                    <div
                      key={exercise.name}
                      style={{
                        padding: '16px 24px',
                        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>
                          {exercise.name}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
                          {exercise.sets} sets × {exercise.reps} · {exercise.frequency}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: diff.bg,
                        color: diff.color,
                        border: `1px solid ${diff.border}`,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ ...CARD, padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
              Full recovery roadmap
            </h2>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 16, bottom: 16, width: 2, background: '#E5E7EB' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {phases.map(phase => {
                  const st = PHASE_STATUS[phase.status]
                  return (
                    <div key={phase.number} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        flexShrink: 0,
                        zIndex: 1,
                        background: st.bg,
                        border: `2px solid ${st.dot}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: phase.status === 'current' ? '#4F52C4' : phase.status === 'completed' ? '#16A34A' : '#9CA3AF',
                      }}>
                        {phase.number}
                      </div>
                      <div style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>
                            {phase.name}
                          </p>
                          <span style={{ fontSize: 11, fontWeight: 600, color: st.dot }}>{st.label}</span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280' }}>{phase.weekRange}</p>
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
