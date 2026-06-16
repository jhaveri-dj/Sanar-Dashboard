import { useState } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'
import { exerciseLog } from '../../data/patientData'

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}

function painColor(v) {
  if (v <= 3) return '#10B981'
  if (v <= 6) return '#F59E0B'
  return '#EF4444'
}

function painEmoji(v) {
  if (v === 0) return '😊'
  if (v <= 3) return '🙂'
  if (v <= 6) return '😐'
  if (v <= 8) return '😣'
  return '🤕'
}

const PAST_LOGS = exerciseLog.slice(1, 6).map((day, i) => {
  const done = day.exercises.filter(e => e.completed).length
  const total = day.exercises.length
  const completion = done === total ? 'Yes' : done >= Math.ceil(total / 2) ? 'Partial' : 'No'
  const pains = [2, 3, 4, 2, 6]
  const feelings = ['Strong', 'Okay', 'Okay', 'Strong', 'Struggled']
  return { date: day.date, pain: pains[i], completion, feeling: feelings[i] }
})

const COMPLETION_OPTIONS = [
  { value: 'Yes',     label: '✓  Yes — all done',        activeColor: '#10B981', activeBg: 'rgba(16,185,129,0.12)', activeBorder: 'rgba(16,185,129,0.35)' },
  { value: 'Partial', label: '~  Partial',                activeColor: '#F59E0B', activeBg: 'rgba(245,158,11,0.12)', activeBorder: 'rgba(245,158,11,0.35)' },
  { value: 'No',      label: '✕  No — missed today',     activeColor: '#EF4444', activeBg: 'rgba(239,68,68,0.12)',  activeBorder: 'rgba(239,68,68,0.35)'  },
]

const FEELING_OPTIONS = [
  { value: 'Strong',    emoji: '💪', label: 'Strong',    activeColor: '#10B981', activeBg: 'rgba(16,185,129,0.12)', activeBorder: 'rgba(16,185,129,0.35)' },
  { value: 'Okay',      emoji: '😐', label: 'Okay',      activeColor: '#F59E0B', activeBg: 'rgba(245,158,11,0.12)', activeBorder: 'rgba(245,158,11,0.35)' },
  { value: 'Struggled', emoji: '😓', label: 'Struggled', activeColor: '#EF4444', activeBg: 'rgba(239,68,68,0.12)',  activeBorder: 'rgba(239,68,68,0.35)'  },
]

