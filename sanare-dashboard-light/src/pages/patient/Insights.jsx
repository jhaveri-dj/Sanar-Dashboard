import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import PatientLayout from '../../components/patient/PatientLayout'
import PatientContextHeader from '../../components/patient/PatientContextHeader'
import {
  weeklyInsights,
  recentRomTrend,
  weeklyReadiness,
  sessionsPerWeek,
  legBalanceTrend,
  dailyPainLog,
} from '../../data/patientData'
import { currentPatient } from '../../data/patients'
import ViewToggle from '../../components/clinician/ViewToggle'
import {
  flexionToChart,
  ROM_EXTENSION,
  ROM_FLEXION_GOAL_CHART,
  romYAxisTicks,
  buildDailyMetrics,
  patientDataMap,
} from '../../data/clinicianData'
import { TrendingUp, MessageCircle, Target, CalendarCheck, Scale, Heart } from 'lucide-react'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

const WINS = [
  {
    icon: TrendingUp,
    title: `Knee flexibility improved ${weeklyInsights.romImprovement}°`,
    detail: 'Best week yet — you bent further than ever!',
  },
  {
    icon: CalendarCheck,
    title: `${weeklyInsights.adherence}% of sessions completed`,
    detail: '4 of 5 sessions done — you showed up!',
  },
  {
    icon: Scale,
    title: `Both legs more in sync (+${legBalanceTrend.at(-1).match - legBalanceTrend[0].match} pts)`,
    detail: 'Your operated leg is catching up to your other side',
  },
]

const JOGGING_FLEXION = 120

function RomFlexionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const flexion = payload[0]?.payload?.flexion
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E8EAED',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <p style={{ color: '#6B7280', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: '#4F52C4', fontWeight: 600, margin: 0 }}>
        Knee bend: {flexion}° flexion
      </p>
    </div>
  )
}

function PlainTooltip({ active, payload, label, unit = '', valueLabel = 'Value' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E8EAED',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <p style={{ color: '#6B7280', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: '#4F52C4', fontWeight: 600, margin: 0 }}>
        {valueLabel}: {payload[0].value}{unit}
      </p>
    </div>
  )
}

