import { Link } from 'react-router-dom'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'

function getRtsStatus(s) {
  const metCount = [s.symmetryIndex >= 90, s.rom >= 125, s.jointStrengthIndex >= 80].filter(Boolean).length
  if (metCount === 3) return { label: 'RTS Ready',        color: '#10B981' }
  if (s.symmetryIndex < 70) return { label: 'Not Ready', color: '#EF4444' }
  return { label: 'Monitor',                              color: '#F59E0B' }
}

function getStatusLine(s) {
  if (s.symmetryIndex < 70) return 'Intervention needed'
  if (s.symmetryIndex < 90 || s.rom < 125 || s.jointStrengthIndex < 80) return 'Monitor — symmetry lagging'
  return 'On track'
}

export default function SurgeonDashboard() {
  return (
    <SurgeonLayout>
      <div className="p-6 md:p-8">

        {/* Header */}
        <div className="mb-7">
          <p className="text-[#6B7280] text-sm mb-1">Welcome back</p>
          <h1 className="text-[#F9FAFB] text-2xl font-bold tracking-tight">Dr. James Ortiz</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#F9FAFB] font-semibold text-lg">Post-Op Patient Roster</h2>
          <span className="bg-[#8B5CF6]/10 text-[#A78BFA] text-xs font-semibold px-3 py-1 rounded-full border border-[#8B5CF6]/20">
            {patients.length} patients
          </span>
        </div>

        {/* Patient cards */}
        <div className="space-y-4">
          {patients.map(p => {
            const s = patientDataMap[p.id].currentWeekSummary
            const rts = getRtsStatus(s)
            const status = getStatusLine(s)
            const lsiColor = s.symmetryIndex >= 90 ? '#10B981' : s.symmetryIndex >= 70 ? '#F59E0B' : '#EF4444'

            return (
              <div key={p.id} className="bg-[#111827] rounded-lg border border-[#1F2937] overflow-hidden">
                <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-4">

                  {/* Patient info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {p.initials}
                    </div>
                    <div>
                      <h3 className="text-[#F9FAFB] font-semibold text-base">{p.name}</h3>
                      <p className="text-[#9CA3AF] text-sm mt-0.5">{p.age}y · {p.graftType} · {p.affectedLeg} knee</p>
                      <p className="text-[#6B7280] text-xs mt-0.5">Week {p.weekInRecovery} · RTS target {p.projectedRTSDate}</p>
                    </div>
                  </div>

                  {/* Right side: LSI + badge + status + CTA */}
                  <div className="flex items-center gap-5 flex-wrap ml-auto">

                    {/* LSI */}
                    <div className="text-center">
                      <p className="text-[#6B7280] text-[10px] uppercase tracking-wider mb-0.5">LSI</p>
                      <p className="font-bold text-lg leading-none" style={{ color: lsiColor }}>{s.symmetryIndex}%</p>
                    </div>

                    {/* RTS badge */}
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                      style={{
                        color: rts.color,
                        backgroundColor: rts.color + '1A',
                        borderColor: rts.color + '4D',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: rts.color }}/>
                      {rts.label}
                    </span>

                    {/* Status */}
                    <p className="text-[#9CA3AF] text-xs hidden sm:block">{status}</p>

                    <Link
                      to={`/surgeon/patient/${p.id}`}
                      className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
                    >
                      View Detail
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </SurgeonLayout>
  )
}