export default function Log() {
  const [pain, setPain] = useState(3)
  const [completion, setCompletion] = useState(null)
  const [feeling, setFeeling] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory] = useState(PAST_LOGS)

  function handleSubmit() {
    const today = new Date().toISOString().split('T')[0]
    setHistory(prev => [{ date: today, pain, completion, feeling }, ...prev.slice(0, 4)])
    setPain(3)
    setCompletion(null)
    setFeeling(null)
    setNotes('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const canSubmit = completion !== null && feeling !== null
  const color = painColor(pain)

  return (
    <PatientLayout>
      <style>{`
        .pain-range { -webkit-appearance: none; appearance: none; width: 100%; background: transparent; cursor: pointer; }
        .pain-range::-webkit-slider-runnable-track { background: rgba(255,255,255,0.08); height: 6px; border-radius: 3px; }
        .pain-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: var(--thumb-color, #3B82F6); margin-top: -8px; cursor: pointer; box-shadow: 0 0 0 4px rgba(59,130,246,0.18); transition: background 0.2s; }
        .pain-range::-moz-range-track { background: rgba(255,255,255,0.08); height: 6px; border-radius: 3px; }
        .pain-range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--thumb-color, #3B82F6); border: none; cursor: pointer; }
      `}</style>

      <div className="p-8">
        <div className="max-w-[1100px] mx-auto space-y-6">

          {/* Header */}
          <div>
            <p className="text-[#9CA3AF] text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-[#F9FAFB] text-3xl font-bold tracking-tight mt-0.5">Today's Log</h1>
          </div>

          {submitted && (
            <div className="rounded-xl px-5 py-4 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-xl">🎉</span>
              <p className="text-[#10B981] font-semibold">Log saved! Great work today, Alex.</p>
            </div>
          )}

          {/* 2-col: form + history */}
          <div className="grid grid-cols-2 gap-6 items-start">

            {/* Left: logging form */}
            <div style={CARD} className="rounded-2xl p-6 space-y-6">
              <h2 className="text-[#F9FAFB] font-bold text-lg">How did today go?</h2>

              {/* Pain slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#F9FAFB] font-semibold text-sm">How much pain did you feel today?</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{painEmoji(pain)}</span>
                    <span className="font-black text-2xl" style={{ color }}>{pain}</span>
                    <span className="text-[#9CA3AF] text-sm">/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0" max="10" value={pain}
                  onChange={e => setPain(Number(e.target.value))}
                  className="pain-range"
                  style={{ '--thumb-color': color }}
                />
                <div className="flex justify-between text-[#9CA3AF] text-xs mt-2">
                  <span>😊 No pain</span>
                  <span>😐 Moderate</span>
                  <span>😣 Severe</span>
                </div>
              </div>

              {/* Exercise completion */}
              <div>
                <label className="text-[#F9FAFB] font-semibold text-sm block mb-3">Did you complete your exercises?</label>
                <div className="flex flex-col gap-2">
                  {COMPLETION_OPTIONS.map(({ value, label, activeColor, activeBg, activeBorder }) => {
                    const isActive = completion === value
                    return (
                      <button
                        key={value}
                        onClick={() => setCompletion(value)}
                        className="w-full text-left px-4 rounded-xl font-medium text-sm transition-all"
                        style={{
                          minHeight: 48,
                          color: isActive ? activeColor : '#9CA3AF',
                          background: isActive ? activeBg : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? activeBorder : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Knee feeling */}
              <div>
                <label className="text-[#F9FAFB] font-semibold text-sm block mb-3">How did your knee feel during exercises?</label>
                <div className="grid grid-cols-3 gap-2">
                  {FEELING_OPTIONS.map(({ value, emoji, label, activeColor, activeBg, activeBorder }) => {
                    const isActive = feeling === value
                    return (
                      <button
                        key={value}
                        onClick={() => setFeeling(value)}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl font-semibold text-xs transition-all"
                        style={{
                          minHeight: 64,
                          color: isActive ? activeColor : '#9CA3AF',
                          background: isActive ? activeBg : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isActive ? activeBorder : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        <span className="text-xl">{emoji}</span>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[#F9FAFB] font-semibold text-sm block mb-2">Any notes for your PT?</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="E.g. 'Felt some tightness behind my knee during squats...'"
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm text-[#F9FAFB] placeholder-[#4B5563] resize-none outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full font-bold text-base rounded-xl transition-all"
                style={{
                  minHeight: 52,
                  background: canSubmit ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                  color: canSubmit ? '#fff' : '#4B5563',
                  boxShadow: canSubmit ? '0 4px 16px rgba(59,130,246,0.35)' : 'none',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                {canSubmit ? 'Save Today\'s Log' : 'Select completion & feeling to save'}
              </button>
            </div>

            {/* Right: past session history */}
            <div style={CARD} className="rounded-2xl p-6">
              <h2 className="text-[#F9FAFB] font-bold text-lg mb-5">Recent Sessions</h2>
              <div className="space-y-3">
                {history.map((log, i) => {
                  const pc = painColor(log.pain)
                  const completionColor = log.completion === 'Yes' ? '#10B981' : log.completion === 'Partial' ? '#F59E0B' : '#EF4444'
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex-shrink-0">
                        <p className="text-[#F9FAFB] font-semibold text-sm">
                          {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[#9CA3AF] text-xs">
                          {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="font-black text-lg" style={{ color: pc }}>{log.pain}</p>
                          <p className="text-[#9CA3AF] text-xs">Pain</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: completionColor }}>{log.completion}</p>
                          <p className="text-[#9CA3AF] text-xs">Done</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#F9FAFB]">{log.feeling}</p>
                          <p className="text-[#9CA3AF] text-xs">Feeling</p>
                        </div>
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
