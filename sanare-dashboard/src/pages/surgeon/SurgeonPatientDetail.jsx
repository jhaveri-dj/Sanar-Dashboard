import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
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
  'alex-chen-001': 'Alex Chen is progressing well through Phase 3 Strengthening at Week 12 post-operatively. VMO activation has improved incrementally and quad symmetry is trending upward toward clinical benchmarks. ROM of 118° reflects steady gains aligned with protocol expectations. Patient is on track for a November 2026 return-to-sport clearance evaluation, pending symmetry index reaching ≥90% and Joint Strength Index exceeding the 80% threshold.',
  'marcus-webb-002': 'Marcus Webb presents with a notable symmetry deficit at Week 6, with LSI currently at 64% — below the 70% clinical threshold required before Phase 3 progression. Weekly adherence has been below protocol at 52%, with no recorded session in the last 4 days. Recommend surgical follow-up before Week 8 to reassess trajectory and address dropout risk. Adjunctive VMO-isolation protocol has been initiated. Adherence barriers should be explored prior to next clinical contact.',
  'priya-sharma-003': 'Priya Sharma has demonstrated exceptional post-operative recovery and is now approaching return-to-sport criteria at Week 22. All three benchmark measures — LSI Symmetry (91%), ROM (128°), and Quad Strength Index (88%) — are within or meeting target ranges. A formal return-to-sport clearance discussion is clinically appropriate at the next visit, with projected clearance in July 2026 pending successful functional testing and psychological readiness screening.',
}

function criterionStatus(value, threshold) {
  if (value >= threshold) return 'green'
  if (value >= threshold * 0.85) return 'yellow'
  return 'red'
}

