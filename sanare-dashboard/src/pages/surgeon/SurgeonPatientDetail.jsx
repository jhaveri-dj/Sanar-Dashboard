import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'

const MILESTONES = {
  'alex-chen-001': [
    { label: 'Pre-op',  rom: 130, lsi: 100, status: 'completed' },
    { label: 'Week 6',  rom: 83,  lsi: 68,  status: 'completed' },
    { label: 'Week 12', rom: 118, lsi: 84,  status: 'current'   },
    { label: 'Week 22', rom: null, lsi: null, status: 'upcoming' },
    { label: 'RTS',     rom: null, lsi: null, status: 'upcoming' },
  ],
  'marcus-webb-002': [
    { label: 'Pre-op',  rom: 130, lsi: 100, status: 'completed' },
    { label: 'Week 6',  rom: 89,  lsi: 64,  status: 'current'   },
    { label: 'Week 12', rom: null, lsi: null, status: 'upcoming' },
    { label: 'Week 22', rom: null, lsi: null, status: 'upcoming' },
    { label: 'RTS',     rom: null, lsi: null, status: 'upcoming' },
  ],
  'priya-sharma-003': [
    { label: 'Pre-op',  rom: 130, lsi: 100, status: 'completed' },
    { label: 'Week 6',  rom: 88,  lsi: 72,  status: 'completed' },
    { label: 'Week 12', rom: 118, lsi: 83,  status: 'completed' },
    { label: 'Week 22', rom: 128, lsi: 91,  status: 'current'   },
    { label: 'RTS',     rom: null, lsi: null, status: 'upcoming' },
  ],
}

const PT_NOTES = {
  'alex-chen-001': 'Alex Chen is progressing well through Phase 3 Strengthening at Week 12 post-operatively. VMO activation has improved incrementally and quad symmetry is trending upward toward clinical benchmarks. ROM of 118° reflects steady gains aligned with protocol expectations. Patient is on track for a November 2026 return-to-sport clearance evaluation, pending symmetry index reaching 90% or above and Joint Strength Index exceeding the 80% threshold.',
  'marcus-webb-002': 'Marcus Webb presents with a notable symmetry deficit at Week 6, with LSI currently at 64%, below the 70% clinical threshold required before Phase 3 progression. Weekly adherence has been below protocol at 52%, with no recorded session in the last 4 days. Recommend surgical follow-up before Week 8 to reassess trajectory and address dropout risk. Adjunctive VMO-isolation protocol has been initiated. Adherence barriers should be explored prior to next clinical contact.',
  'priya-sharma-003': 'Priya Sharma has demonstrated exceptional post-operative recovery and is now approaching return-to-sport criteria at Week 22. All three benchmark measures (LSI Symmetry 91%, ROM 128°, and Quad Strength Index 88%) are within or meeting target ranges. A formal return-to-sport clearance discussion is clinically appropriate at the next visit, with projected clearance in July 2026 pending successful functional testing and psychological readiness screening.',
}

const PT_CHECKLIST = {
  'alex-chen-001': [
    { item: 'Full passive extension achieved',      status: 'done' },
    { item: 'Quad activation, SLR without lag',      status: 'done' },
    { item: 'Normalized gait without brace',         status: 'done' },
    { item: 'Single-leg squat to 60 degrees',        status: 'progress' },
    { item: 'Bilateral hop symmetry 90% or above',   status: 'pending' },
    { item: 'Sport-specific agility drills cleared', status: 'pending' },
  ],
  'marcus-webb-002': [
    { item: 'Full passive extension achieved',      status: 'progress' },
    { item: 'Quad activation, SLR without lag',      status: 'progress' },
    { item: 'Normalized gait without brace',         status: 'pending' },
    { item: 'Single-leg squat to 60 degrees',        status: 'pending' },
    { item: 'Bilateral hop symmetry 90% or above',   status: 'pending' },
    { item: 'Sport-specific agility drills cleared', status: 'pending' },
  ],
  'priya-sharma-003': [
    { item: 'Full passive extension achieved',      status: 'done' },
    { item: 'Quad activation, SLR without lag',      status: 'done' },
    { item: 'Normalized gait without brace',         status: 'done' },
    { item: 'Single-leg squat to 60 degrees',        status: 'done' },
    { item: 'Bilateral hop symmetry 90% or above',   status: 'done' },
    { item: 'Sport-specific agility drills cleared', status: 'progress' },
  ],
}

