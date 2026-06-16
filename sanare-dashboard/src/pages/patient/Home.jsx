import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../components/patient/PatientLayout'
import { weeklyReadiness, currentMilestone, todayStats, milestones } from '../../data/patientData'

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function ReadinessRing({ score, animated }) {
  const r = 64
  const circumference = 2 * Math.PI * r
  const offset = animated ? circumference * (1 - score / 100) : circumference
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  const label = score >= 80 ? 'Great shape today!' : score >= 60 ? 'Good to train steadily' : 'Take it easy today'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
          <circle cx="80" cy="80" r={r} fill="none" stroke={color + '22'} strokeWidth="10" />
          <circle
            cx="80" cy="80" r={r}
            fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black leading-none" style={{ fontSize: 44, color }}>{score}</span>
          <span className="text-[#9CA3AF] text-xs font-medium mt-1">out of 100</span>
        </div>
      </div>
      <p className="text-[#9CA3AF] text-sm text-center">{label}</p>
    </div>
  )
}

export default function Home() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [])

  const latest = weeklyReadiness[weeklyReadiness.length - 1]
  const score = latest.score
  const weekLabel = latest.week

  const completedCount = milestones.filter(m => m.status === 'completed').length
  const returnToSportPct = Math.round(
    (completedCount + (currentMilestone?.progress ?? 0) / 100) / milestones.length * 100
  )

  const nextSession = new Date()
  nextSession.setDate(nextSession.getDate() + 2)
  const nextSessionLabel = nextSession.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  })

  return (
    <PatientLayout>
      <div className="p-8">
        <div className="max-w-[1100px] mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-[#F9FAFB] text-3xl font-bold tracking-tight">
              {getGreeting()}, Alex 👋
            </h1>
            <p className="text-[#9CA3AF] text-sm mt-1">{weekLabel} · Strengthening Phase</p>
          </div>

          {/* Main 2-col row */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left: readiness ring */}
            <div style={CARD} className="rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
              <p className="text-[#9CA3AF] text-sm font-medium self-start">Today's Readiness</p>
              <ReadinessRing score={score} animated={animated} />
            </div>

            {/* Right: quick actions + next session */}
            <div className="flex flex-col gap-4">
              <Link
                to="/patient/log"
                className="flex items-center justify-center gap-2 text-white font-bold rounded-xl text-base transition-opacity hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#3B82F6', minHeight: 56, boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}
              >
                <span className="text-xl">✏️</span> Log Today's Session
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/patient/progress"
                  style={{ ...CARD, minHeight: 56 }}
                  className="flex items-center justify-center gap-2 rounded-xl text-[#F9FAFB] font-semibold text-sm transition-opacity hover:opacity-80"
                >
                  <span className="text-lg">📈</span> View My Progress
                </Link>
                <Link
                  to="/patient/messages"
                  style={{ ...CARD, minHeight: 56 }}
                  className="flex items-center justify-center gap-2 rounded-xl text-[#F9FAFB] font-semibold text-sm transition-opacity hover:opacity-80"
                >
                  <span className="text-lg">💬</span> Message My PT
                </Link>
              </div>

              {/* Next session */}
              <div style={CARD} className="rounded-2xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    📅
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs font-medium">Next PT Session</p>
                    <p className="text-[#F9FAFB] font-bold text-sm">{nextSessionLabel}</p>
                  </div>
                </div>
                <span className="text-[#3B82F6] text-sm font-semibold">9:00 AM</span>
              </div>

              {/* Streak */}
              <div style={CARD} className="rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  🔥
                </div>
                <div>
                  <p className="text-[#F9FAFB] font-bold text-sm">{todayStats.streak}-day streak — keep it up!</p>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">You've logged every day this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return-to-sport banner */}
          <div
            className="rounded-2xl px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', boxShadow: '0 4px 24px rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-white font-black text-xl">You're {returnToSportPct}% of the way to return-to-sport</p>
                <p className="text-blue-200 text-sm mt-0.5">Next up: Light Jogging · Target Jul 3</p>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="w-36 bg-white/20 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-white transition-all duration-1000"
                  style={{ width: animated ? `${returnToSportPct}%` : '0%' }}
                />
              </div>
              <p className="text-blue-200 text-xs mt-1">{returnToSportPct}% complete</p>
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
