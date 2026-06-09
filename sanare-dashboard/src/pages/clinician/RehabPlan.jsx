import { useParams } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { rehabPhaseMap } from '../../data/clinicianData'
import { patients } from '../../data/patients'

const DIFFICULTY_COLORS = {
  Easy:   { bg: '#10B98115', text: '#10B981', border: '#10B98130' },
  Medium: { bg: '#F59E0B15', text: '#F59E0B', border: '#F59E0B30' },
  Hard:   { bg: '#EF444415', text: '#EF4444', border: '#EF444430' },
}

const PHASE_STATUS_STYLES = {
  completed: { ring: '#10B981', bg: '#10B98120', text: '#10B981', dot: '#10B981' },
  current:   { ring: '#3B82F6', bg: '#3B82F620', text: '#3B82F6', dot: '#3B82F6' },
  upcoming:  { ring: '#374151', bg: '#1F293750', text: '#6B7280', dot: '#374151' },
}

export default function RehabPlan() {
  const { id } = useParams()
  const p = patients.find(pt => pt.id === id) || patients[0]
  const rehabPhases = rehabPhaseMap[p.id] || rehabPhaseMap['alex-chen-001']
  const currentPhaseData = rehabPhases.find(ph => ph.status === 'current')

  return (
    <ClinicianLayout>
      <div className="p-6 md:p-8 max-w-5xl space-y-6">

        {/* Header */}
        <div>
          <p className="text-[#6B7280] text-sm mb-1">{p.name} · Week {p.weekInRecovery}</p>
          <h1 className="text-[#F9FAFB] text-2xl font-bold tracking-tight">Rehabilitation Plan</h1>
        </div>

        {/* Current phase highlight */}
        <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/25 rounded-lg p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#3B82F6] font-black text-xl">P{currentPhaseData.number}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-[#F9FAFB] text-xl font-bold">
                  Phase {currentPhaseData.number} — {currentPhaseData.name}
                </h2>
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold px-3 py-1 rounded-full border border-[#3B82F6]/30">
                  Current Phase
                </span>
              </div>
              <p className="text-[#6B7280] text-sm">{currentPhaseData.weekRange}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentPhaseData.goals.map(goal => (
                  <span key={goal} className="text-xs bg-white/5 border border-white/10 text-[#9CA3AF] px-3 py-1 rounded-full">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase timeline */}
        <div className="bg-[#111827] rounded-lg p-6 border border-white/5">
          <h2 className="text-[#F9FAFB] font-semibold text-base mb-6">Recovery Roadmap</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#1F2937]" />

            <div className="space-y-4">
              {rehabPhases.map((phase, i) => {
                const styles = PHASE_STATUS_STYLES[phase.status]
                return (
                  <div key={phase.number} className="flex gap-4 relative">
                    {/* Status dot */}
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10"
                      style={{ borderColor: styles.ring, backgroundColor: styles.bg }}
                    >
                      {phase.status === 'completed' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : phase.status === 'current' ? (
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: styles.dot }}/>
                      ) : (
                        <span className="text-[#4B5563] text-xs font-bold">{phase.number}</span>
                      )}
                    </div>

                    {/* Phase info */}
                    <div
                      className={`flex-1 rounded-xl p-4 border transition-all ${
                        phase.status === 'current'
                          ? 'bg-[#3B82F6]/5 border-[#3B82F6]/20'
                          : phase.status === 'completed'
                          ? 'bg-[#10B981]/5 border-[#10B981]/15'
                          : 'bg-[#0A0F1E] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: styles.text }}>
                          Phase {phase.number} — {phase.name}
                        </p>
                        <span className="text-[#6B7280] text-xs">{phase.weekRange}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {phase.goals.map(goal => (
                          <span key={goal} className="text-xs text-[#6B7280] bg-white/5 px-2 py-0.5 rounded">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Exercise list */}
        <div className="bg-[#111827] rounded-lg p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[#F9FAFB] font-semibold text-base">Phase {currentPhaseData.number} Exercise Protocol</h2>
              <p className="text-[#6B7280] text-xs mt-0.5">{currentPhaseData.exercises.length} exercises · {currentPhaseData.weekRange}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Exercise', 'Sets', 'Reps', 'Frequency', 'Difficulty'].map(h => (
                    <th key={h} className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider pb-3 pr-6 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentPhaseData.exercises.map((ex, i) => {
                  const dc = DIFFICULTY_COLORS[ex.difficulty]
                  return (
                    <tr key={i} className="hover:bg-white/2 transition">
                      <td className="py-3.5 pr-6 text-[#F9FAFB] text-sm font-medium whitespace-nowrap">{ex.name}</td>
                      <td className="py-3.5 pr-6 text-[#9CA3AF] text-sm">{ex.sets}</td>
                      <td className="py-3.5 pr-6 text-[#9CA3AF] text-sm">{ex.reps}</td>
                      <td className="py-3.5 pr-6 text-[#9CA3AF] text-sm whitespace-nowrap">{ex.frequency}</td>
                      <td className="py-3.5">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{ color: dc.text, backgroundColor: dc.bg, borderColor: dc.border }}
                        >
                          {ex.difficulty}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical notes */}
        <div className="bg-[#111827] rounded-lg p-6 border border-white/5">
          <h2 className="text-[#F9FAFB] font-semibold text-base mb-3">Clinical Notes</h2>
          <div className="bg-[#0A0F1E] rounded-xl p-4 border border-white/5">
            <p className="text-[#9CA3AF] text-sm leading-relaxed">{p.notes}</p>
          </div>
          <p className="text-[#4B5563] text-xs mt-3">Read-only — notes updated by Sarah Mitchell</p>
        </div>

      </div>
    </ClinicianLayout>
  )
}
