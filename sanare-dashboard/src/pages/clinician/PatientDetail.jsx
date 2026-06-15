import { Fragment, useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  ComposedChart, LineChart, BarChart,
  Line, Area, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import AnatomyHeatmap from '../../components/clinician/AnatomyHeatmap'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'


const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
}
const INNER = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'dr_mitchell',
    text: "Hi Alex, great work this week! ROM hit 118° — that's your personal best. The terminal knee extensions are really paying off.",
    time: 'Jun 3, 10:42 AM',
  },
  {
    id: 2,
    sender: 'patient',
    text: "Thanks Dr. Mitchell! Should I increase the weight on single-leg press? It's been feeling easier at 45lbs.",
    time: 'Jun 3, 11:15 AM',
  },
  {
    id: 3,
    sender: 'dr_mitchell',
    text: "Yes, go up to 60lbs for 3×12. Keep the TKEs daily — 3 sets of 20. See you Saturday for your Week 12 eval. Looking strong!",
    time: 'Jun 3, 11:22 AM',
  },
]

function SendIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>
  )
}

function getAdherenceColor(pct) {
  if (pct >= 80) return '#10B981'
  if (pct >= 65) return '#F59E0B'
  return '#EF4444'
}

function TrendArrow({ current, previous, unit = '' }) {
  const diff = current - previous
  const up = diff >= 0
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
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
  return (
    <div className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#9CA3AF] text-xs mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}/>
          <span className="text-[#9CA3AF]">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}°</span>
        </div>
      ))}
    </div>
  )
}

const CustomEmgTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#9CA3AF] text-xs mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}/>
          <span className="text-[#9CA3AF]">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}%</span>
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

  // find which node id the patient is currently at
  let currentNodeId = 0
  for (let i = TIMELINE_NODES.length - 1; i >= 0; i--) {
    if (week >= TIMELINE_NODES[i].weekStart) { currentNodeId = TIMELINE_NODES[i].id; break }
  }

  return (
    <div className="rounded-2xl p-6" style={CARD}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-lg tracking-tight">Recovery Trajectory</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Week {week} of 52 · Projected RTS: {patient.projectedRTSDate}
          </p>
        </div>
        <span className="font-bold text-sm bg-[#3B82F6]/10 text-[#60A5FA] px-3 py-1 rounded-full border border-[#3B82F6]/20">
          {Math.round((week / 52) * 100)}% complete
        </span>
      </div>

      {/* Track with nodes */}
      <div className="flex items-start">
        {TIMELINE_NODES.map((node, i) => {
          const isPast    = node.id < currentNodeId
          const isCurrent = node.id === currentNodeId
          const isFuture  = node.id > currentNodeId

          // Connector: progress through the segment between this node and next
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
              {/* Node */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#3B82F6] ring-4 ring-[#3B82F6]/25'
                      : isPast
                      ? 'bg-[#3B82F6]'
                      : 'bg-[#0A0F1E] border-2 border-[#374151]'
                  }`}
                >
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                </div>
                <p className={`text-xs font-semibold mt-2 text-center leading-tight ${
                  isCurrent ? 'text-[#60A5FA]' : isPast ? 'text-[#F9FAFB]' : 'text-[#4B5563]'
                }`}>
                  {node.label}
                </p>
                <p className={`text-xs mt-0.5 text-center leading-tight ${
                  isFuture ? 'text-[#374151]' : 'text-[#6B7280]'
                }`}>
                  {node.sub}
                </p>
              </div>

              {/* Connector line */}
              {nextNode && (
                <div className="flex-1 mx-0.5 mt-2 h-0.5 relative self-start">
                  <div className="absolute inset-0 bg-[#1F2937] rounded"/>
                  {connectorFill > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#3B82F6] rounded"
                      style={{ width: `${connectorFill}%` }}
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

  const [clinicianMessages, setClinicianMessages] = useState(INITIAL_MESSAGES)
  const [clinicianDraft, setClinicianDraft] = useState('')
  const messagesBottomRef = useRef(null)

  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [clinicianMessages])

  function sendClinicianMessage() {
    const text = clinicianDraft.trim()
    if (!text) return
    setClinicianMessages(prev => [
      ...prev,
      { id: prev.length + 1, sender: 'dr_mitchell', text, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
    ])
    setClinicianDraft('')
  }

  function handleClinicianKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendClinicianMessage()
    }
  }

  const chartData = weeklyData.map(w => ({
    week:        w.label,
    romActual:   w.rom.actual,
    romExpected: w.rom.expected,
    vmo:         w.emg.vmo,
    vl:          w.emg.vl,
    rf:          w.emg.rf,
    bf:          w.emg.bf,
    gastroc:     w.emg.gastroc,
    adherence:   w.adherence,
  }))

  const currentEmg = weeklyData.at(-1).emg

  const statCards = [
    { label: 'Current ROM',        value: `${s.rom}°`,                current: s.rom,                previous: s.romPrevWeek,             unit: '°',  sub: 'Range of motion',        color: '#3B82F6' },
    { label: 'Avg EMG Activation', value: `${s.avgEmg}%`,             current: s.avgEmg,             previous: s.avgEmgPrevWeek,          unit: '%',  sub: '5-muscle avg MVIC',      color: '#8B5CF6' },
    { label: 'Weekly Adherence',   value: `${s.adherence}%`,          current: s.adherence,          previous: s.adherencePrevWeek,       unit: '%',  sub: 'Session completion',     color: s.adherence >= 80 ? '#10B981' : '#F59E0B' },
    { label: 'Symmetry Index',     value: `${s.symmetryIndex}%`,      current: s.symmetryIndex,      previous: s.symmetryPrevWeek,        unit: '%',  sub: 'Operated vs intact leg', color: s.symmetryIndex >= 80 ? '#10B981' : s.symmetryIndex >= 70 ? '#F59E0B' : '#EF4444' },
    { label: 'Joint Strength Index',value: `${s.jointStrengthIndex}%`,current: s.jointStrengthIndex, previous: s.jointStrengthPrevWeek,   unit: '%',  sub: 'Est. · Sanaré algorithm', color: s.jointStrengthIndex >= 80 ? '#10B981' : s.jointStrengthIndex >= 60 ? '#F59E0B' : '#EF4444' },
  ]

  return (
    <ClinicianLayout>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-6 md:py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${patient.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {patient.initials}
          </div>
          <div>
            <h1 className="text-[#F9FAFB] text-2xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-[#9CA3AF] text-sm font-medium">
              {patient.age}y · Week {patient.weekInRecovery} · {patient.currentPhase.name} · {patient.graftType} · {patient.affectedLeg} knee
            </p>
          </div>
          <div className="ml-auto flex gap-2 flex-wrap">
            <span className="bg-[#3B82F6]/15 text-[#3B82F6] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#3B82F6]/25">
              {patient.currentPhase.name}
            </span>
            <span className="bg-[#10B981]/15 text-[#10B981] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#10B981]/25">
              Week {patient.weekInRecovery}
            </span>
          </div>
        </div>

        {/* Trajectory Timeline */}
        <TrajectoryTimeline patient={patient} />

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map(({ label, value, current, previous, unit, sub, color }) => (
            <div key={label} className="rounded-2xl p-5" style={CARD}>
              <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
              <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
              <p className="text-[#9CA3AF] text-xs mb-2">{sub}</p>
              <TrendArrow current={current} previous={previous} unit={unit}/>
            </div>
          ))}
        </div>

        {/* ── ROM Trend Chart ── */}
        <div className="rounded-2xl p-6" style={CARD}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">ROM Recovery Trend</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">Range of motion — actual vs expected protocol</p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#3B82F6] rounded"/><span className="text-[#9CA3AF]">Actual</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#6B7280] rounded"/><span className="text-[#9CA3AF]">Expected</span></div>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="romGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tickFormatter={v => `${v}°`}
                />
                <Tooltip content={<CustomRomTooltip/>}/>
                <Area  type="monotone" dataKey="romActual"   name="Actual ROM" stroke="#3B82F6" strokeWidth={2.5} fill="url(#romGradient)" dot={false} activeDot={{ r: 5, fill: '#3B82F6' }}/>
                <Line  type="monotone" dataKey="romExpected" name="Expected"   stroke="#4B5563" strokeWidth={1.5} strokeDasharray="6 4"    dot={false}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── EMG Muscle Activation Chart ── */}
        <div className="rounded-2xl p-6" style={CARD}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">EMG Muscle Activation</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">% of Maximum Voluntary Isometric Contraction (MVIC)</p>
            </div>
            <div className="hidden md:flex flex-wrap gap-3 text-xs">
              {[
                { key: 'vmo',    color: '#3B82F6', label: 'VMO'    },
                { key: 'vl',     color: '#10B981', label: 'VL'     },
                { key: 'rf',     color: '#8B5CF6', label: 'RF'     },
                { key: 'bf',     color: '#F59E0B', label: 'BF'     },
                { key: 'gastroc',color: '#EF4444', label: 'Gastroc'},
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}/>
                  <span className="text-[#9CA3AF]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={v => `${v}%`}
                />
                <Tooltip content={<CustomEmgTooltip/>}/>
                <ReferenceLine y={65} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <ReferenceLine y={50} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <Line type="monotone" dataKey="vmo"    name="VMO"    stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="vl"     name="VL"     stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="rf"     name="RF"     stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="bf"     name="BF"     stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                <Line type="monotone" dataKey="gastroc" name="Gastroc" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[#4B5563] text-xs mt-2">Dashed lines: 50% (caution) and 65% (target) MVIC thresholds</p>
        </div>

        {/* ── Anatomy Heatmap + Adherence Chart ── */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={CARD}>
            <div className="mb-5">
              <h2 className="text-white font-bold text-lg tracking-tight">Anatomy Activation Map</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">Week {patient.weekInRecovery} — click a zone for details</p>
            </div>
            <AnatomyHeatmap muscles={currentEmg}/>
          </div>

          <div className="rounded-2xl p-6" style={CARD}>
            <div className="mb-5">
              <h2 className="text-white font-bold text-lg tracking-tight">Weekly Adherence</h2>
              <p className="text-[#9CA3AF] text-xs mt-0.5">Session completion rate by week</p>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`}/>
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      const val = payload[0].value
                      return (
                        <div className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                          <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
                          <p className="text-white font-bold">{val}% adherence</p>
                          <p className="text-xs mt-0.5" style={{ color: getAdherenceColor(val) }}>
                            {val >= 80 ? 'On target' : val >= 65 ? 'Below protocol' : 'Needs attention'}
                          </p>
                        </div>
                      )
                    }}
                  />
                  <ReferenceLine y={80} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.4}/>
                  <Bar dataKey="adherence" barSize={40} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getAdherenceColor(entry.adherence)} fillOpacity={0.85}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              {[{ color: '#10B981', label: '≥80%' }, { color: '#F59E0B', label: '65–79%' }, { color: '#EF4444', label: '<65%' }].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }}/>
                  <span className="text-[#6B7280] text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Session Log ── */}
        <div>
          {/* Session Log Table */}
          <div className="rounded-2xl p-6" style={CARD}>
            <h2 className="text-[#F9FAFB] font-semibold text-base mb-1">Weekly Session Log</h2>
            <p className="text-[#9CA3AF] text-xs mb-5">Last {sessionLog.length} sessions</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Date', 'Duration', 'ROM', 'Avg Activation'].map(h => (
                      <th key={h} className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessionLog.map((row, i) => (
                    <tr key={i} className="hover:bg-white/2 transition">
                      <td className="py-3 pr-4 text-[#F9FAFB] text-xs font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 pr-4 text-[#9CA3AF] text-xs">{row.duration} min</td>
                      <td className="py-3 pr-4">
                        <span className="text-[#3B82F6] font-semibold text-xs">{row.romAchieved}°</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#1F2937] rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-[#8B5CF6]" style={{ width: `${row.avgActivation}%` }}/>
                          </div>
                          <span className="text-[#9CA3AF] text-xs">{row.avgActivation}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Clinician Messaging ── */}
        <div className="rounded-2xl overflow-hidden" style={CARD}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${patient.avatarColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
              {patient.initials}
            </div>
            <div>
              <h2 className="text-[#F9FAFB] font-semibold text-sm">Messaging — {patient.name}</h2>
              <p className="text-[#6B7280] text-xs">Secure patient–clinician channel · RTM (CPT 98980)</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto px-6 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/5"/>
              <span className="text-[#4B5563] text-xs font-medium">June 3</span>
              <div className="flex-1 h-px bg-white/5"/>
            </div>

            {clinicianMessages.map(msg => {
              const isClinician = msg.sender === 'dr_mitchell'
              return (
                <div key={msg.id} className={`flex flex-col ${isClinician ? 'items-end' : 'items-start'}`}>
                  {!isClinician && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${patient.avatarColor} flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0`}>
                        {patient.initials}
                      </div>
                      <span className="text-[#6B7280] text-xs font-medium">{patient.name}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isClinician
                        ? 'bg-[#3B82F6] text-white rounded-tr-sm'
                        : 'bg-[#1F2937] text-[#E5E7EB] rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-[#4B5563] mt-1 ${isClinician ? 'mr-1' : 'ml-1'}`}>{msg.time}</p>
                </div>
              )
            })}
            <div ref={messagesBottomRef}/>
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/5 flex items-end gap-2">
            <textarea
              value={clinicianDraft}
              onChange={e => setClinicianDraft(e.target.value)}
              onKeyDown={handleClinicianKeyDown}
              placeholder={`Message ${patient.name}...`}
              rows={1}
              className="flex-1 bg-[#0A0F1E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] resize-none outline-none focus:border-[#3B82F6]/50 transition-colors leading-relaxed"
              style={{ minHeight: '42px', maxHeight: '120px', overflow: 'auto' }}
            />
            <button
              onClick={sendClinicianMessage}
              disabled={!clinicianDraft.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                clinicianDraft.trim() ? 'bg-[#3B82F6] text-white' : 'bg-white/5 text-[#4B5563]'
              }`}
            >
              <SendIcon/>
            </button>
          </div>
        </div>

      </div>
    </ClinicianLayout>
  )
}
