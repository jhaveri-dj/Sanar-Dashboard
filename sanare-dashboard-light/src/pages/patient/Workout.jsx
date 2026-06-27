import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Pause, Play, Square, Zap } from 'lucide-react'
import PatientLayout from '../../components/patient/PatientLayout'
import { todayStats, activityRings } from '../../data/patientData'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

const MUSCLES = [
  { key: 'vmo',     label: 'VMO',     color: '#4F52C4', base: 72 },
  { key: 'vl',      label: 'VL',      color: '#16A34A', base: 78 },
  { key: 'rf',      label: 'RF',      color: '#818CF8', base: 70 },
  { key: 'bf',      label: 'BF',      color: '#D97706', base: 75 },
  { key: 'gastroc', label: 'Gastroc', color: '#DC2626', base: 80 },
]

function jitterPct(base, spread = 8) {
  return Math.round(Math.max(20, Math.min(98, base + (Math.random() - 0.5) * spread * 2)))
}

function nextRom(prev) {
  const delta = (Math.random() - 0.5) * 16
  return Math.round(Math.max(88, Math.min(125, prev + delta)))
}

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function LiveRomGauge({ rom, peak }) {
  const minRom = 85
  const maxRom = 130
  const pct = ((rom - minRom) / (maxRom - minRom)) * 100
  const r = 72
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={r} fill="none" stroke="#EEF2FF" strokeWidth="12" />
          <circle
            cx="90" cy="90" r={r}
            fill="none" stroke="#4F52C4" strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%',
        }}>
          <div style={{ fontSize: 42, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
            {rom}<span style={{ fontSize: 28, fontWeight: 600 }}>°</span>
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>Knee flexion</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
        Session peak: <strong style={{ color: '#4F52C4' }}>{peak}°</strong>
      </p>
    </div>
  )
}

function MuscleBar({ label, value, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.35s ease',
        }}/>
      </div>
    </div>
  )
}

export default function Workout() {
  const [active, setActive] = useState(false)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [rom, setRom] = useState(todayStats.currentRom)
  const [peakRom, setPeakRom] = useState(todayStats.currentRom)
  const [muscles, setMuscles] = useState(() =>
    Object.fromEntries(MUSCLES.map(m => [m.key, m.base]))
  )
  const tickRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!active || paused) {
      clearInterval(tickRef.current)
      clearInterval(timerRef.current)
      return undefined
    }

    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)

    tickRef.current = setInterval(() => {
      setRom(prev => {
        const next = nextRom(prev)
        setPeakRom(p => Math.max(p, next))
        return next
      })
      setMuscles(prev => {
        const next = { ...prev }
        MUSCLES.forEach(m => {
          next[m.key] = jitterPct(prev[m.key], 10)
        })
        return next
      })
    }, 400)

    return () => {
      clearInterval(tickRef.current)
      clearInterval(timerRef.current)
    }
  }, [active, paused])

  function handleStart() {
    setActive(true)
    setPaused(false)
    setElapsed(0)
    setPeakRom(todayStats.currentRom)
    setRom(todayStats.currentRom)
    setMuscles(Object.fromEntries(MUSCLES.map(m => [m.key, m.base])))
  }

  function handleEnd() {
    setActive(false)
    setPaused(false)
  }

  const avgActivation = Math.round(
    Object.values(muscles).reduce((a, b) => a + b, 0) / MUSCLES.length
  )

  return (
    <PatientLayout>
      <div style={{ padding: '24px 24px 48px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#111827' }}>Live Workout</h1>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6B7280' }}>
                Sanaré Sleeve · real-time sensor feedback
              </p>
            </div>
            {active && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 999,
                background: paused ? '#FFFBEB' : '#F0FDF4',
                border: `1px solid ${paused ? '#FDE68A' : '#BBF7D0'}`,
              }}>
                {!paused && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#16A34A',
                    animation: 'pulse 1.2s ease-in-out infinite',
                  }}/>
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: paused ? '#D97706' : '#16A34A' }}>
                  {paused ? 'Paused' : 'Live'}
                </span>
                <span style={{ fontSize: 13, color: '#374151', fontVariantNumeric: 'tabular-nums' }}>
                  {formatElapsed(elapsed)}
                </span>
              </div>
            )}
          </div>

          {!active ? (
            <div style={{ ...CARD, padding: 32, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: '#EEF2FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Activity size={28} color="#4F52C4" />
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: '#111827' }}>
                Ready to train?
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6B7280', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
                Start your session to see live range of motion and muscle activation from your Sanaré Sleeve.
              </p>
              <button
                type="button"
                onClick={handleStart}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#4F52C4', color: '#FFFFFF', border: 'none',
                  fontSize: 15, fontWeight: 600, borderRadius: 12,
                  padding: '14px 28px', cursor: 'pointer',
                }}
              >
                <Play size={18} fill="#FFFFFF" />
                Start Workout
              </button>
            </div>
          ) : (
            <>
              <div style={{ ...CARD, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Zap size={16} color="#4F52C4" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Range of Motion</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6B7280' }}>Updates every rep</span>
                </div>
                <LiveRomGauge rom={rom} peak={peakRom} />
              </div>

              <div style={{ ...CARD, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={16} color="#16A34A" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Muscle Activation</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4F52C4' }}>
                    Avg {avgActivation}% MVIC
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {MUSCLES.map(m => (
                    <MuscleBar key={m.key} label={m.label} value={muscles[m.key]} color={m.color} />
                  ))}
                </div>
                <p style={{ margin: '16px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                  Baseline this week: {activityRings.muscleActivation.current}% avg activation
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setPaused(p => !p)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 20px', borderRadius: 12,
                    border: '1px solid #E8EAED', background: '#FFFFFF',
                    fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer',
                  }}
                >
                  {paused ? <Play size={16} /> : <Pause size={16} />}
                  {paused ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  onClick={handleEnd}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 20px', borderRadius: 12,
                    border: '1px solid #FECACA', background: '#FEF2F2',
                    fontSize: 14, fontWeight: 600, color: '#DC2626', cursor: 'pointer',
                  }}
                >
                  <Square size={16} />
                  End Workout
                </button>
              </div>

              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
                Finished?{' '}
                <Link to="/patient/log" style={{ color: '#4F52C4', fontWeight: 500, textDecoration: 'none' }}>
                  Log today&apos;s session
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </PatientLayout>
  )
}
