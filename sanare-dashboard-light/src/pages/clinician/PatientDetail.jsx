import { Fragment, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ComposedChart, LineChart, BarChart,
  Line, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ViewToggle from '../../components/clinician/ViewToggle'
import AnatomyHeatmap from '../../components/clinician/AnatomyHeatmap'
import { patients } from '../../data/patients'
import {
  patientDataMap,
  buildDailyMetrics,
  romYAxisTicks,
  flexionToChart,
  ROM_FLEXION_GOAL_CHART,
  ROM_EXTENSION,
} from '../../data/clinicianData'
import { getPatientAvatar } from '../../data/patientAvatars'

const CARD_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
}

const INNER_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
}

const avatarMap = {
  'alex-chen-001':    getPatientAvatar('alex-chen-001', 56),
  'marcus-webb-002':  getPatientAvatar('marcus-webb-002', 56),
  'priya-sharma-003': getPatientAvatar('priya-sharma-003', 56),
}

function formatVisitDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function PatientProfileHeader({ patient, avatarSrc }) {
  const graftShort = patient.graftType.replace(' Autograft', '')

  const facts = [
    { label: 'Age',          value: `${patient.age} years` },
    { label: 'Recovery',     value: `Week ${patient.weekInRecovery} of ${patient.totalWeeks}` },
    { label: 'Phase',        value: patient.currentPhase.name },
    { label: 'Graft',        value: graftShort },
    { label: 'Operated leg', value: patient.affectedLeg },
  ]

  return (
    <div style={{
      ...CARD_STYLE,
      padding: '20px 24px',
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
    }}>
      <img
        src={avatarSrc}
        alt={patient.name}
        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>
              {patient.name}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
              ACL reconstruction · {graftShort} · {patient.affectedLeg} knee
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151' }}>
              Last visit: {formatVisitDate(patient.lastSessionDate)}
              <span style={{ margin: '0 8px', color: '#D1D5DB' }}>·</span>
              Next visit: {formatVisitDate(patient.nextSessionDate)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: 999,
              background: '#EEF2FF',
              color: '#4F52C4',
              border: '1px solid #C7D2FE',
              whiteSpace: 'nowrap',
            }}>
              {patient.currentPhase.name}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: 999,
              background: '#F0FDF4',
              color: '#16A34A',
              border: '1px solid #BBF7D0',
              whiteSpace: 'nowrap',
            }}>
              RTS {patient.projectedRTSDate}
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          background: '#FAFBFC',
          borderRadius: 10,
          border: '1px solid #E8EAED',
        }}>
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              style={{
                padding: '11px 16px',
                borderLeft: index > 0 ? '1px solid #E8EAED' : undefined,
              }}
            >
              <p style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
              }}>
                {fact.label}
              </p>
              <p style={{
                margin: '3px 0 0',
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getMetricTint(value, thresholds = { green: 80, amber: 65 }) {
  if (value >= thresholds.green) return { color: '#16A34A' }
  if (value >= thresholds.amber) return { color: '#D97706' }
  return { color: '#DC2626' }
}

function getAdherenceColor(pct) {
  return getMetricTint(pct).color
}

function TrendArrow({ current, previous, unit = '' }) {
  const diff = current - previous
  const up = diff >= 0
  return (
    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: up ? '#16A34A' : '#DC2626' }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {up
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          : <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        }
      </svg>
      {up ? '+' : ''}{diff}{unit}
    </div>
  )
}

const CustomRomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  const flexion = point?.flexionActual
  return (
    <div className="rounded-lg px-4 py-3" style={{
      background: '#FFFFFF',
      border: '1px solid #E8EAED',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
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
    <div className="rounded-lg px-4 py-3" style={{
      background: '#FFFFFF',
      border: '1px solid #E8EAED',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
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

const TIMELINE_NODES = [
  { id: 0, label: 'Surgery',  sub: 'Week 0',    weekStart: 0  },
  { id: 1, label: 'Phase 1',  sub: 'Wk 1–3',   weekStart: 1  },
  { id: 2, label: 'Phase 2',  sub: 'Wk 4–9',   weekStart: 4  },
  { id: 3, label: 'Phase 3',  sub: 'Wk 10–16', weekStart: 10 },
  { id: 4, label: 'Phase 4',  sub: 'Wk 17–24', weekStart: 17 },
  { id: 5, label: 'RTS',      sub: 'Wk 25+',   weekStart: 25 },
]

function TrajectoryTimeline({ patient }) {
  const week = patient.weekInRecovery

  let currentNodeId = 0
  for (let i = TIMELINE_NODES.length - 1; i >= 0; i--) {
    if (week >= TIMELINE_NODES[i].weekStart) { currentNodeId = TIMELINE_NODES[i].id; break }
  }

  return (
    <div className="rounded-2xl p-6" style={CARD_STYLE}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-lg tracking-tight" style={{ color: '#111827' }}>Recovery Trajectory</h2>
          <p className="text-xs mt-0.5" style={{ color: '#374151' }}>
            Week {week} of 52 · Projected RTS: {patient.projectedRTSDate}
          </p>
        </div>
        <span className="font-semibold text-sm px-3 py-1 rounded-full" style={{
          background: '#EEF2FF',
          color: '#4F52C4',
          border: '1px solid #C7D2FE',
        }}>
          {Math.round((week / 52) * 100)}% complete
        </span>
      </div>

      <div className="flex items-start">
        {TIMELINE_NODES.map((node, i) => {
          const isPast    = node.id < currentNodeId
          const isCurrent = node.id === currentNodeId
          const isFuture  = node.id > currentNodeId

          const nextNode = TIMELINE_NODES[i + 1]
          let connectorFill = 0
          if (nextNode) {
            if (isPast) connectorFill = 100
            else if (isCurrent) {
              const segLen = nextNode.weekStart - node.weekStart
              connectorFill = Math.min(((week - node.weekStart) / segLen) * 100, 99)
            }
          }

          return (
            <Fragment key={node.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                  style={
                    isCurrent
                      ? { background: '#4F52C4', boxShadow: '0 0 0 4px rgba(79,82,196,0.18)' }
                      : isPast
                      ? { background: '#4F52C4' }
                      : { background: '#E5E7EB', border: '2px solid #E5E7EB' }
                  }
                >
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFFFFF' }}/>}
                </div>
                <p className="text-xs font-semibold mt-2 text-center leading-tight" style={
                  isCurrent ? { color: '#4F52C4', fontWeight: 600 }
                  : isPast   ? { color: '#111827' }
                  :             { color: '#6B7280' }
                }>
                  {node.label}
                </p>
                <p className="text-xs mt-0.5 text-center leading-tight" style={{ color: isFuture ? '#6B7280' : '#374151' }}>
                  {node.sub}
                </p>
              </div>

              {nextNode && (
                <div className="flex-1 mx-0.5 mt-2 h-0.5 relative self-start">
                  <div className="absolute inset-0 rounded" style={{ background: '#E5E7EB' }}/>
                  {connectorFill > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: `${connectorFill}%`, background: '#4F52C4' }}
                    />
                  )}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default function PatientDetail() {
  const { id } = useParams()
  const patient = patients.find(p => p.id === id) || patients[0]
  const data = patientDataMap[patient.id] || patientDataMap[patients[0].id]
  const { weeklyData, sessionLog, currentWeekSummary: s } = data

  const [romView, setRomView] = useState('weekly')
  const [adherenceView, setAdherenceView] = useState('weekly')

  const chartData = weeklyData.map(w => ({
    week:          w.label,
    romActual:     flexionToChart(w.rom.actual),
    flexionActual: w.rom.actual,
    romTarget:     ROM_FLEXION_GOAL_CHART,
    vmo:           w.emg.vmo,
    vl:            w.emg.vl,
    rf:            w.emg.rf,
    bf:            w.emg.bf,
    gastroc:       w.emg.gastroc,
    adherence:     w.adherence,
  }))

  const dailyMetrics = buildDailyMetrics(sessionLog, '2026-06-26', weeklyData)
  const romWeeklyData = chartData.map(d => ({
    label: d.week,
    romActual: d.romActual,
    flexionActual: d.flexionActual,
    romTarget: ROM_FLEXION_GOAL_CHART,
  }))
  const romDailyData = dailyMetrics
  const adherenceWeeklyData = chartData.map(d => ({ label: d.week, adherence: d.adherence }))
  const adherenceDailyData = dailyMetrics.map(d => ({ label: d.label, adherence: d.adherence }))

  const activeRomData = romView === 'weekly' ? romWeeklyData : romDailyData
  const activeAdherenceData = adherenceView === 'weekly' ? adherenceWeeklyData : adherenceDailyData
  const romTicks = romYAxisTicks()

  const currentEmg = weeklyData.at(-1).emg

  const statCards = [
    { label: 'Current ROM',         value: `${s.rom}°`,                 current: s.rom,                previous: s.romPrevWeek,           unit: '°',  sub: 'Range of motion',         color: '#4F52C4' },
    { label: 'Avg EMG Activation',  value: `${s.avgEmg}%`,              current: s.avgEmg,             previous: s.avgEmgPrevWeek,        unit: '%',  sub: '5-muscle avg MVIC',       color: '#4F52C4' },
    { label: 'Weekly Adherence',    value: `${s.adherence}%`,           current: s.adherence,          previous: s.adherencePrevWeek,     unit: '%',  sub: 'Session completion',      color: getMetricTint(s.adherence).color },
    { label: 'Symmetry Index',      value: `${s.symmetryIndex}%`,       current: s.symmetryIndex,      previous: s.symmetryPrevWeek,      unit: '%',  sub: 'Operated vs intact leg',  color: getMetricTint(s.symmetryIndex, { green: 80, amber: 70 }).color },
    { label: 'Joint Strength Index',value: `${s.jointStrengthIndex}%`,  current: s.jointStrengthIndex, previous: s.jointStrengthPrevWeek, unit: '%',  sub: 'Est. · Sanaré algorithm', color: getMetricTint(s.jointStrengthIndex, { green: 80, amber: 60 }).color },
  ]

  return (
    <ClinicianLayout>
      <div className="max-w-screen-2xl mx-auto px-5 md:px-6 py-5 md:py-6" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Page header ── */}
        <PatientProfileHeader
          patient={patient}
          avatarSrc={avatarMap[patient.id] || 'https://i.pravatar.cc/48?img=1'}
        />

        {/* ── Trajectory Timeline ── */}
        <TrajectoryTimeline patient={patient} />

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map(({ label, value, current, previous, unit, sub, color }) => (
            <div key={label} className="rounded-xl p-5" style={INNER_STYLE}>
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#374151', letterSpacing: '0.05em' }}>{label}</p>
              <p className="text-3xl font-semibold mb-1" style={{ color }}>{value}</p>
              <p className="text-xs mb-2" style={{ color: '#6B7280' }}>{sub}</p>
              <TrendArrow current={current} previous={previous} unit={unit}/>
            </div>
          ))}
        </div>

        {/* ── ROM + Adherence side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ROM Trend Chart */}
          <div className="rounded-xl p-6" style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-lg tracking-tight" style={{ color: '#111827' }}>ROM Recovery Trend</h2>
                <p className="text-xs mt-0.5" style={{ color: '#374151' }}>
                  From full extension ({ROM_EXTENSION}°) toward flexion goal (150°)
                </p>
              </div>
              <ViewToggle value={romView} onChange={setRomView} />
            </div>
            <div className="flex gap-4 text-xs mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: '#4F52C4' }}/>
                <span style={{ color: '#374151' }}>Flexion progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded border-t border-dashed" style={{ borderColor: '#16A34A' }}/>
                <span style={{ color: '#374151' }}>Flexion goal (150°)</span>
              </div>
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activeRomData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    domain={[ROM_FLEXION_GOAL_CHART, ROM_EXTENSION]}
                    ticks={romTicks}
                    allowDecimals={false}
                    tickFormatter={v => `${v}°`}
                  />
                  <Tooltip content={<CustomRomTooltip/>}/>
                  <ReferenceLine y={ROM_FLEXION_GOAL_CHART} stroke="#16A34A" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: '150° flexion', position: 'right', fill: '#16A34A', fontSize: 11 }}/>
                  <Line type="monotone" dataKey="romActual" name="Flexion progress" stroke="#4F52C4" strokeWidth={2.5} dot={{ r: 3, fill: '#4F52C4' }} connectNulls activeDot={{ r: 5, fill: '#4F52C4', strokeWidth: 0 }}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Adherence Chart */}
          <div className="rounded-xl p-6" style={CARD_STYLE}>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-lg tracking-tight" style={{ color: '#111827' }}>
                  {adherenceView === 'weekly' ? 'Weekly Adherence' : 'Daily Adherence'}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#374151' }}>
                  {adherenceView === 'weekly' ? 'Session completion rate by week' : 'Session completed each day'}
                </p>
              </div>
              <ViewToggle value={adherenceView} onChange={setAdherenceView} />
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeAdherenceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
                  <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`}/>
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      const val = payload[0].value
                      return (
                        <div className="rounded-lg px-4 py-3" style={{ background: '#FFFFFF', border: '1px solid #E8EAED', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                          <p className="text-xs mb-1" style={{ color: '#374151' }}>{label}</p>
                          <p className="font-semibold" style={{ color: '#111827' }}>{val}% adherence</p>
                        </div>
                      )
                    }}
                  />
                  {adherenceView === 'weekly' && <ReferenceLine y={80} stroke="#E5E7EB" strokeDasharray="4 4"/>}
                  <Bar dataKey="adherence" barSize={adherenceView === 'weekly' ? 32 : 18} radius={[4, 4, 0, 0]}>
                    {activeAdherenceData.map((entry, i) => (
                      <Cell key={i} fill={getAdherenceColor(entry.adherence)} fillOpacity={0.85}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              {[
                { color: '#16A34A', label: '≥80%' },
                { color: '#D97706', label: '65–79%' },
                { color: '#DC2626', label: '<65%' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }}/>
                  <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EMG Muscle Activation Chart ── */}
        <div className="rounded-xl p-6" style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg tracking-tight" style={{ color: '#111827' }}>EMG Muscle Activation</h2>
              <p className="text-xs mt-0.5" style={{ color: '#374151' }}>% of Maximum Voluntary Isometric Contraction (MVIC)</p>
            </div>
            <div className="hidden md:flex flex-wrap gap-3 text-xs">
              {[
                { color: '#4F52C4', label: 'VMO'     },
                { color: '#16A34A', label: 'VL'      },
                { color: '#818CF8', label: 'RF'      },
                { color: '#D97706', label: 'BF'      },
                { color: '#DC2626', label: 'Gastroc' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}/>
                  <span style={{ color: '#374151' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}/>
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={v => `${v}%`}
                />
                <Tooltip content={<CustomEmgTooltip/>}/>
                <ReferenceLine y={65} stroke="#E5E7EB" strokeDasharray="4 4"/>
                <ReferenceLine y={50} stroke="#E5E7EB" strokeDasharray="4 4"/>
                <Line type="monotone" dataKey="vmo"     name="VMO"     stroke="#4F52C4" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="vl"      name="VL"      stroke="#16A34A" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="rf"      name="RF"      stroke="#818CF8" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="bf"      name="BF"      stroke="#D97706" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="gastroc" name="Gastroc" stroke="#DC2626" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Dashed lines: 50% (caution) and 65% (target) MVIC thresholds</p>
        </div>

        {/* ── Anatomy Heatmap ── */}
        <div className="rounded-xl p-6" style={CARD_STYLE}>
          <div className="mb-5">
            <h2 className="font-semibold text-lg tracking-tight" style={{ color: '#111827' }}>Anatomy Activation Map</h2>
            <p className="text-xs mt-0.5" style={{ color: '#374151' }}>Week {patient.weekInRecovery} — click a zone for details</p>
          </div>
          <AnatomyHeatmap muscles={currentEmg}/>
        </div>

        {/* ── Session Log ── */}
        <div className="rounded-xl p-6" style={CARD_STYLE}>
          <h2 className="font-semibold text-base mb-1" style={{ color: '#111827' }}>Weekly Session Log</h2>
          <p className="text-xs mb-5" style={{ color: '#374151' }}>Last {sessionLog.length} sessions</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  {['Date', 'Duration', 'ROM', 'Avg Activation'].map(h => (
                    <th key={h} className="text-left text-xs font-medium uppercase tracking-wider pb-3 pr-4" style={{ color: '#6B7280', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessionLog.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="py-3 pr-4 text-xs font-medium whitespace-nowrap" style={{ color: '#111827' }}>
                      {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 pr-4 text-xs" style={{ color: '#374151' }}>{row.duration} min</td>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-xs" style={{ color: '#4F52C4' }}>{row.romAchieved}°</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 rounded-full h-1.5" style={{ background: '#E5E7EB' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${row.avgActivation}%`, background: '#4F52C4' }}/>
                        </div>
                        <span className="text-xs" style={{ color: '#374151' }}>{row.avgActivation}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap" style={CARD_STYLE}>
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
            Message this patient or edit their training protocol
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to={`/clinician/messages/${patient.id}`} className="btn-ghost" style={{ textDecoration: 'none' }}>
              Open messages
            </Link>
            <Link to={`/clinician/patient/${patient.id}/rehab-plan`} className="btn-ghost" style={{ textDecoration: 'none' }}>
              Edit protocol
            </Link>
          </div>
        </div>

      </div>
    </ClinicianLayout>
  )
}
