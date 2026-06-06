import { useState } from 'react'
import { Link } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { allAlerts } from '../../data/clinicianData'

const SEVERITY_STYLES = {
  red:    { bg: '#EF444415', border: '#EF444430', badge: '#EF4444', badgeBg: '#EF444420', label: 'Critical', icon: '#EF4444' },
  yellow: { bg: '#F59E0B10', border: '#F59E0B25', badge: '#F59E0B', badgeBg: '#F59E0B15', label: 'Warning',  icon: '#F59E0B' },
}

const CATEGORY_COLORS = {
  EMG:       { bg: '#8B5CF615', text: '#8B5CF6' },
  Adherence: { bg: '#3B82F615', text: '#3B82F6' },
  ROM:       { bg: '#10B98115', text: '#10B981' },
  Pain:      { bg: '#F59E0B15', text: '#F59E0B' },
  Symmetry:  { bg: '#EF444415', text: '#EF4444' },
  Dropout:   { bg: '#F9731615', text: '#F97316' },
}

const PATIENT_COLORS = {
  'alex-chen-001':    { bg: '#3B82F615', text: '#60A5FA' },
  'marcus-webb-002':  { bg: '#EF444415', text: '#FCA5A5' },
  'priya-sharma-003': { bg: '#10B98115', text: '#34D399' },
}

function AlertIcon({ severity }) {
  if (severity === 'red') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  )
}

export default function Alerts() {
  const [dismissed, setDismissed] = useState(new Set())
  const [expanded, setExpanded] = useState(new Set(['mw-1']))

  const activeAlerts = allAlerts.filter(a => !dismissed.has(a.id))
  const redCount = activeAlerts.filter(a => a.severity === 'red').length
  const yellowCount = activeAlerts.filter(a => a.severity === 'yellow').length

  function toggleExpand(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function dismiss(id) {
    setDismissed(prev => new Set([...prev, id]))
  }

  return (
    <ClinicianLayout>
      <div className="p-6 md:p-8 max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[#F9FAFB] text-2xl font-bold tracking-tight">Alerts Inbox</h1>
            <p className="text-[#6B7280] text-sm mt-1">All patients · {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {redCount > 0 && (
              <div className="flex items-center gap-2 bg-[#EF444415] border border-[#EF444430] rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"/>
                <span className="text-[#EF4444] font-semibold text-sm">{redCount} critical</span>
              </div>
            )}
            {yellowCount > 0 && (
              <div className="flex items-center gap-2 bg-[#F59E0B10] border border-[#F59E0B25] rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]"/>
                <span className="text-[#F59E0B] font-semibold text-sm">{yellowCount} warning</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-[#4B5563] text-xs">Critical alerts shown first. Click to expand details and recommended actions.</p>

        {/* Alert list */}
        {activeAlerts.length === 0 ? (
          <div className="bg-[#111827] rounded-lg p-12 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/15 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-[#F9FAFB] font-semibold mb-1">All clear</p>
            <p className="text-[#6B7280] text-sm">No active alerts across all patients.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...activeAlerts]
              .sort((a, b) => (a.severity === 'red' ? -1 : 1))
              .map(alert => {
                const sv = SEVERITY_STYLES[alert.severity]
                const cat = CATEGORY_COLORS[alert.category] || { bg: '#1F293750', text: '#9CA3AF' }
                const ptColor = PATIENT_COLORS[alert.patientId] || { bg: '#1F293750', text: '#9CA3AF' }
                const isExpanded = expanded.has(alert.id)

                return (
                  <div
                    key={alert.id}
                    className="rounded-lg border overflow-hidden transition-all"
                    style={{ backgroundColor: sv.bg, borderColor: sv.border }}
                  >
                    {/* Header — click to expand */}
                    <button
                      className="w-full flex items-start gap-4 p-5 text-left"
                      onClick={() => toggleExpand(alert.id)}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: sv.badgeBg }}
                      >
                        <AlertIcon severity={alert.severity} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ color: sv.badge, backgroundColor: sv.badgeBg }}
                          >
                            {sv.label}
                          </span>
                          {/* Patient name badge */}
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ color: ptColor.text, backgroundColor: ptColor.bg }}
                          >
                            {alert.patientName}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ color: cat.text, backgroundColor: cat.bg }}
                          >
                            {alert.category}
                          </span>
                          <span className="text-[#6B7280] text-xs ml-auto">
                            {new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' '}
                            {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#F9FAFB] font-semibold text-sm">{alert.title}</p>
                        <p className="text-[#9CA3AF] text-xs mt-0.5 leading-relaxed">{alert.message}</p>
                      </div>

                      <svg
                        width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth={2}
                        className={`flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {/* Expanded: recommended action */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-white/5">
                        <div className="bg-[#111827] rounded-xl p-4 mt-3">
                          <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-2">Recommended Action</p>
                          <p className="text-[#F9FAFB] text-sm leading-relaxed">{alert.recommendedAction}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => dismiss(alert.id)}
                            className="text-xs text-[#6B7280] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
                          >
                            Dismiss
                          </button>
                          <button className="text-xs bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 text-[#3B82F6] border border-[#3B82F6]/25 px-3 py-1.5 rounded-lg transition font-medium">
                            Mark Reviewed
                          </button>
                          <Link
                            to={`/clinician/patient/${alert.patientId}`}
                            className="text-xs bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-lg transition ml-auto"
                          >
                            View patient →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}

        {dismissed.size > 0 && (
          <button
            onClick={() => setDismissed(new Set())}
            className="text-xs text-[#6B7280] hover:text-white transition"
          >
            Restore {dismissed.size} dismissed alert{dismissed.size > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </ClinicianLayout>
  )
}
