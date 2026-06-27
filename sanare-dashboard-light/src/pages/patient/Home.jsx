import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Play, TrendingUp, MessageCircle, Trophy,
  Calendar, Flame, CheckCircle, Ruler, Zap,
} from 'lucide-react'
import PatientLayout from '../../components/patient/PatientLayout'
import PatientContextHeader from '../../components/patient/PatientContextHeader'
import { weeklyReadiness, currentMilestone, todayStats, activityRings, rehabPhases, currentRehabPhase, accomplishedMilestones } from '../../data/patientData'
import PhaseStepper from '../../components/patient/PhaseStepper'
import { currentPatient } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function ReadinessRing({ score, animated }) {
  const r = 65
  const circumference = 2 * Math.PI * r
  const offset = animated ? circumference * (1 - score / 100) : circumference
  const label = score >= 80 ? 'Great shape today!' : score >= 60 ? 'Good to train steadily' : 'Take it easy today'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#EEF2FF" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={r}
            fill="none" stroke="#4F52C4" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {score}
          </span>
          <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 500, marginTop: 4 }}>out of 100</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <CheckCircle size={14} color="#16A34A" strokeWidth={2} />
        <span style={{ color: '#16A34A', fontSize: 13, fontWeight: 500 }}>{label}</span>
      </div>
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
  const score  = latest.score

  const completedCount = accomplishedMilestones.length
  const totalPhases = rehabPhases.length

  const nextSession = new Date()
  nextSession.setDate(nextSession.getDate() + 2)
  const nextSessionLabel = nextSession.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <PatientContextHeader
            title={`${getGreeting()}, Alex`}
            facts={[
              { label: 'Recovery week', value: `Week ${currentPatient.weekInRecovery} of ${currentPatient.totalWeeks}` },
              { label: 'Phase', value: currentPatient.currentPhase.name },
              { label: 'Today', value: todayStr },
              { label: 'Current goal', value: currentMilestone.name },
              { label: 'Knee ROM', value: `${todayStats.currentRom}°` },
            ]}
          />

          {/* Today's Readiness hero card */}
          <div style={{
            background: 'linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 70%)',
            border: '2px solid #E8EAED',
            borderRadius: 20,
            padding: 32,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            alignItems: 'center',
          }}>
            {/* Left — ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: '0 0 4px', textAlign: 'center' }}>
                Today's Readiness
              </p>
              <ReadinessRing score={score} animated={animated} />
            </div>

            {/* Right — actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Primary CTA */}
              <Link
                to="/patient/workout"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', boxSizing: 'border-box',
                  background: '#4F52C4', color: 'white',
                  fontSize: 15, fontWeight: 600,
                  borderRadius: 12, padding: '14px 20px', textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#4338CA'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,82,196,0.30)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#4F52C4'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Play size={18} fill="white" />
                Start Workout
              </Link>

              {/* Secondary buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { to: '/patient/progress', Icon: TrendingUp,    label: 'View My Progress' },
                  { to: '/patient/messages', Icon: MessageCircle, label: 'Reply to My PT'    },
                ].map(({ to, Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: '#FFFFFF', border: '1px solid #E8EAED', color: '#374151',
                      fontSize: 13, fontWeight: 500, borderRadius: 10, padding: '10px 14px',
                      textDecoration: 'none', transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF' }}
                  >
                    <Icon size={14} color="#6B7280" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Next session */}
              <div style={{
                background: '#F9FAFB', border: '1px solid #EAECF0', borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={16} color="#4F52C4" strokeWidth={1.8} />
                  <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Next PT Session
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{nextSessionLabel}</p>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#4F52C4' }}>9:00 AM</span>
                </div>
              </div>

              {/* Streak */}
              <div style={{
                background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Flame size={18} color="#F59E0B" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{todayStats.streak}-day streak — keep it up!</span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0 28px' }}>You've logged every day this week</p>
              </div>
            </div>
          </div>

          {/* Recovery phase banner — milestone-based, not percentage */}
          <div style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)',
            border: '1px solid #C7D2FE',
            borderRadius: 16, padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 240 }}>
                <Trophy size={22} color="#4F52C4" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
                    Phase {currentRehabPhase.number} of {totalPhases} — {currentRehabPhase.name}
                  </p>
                  <p style={{ fontSize: 13, color: '#374151', margin: '6px 0 0' }}>
                    {completedCount} milestones accomplished · Next up: {currentMilestone?.name}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
                    {currentRehabPhase.focus}
                  </p>
                </div>
              </div>
              <PhaseStepper phases={rehabPhases} size="sm" />
            </div>
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(199,210,254,0.6)',
              display: 'flex', flexWrap: 'wrap', gap: 8,
            }}>
              {accomplishedMilestones.map(m => (
                <span
                  key={m.id}
                  style={{
                    fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 999,
                    background: '#FFFFFF', color: '#16A34A', border: '1px solid #BBF7D0',
                  }}
                >
                  {m.name} ✓
                </span>
              ))}
            </div>
          </div>

          {/* This Week stats */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
              This week
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                {
                  iconBg: '#EEF2FF', Icon: Ruler, iconColor: '#4F52C4',
                  label: 'ROM TODAY',
                  value: `${todayStats.currentRom}°`,
                  sub: 'Personal best this week', subColor: '#16A34A',
                },
                {
                  iconBg: '#F0FDF4', Icon: Zap, iconColor: '#16A34A',
                  label: 'MUSCLE ACTIVATION',
                  value: `${activityRings.muscleActivation.current}%`,
                  sub: 'vs 68% last week ↑', subColor: '#16A34A',
                },
                {
                  iconBg: '#FFFBEB', Icon: Flame, iconColor: '#F59E0B',
                  label: 'SESSION STREAK',
                  value: `${todayStats.streak} days`,
                  sub: 'Keep the momentum', subColor: '#6B7280',
                },
              ].map(({ iconBg, Icon, iconColor, label, value, sub, subColor }) => (
                <div key={label} style={{ ...CARD, padding: '20px' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                  }}>
                    <Icon size={18} color={iconColor} strokeWidth={1.8} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 30, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 12, color: subColor, marginTop: 6 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
