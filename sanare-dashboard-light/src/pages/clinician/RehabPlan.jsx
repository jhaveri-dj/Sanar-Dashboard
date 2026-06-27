import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Trash2, Save, ExternalLink, ChevronRight } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { rehabPhaseMap, EXERCISES_BY_PHASE } from '../../data/clinicianData'
import { patients } from '../../data/patients'
import { getPatientAvatar } from '../../data/patientAvatars'

const DIFFICULTY = {
  Easy:   { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  Medium: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  Hard:   { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}

const PHASE_STATUS = {
  completed: { ring: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  current:   { ring: '#4F52C4', bg: '#EEF2FF', border: '#C7D2FE' },
  upcoming:  { ring: '#D1D5DB', bg: '#F9FAFB', border: '#E5E7EB' },
}

const DEFAULT_VIDEOS = {
  'Leg Press (single leg)': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
  'Terminal Knee Extensions': 'https://www.youtube.com/watch?v=ADid8jssmFI',
  'Romanian Deadlift': 'https://www.youtube.com/watch?v=2SHskkLwo4M',
  'Heel Slides': 'https://www.youtube.com/watch?v=5M9OrUKNaEc',
}

function withDefaults(exercises = []) {
  return exercises.map((ex, i) => ({
    id: `ex-${i}-${ex.name}`,
    name: ex.name,
    sets: ex.sets,
    reps: ex.reps,
    duration: ex.duration || ex.reps,
    frequency: ex.frequency,
    difficulty: ex.difficulty,
    videoUrl: ex.videoUrl || DEFAULT_VIDEOS[ex.name] || '',
  }))
}

function buildInitialPhasePlans(rehabPhases) {
  return Object.fromEntries(
    rehabPhases.map(ph => [
      ph.number,
      {
        title: `Phase ${ph.number}: ${ph.name} Protocol`,
        exercises: withDefaults(ph.exercises || EXERCISES_BY_PHASE[ph.number] || []),
      },
    ])
  )
}

const INPUT = {
  width: '100%',
  fontSize: 13,
  padding: '7px 10px',
  border: '1px solid #D1D5DB',
  borderRadius: 8,
  background: '#FFFFFF',
  color: '#111827',
  outline: 'none',
}

const EMPTY_EXERCISE = {
  name: '',
  sets: 3,
  reps: '12',
  duration: '12 reps',
  frequency: '3×/week',
  difficulty: 'Medium',
  videoUrl: '',
}

export default function RehabPlan() {
  const { id } = useParams()
  const p = patients.find(pt => pt.id === id) || patients[0]
  const rehabPhases = rehabPhaseMap[p.id] || rehabPhaseMap['alex-chen-001']
  const currentPhaseData = rehabPhases.find(ph => ph.status === 'current')

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState(currentPhaseData?.number ?? 3)
  const [phasePlans, setPhasePlans] = useState(() => buildInitialPhasePlans(rehabPhases))

  const activePhase = rehabPhases.find(ph => ph.number === selectedPhase)
  const activePlan = phasePlans[selectedPhase]

  if (!currentPhaseData || !activePhase || !activePlan) return null

  function updateExercise(exId, field, value) {
    setPhasePlans(prev => ({
      ...prev,
      [selectedPhase]: {
        ...prev[selectedPhase],
        exercises: prev[selectedPhase].exercises.map(ex =>
          ex.id === exId ? { ...ex, [field]: value } : ex
        ),
      },
    }))
    setSaved(false)
  }

  function updateTitle(value) {
    setPhasePlans(prev => ({
      ...prev,
      [selectedPhase]: { ...prev[selectedPhase], title: value },
    }))
    setSaved(false)
  }

  function addExercise() {
    setPhasePlans(prev => ({
      ...prev,
      [selectedPhase]: {
        ...prev[selectedPhase],
        exercises: [...prev[selectedPhase].exercises, { ...EMPTY_EXERCISE, id: `ex-${Date.now()}` }],
      },
    }))
    setSaved(false)
  }

  function removeExercise(exId) {
    setPhasePlans(prev => ({
      ...prev,
      [selectedPhase]: {
        ...prev[selectedPhase],
        exercises: prev[selectedPhase].exercises.filter(ex => ex.id !== exId),
      },
    }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setEditing(false)
  }

  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Link to="/clinician/recovery-plans" style={{ color: '#374151', textDecoration: 'none' }}>Recovery Plans</Link>
          <ChevronRight size={12} color="#D1D5DB" />
          <span style={{ color: '#111827', fontWeight: 500 }}>{p.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing ? (
            <>
              <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button type="button" className="btn-ghost" onClick={handleSave} style={{ background: '#4F52C4', color: '#FFFFFF', borderColor: '#4F52C4' }}>
                <Save size={14} />
                Save protocol
              </button>
            </>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>Edit protocol</button>
          )}
        </div>
      </div>

      <div className="page-shell" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <img src={getPatientAvatar(p.id, 56)} alt={p.name} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover' }} />
          <div>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>{p.name} · Week {p.weekInRecovery}</p>
            <h1 className="page-title" style={{ fontSize: 26, marginTop: 4 }}>Training Protocol Editor</h1>
            <p className="page-subtitle">Build a custom exercise plan for each recovery phase</p>
          </div>
        </div>

        {saved && (
          <div className="card" style={{ padding: '12px 16px', marginBottom: 16, background: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#166534' }}>Protocol saved — patient will see updated exercises in their portal.</p>
          </div>
        )}

        {/* Phase selector */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Select phase to edit
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {rehabPhases.map(phase => {
              const st = PHASE_STATUS[phase.status]
              const selected = phase.number === selectedPhase
              return (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => setSelectedPhase(phase.number)}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
                    background: selected ? '#4F52C4' : st.bg,
                    border: `1px solid ${selected ? '#4F52C4' : st.border}`,
                    color: selected ? '#FFFFFF' : phase.status === 'current' ? '#4F52C4' : '#374151',
                  }}
                >
                  P{phase.number}: {phase.name}
                  {phase.status === 'current' && !selected && ' · Current'}
                </button>
              )
            })}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 12, color: '#6B7280' }}>{activePhase.weekRange}</p>
        </div>

        <div className="card" style={{ padding: '24px 26px', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
            <div style={{ flex: 1 }}>
              {editing ? (
                <input
                  value={activePlan.title}
                  onChange={e => updateTitle(e.target.value)}
                  style={{ ...INPUT, fontSize: 18, fontWeight: 600, marginBottom: 6 }}
                />
              ) : (
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>{activePlan.title}</h2>
              )}
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
                {activePlan.exercises.length} exercises · assign sets, duration, and demo videos
              </p>
            </div>
            {editing && (
              <button type="button" className="btn-ghost" onClick={addExercise}>
                <Plus size={14} />
                Add exercise
              </button>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8EAED' }}>
                  {['Exercise', 'Sets', 'Reps / Duration', 'Frequency', 'Video', 'Difficulty', editing ? '' : null]
                    .filter(Boolean)
                    .map(h => (
                      <th key={h} style={{
                        textAlign: 'left', color: '#6B7280', fontSize: 11, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 12, paddingRight: 16,
                      }}>
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {activePlan.exercises.map(ex => {
                  const dc = DIFFICULTY[ex.difficulty] || DIFFICULTY.Medium
                  return (
                    <tr key={ex.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px 12px 0', minWidth: 180 }}>
                        {editing ? (
                          <input style={INPUT} value={ex.name} onChange={e => updateExercise(ex.id, 'name', e.target.value)} placeholder="Exercise name" />
                        ) : (
                          <span style={{ fontWeight: 600, color: '#111827' }}>{ex.name}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px 12px 0', width: 70 }}>
                        {editing ? (
                          <input style={INPUT} type="number" min={1} value={ex.sets} onChange={e => updateExercise(ex.id, 'sets', Number(e.target.value))} />
                        ) : ex.sets}
                      </td>
                      <td style={{ padding: '12px 16px 12px 0', minWidth: 120 }}>
                        {editing ? (
                          <input style={INPUT} value={ex.duration} onChange={e => updateExercise(ex.id, 'duration', e.target.value)} placeholder="e.g. 30s or 12 reps" />
                        ) : ex.duration}
                      </td>
                      <td style={{ padding: '12px 16px 12px 0', minWidth: 100 }}>
                        {editing ? (
                          <input style={INPUT} value={ex.frequency} onChange={e => updateExercise(ex.id, 'frequency', e.target.value)} />
                        ) : ex.frequency}
                      </td>
                      <td style={{ padding: '12px 16px 12px 0', minWidth: 160 }}>
                        {editing ? (
                          <input style={INPUT} value={ex.videoUrl} onChange={e => updateExercise(ex.id, 'videoUrl', e.target.value)} placeholder="Video URL" />
                        ) : ex.videoUrl ? (
                          <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4F52C4', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            Watch demo <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ color: '#9CA3AF' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px 12px 0' }}>
                        {editing ? (
                          <select value={ex.difficulty} onChange={e => updateExercise(ex.id, 'difficulty', e.target.value)} style={INPUT}>
                            {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        ) : (
                          <span style={{
                            fontSize: 12, fontWeight: 600, padding: '4px 11px', borderRadius: 999,
                            color: dc.color, background: dc.bg, border: `1px solid ${dc.border}`,
                          }}>
                            {ex.difficulty}
                          </span>
                        )}
                      </td>
                      {editing && (
                        <td style={{ padding: '12px 0' }}>
                          <button type="button" onClick={() => removeExercise(ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <Trash2 size={15} color="#DC2626" />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: '24px 26px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#111827' }}>Clinical Note</h2>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.8, margin: 0, borderLeft: '3px solid #C7D2FE', paddingLeft: 16 }}>
            {p.notes}
          </p>
        </div>
      </div>
    </ClinicianLayout>
  )
}