function CriterionIcon({ status }) {
  if (status === 'green') {
    return (
      <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    )
  }
  if (status === 'yellow') {
    return (
      <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/>
        </svg>
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full bg-[#EF4444]/20 flex items-center justify-center flex-shrink-0">
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>
  )
}

function MetricsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#9CA3AF] text-xs mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}/>
          <span className="text-[#9CA3AF]">{p.name}:</span>
          <span className="text-white font-semibold">
            {p.dataKey === 'rom' ? `${p.value}°` : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  )
}

const STATUS_COLOR = { green: '#10B981', yellow: '#F59E0B', red: '#EF4444' }
const STATUS_LABEL = { green: 'Met', yellow: 'At risk', red: 'Not yet' }

export default function SurgeonPatientDetail() {
  const { id } = useParams()
  const patient = patients.find(p => p.id === id) || patients[0]
  const { weeklyData, currentWeekSummary: s } = patientDataMap[patient.id]
  const milestones = MILESTONES[patient.id]

  const lsiStatus = criterionStatus(s.symmetryIndex, 90)
  const romStatus = criterionStatus(s.rom, 125)
  const jsiStatus = criterionStatus(s.jointStrengthIndex, 80)

  const chartData = weeklyData.map(w => ({
    week: w.label,
    rom: w.rom.actual,
    activation: Math.round((w.emg.vmo + w.emg.vl + w.emg.rf + w.emg.bf + w.emg.gastroc) / 5),
    jsi: w.jsi,
  }))

  return (
    <SurgeonLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-6 md:py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${patient.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {patient.initials}
          </div>
          <div>
            <h1 className="text-[#F9FAFB] text-xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-[#6B7280] text-sm">
              {patient.age}y · Week {patient.weekInRecovery} · {patient.graftType} · {patient.affectedLeg} knee · RTS target {patient.projectedRTSDate}
            </p>
          </div>
        </div>

        {/* Section 1: Milestone Timeline */}
        <div className="bg-[#111827] rounded-lg p-6 border border-[#1F2937]">
          <h2 className="text-[#F9FAFB] font-semibold text-base mb-1">Milestone Timeline</h2>
          <p className="text-[#6B7280] text-xs mb-6">ROM and LSI at key recovery checkpoints</p>

          <div className="flex items-start">
            {milestones.map((m, i) => {
              const isPast    = m.status === 'completed'
              const isCurrent = m.status === 'current'
              const next = milestones[i + 1]

              return (
                <Fragment key={m.label}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-[#8B5CF6] ring-4 ring-[#8B5CF6]/25' :
                      isPast    ? 'bg-[#8B5CF6]' :
                      'bg-[#0A0F1E] border-2 border-[#374151]'
                    }`}>
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                    </div>

                    <p className={`text-xs font-semibold mt-2 text-center leading-tight ${
                      isCurrent ? 'text-[#A78BFA]' : isPast ? 'text-[#F9FAFB]' : 'text-[#4B5563]'
                    }`}>{m.label}</p>

                    {m.rom !== null ? (
                      <div className="mt-1.5 text-center space-y-0.5">
                        <p className="text-[#9CA3AF] text-[10px]">{m.rom}°</p>
                        <p className="text-[#6B7280] text-[10px]">LSI {m.lsi}%</p>
                      </div>
                    ) : (
                      <p className="text-[#374151] text-[10px] mt-1.5">—</p>
                    )}
                  </div>

                  {next && (
                    <div className="flex-1 mx-1 mt-2 h-0.5 self-start relative">
                      <div className="absolute inset-0 bg-[#1F2937] rounded"/>
                      {isPast && <div className="absolute inset-0 bg-[#8B5CF6] rounded"/>}
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* Metrics Trend Chart */}
        <div className="bg-[#111827] rounded-lg p-6 border border-[#1F2937]">
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="text-[#F9FAFB] font-semibold text-base">Metrics Trend</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">ROM, muscle activation, and joint strength over recovery</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#3B82F6] rounded"/>
                <span className="text-[#9CA3AF]">ROM (°)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#8B5CF6] rounded"/>
                <span className="text-[#9CA3AF]">Muscle Activation (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#F59E0B] rounded"/>
                <span className="text-[#9CA3AF]">Joint Strength (%)</span>
              </div>
            </div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 44, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis
                  yAxisId="pct"
                  tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={[0, 100]} tickFormatter={v => `${v}%`}
                />
                <YAxis
                  yAxisId="deg"
                  orientation="right"
                  tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={[0, 140]} tickFormatter={v => `${v}°`}
                />
                <Tooltip content={<MetricsTooltip/>}/>
                <Line yAxisId="deg" type="monotone" dataKey="rom"        name="ROM"              stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3B82F6' }}/>
                <Line yAxisId="pct" type="monotone" dataKey="activation" name="Muscle Activation" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }}/>
                <Line yAxisId="pct" type="monotone" dataKey="jsi"        name="Joint Strength"   stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#F59E0B' }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 2: RTS Readiness Panel */}
        <div className="bg-[#111827] rounded-lg p-6 border border-[#1F2937]">
          <h2 className="text-[#F9FAFB] font-semibold text-base mb-1">RTS Readiness</h2>
          <p className="text-[#6B7280] text-xs mb-5">Return-to-sport criteria assessment</p>

          <div className="space-y-3">
            {[
              {
                label: 'LSI Symmetry ≥ 90%',
                sub: 'Limb Symmetry Index — operated vs intact leg',
                value: `${s.symmetryIndex}%`,
                status: lsiStatus,
              },
              {
                label: 'ROM ≥ 125°',
                sub: 'Range of motion — full knee flexion',
                value: `${s.rom}°`,
                status: romStatus,
              },
              {
                label: 'Quad Strength Index ≥ 80%',
                sub: 'Est. quadriceps strength symmetry · Sanaré algorithm',
                value: `${s.jointStrengthIndex}%`,
                status: jsiStatus,
              },
            ].map(({ label, sub, value, status }) => (
              <div key={label} className="flex items-center gap-4 bg-[#0A0F1E] rounded-xl px-4 py-3">
                <CriterionIcon status={status}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F9FAFB] text-sm font-medium">{label}</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">{sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm" style={{ color: STATUS_COLOR[status] }}>{value}</p>
                  <p className="text-[#6B7280] text-xs">{STATUS_LABEL[status]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: PT Summary Note */}
        <div className="bg-[#111827] rounded-lg p-6 border border-[#1F2937]">
          <h2 className="text-[#F9FAFB] font-semibold text-base mb-1">PT Summary Note</h2>
          <p className="text-[#6B7280] text-xs mb-4">Prepared by Sarah Mitchell, PT, DPT, SCS · Read-only</p>
          <p className="text-[#D1D5DB] text-sm leading-relaxed">{PT_NOTES[patient.id]}</p>
        </div>

      </div>
    </SurgeonLayout>
  )
}