function TrendBadge({ children, positive = true }) {
  return (
    <span style={{
      fontSize: 12,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 20,
      background: positive ? '#F0FDF4' : '#FFFBEB',
      color: positive ? '#16A34A' : '#D97706',
      border: `1px solid ${positive ? '#BBF7D0' : '#FDE68A'}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

function ChartCard({ title, subtitle, badge, action, children, height = 168 }) {
  return (
    <div style={{ ...CARD, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0', lineHeight: 1.4 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          {badge}
          {action}
        </div>
      </div>
      <div style={{ height, marginTop: 12 }}>{children}</div>
    </div>
  )
}

const axisStyle = { fill: '#9CA3AF', fontSize: 11 }
const gridStyle = { stroke: '#F3F4F6' }

export default function Insights() {
  const [goal, setGoal] = useState('')
  const [savedGoal, setSavedGoal] = useState('Return to soccer by October')
  const [editing, setEditing] = useState(false)
  const [romView, setRomView] = useState('weekly')

  function saveGoal() {
    if (goal.trim()) setSavedGoal(goal.trim())
    setGoal('')
    setEditing(false)
  }

  const nextM = weeklyInsights.nextMilestone
  const latestReadiness = weeklyReadiness.at(-1).score
  const prevReadiness = weeklyReadiness.at(-2).score
  const avgPain = (dailyPainLog.reduce((s, d) => s + d.level, 0) / dailyPainLog.length).toFixed(1)

  const romWeeklyData = recentRomTrend.map(d => ({
    week: d.week,
    flexion: d.rom,
    chartRom: flexionToChart(d.rom),
  }))

  const patientChartData = patientDataMap[currentPatient.id] || patientDataMap['alex-chen-001']
  const romDailyData = buildDailyMetrics(
    patientChartData.sessionLog,
    '2026-06-26',
    patientChartData.weeklyData,
  ).map(d => ({
    label: d.label,
    flexion: d.flexionActual,
    chartRom: d.romActual,
  }))

  const activeRomData = romView === 'weekly' ? romWeeklyData : romDailyData
  const romXKey = romView === 'weekly' ? 'week' : 'label'
  const romTicks = romYAxisTicks()
  const joggingGoalChart = flexionToChart(JOGGING_FLEXION)

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <PatientContextHeader
            title="Weekly Highlights"
            facts={[
              { label: 'Recovery week', value: `Week ${currentPatient.weekInRecovery} of ${currentPatient.totalWeeks}` },
              { label: 'Phase', value: currentPatient.currentPhase.name },
              { label: 'This week', value: weeklyInsights.weekLabel },
              { label: 'Knee bend', value: `${recentRomTrend.at(-1).rom}°` },
              { label: 'Show-up rate', value: `${weeklyInsights.adherence}%` },
            ]}
          />

          <div style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #FAFBFF 100%)',
            border: '1px solid #C7D2FE',
            borderRadius: 16,
            padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Target size={22} color="#4F52C4" />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                My Goal
              </span>
              <div style={{ flex: 1 }} />
              {!editing && (
                <button
                  type="button"
                  onClick={() => { setGoal(savedGoal); setEditing(true) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#4F52C4', padding: 0 }}
                >
                  Edit
                </button>
              )}
            </div>
            {editing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. Return to soccer by October"
                  onKeyDown={e => e.key === 'Enter' && saveGoal()}
                  autoFocus
                  style={{
                    flex: 1, borderRadius: 10, padding: '10px 14px', fontSize: 15,
                    outline: 'none', color: '#1F2937', background: '#FFFFFF',
                    border: '1px solid #C7D2FE', boxShadow: '0 0 0 2px #EEF2FF',
                  }}
                />
                <button
                  type="button"
                  onClick={saveGoal}
                  style={{
                    padding: '10px 18px', borderRadius: 10, border: 'none',
                    background: '#4F52C4', color: '#FFFFFF', fontSize: 14,
                    fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>{savedGoal}</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ ...CARD, padding: '24px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
                3 Highlights This Week
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WINS.map(({ icon: Icon, title, detail }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color="#4F52C4" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</p>
                      <p style={{ fontSize: 12, color: '#374151', margin: '2px 0 0' }}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...CARD, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <img
                  src="https://i.pravatar.cc/36?img=5"
                  alt="Sarah Mitchell"
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageCircle size={14} color="#4F52C4" />
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>
                    From Sarah Mitchell, PT
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                {weeklyInsights.motivationalMessage}
              </p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
              Trends made simple
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
              No medical jargon — just clear pictures of how you&apos;re doing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <ChartCard
                title="How Far Your Knee Bends"
                subtitle={
                  romView === 'weekly'
                    ? `After surgery your leg starts straight (${ROM_EXTENSION}°). The line moves down as bending improves — ${JOGGING_FLEXION}° flexion is the jogging goal.`
                    : 'Last 14 days — each point is your best bend that day from your Sanaré Sleeve.'
                }
                badge={<TrendBadge>+{weeklyInsights.romImprovement}° flexion this month</TrendBadge>}
                action={<ViewToggle value={romView} onChange={setRomView} />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeRomData} margin={{ top: 5, right: 10, left: -16, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                    <XAxis dataKey={romXKey} tick={axisStyle} axisLine={false} tickLine={false} interval={romView === 'daily' ? 1 : 0} />
                    <YAxis
                      tick={axisStyle}
                      axisLine={false}
                      tickLine={false}
                      domain={[ROM_FLEXION_GOAL_CHART, ROM_EXTENSION]}
                      ticks={romTicks}
                      tickFormatter={v => `${v}°`}
                    />
                    <Tooltip content={<RomFlexionTooltip />} />
                    <ReferenceLine
                      y={joggingGoalChart}
                      stroke="#BBF7D0"
                      strokeDasharray="4 4"
                      label={{ value: `Jogging goal (${JOGGING_FLEXION}°)`, fill: '#16A34A', fontSize: 10, position: 'insideTopRight' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="chartRom"
                      stroke="#4F52C4"
                      strokeWidth={2.5}
                      dot={{ fill: '#4F52C4', r: romView === 'daily' ? 3 : 4, strokeWidth: 0 }}
                      connectNulls
                      activeDot={{ r: 6, fill: '#4F52C4', strokeWidth: 2, stroke: '#FFFFFF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="How Ready You Felt"
                subtitle="Your daily readiness score — like a green light for exercise."
                badge={<TrendBadge>{latestReadiness > prevReadiness ? `+${latestReadiness - prevReadiness} vs last week` : 'Steady'}</TrendBadge>}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyReadiness} margin={{ top: 5, right: 10, left: -16, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                    <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[40, 100]} />
                    <Tooltip content={<PlainTooltip unit="/100" valueLabel="Readiness" />} />
                    <ReferenceLine y={80} stroke="#BBF7D0" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Days You Showed Up"
                subtitle="Exercise sessions you completed each week (out of 5 planned)."
                badge={<TrendBadge>{weeklyInsights.adherence}% this week</TrendBadge>}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionsPerWeek} margin={{ top: 5, right: 10, left: -16, bottom: 5 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                    <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 5]} allowDecimals={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        const d = payload[0].payload
                        return (
                          <div style={{ background: '#FFF', border: '1px solid #E8EAED', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                            <p style={{ margin: '0 0 4px', color: '#6B7280' }}>{label}</p>
                            <p style={{ margin: 0, fontWeight: 600, color: '#4F52C4' }}>{d.completed} of {d.goal} sessions</p>
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={36}>
                      {sessionsPerWeek.map((entry) => (
                        <Cell key={entry.week} fill={entry.completed >= 4 ? '#4F52C4' : entry.completed >= 3 ? '#818CF8' : '#C7D2FE'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Both Legs in Sync"
                subtitle="How evenly your operated leg matches your other side. 100 = perfectly matched."
                badge={<TrendBadge>+{legBalanceTrend.at(-1).match - legBalanceTrend[0].match} pts since Wk 9</TrendBadge>}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={legBalanceTrend} margin={{ top: 5, right: 10, left: -16, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                    <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
                    <Tooltip content={<PlainTooltip unit="%" valueLabel="Leg match" />} />
                    <ReferenceLine y={90} stroke="#BBF7D0" strokeDasharray="4 4" label={{ value: 'Great match', fill: '#16A34A', fontSize: 10, position: 'insideTopRight' }} />
                    <Line type="monotone" dataKey="match" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#F97316', strokeWidth: 2, stroke: '#FFFFFF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Pain You Logged This Week"
                subtitle="Lower is better. Based on your daily check-ins (0 = none, 10 = worst)."
                badge={<TrendBadge positive={Number(avgPain) <= 3}>{avgPain}/10 avg</TrendBadge>}
                height={148}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPainLog} margin={{ top: 5, right: 10, left: -16, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                    <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 10]} allowDecimals={false} />
                    <Tooltip content={<PlainTooltip unit="/10" valueLabel="Pain" />} />
                    <ReferenceLine y={3} stroke="#BBF7D0" strokeDasharray="4 4" />
                    <Bar dataKey="level" radius={[6, 6, 0, 0]} maxBarSize={28}>
                      {dailyPainLog.map((entry) => (
                        <Cell
                          key={entry.day}
                          fill={entry.level <= 3 ? '#16A34A' : entry.level <= 6 ? '#D97706' : '#DC2626'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Your Recovery Energy"
                subtitle="A simple score combining movement, muscle work, and session completion."
                badge={<TrendBadge>{latestReadiness}/100 today</TrendBadge>}
                height={148}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', justifyContent: 'center' }}>
                  {[
                    { label: 'Daily movement', value: 82, color: '#3B82F6' },
                    { label: 'Muscle activation', value: 75, color: '#10B981' },
                    { label: 'Sessions done', value: 75, color: '#F97316' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}%</span>
                      </div>
                      <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {nextM && (
              <div style={{ ...CARD, padding: '24px' }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Up Next
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <Heart size={18} color="#4F52C4" />
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>{nextM.name}</p>
                </div>
                <p style={{ fontSize: 13, color: '#374151', margin: '0 0 14px', lineHeight: 1.6 }}>
                  {nextM.description}
                </p>
                <div style={{ height: 8, background: '#EEF2FF', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', width: `${nextM.progress}%`, background: '#4F52C4', borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#4F52C4', fontWeight: 600 }}>{nextM.progress}% complete</span>
                  <span style={{ color: '#9CA3AF' }}>
                    Target: {new Date(nextM.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            )}

            <div style={{
              ...CARD,
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FAFBFF 100%)',
              border: '1px solid #BBF7D0',
              padding: '24px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                Where You Are Now
              </p>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>
                Phase 3 — Strengthening
              </p>
              <p style={{ fontSize: 13, color: '#374151', margin: '8px 0 0', lineHeight: 1.6 }}>
                You&apos;re building strength for return-to-sport. Stay consistent with your home program.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
                {[
                  { val: 'Week 12', sub: 'of 16' },
                  { val: '4 left', sub: 'in phase' },
                  { val: 'On track', sub: 'status', green: true },
                ].map(({ val, sub, green }) => (
                  <div key={sub} style={{
                    background: '#FFFFFF', border: '1px solid #E8EAED',
                    borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: green ? '#16A34A' : '#1F2937', margin: 0 }}>{val}</p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
