import { Link } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { patients } from '../../data/patients'
import { patientDataMap, allAlerts } from '../../data/clinicianData'

function getAdherenceColor(pct) {
  if (pct >= 80) return '#10B981'
  if (pct >= 65) return '#F59E0B'
  return '#EF4444'
}

function getRiskColor(score) {
  if (score <= 25) return '#10B981'
  if (score <= 50) return '#F59E0B'
  return '#EF4444'
}

function getRiskLabel(score) {
  if (score <= 25) return 'Low'
  if (score <= 50) return 'Moderate'
  return 'High'
}

const criticalAlerts = allAlerts.filter(a => a.severity === 'red')

export default function Dashboard() {
  return (
    <ClinicianLayout>
      <div className="p-6 md:p-8">

        {/* Header */}
        <div className="mb-7">
          <p className="text-[#6B7280] text-sm mb-1">Welcome back</p>
          <h1 className="text-[#F9FAFB] text-2xl font-bold tracking-tight">Dr. Sarah Mitchell</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Alert banner */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl px-5 py-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#EF4444] font-semibold text-sm">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require attention
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {criticalAlerts.map(a => (
                    <span key={a.id} className="text-[#FCA5A5] text-xs bg-[#EF4444]/10 border border-[#EF4444]/20 px-2 py-0.5 rounded-full">
                      {a.patientName} · {a.category}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/clinician/alerts" className="text-[#EF4444] text-xs font-semibold hover:underline flex-shrink-0 whitespace-nowrap">
                View all →
              </Link>
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#F9FAFB] font-semibold text-lg">Patient Roster</h2>
          <span className="bg-[#3B82F6]/10 text-[#60A5FA] text-xs font-semibold px-3 py-1 rounded-full border border-[#3B82F6]/20">
            {patients.length} patients assigned
          </span>
        </div>

        {/* Patient cards */}
        <div className="space-y-4">
          {patients.map(p => {
            const data = patientDataMap[p.id]
            const s = data.currentWeekSummary
            const patientAlerts = data.alerts
            const romTrend = s.rom - s.romPrevWeek

            const statCells = [
              {
                label: 'Phase',
                value: `Phase ${p.currentPhase.number}`,
                sub: p.currentPhase.name,
                color: '#3B82F6',
              },
              {
                label: 'Week',
                value: `${p.weekInRecovery} / 52`,
                sub: `${Math.round((p.weekInRecovery / p.totalWeeks) * 100)}% complete`,
                color: '#9CA3AF',
              },
              {
                label: 'ROM',
                value: `${s.rom}°`,
                sub: `${romTrend >= 0 ? '+' : ''}${romTrend}° this wk`,
                color: '#3B82F6',
              },
              {
                label: 'Adherence',
                value: `${s.adherence}%`,
                sub: `${s.completedSessions} / ${s.prescribedSessions} sessions`,
                color: getAdherenceColor(s.adherence),
              },
              {
                label: 'Symmetry',
                value: `${s.symmetryIndex}%`,
                sub: s.symmetryIndex >= 70 ? 'On target' : 'Below threshold',
                color: s.symmetryIndex >= 80 ? '#10B981' : s.symmetryIndex >= 70 ? '#F59E0B' : '#EF4444',
              },
              {
                label: 'Risk Score',
                value: s.riskScore,
                sub: getRiskLabel(s.riskScore),
                color: getRiskColor(s.riskScore),
              },
            ]

            return (
              <div key={p.id} className="bg-[#111827] rounded-lg border border-[#1F2937] overflow-hidden transition-colors">

                {/* Card header */}
                <div className="px-6 py-5 border-b border-[#1F2937] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[#F9FAFB] font-semibold text-base">{p.name}</h3>
                        {patientAlerts.length > 0 && (
                          <span className="bg-[#EF4444]/15 text-[#EF4444] text-xs font-bold px-2 py-0.5 rounded-full border border-[#EF4444]/25 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] inline-block animate-pulse"/>
                            {patientAlerts.length} alert{patientAlerts.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-[#9CA3AF] text-sm mt-0.5">{p.age}y · {p.graftType} · {p.affectedLeg} knee</p>
                    </div>
                  </div>
                  <Link
                    to={`/clinician/patient/${p.id}`}
                    className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    View Detail
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 md:grid-cols-6">
                  {statCells.map(({ label, value, sub, color }, i) => (
                    <div
                      key={label}
                      className={`px-5 py-3.5 ${i > 0 ? 'border-l border-[#1F2937]' : ''} ${i >= 3 ? 'border-t border-[#1F2937] md:border-t-0' : ''}`}
                    >
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                      <p className="font-bold text-base leading-tight" style={{ color }}>{value}</p>
                      <p className="text-[#6B7280] text-xs mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Session dates + weekly summary */}
                <div className="px-6 py-4 border-t border-[#1F2937] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-5 text-xs text-[#9CA3AF]">
                    <span>
                      Last session:{' '}
                      <span className="text-[#F9FAFB] font-medium">
                        {new Date(p.lastSessionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </span>
                    <span>
                      Next session:{' '}
                      <span className="text-[#60A5FA] font-medium">
                        {new Date(p.nextSessionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </span>
                    <span>
                      Projected RTS:{' '}
                      <span className="text-[#F9FAFB] font-medium">{p.projectedRTSDate}</span>
                    </span>
                  </div>

                  {/* Monospace summary card */}
                  <div className="font-mono text-[11px] text-[#6B7280] bg-[#0A0F1E] rounded-lg px-4 py-2.5 leading-relaxed whitespace-nowrap">
                    <span className="text-[#9CA3AF] font-semibold">Week {p.weekInRecovery}</span>
                    {' · '}P{p.currentPhase.number}: {p.currentPhase.name}
                    <br/>
                    ROM {s.rom}° · Adherence {s.adherence}% · Symmetry {s.symmetryIndex}%
                    {s.clinicianFlag && (
                      <>
                        <br/>
                        <span className={patientAlerts.length > 0 ? 'text-[#FCA5A5]' : 'text-[#6B7280]'}>
                          {patientAlerts.length > 0 ? '! ' : '- '}{s.clinicianFlag}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ClinicianLayout>
  )
}
