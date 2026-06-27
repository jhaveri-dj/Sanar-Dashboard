import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import {
  ComposedChart, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { patients } from '../../data/patients'
import {
  patientDataMap,
  flexionToChart,
  romYAxisTicks,
  ROM_FLEXION_GOAL_CHART,
  ROM_EXTENSION,
} from '../../data/clinicianData'
import { getPatientAvatar } from '../../data/patientAvatars'

const CARD_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  padding: '24px 26px',
}

const INNER_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 10,
}

const AVATAR_URLS = {
  'alex-chen-001':    getPatientAvatar('alex-chen-001', 48),
  'marcus-webb-002':  getPatientAvatar('marcus-webb-002', 48),
  'priya-sharma-003': getPatientAvatar('priya-sharma-003', 48),
}

function formatVisitDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

const CustomRomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const flexion = payload[0]?.payload?.flexionActual
  return (
    <div className="rounded-lg px-4 py-3" style={{ background: '#FFFFFF', border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <p className="text-xs mb-2 font-medium" style={{ color: '#374151' }}>{label}</p>
      {flexion != null && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4F52C4' }}/>
          <span style={{ color: '#374151' }}>Flexion:</span>
          <span className="font-semibold" style={{ color: '#111827' }}>{flexion}°</span>
        </div>
      )}
    </div>
  )
}

const CustomEmgTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-4 py-3" style={{ background: '#FFFFFF', border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <p className="text-xs mb-2 font-medium" style={{ color: '#374151' }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}/>
          <span style={{ color: '#374151' }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: '#111827' }}>{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

const CHIP_STYLE = {
  backgroundColor: '#F3F4F6',
  borderRadius: 6,
  padding: '2px 8px',
  fontSize: 12,
  color: '#1F2937',
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}

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
    { item: 'Full passive extension achieved',      status: 'done'     },
    { item: 'Quad activation, SLR without lag',     status: 'done'     },
    { item: 'Normalized gait without brace',        status: 'done'     },
    { item: 'Single-leg squat to 60 degrees',       status: 'progress' },
    { item: 'Bilateral hop symmetry 90% or above',  status: 'pending'  },
    { item: 'Sport-specific agility drills cleared',status: 'pending'  },
  ],
  'marcus-webb-002': [
    { item: 'Full passive extension achieved',      status: 'progress' },
    { item: 'Quad activation, SLR without lag',     status: 'progress' },
    { item: 'Normalized gait without brace',        status: 'pending'  },
    { item: 'Single-leg squat to 60 degrees',       status: 'pending'  },
    { item: 'Bilateral hop symmetry 90% or above',  status: 'pending'  },
    { item: 'Sport-specific agility drills cleared',status: 'pending'  },
  ],
  'priya-sharma-003': [
    { item: 'Full passive extension achieved',      status: 'done'     },
    { item: 'Quad activation, SLR without lag',     status: 'done'     },
    { item: 'Normalized gait without brace',        status: 'done'     },
    { item: 'Single-leg squat to 60 degrees',       status: 'done'     },
    { item: 'Bilateral hop symmetry 90% or above',  status: 'done'     },
    { item: 'Sport-specific agility drills cleared',status: 'progress' },
  ],
}

function criterionStatus(value, threshold) {
  if (value >= threshold) return 'green'
  if (value >= threshold * 0.85) return 'yellow'
  return 'red'
}

const STATUS_COLOR = { green: '#16A34A', yellow: '#D97706', red: '#DC2626' }

function TargetBar({ value, threshold, color }) {
  const pct = Math.min((value / threshold) * 100, 100)
  return (
    <div style={{ height: 5, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }}/>
    </div>
  )
}

const EYEBROW = {
  color: '#6B7280', fontSize: 10, fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px',
}
const SECTION_TITLE = { color: '#111827', fontSize: 15, fontWeight: 600, margin: 0 }

function StatusIcon({ status, size = 16 }) {
  const c = STATUS_COLOR[status]
  if (status === 'green') return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
  )
  if (status === 'yellow') return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>
  )
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={c} strokeWidth={2.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  )
}

function MetricRow({ name, value, unit, target, status }) {
  const color = STATUS_COLOR[status]
  return (
    <div style={{ ...INNER_STYLE, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusIcon status={status} size={16}/>
          <span style={{ color: '#1F2937', fontSize: 13, fontWeight: 500 }}>{name}</span>
        </div>
        <span style={{ color, fontSize: 16, fontWeight: 600 }}>{value}{unit}</span>
      </div>
      <TargetBar value={value} threshold={target} color={color}/>
    </div>
  )
}

function ChecklistRow({ item, status }) {
  const cfg = {
    done:     { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Done'        },
    progress: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'In progress' },
    pending:  { color: '#6B7280', bg: '#F9FAFB', border: '#E8EAED', label: 'Not started' },
  }[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: 10 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      }}>
        {status === 'done' && (
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={cfg.color} strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        )}
        {status === 'progress' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color }}/>}
      </div>
      <p style={{ flex: 1, color: status === 'pending' ? '#6B7280' : '#1F2937', fontSize: 14, fontWeight: status === 'done' ? 500 : 400, margin: 0 }}>
        {item}
      </p>
      <span style={{
        color: cfg.color, fontSize: 11, fontWeight: 600,
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        borderRadius: 20, padding: '3px 10px', flexShrink: 0,
      }}>
        {cfg.label}
      </span>
    </div>
  )
}

