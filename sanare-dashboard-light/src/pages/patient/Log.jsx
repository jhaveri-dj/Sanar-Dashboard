import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import PatientLayout from '../../components/patient/PatientLayout'
import PatientContextHeader from '../../components/patient/PatientContextHeader'
import { currentPatient } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

function painColor(v) {
  if (v <= 3) return '#16A34A'
  if (v <= 6) return '#D97706'
  return '#DC2626'
}

function painBg(v) {
  if (v <= 3) return '#F0FDF4'
  if (v <= 6) return '#FFFBEB'
  return '#FEF2F2'
}

const PAIN_LEVELS = [
  { value: 0,  label: 'No pain'          },
  { value: 1,  label: 'Barely noticeable' },
  { value: 2,  label: 'Very mild'        },
  { value: 3,  label: 'Mild'             },
  { value: 4,  label: 'Uncomfortable'    },
  { value: 5,  label: 'Moderate'         },
  { value: 6,  label: 'Distracting'      },
  { value: 7,  label: 'Distressing'      },
  { value: 8,  label: 'Intense'          },
  { value: 9,  label: 'Severe'           },
  { value: 10, label: 'Unbearable'       },
]

function PainScale({ value, onChange }) {
  const level = PAIN_LEVELS[value]
  const color = painColor(value)
  const bg = painBg(value)

  return (
    <div>
      <label style={{ color: '#1F2937', fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 12 }}>
        How much pain did you feel today?
      </label>

      <div style={{
        background: bg,
        border: `1px solid ${color}33`,
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: '#FFFFFF',
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 26, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {value}
          </span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Pain score · NRS 0–10</p>
          <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>
            {level.label}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gap: 5 }}>
        {PAIN_LEVELS.map(({ value: v }) => {
          const active = value === v
          const c = painColor(v)
          return (
            <button
              key={v}
              type="button"
              aria-label={`Pain level ${v}`}
              aria-pressed={active}
              onClick={() => onChange(v)}
              style={{
                aspectRatio: '1',
                minWidth: 0,
                borderRadius: 8,
                border: active ? `2px solid ${c}` : '1px solid #E8EAED',
                background: active ? painBg(v) : '#FFFFFF',
                color: active ? c : '#6B7280',
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontVariantNumeric: 'tabular-nums',
                padding: 0,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = '#C7D2FE'
                  e.currentTarget.style.background = '#F9FAFB'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = '#E8EAED'
                  e.currentTarget.style.background = '#FFFFFF'
                }
              }}
            >
              {v}
            </button>
          )
        })}
      </div>

      <div style={{
        marginTop: 10,
        height: 4,
        borderRadius: 2,
        background: 'linear-gradient(to right, #16A34A 0%, #16A34A 30%, #D97706 55%, #DC2626 100%)',
        opacity: 0.35,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 8, color: '#9CA3AF' }}>
        <span>0 · No pain</span>
        <span>5 · Moderate</span>
        <span>10 · Worst</span>
      </div>
    </div>
  )
}

const COMPLETION_OPTIONS = [
  { value: 'Yes',     label: 'Yes — all done'    },
  { value: 'Partial', label: 'Partial'           },
  { value: 'No',      label: 'No — missed today' },
]

const FEELING_OPTIONS = [
  { value: 'Strong',    label: 'Strong'    },
  { value: 'Okay',      label: 'Okay'      },
  { value: 'Struggled', label: 'Struggled' },
]

const PAST_LOGS = [
  { date: 'Jun 4',  pain: 2, completion: 'Yes',     feeling: 'Strong'    },
  { date: 'Jun 3',  pain: 3, completion: 'Partial', feeling: 'Okay'      },
  { date: 'Jun 2',  pain: 4, completion: 'Partial', feeling: 'Okay'      },
  { date: 'Jun 1',  pain: 2, completion: 'Yes',     feeling: 'Strong'    },
  { date: 'May 31', pain: 6, completion: 'No',      feeling: 'Struggled' },
]

function badgeStyle(value) {
  if (value === 'Yes' || value === 'Strong') {
    return { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }
  }
  if (value === 'Partial' || value === 'Okay') {
    return { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }
  }
  return { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }
}

