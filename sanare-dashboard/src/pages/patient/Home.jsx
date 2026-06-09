import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../components/patient/PatientLayout'
import { activityRings, todayStats } from '../../data/patientData'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const RINGS = [
  { key: 'dailyMovement',    r: 80, color: '#3B82F6', label: 'Movement'   },
  { key: 'muscleActivation', r: 62, color: '#10B981', label: 'Activation' },
  { key: 'sessionCompletion',r: 44, color: '#F97316', label: 'Sessions'   },
]

function ActivityRings({ animated }) {
  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52 flex-shrink-0">
      {RINGS.map(({ key, r, color }) => {
        const circumference = 2 * Math.PI * r
        const pct = key === 'sessionCompletion'
          ? activityRings[key].percent
          : activityRings[key].current
        const offset = animated ? circumference * (1 - pct / 100) : circumference
        const track = color + '22'
        return (
          <g key={key}>
            <circle cx="100" cy="100" r={r} fill="none" stroke={track} strokeWidth="13"/>
            <circle
              cx="100" cy="100" r={r}
              fill="none" stroke={color} strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </g>
        )
      })}
      <text x="100" y="95" textAnchor="middle" fill="#0A0A0A" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">
        Week 12
      </text>
      <text x="100" y="113" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="Inter, sans-serif">
        Strengthening
      </text>
    </svg>
  )
}

export default function Home() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <PatientLayout>
      <div className="px-5 pt-10 space-y-5 pb-4">

        {/* Section 1: Greeting + rings */}
        <div>
          <p className="text-[#0A0A0A] text-2xl font-bold tracking-tight">
            {getGreeting()}, Alex
          </p>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{today}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#0A0A0A] font-semibold text-sm">Today's Activity</h2>
            <span className="text-xs text-[#6B6B6B] font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <ActivityRings animated={animated}/>
            <div className="flex flex-col gap-3.5 flex-1 min-w-0">
              {RINGS.map(({ key, color, label }) => {
                const ring = activityRings[key]
                const pct = key === 'sessionCompletion' ? ring.percent : ring.current
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#0A0A0A] text-xs font-medium">{label}</span>
                      <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="w-full bg-[#F0F0F0] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-[width] duration-1000 ease-out"
                        style={{ width: animated ? `${pct}%` : '0%', backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section 2: CTA */}
        <Link
          to="/patient/log"
          className="block w-full bg-[#1E3A5F] text-white font-bold py-4 rounded-xl text-center text-base active:scale-95 transition-transform duration-150"
        >
          Log Today's Session
        </Link>

        {/* Section 3: 2 stat pills */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5]">
            <p className="text-[#6B6B6B] text-xs font-medium mb-1">Current ROM</p>
            <p className="text-[#0A0A0A] font-bold text-2xl">{todayStats.currentRom}°</p>
            <p className="text-[#3B82F6] text-xs mt-0.5 font-medium">Personal best</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E5E5E5]">
            <p className="text-[#6B6B6B] text-xs font-medium mb-1">Day Streak</p>
            <p className="text-[#0A0A0A] font-bold text-2xl">{todayStats.streak}</p>
            <p className="text-[#6B6B6B] text-xs mt-0.5 font-medium">days in a row</p>
          </div>
        </div>

      </div>
    </PatientLayout>
  )
}