export default function SurgeonPatientDetail() {
  const { id } = useParams()
  const patient = patients.find(p => p.id === id) || patients[0]
  const { weeklyData, currentWeekSummary: s } = patientDataMap[patient.id]
  const milestones = MILESTONES[patient.id]
  const checklist  = PT_CHECKLIST[patient.id]

  const lastEmg = weeklyData[weeklyData.length - 1].emg
  const activation = Math.round(
    (lastEmg.vmo + lastEmg.vl + lastEmg.rf + lastEmg.bf + lastEmg.gastroc) / 5
  )

  const chartData = weeklyData.map(w => ({
    week:          w.label,
    romActual:     flexionToChart(w.rom.actual),
    flexionActual: w.rom.actual,
    vmo:           w.emg.vmo,
    vl:            w.emg.vl,
    rf:            w.emg.rf,
    bf:            w.emg.bf,
    gastroc:       w.emg.gastroc,
  }))
  const romTicks = romYAxisTicks()

  const lsiStatus = criterionStatus(s.symmetryIndex, 90)
  const romStatus = criterionStatus(s.rom, 125)
  const jsiStatus = criterionStatus(s.jointStrengthIndex, 80)

  const overallMet   = [lsiStatus, romStatus, jsiStatus].filter(x => x === 'green').length
  const overallColor = overallMet === 3 ? '#16A34A' : overallMet === 0 ? '#DC2626' : '#D97706'
  const overallLabel = overallMet === 3 ? 'RTS Ready' : overallMet === 0 ? 'Not Ready' : 'In Progress'
  const overallBadge = overallMet === 3
    ? { bg: '#F0FDF4', border: '#BBF7D0' }
    : overallMet === 0
    ? { bg: '#FEF2F2', border: '#FECACA' }
    : { bg: '#FFFBEB', border: '#FDE68A' }

  return (
    <SurgeonLayout>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '28px 32px 52px' }}>

        {/* ── Header ── */}
        <div style={{
          background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px 24px',
          marginBottom: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={AVATAR_URLS[patient.id] || 'https://i.pravatar.cc/48?img=1'}
              alt={patient.name}
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0 }}>{patient.name}</h1>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {[
                  `${patient.age}y`,
                  `Week ${patient.weekInRecovery}`,
                  patient.graftType.replace(' Autograft', ''),
                  `${patient.affectedLeg} knee`,
                ].map(text => (
                  <span key={text} style={CHIP_STYLE}>{text}</span>
                ))}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6B7280' }}>
                Last visit: {formatVisitDate(patient.lastSessionDate)}
                <span style={{ margin: '0 6px', color: '#D1D5DB' }}>·</span>
                Next visit: {formatVisitDate(patient.nextSessionDate)}
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: overallBadge.bg, border: `1px solid ${overallBadge.border}`,
            borderRadius: 20, padding: '8px 16px',
          }}>
            <StatusIcon status={overallMet === 3 ? 'green' : overallMet === 0 ? 'red' : 'yellow'} size={16}/>
            <span style={{ color: overallColor, fontWeight: 600, fontSize: 14 }}>{overallLabel}</span>
            <span style={{ color: overallColor, opacity: 0.8, fontSize: 13, fontWeight: 500 }}>{overallMet}/3 met</span>
          </div>
        </div>

        {/* ── Milestone Timeline ── */}
        <div style={{
          background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px 36px 32px',
          marginBottom: 16,
        }}>
          <div style={{ marginBottom: 24 }}>
            <p style={EYEBROW}>Recovery Journey</p>
            <h2 style={{ color: '#111827', fontSize: 16, fontWeight: 600, margin: 0 }}>Milestone Timeline</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            {milestones.map((m, i) => {
              const isPast    = m.status === 'completed'
              const isCurrent = m.status === 'current'
              const next      = milestones[i + 1]
              return (
                <Fragment key={m.label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 2 }}>
                    <div style={{
                      position: 'relative',
                      width: isCurrent ? 24 : 18,
                      height: isCurrent ? 24 : 18,
                      borderRadius: '50%',
                      background: isCurrent || isPast ? '#4F52C4' : '#E5E7EB',
                      border: isCurrent ? '3px solid #C7D2FE' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isCurrent && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFFFF' }}/>}
                      {isPast && (
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, marginTop: 10, textAlign: 'center', color: '#374151' }}>{m.label}</p>
                    {m.rom !== null ? (
                      <div style={{
                        marginTop: 6, textAlign: 'center', padding: '6px 12px', borderRadius: 8,
                        background: isCurrent ? '#EEF2FF' : '#F9FAFB',
                        border: `1px solid ${isCurrent ? '#C7D2FE' : '#E8EAED'}`,
                      }}>
                        <p style={{ color: '#111827', fontSize: 13, fontWeight: 600, margin: 0 }}>{m.rom}°</p>
                        <p style={{ color: '#6B7280', fontSize: 11, margin: '2px 0 0' }}>LSI {m.lsi}%</p>
                      </div>
                    ) : (
                      <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>—</p>
                    )}
                  </div>
                  {next && (
                    <div style={{ flex: 1, margin: '8px 6px 0', height: 3, position: 'relative', alignSelf: 'flex-start', zIndex: 1 }}>
                      <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', borderRadius: 3 }}/>
                      {isPast && <div style={{ position: 'absolute', inset: 0, background: '#4F52C4', borderRadius: 3 }}/>}
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* ── Weekly ROM + EMG charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
          <div style={CARD_STYLE}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={SECTION_TITLE}>ROM Recovery Trend</h2>
              <p style={{ color: '#6B7280', fontSize: 12, margin: '4px 0 0' }}>
                From full extension ({ROM_EXTENSION}°) toward flexion goal (150°)
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, marginBottom: 12, color: '#374151' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 2, background: '#4F52C4', borderRadius: 1 }}/>
                Flexion progress
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, borderTop: '2px dashed #16A34A' }}/>
                Flexion goal
              </span>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 10 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    domain={[ROM_FLEXION_GOAL_CHART, ROM_EXTENSION]}
                    ticks={romTicks}
                    tickFormatter={v => `${v}°`}
                  />
                  <Tooltip content={<CustomRomTooltip/>}/>
                  <ReferenceLine y={ROM_FLEXION_GOAL_CHART} stroke="#16A34A" strokeDasharray="6 4" strokeWidth={1.5}/>
                  <Line type="monotone" dataKey="romActual" stroke="#4F52C4" strokeWidth={2.5} dot={{ r: 3, fill: '#4F52C4' }} connectNulls activeDot={{ r: 5, fill: '#4F52C4', strokeWidth: 0 }}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={CARD_STYLE}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={SECTION_TITLE}>Muscle Activation</h2>
              <p style={{ color: '#6B7280', fontSize: 12, margin: '4px 0 0' }}>
                Weekly EMG · % of MVIC
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 11, marginBottom: 12, color: '#374151' }}>
              {[
                { color: '#4F52C4', label: 'VMO' },
                { color: '#16A34A', label: 'VL' },
                { color: '#818CF8', label: 'RF' },
                { color: '#D97706', label: 'BF' },
                { color: '#DC2626', label: 'Gastroc' },
              ].map(({ color, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
                  {label}
                </span>
              ))}
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
                  <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={v => `${v}%`}/>
                  <Tooltip content={<CustomEmgTooltip/>}/>
                  <Line type="monotone" dataKey="vmo" stroke="#4F52C4" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="vl" stroke="#16A34A" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="rf" stroke="#818CF8" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="bf" stroke="#D97706" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="gastroc" stroke="#DC2626" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RTS Readiness (full width) ── */}
        <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={EYEBROW}>Clearance Criteria</p>
            <h2 style={SECTION_TITLE}>RTS Readiness</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetricRow name="LSI Symmetry" value={s.symmetryIndex} unit="%" target={90} status={lsiStatus}/>
            <MetricRow name="Range of Motion" value={s.rom} unit="°" target={125} status={romStatus}/>
            <MetricRow name="Muscle Activation" value={activation} unit="%" target={80} status={criterionStatus(activation, 80)}/>
            <MetricRow name="Joint Strength" value={s.jointStrengthIndex} unit="%" target={80} status={jsiStatus}/>
          </div>
        </div>

        {/* ── PT Checklist + Summary (balanced columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div style={CARD_STYLE}>
            <div style={{ marginBottom: 14 }}>
              <p style={EYEBROW}>Rehab Progress</p>
              <h2 style={SECTION_TITLE}>PT Checklist</h2>
              <p style={{ color: '#6B7280', fontSize: 12, margin: '4px 0 0' }}>
                Maintained by Sarah Mitchell, PT · Read-only
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {checklist.map(c => <ChecklistRow key={c.item} item={c.item} status={c.status}/>)}
            </div>
          </div>

          <div style={CARD_STYLE}>
            <div style={{ marginBottom: 14 }}>
              <p style={EYEBROW}>Clinical Note</p>
              <h2 style={SECTION_TITLE}>PT Summary</h2>
            </div>
            <div style={{ borderLeft: '3px solid #C7D2FE', paddingLeft: 16 }}>
              <p style={{ color: '#1F2937', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                {PT_NOTES[patient.id]}
              </p>
            </div>
          </div>

        </div>

      </div>
    </SurgeonLayout>
  )
}
