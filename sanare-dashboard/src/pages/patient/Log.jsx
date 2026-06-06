import { useState } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'
import { exerciseLog, heatmapData } from '../../data/patientData'

const DIFFICULTY_STYLES = {
  Easy:   { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' },
  Medium: { bg: '#FFFBEB', text: '#F59E0B', border: '#FDE68A' },
  Hard:   { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' },
}

const HEATMAP_COLORS = {
  0: { bg: '#F3F4F6', label: 'Missed' },
  1: { bg: '#86EFAC', label: 'Partial' },
  2: { bg: '#10B981', label: 'Complete' },
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const todayLog = exerciseLog[0]

// Compute weekly session stats (last 7 days in data)
const thisWeekDays = exerciseLog.slice(0, 5)
const completedSessions = thisWeekDays.filter(day =>
  day.exercises.filter(e => e.completed).length >= 3
).length
const prescribedSessions = 5

export default function Log() {
  const [checked, setChecked] = useState(
    () => new Set(
      todayLog.exercises
        .map((ex, i) => ex.completed ? i : null)
        .filter(i => i !== null)
    )
  )

  function toggleExercise(i) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const doneCount = checked.size
  const totalCount = todayLog.exercises.length

  return (
    <PatientLayout>
      <div className="px-5 pt-8 space-y-5">

        {/* Header */}
        <div>
          <p className="text-gray-400 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-[#1E3A5F] text-2xl font-bold tracking-tight mt-0.5">Exercise Log</h1>
        </div>

        {/* Today's progress pill */}
        <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-50 flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#F3F4F6" strokeWidth="5"/>
              <circle
                cx="24" cy="24" r="20" fill="none" stroke="#10B981" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={125.66}
                strokeDashoffset={125.66 * (1 - doneCount / totalCount)}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#1E3A5F] font-bold text-xs">{doneCount}/{totalCount}</span>
            </div>
          </div>
          <div>
            <p className="text-[#1E3A5F] font-bold text-sm">Today's session</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {doneCount === totalCount ? '🎉 All done!' : `${totalCount - doneCount} exercises remaining`}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#10B981] font-bold text-sm">{Math.round((doneCount / totalCount) * 100)}%</p>
            <p className="text-gray-400 text-xs">complete</p>
          </div>
        </div>

        {/* Exercise checklist */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-[#1E3A5F] font-bold text-base mb-4">Today's Exercises</h2>
          <div className="space-y-3">
            {todayLog.exercises.map((ex, i) => {
              const done = checked.has(i)
              const dc = DIFFICULTY_STYLES[ex.difficulty]
              return (
                <button
                  key={i}
                  onClick={() => toggleExercise(i)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border transition-all text-left ${
                    done
                      ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                      : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    done ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300 bg-white'
                  }`}>
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${done ? 'text-[#065F46] line-through' : 'text-[#1E3A5F]'}`}>
                      {ex.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {ex.sets} sets × {ex.reps} reps · ~{ex.duration} min
                    </p>
                  </div>

                  {/* Difficulty badge */}
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0"
                    style={{ color: dc.text, backgroundColor: dc.bg, borderColor: dc.border }}
                  >
                    {ex.difficulty}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Weekly completion heatmap */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1E3A5F] font-bold text-base">8-Week Heatmap</h2>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {Object.entries(HEATMAP_COLORS).map(([val, { bg, label }]) => (
                <div key={val} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: bg }}/>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Day labels */}
              <div className="flex gap-1 mb-1 ml-14">
                {DAY_LABELS.map((d, i) => (
                  <div key={i} className="w-7 text-center text-gray-300 text-xs">{d}</div>
                ))}
              </div>

              {/* Heatmap rows */}
              <div className="space-y-1">
                {heatmapData.map((week, wi) => (
                  <div key={wi} className="flex items-center gap-2">
                    <span className="text-gray-300 text-xs w-12 text-right pr-2 flex-shrink-0">{week.week}</span>
                    <div className="flex gap-1">
                      {week.days.map((val, di) => (
                        <div
                          key={di}
                          className="w-7 h-7 rounded-md transition-transform hover:scale-110"
                          style={{ backgroundColor: HEATMAP_COLORS[val].bg }}
                          title={`${week.week} ${DAY_LABELS[di]}: ${HEATMAP_COLORS[val].label}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Week summary */}
        <div className="bg-[#1E3A5F] rounded-3xl p-5 shadow-lg shadow-[#1E3A5F]/20">
          <h2 className="text-white font-bold text-base mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Sessions', value: `${completedSessions}/${prescribedSessions}`, color: '#34D399' },
              { label: 'Completion', value: `${Math.round((completedSessions / prescribedSessions) * 100)}%`, color: '#60A5FA' },
              { label: 'Streak', value: '8 days', color: '#FBBF24' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/10 rounded-2xl py-3">
                <p className="font-bold text-lg" style={{ color }}>{value}</p>
                <p className="text-blue-200 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PatientLayout>
  )
}
