import { useEffect, useState } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'
import { milestones, currentMilestone } from '../../data/patientData'

const STATUS_STYLES = {
  completed:   { ring: '#10B981', bg: '#ECFDF5', icon: '✅', textColor: '#065F46' },
  'in-progress': { ring: '#3B82F6', bg: '#EFF6FF', icon: '🔄', textColor: '#1E40AF' },
  locked:      { ring: '#E5E7EB', bg: '#F9FAFB', icon: '🔒', textColor: '#9CA3AF' },
}

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
      <div className="px-5 pt-8 space-y-5">

        {/* Header */}
        <div>
          <p className="text-gray-400 text-sm font-medium">Week 12 · Strengthening Phase</p>
          <h1 className="text-[#1E3A5F] text-2xl font-bold tracking-tight mt-0.5">Your Progress</h1>
        </div>

        {/* Headline stat */}
        <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] rounded-3xl p-6 shadow-lg shadow-blue-200">
          <p className="text-blue-200 text-sm font-medium mb-1">Current milestone</p>
          <p className="text-white text-2xl font-black leading-tight">
            {currentMilestone.progress}% of the way<br/>to {currentMilestone.name}
          </p>
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
              <div
                className="h-2.5 rounded-full bg-white transition-all duration-1000"
                style={{ width: barAnimated ? `${currentMilestone.progress}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-200">
              <span>Week 10 start</span>
              <span>Target: {new Date(currentMilestone.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Overall progress pill */}
        <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏁</span>
            <p className="text-[#1E3A5F] font-semibold text-sm">Overall recovery</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#3B82F6] transition-all duration-1000"
                style={{ width: barAnimated ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-[#1E3A5F] font-bold text-sm whitespace-nowrap">
              {completedCount}/{totalCount} done
            </span>
          </div>
        </div>

        {/* Milestone timeline */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-[#1E3A5F] font-bold text-base mb-5">Milestone Timeline</h2>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

            <div className="space-y-4">
              {milestones.map((m, i) => {
                const s = STATUS_STYLES[m.status]
                const isInProgress = m.status === 'in-progress'

                return (
                  <div key={m.id} className="flex gap-4 relative">
                    {/* Status indicator */}
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 text-base"
                      style={{ borderColor: s.ring, backgroundColor: s.bg }}
                    >
                      {m.status === 'completed' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : m.status === 'in-progress' ? (
                        <div className="w-3 h-3 rounded-full bg-[#3B82F6] animate-pulse"/>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      )}
                    </div>

                    {/* Content card */}
                    <div
                      className={`flex-1 rounded-2xl p-4 border transition-all ${
                        isInProgress
                          ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                          : m.status === 'completed'
                          ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${isInProgress ? 'text-[#1E40AF]' : m.status === 'completed' ? 'text-[#065F46]' : 'text-gray-400'}`}>
                            {m.name}
                          </p>
                          <p className={`text-xs mt-0.5 ${isInProgress ? 'text-blue-400' : m.status === 'completed' ? 'text-emerald-500' : 'text-gray-300'}`}>
                            {m.description}
                          </p>
                        </div>
                        {m.status === 'completed' && (
                          <span className="bg-[#10B981]/15 text-[#10B981] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Done
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <p className={`text-xs font-medium ${isInProgress ? 'text-blue-400' : m.status === 'completed' ? 'text-emerald-500' : 'text-gray-300'}`}>
                          {m.status === 'completed'
                            ? `✓ Completed ${new Date(m.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : m.status === 'in-progress'
                            ? `Target: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : `Estimated: ${new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          }
                        </p>
                        <span className={`text-xs ${isInProgress ? 'text-blue-300' : m.status === 'completed' ? 'text-emerald-400' : 'text-gray-300'}`}>
                          Week {m.weeksPostSurgery} post-op
                        </span>
                      </div>

                      {/* In-progress bar */}
                      {isInProgress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-blue-400 mb-1">
                            <span>Progress</span>
                            <span className="font-bold">{m.progress}%</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-[#3B82F6] transition-all duration-1000"
                              style={{ width: barAnimated ? `${m.progress}%` : '0%' }}
                            />
                          </div>
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
    </PatientLayout>
  )
}