function criterionStatus(value, threshold) {
  if (value >= threshold) return 'green'
  if (value >= threshold * 0.85) return 'yellow'
  return 'red'
}

const STATUS_COLOR  = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }
const STATUS_BG     = { green: 'rgba(16,185,129,0.1)', yellow: 'rgba(245,158,11,0.1)', red: 'rgba(239,68,68,0.1)' }
const STATUS_BORDER = { green: 'rgba(16,185,129,0.3)', yellow: 'rgba(245,158,11,0.3)', red: 'rgba(239,68,68,0.3)' }

// Shape-based icons so status reads without relying on color alone
function StatusIcon({ status, size = 16 }) {
  const c = STATUS_COLOR[status]
  if (status === 'green') return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
  if (status === 'yellow') return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
}

function verdictText(value, threshold, unit) {
  const diff = threshold - value
  if (diff <= 0) return 'Target met'
  return `${diff}${unit} short of target`
}

// Progress-to-target bar: a full bar means the threshold is met
function TargetBar({ value, threshold, color }) {
  const pct = Math.min((value / threshold) * 100, 100)
  return (
    <div style={{ height: 7, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, boxShadow: `0 0 10px ${color}66` }}/>
    </div>
  )
}

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  padding: '24px 26px',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
}
const EYEBROW = { color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }
const TITLE   = { color: 'white', fontSize: 21, fontWeight: 700, letterSpacing: '-0.3px', margin: 0 }

function MetricRow({ name, value, unit, target, status }) {
  const color = STATUS_COLOR[status]
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusIcon status={status} size={18}/>
          <span style={{ color: '#F3F4F6', fontSize: 15, fontWeight: 600 }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ color, fontSize: 30, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', textShadow: `0 0 20px ${color}40` }}>{value}</span>
          <span style={{ color, fontSize: 16, fontWeight: 700 }}>{unit}</span>
        </div>
      </div>
      <TargetBar value={value} threshold={target} color={color}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 600 }}>Target {target}{unit}</span>
        <span style={{ color, fontSize: 12, fontWeight: 700 }}>{verdictText(value, target, unit)}</span>
      </div>
    </div>
  )
}

function ChecklistRow({ item, status }) {
  const cfg = {
    done:     { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  label: 'Done' },
    progress: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  label: 'In progress' },
    pending:  { color: '#94A3B8', bg: 'rgba(255,255,255,0.04)',border: 'rgba(255,255,255,0.12)',label: 'Not started' },
  }[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11 }}>
      <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
        {status === 'done' && <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={cfg.color} strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        {status === 'progress' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color }}/>}
      </div>
      <p style={{ flex: 1, color: status === 'pending' ? '#94A3B8' : '#F3F4F6', fontSize: 14, fontWeight: 600, margin: 0 }}>{item}</p>
      <span style={{ color: cfg.color, fontSize: 11, fontWeight: 700, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 999, padding: '3px 11px', flexShrink: 0 }}>{cfg.label}</span>
    </div>
  )
}

