import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import PatientLayout from '../../components/patient/PatientLayout'
import { weeklyInsights, recentRomTrend, currentMilestone } from '../../data/patientData'

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}

const WINS = [
  {
    emoji: '🦵',
    title: `Knee flexibility improved ${weeklyInsights.romImprovement}°`,
    detail: 'Best week yet — you bent further than ever!',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
  },
  {
    emoji: '📋',
    title: `${weeklyInsights.adherence}% of sessions completed`,
    detail: '4 of 5 sessions done — you showed up!',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
  },
  {
    emoji: '💪',
    title: `Quad strength up ${weeklyInsights.vmoActivationIncrease}%`,
    detail: 'Your muscles are getting noticeably stronger',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.25)',
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: '#1C2333', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-[#9CA3AF] mb-1">{label}</p>
      <p className="text-[#3B82F6] font-bold">{payload[0].value} degrees</p>
    </div>
  )
}

export default function Insights() {
  const [goal, setGoal] = useState('')
  const [savedGoal, setSavedGoal] = useState('Return to soccer by October')
  const [editing, setEditing] = useState(false)

  function saveGoal() {
    if (goal.trim()) setSavedGoal(goal.trim())
    setGoal('')
    setEditing(false)
  }

  const nextM = weeklyInsights.nextMilestone

  return (
    <PatientLayout>
      <div className="p-8">
        <div className="max-w-[1100px] mx-auto space-y-6">

          {/* Header */}
          <div>
            <p className="text-[#9CA3AF] text-sm font-medium">{weeklyInsights.weekLabel} recap</p>
            <h1 className="text-[#F9FAFB] text-3xl font-bold tracking-tight mt-0.5">My Wins</h1>
          </div>

          {/* Personal goal — full width */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 4px 24px rgba(99,102,241,0.15)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <span className="text-3xl flex-shrink-0">🎯</span>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-200 text-sm font-medium mb-1">My Goal</p>
                  {editing ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        placeholder="E.g. Return to soccer by October"
                        onKeyDown={e => e.key === 'Enter' && saveGoal()}
                        autoFocus
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm outline-none focus:border-white/40"
                      />
                      <button
                        onClick={saveGoal}
                        className="px-4 py-2 bg-white text-[#1e3a8a] font-bold text-sm rounded-lg flex-shrink-0 hover:bg-blue-50 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-white font-black text-xl">{savedGoal}</p>
                  )}
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => { setGoal(savedGoal); setEditing(true) }}
                  className="text-blue-200 hover:text-white text-sm font-medium flex-shrink-0 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* 2-col: wins + chart */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left col */}
            <div className="space-y-5">

              {/* 3 Wins */}
              <div style={CARD} className="rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏅</span>
                  <h2 className="text-[#F9FAFB] font-bold text-lg">3 Wins This Week</h2>
                </div>
                <div className="space-y-3">
                  {WINS.map(({ emoji, title, detail, color, bg, border }) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: bg, border: `1px solid ${border}` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                        style={{ background: `${color}20` }}
                      >
                        {emoji}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color }}>{title}</p>
                        <p className="text-[#9CA3AF] text-xs mt-0.5">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message from PT */}
              <div
                className="rounded-2xl p-5"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💬</span>
                  <div>
                    <p className="text-[#F9FAFB] font-bold text-sm mb-1.5">From Sarah Mitchell, PT</p>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed">{weeklyInsights.motivationalMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-5">

              {/* Knee flexibility chart */}
              <div style={CARD} className="rounded-2xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[#F9FAFB] font-bold text-lg">Knee Flexibility Progress</h2>
                  <span className="text-[#10B981] font-bold">+{weeklyInsights.romImprovement} ↑</span>
                </div>
                <p className="text-[#9CA3AF] text-xs mb-5">Last 4 weeks</p>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recentRomTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="patientRomGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                      <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[95, 125]}/>
                      <Tooltip content={<CustomTooltip />}/>
                      <Line
                        type="monotone" dataKey="rom"
                        stroke="#3B82F6" strokeWidth={2.5}
                        dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#060810' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Next milestone */}
              {nextM && (
                <div style={CARD} className="rounded-2xl p-6">
                  <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-3">Up next</p>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
                    >
                      🏃
                    </div>
                    <div className="flex-1">
                      <p className="text-[#F9FAFB] font-bold">{nextM.name}</p>
                      <p className="text-[#9CA3AF] text-sm mt-0.5">{nextM.description}</p>
                      <div className="mt-3">
                        <div className="w-full rounded-full h-2 mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="h-2 rounded-full bg-[#3B82F6]"
                            style={{ width: `${nextM.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#9CA3AF]">
                          <span>{nextM.progress}% complete</span>
                          <span>Target: {new Date(nextM.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase */}
              <div
                className="rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', boxShadow: '0 4px 16px rgba(59,130,246,0.15)' }}
              >
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Current phase</p>
                <p className="text-white font-black text-lg">Phase 3 — Strengthening</p>
                <p className="text-blue-200 text-sm mt-1">Weeks 10–16 · You're on track 🚀</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { val: 'Week 12', sub: 'of 16' },
                    { val: '4 left',  sub: 'in phase' },
                    { val: 'On track', sub: 'status', green: true },
                  ].map(({ val, sub, green }) => (
                    <div key={sub} className="rounded-xl py-3 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <p className="font-bold text-sm" style={{ color: green ? '#34D399' : 'white' }}>{val}</p>
                      <p className="text-blue-200 text-xs mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
