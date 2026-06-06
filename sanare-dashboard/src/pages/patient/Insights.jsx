import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import PatientLayout from '../../components/patient/PatientLayout'
import { weeklyInsights, recentRomTrend, currentMilestone } from '../../data/patientData'

const WINS = [
  { emoji: '📐', title: `ROM improved ${weeklyInsights.romImprovement}°`, detail: 'Best week yet — 118° achieved', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  { emoji: '📋', title: `${weeklyInsights.adherence}% adherence`, detail: '4 of 5 sessions completed on time', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { emoji: '⚡', title: `VMO activation +${weeklyInsights.vmoActivationIncrease}%`, detail: 'Quad strength building well', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-[#1E3A5F] font-bold">{payload[0].value}° ROM</p>
    </div>
  )
}

export default function Insights() {
  const nextM = weeklyInsights.nextMilestone

  return (
    <PatientLayout>
      <div className="px-5 pt-8 space-y-5">

        {/* Header */}
        <div>
          <p className="text-gray-400 text-sm font-medium">{weeklyInsights.weekLabel} recap</p>
          <h1 className="text-[#1E3A5F] text-2xl font-bold tracking-tight mt-0.5">Your Week in Review</h1>
        </div>

        {/* 3 wins card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏅</span>
            <h2 className="text-[#1E3A5F] font-bold text-base">3 Wins This Week</h2>
          </div>
          <div className="space-y-3">
            {WINS.map(({ emoji, title, detail, color, bg, border }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-3.5 rounded-2xl border"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  {emoji}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color }}>{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROM trend chart */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[#1E3A5F] font-bold text-base">ROM — Last 4 Weeks</h2>
            <span className="text-[#10B981] text-sm font-bold">+{weeklyInsights.romImprovement}° ↑</span>
          </div>
          <p className="text-gray-400 text-xs mb-4">Range of motion in degrees</p>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentRomTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="patientRomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} domain={[95, 125]} tickFormatter={v => `${v}°`}/>
                <Tooltip content={<CustomTooltip />}/>
                <Line
                  type="monotone" dataKey="rom" name="ROM"
                  stroke="#1E3A5F" strokeWidth={2.5}
                  dot={{ fill: '#1E3A5F', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1E3A5F', strokeWidth: 2, stroke: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Motivational message */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FEF3C7] rounded-3xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💬</span>
            <div>
              <p className="text-[#1E3A5F] font-bold text-sm mb-2">From Dr. Sarah Mitchell</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {weeklyInsights.motivationalMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Next milestone preview */}
        {nextM && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Up next</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 text-xl">
                🏃
              </div>
              <div className="flex-1">
                <p className="text-[#1E3A5F] font-bold text-sm">{nextM.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{nextM.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                    <div
                      className="h-1.5 rounded-full bg-[#3B82F6]"
                      style={{ width: `${nextM.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{nextM.progress}% complete</span>
                    <span>Target: {new Date(nextM.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase summary */}
        <div className="bg-[#1E3A5F] rounded-3xl p-5 shadow-lg shadow-[#1E3A5F]/20 pb-6">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-2">Current phase</p>
          <p className="text-white font-black text-lg">Phase 3 — Strengthening</p>
          <p className="text-blue-200 text-sm mt-1">Weeks 10–16 · You're on track 🚀</p>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-white/10 rounded-2xl py-3 text-center">
              <p className="text-white font-bold">Week 12</p>
              <p className="text-blue-200 text-xs">of 16</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl py-3 text-center">
              <p className="text-white font-bold">4 left</p>
              <p className="text-blue-200 text-xs">in phase</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl py-3 text-center">
              <p className="text-[#34D399] font-bold">On track</p>
              <p className="text-blue-200 text-xs">status</p>
            </div>
          </div>
        </div>

      </div>
    </PatientLayout>
  )
}