export default function SurgeonPatientDetail() {
  const { id } = useParams()
  const patient = patients.find(p => p.id === id) || patients[0]
  const { weeklyData, currentWeekSummary: s } = patientDataMap[patient.id]
  const milestones = MILESTONES[patient.id]
  const checklist = PT_CHECKLIST[patient.id]
  const activation = Math.round((weeklyData[weeklyData.length-1].emg.vmo + weeklyData[weeklyData.length-1].emg.vl + weeklyData[weeklyData.length-1].emg.rf + weeklyData[weeklyData.length-1].emg.bf + weeklyData[weeklyData.length-1].emg.gastroc) / 5)

  const lsiStatus = criterionStatus(s.symmetryIndex, 90)
  const romStatus = criterionStatus(s.rom, 125)
  const jsiStatus = criterionStatus(s.jointStrengthIndex, 80)

  const overallMet = [lsiStatus, romStatus, jsiStatus].filter(x => x === 'green').length
  const overallColor = overallMet === 3 ? '#10B981' : overallMet === 0 ? '#EF4444' : '#F59E0B'
  const overallLabel = overallMet === 3 ? 'RTS Ready' : overallMet === 0 ? 'Not Ready' : 'In Progress'

  return (
    <SurgeonLayout>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '28px 32px 64px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={`bg-gradient-to-br ${patient.avatarColor}`} style={{ width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 19, flexShrink: 0 }}>
              {patient.initials}
            </div>
            <div>
              <h1 style={{ color: '#F9FAFB', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{patient.name}</h1>
              <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, margin: '4px 0 0' }}>
                {patient.age}y · Week {patient.weekInRecovery} · {patient.graftType} · {patient.affectedLeg} knee · RTS target {patient.projectedRTSDate}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: overallColor + '18', border: `1px solid ${overallColor}55`, borderRadius: 999, padding: '10px 18px' }}>
            <StatusIcon status={overallMet === 3 ? 'green' : overallMet === 0 ? 'red' : 'yellow'} size={16}/>
            <span style={{ color: overallColor, fontWeight: 700, fontSize: 14 }}>{overallLabel}</span>
            <span style={{ color: overallColor, opacity: 0.75, fontSize: 13, fontWeight: 600 }}>{overallMet}/3 met</span>
          </div>
        </div>

        {/* ════ HERO: Milestone Timeline (full width) ════ */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(139,92,246,0.18), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }}/>
          <div style={{ position: 'relative', background: 'linear-gradient(160deg, #1F1840 0%, #161629 55%, #11121C 100%)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: 20, padding: '28px 36px 32px', boxShadow: '0 0 40px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div style={{ marginBottom: 28 }}>
              <p style={EYEBROW}>Recovery Journey</p>
              <h2 style={{ ...TITLE, fontSize: 23 }}>Milestone Timeline</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
              {milestones.map((m, i) => {
                const isPast = m.status === 'completed'
                const isCurrent = m.status === 'current'
                const next = milestones[i + 1]
                return (
                  <Fragment key={m.label}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 2 }}>
                      {isCurrent && <div style={{ position: 'absolute', top: -8, width: 42, height: 42, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)', filter: 'blur(6px)' }}/>}
                      <div style={{ position: 'relative', width: isCurrent ? 26 : 20, height: isCurrent ? 26 : 20, borderRadius: '50%', background: isCurrent ? 'linear-gradient(135deg, #A78BFA, #7C3AED)' : isPast ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : '#161B27', border: isCurrent ? '3px solid rgba(167,139,250,0.4)' : isPast ? 'none' : '2px solid #2D3344', boxShadow: isCurrent ? '0 0 22px rgba(139,92,246,0.85)' : isPast ? '0 0 12px rgba(139,92,246,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isCurrent && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }}/>}
                        {isPast && <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, marginTop: 12, textAlign: 'center', color: isCurrent ? '#C4B5FD' : isPast ? '#F3F4F6' : '#94A3B8' }}>{m.label}</p>
                      {m.rom !== null ? (
                        <div style={{ marginTop: 8, textAlign: 'center', padding: '7px 13px', borderRadius: 9, background: isCurrent ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isCurrent ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                          <p style={{ color: isCurrent ? '#DDD6FE' : '#E5E7EB', fontSize: 14, fontWeight: 700, margin: 0 }}>{m.rom}°</p>
                          <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600, margin: '2px 0 0' }}>LSI {m.lsi}%</p>
                        </div>
                      ) : (
                        <p style={{ color: '#4B5563', fontSize: 12, marginTop: 8 }}>—</p>
                      )}
                    </div>
                    {next && (
                      <div style={{ flex: 1, margin: '9px 6px 0', height: 3, position: 'relative', alignSelf: 'flex-start', zIndex: 1 }}>
                        <div style={{ position: 'absolute', inset: 0, background: '#1F2433', borderRadius: 3 }}/>
                        {isPast && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #8B5CF6, #A78BFA)', borderRadius: 3, boxShadow: '0 0 8px rgba(139,92,246,0.5)' }}/>}
                      </div>
                    )}
                  </Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/* ════ Two-column body ════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">

          {/* LEFT: objective sensor data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Recovery Metrics */}
            <div style={CARD}>
              <div style={{ marginBottom: 20 }}>
                <p style={EYEBROW}>Current Status</p>
                <h2 style={TITLE}>Recovery Metrics</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <MetricRow name="Range of Motion"   value={s.rom}               unit="°" target={125} status={romStatus}/>
                <MetricRow name="Muscle Activation" value={activation}          unit="%" target={80}  status={criterionStatus(activation, 80)}/>
                <MetricRow name="Joint Strength"    value={s.jointStrengthIndex} unit="%" target={80}  status={jsiStatus}/>
              </div>
            </div>

            {/* RTS Readiness */}
            <div style={CARD}>
              <div style={{ marginBottom: 20 }}>
                <p style={EYEBROW}>Clearance Criteria</p>
                <h2 style={TITLE}>RTS Readiness</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'LSI Symmetry',  threshold: 90,  unit: '%', value: s.symmetryIndex,      sub: 'Operated leg vs intact leg',  status: lsiStatus },
                  { label: 'Range of Motion', threshold: 125, unit: '°', value: s.rom,              sub: 'Full knee flexion',           status: romStatus },
                  { label: 'Quad Strength', threshold: 80,  unit: '%', value: s.jointStrengthIndex, sub: 'Sanaré algorithm estimate',   status: jsiStatus },
                ].map(({ label, threshold, unit, value, sub, status }) => (
                  <div key={label} style={{ background: STATUS_BG[status], border: `1px solid ${STATUS_BORDER[status]}`, borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: `1px solid ${STATUS_BORDER[status]}` }}>
                          <StatusIcon status={status} size={16}/>
                        </div>
                        <div>
                          <p style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700, margin: 0 }}>{label} {threshold}{unit} or above</p>
                          <p style={{ color: '#CBD5E1', fontSize: 12.5, fontWeight: 500, margin: '2px 0 0' }}>{sub}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ color: STATUS_COLOR[status], fontSize: 30, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px', textShadow: `0 0 20px ${STATUS_COLOR[status]}40` }}>{value}{unit}</span>
                      </div>
                    </div>
                    <TargetBar value={value} threshold={threshold} color={STATUS_COLOR[status]}/>
                    <p style={{ color: STATUS_COLOR[status], fontSize: 12, fontWeight: 700, margin: '8px 0 0', textAlign: 'right' }}>{verdictText(value, threshold, unit)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PT-maintained tracking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* PT Checklist */}
            <div style={CARD}>
              <div style={{ marginBottom: 18 }}>
                <p style={EYEBROW}>Rehab Progress</p>
                <h2 style={TITLE}>PT Checklist</h2>
                <p style={{ color: '#9CA3AF', fontSize: 12.5, fontWeight: 500, margin: '6px 0 0' }}>Maintained by Sarah Mitchell, PT, DPT, SCS · Read-only</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {checklist.map(c => <ChecklistRow key={c.item} item={c.item} status={c.status}/>)}
              </div>
            </div>

            {/* PT Summary */}
            <div style={CARD}>
              <div style={{ marginBottom: 16 }}>
                <p style={EYEBROW}>Clinical Note</p>
                <h2 style={TITLE}>PT Summary</h2>
              </div>
              <div style={{ borderLeft: '2px solid rgba(139,92,246,0.4)', paddingLeft: 18 }}>
                <p style={{ color: '#D1D5DB', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{PT_NOTES[patient.id]}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SurgeonLayout>
  )
}