export default function Log() {
  const [pain,       setPain]       = useState(3)
  const [completion, setCompletion] = useState('Yes')
  const [feeling,    setFeeling]    = useState(null)
  const [notes,      setNotes]      = useState('')
  const [submitted,  setSubmitted]  = useState(false)
  const [history,    setHistory]    = useState(PAST_LOGS)

  function handleSubmit() {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setHistory(prev => [{ date: today, pain, completion, feeling }, ...prev.slice(0, 4)])
    setPain(3); setCompletion('Yes'); setFeeling(null); setNotes('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const canSubmit = completion !== null && feeling !== null
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <PatientContextHeader
            title="Today's Log"
            facts={[
              { label: 'Recovery week', value: `Week ${currentPatient.weekInRecovery} of ${currentPatient.totalWeeks}` },
              { label: 'Phase', value: currentPatient.currentPhase.name },
              { label: 'Today', value: todayStr },
              { label: 'Log streak', value: '8 days' },
              { label: 'Sessions', value: '4 of 5 this week' },
            ]}
          />

          {submitted && (
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12,
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <CheckCircle size={20} color="#16A34A" strokeWidth={2} />
              <p style={{ color: '#16A34A', fontWeight: 600, margin: 0 }}>Log saved! Great work today, Alex.</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

            {/* Form card */}
            <div style={{ ...CARD, flex: 1, padding: '28px 32px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 24px' }}>How did today go?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <PainScale value={pain} onChange={setPain} />

                {/* Exercise completion */}
                <div>
                  <label style={{ color: '#1F2937', fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 10 }}>
                    Did you complete your exercises?
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {COMPLETION_OPTIONS.map(({ value, label }) => {
                      const isActive = completion === value
                      return (
                        <button
                          key={value}
                          onClick={() => setCompletion(value)}
                          style={{
                            padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.15s ease',
                            color: isActive ? '#FFFFFF' : '#374151',
                            background: isActive ? '#4F52C4' : '#FFFFFF',
                            border: isActive ? '1px solid transparent' : '1px solid #E8EAED',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Knee feel */}
                <div>
                  <label style={{ color: '#1F2937', fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 10 }}>
                    How did your knee feel during exercises?
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {FEELING_OPTIONS.map(({ value, label }) => {
                      const isActive = feeling === value
                      return (
                        <button
                          key={value}
                          onClick={() => setFeeling(value)}
                          style={{
                            padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.15s ease',
                            color: isActive ? '#FFFFFF' : '#374151',
                            background: isActive ? '#4F52C4' : '#FFFFFF',
                            border: isActive ? '1px solid transparent' : '1px solid #E8EAED',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ color: '#1F2937', fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 8 }}>
                    Any notes for your PT?
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. 'Felt some tightness behind my knee during squats...'"
                    rows={3}
                    style={{
                      width: '100%', minHeight: 100, borderRadius: 10, padding: '12px 16px',
                      fontSize: 14, resize: 'vertical', outline: 'none', lineHeight: 1.6,
                      background: '#F9FAFB', border: '1px solid #D1D5DB', color: '#1F2937',
                      boxSizing: 'border-box', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#4F52C4'
                      e.currentTarget.style.boxShadow = '0 0 0 2px #EEF2FF'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#D1D5DB'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', padding: '14px', borderRadius: 12,
                    fontSize: 15, fontWeight: 600, border: 'none', marginTop: 8,
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    background: canSubmit ? '#4F52C4' : '#F3F4F6',
                    color: canSubmit ? '#FFFFFF' : '#6B7280',
                  }}
                  onMouseEnter={e => {
                    if (canSubmit) {
                      e.currentTarget.style.background = '#4338CA'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,82,196,0.28)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (canSubmit) {
                      e.currentTarget.style.background = '#4F52C4'
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <CheckCircle size={18} />
                  Save Today's Log
                </button>
              </div>
            </div>

            {/* Recent Sessions */}
            <div style={{ ...CARD, width: 340, flexShrink: 0 }}>
              <div style={{ padding: '20px 20px 12px' }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Recent Sessions</h2>
              </div>
              {history.map((log, i) => {
                const pc = painColor(log.pain)
                const doneBadge = badgeStyle(log.completion)
                const feelBadge = badgeStyle(log.feeling)
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 20px',
                      borderTop: '1px solid #F3F4F6',
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, width: 52, flexShrink: 0 }}>
                      {log.date}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: pc, width: 24, textAlign: 'center', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {log.pain}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                      ...doneBadge,
                    }}>
                      {log.completion}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                      ...feelBadge,
                    }}>
                      {log.feeling}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
