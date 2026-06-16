import { useEffect, useState } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'
import { milestones, currentMilestone, todayStats, activityRings, weeklyReadiness } from '../../data/patientData'

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}

function statusLabel(pct) {
  if (pct >= 80) return { text: 'Great progress!', color: '#10B981' }
  if (pct >= 60) return { text: 'Getting there', color: '#F59E0B' }
  return { text: 'Needs attention', color: '#EF4444' }
}

const latestScore = weeklyReadiness[weeklyReadiness.length - 1].score

const METRICS = [
  {
    label: 'Knee Flexibility',
    sublabel: 'How far your knee bends',
    current: todayStats.currentRom,
    goal: 130,
    unit: '°',
    color: '#3B82F6',
    pct: Math.min(Math.round((todayStats.currentRom / 130) * 100), 100),
  },
  {
    label: 'Muscle Strength',
    sublabel: 'How hard your muscles are working',
    current: activityRings.muscleActivation.current,
    goal: 100,
    unit: '%',
    color: '#10B981',
    pct: activityRings.muscleActivation.current,
  },
  {
    label: 'Left vs Right Balance',
    sublabel: 'How even both legs feel',
    current: 84,
    goal: 95,
    unit: '%',
    color: '#8B5CF6',
    pct: Math.round((84 / 95) * 100),
  },
  {
    label: 'Overall Strength',
    sublabel: 'Estimated recovery strength',
    current: latestScore,
    goal: 100,
    unit: '%',
    color: '#F97316',
    pct: latestScore,
  },
]

export default function Progress() {
  const [barAnimated, setBarAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBarAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const completedCount = milestones.filter(m => m.status === 'completed').length
  const totalCount = milestones.length

  return (
    <PatientLayout>
      <div className="p-8">
        <div className="max-w-[1100px] mx-auto space-y-6">

          {/* Header */}
          <div>
            <p className="text-[#9CA3AF] text-sm font-medium">Week 12 · Strengthening Phase</p>
            <h1 className="text-[#F9FAFB] text-3xl font-bold tracking-tight mt-0.5">Your Progress</h1>
          </div>

          {/* Current goal banner */}
          <div
            className="rounded-2xl p-6 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', boxShadow: '0 4px 24px rgba(59,130,246,0.2)' }}
          >
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Current goal</p>
              <p className="text-white text-2xl font-black">
                {currentMilestone.progress}% of the way to {currentMilestone.name}
              </p>
              <p className="text-blue-200 text-sm mt-1">Target: {new Date(currentMilestone.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex-shrink-0 w-48">
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-white transition-all duration-1000"
                  style={{ width: barAnimated ? `${currentMilestone.progress}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-blue-200">
                <span>Week 10 start</span>
                <span>{currentMilestone.progress}%</span>
              </div>
            </div>
          </div>

          {/* 2-column: metrics + milestones */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left: How You're Doing metrics */}
            <div style={CARD} className="rounded-2xl p-6">
              <h2 className="text-[#F9FAFB] font-bold text-lg mb-5">How You're Doing</h2>
              <div className="space-y-6">
                {METRICS.map(({ label, sublabel, current, goal, unit, color, pct }) => {
                  const status = statusLabel(pct)
                  return (
                    <div key={label}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[#F9FAFB] font-semibold text-sm">{label}</p>
                          <p className="text-[#9CA3AF] text-xs mt-0.5">{sublabel}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="font-bold text-xl" style={{ color }}>{current}{unit}</span>
                          <p className="text-[#9CA3AF] text-xs">of {goal}{unit}</p>
                        </div>
                      </div>
                      <div className="w-full rounded-full h-2 mb-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: barAnimated ? `${pct}%` : '0%', backgroundColor: color }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold" style={{ color: status.color }}>{status.text}</span>
                        <span className="text-[#9CA3AF] text-xs">{pct}% to goal</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Recovery path milestones */}
            <div style={CARD} className="rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#F9FAFB] font-bold text-lg">Recovery Path</h2>
                <span className="text-[#9CA3AF] text-sm">{completedCount}/{totalCount} milestones done</span>
              </div>

              <div className="relative">
                <div className="absolute left-5 top-5 bottom-5 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <div className="space-y-4">
                  {milestones.map((m) => {
                    const isComplete = m.status === 'completed'
                    const isInProgress = m.status === 'in-progress'
                    const ringColor = isComplete ? '#10B981' : isInProgress ? '#3B82F6' : 'rgba(255,255,255,0.1)'
                    const bgColor = isComplete ? 'rgba(16,185,129,0.08)' : isInProgress ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)'
                    const borderColor = isComplete ? 'rgba(16,185,129,0.25)' : isInProgress ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)'
                    const titleColor = isComplete ? '#10B981' : isInProgress ? '#60A5FA' : '#4B5563'
                    const descColor = isComplete ? 'rgba(16,185,129,0.65)' : isInProgress ? 'rgba(96,165,250,0.65)' : '#374151'

                    return (
                      <div key={m.id} className="flex gap-4 relative">
                        <div
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10"
                          style={{ borderColor: ringColor, backgroundColor: bgColor }}
                        >
                          {isComplete ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          ) : isInProgress ? (
                            <div className="w-3 h-3 rounded-full bg-[#3B82F6] animate-pulse"/>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 rounded-xl p-3.5" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-sm" style={{ color: titleColor }}>{m.name}</p>
                            {isComplete && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                                Done ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: descColor }}>
                            {isComplete
                              ? `Completed ${new Date(m.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                              : isInProgress
                              ? `Target: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                              : `Estimated: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            }
                          </p>

                          {isInProgress && (
                            <div className="mt-2.5">
                              <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(59,130,246,0.15)' }}>
                                <div
                                  className="h-1.5 rounded-full bg-[#3B82F6] transition-all duration-1000"
                                  style={{ width: barAnimated ? `${m.progress}%` : '0%' }}
                                />
                              </div>
                              <p className="text-xs mt-1" style={{ color: 'rgba(96,165,250,0.7)' }}>{m.progress}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
