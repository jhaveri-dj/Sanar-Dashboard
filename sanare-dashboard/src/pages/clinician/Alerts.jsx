import { useState } from 'react'
import { Link } from 'react-router-dom'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { allAlerts } from '../../data/clinicianData'

const SEVERITY = {
  red:    { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#EF4444', label: 'Critical' },
  yellow: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B', label: 'Warning' },
}
const CATEGORY_COLORS = {
  EMG:       { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA' },
  Adherence: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  ROM:       { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
  Pain:      { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24' },
  Symmetry:  { bg: 'rgba(239,68,68,0.15)',  text: '#FCA5A5' },
  Dropout:   { bg: 'rgba(249,115,22,0.15)', text: '#FDBA74' },
}
const PATIENT_COLORS = {
  'alex-chen-001':    { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  'marcus-webb-002':  { bg: 'rgba(239,68,68,0.15)',  text: '#FCA5A5' },
  'priya-sharma-003': { bg: 'rgba(16,185,129,0.15)', text: '#34D399' },
}

function AlertIcon({ severity }) {
  const c = severity === 'red' ? '#EF4444' : '#F59E0B'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>
  )
}

const CARD = {
  background: 'linear-gradient(180deg, #1C2333 0%, #161C2A 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
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
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 32px 64px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
          <div>
            <p style={{ color: '#60A5FA', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Monitoring</p>
            <h1 style={{ color: '#F9FAFB', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Alerts Inbox</h1>
            <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500, margin: '6px 0 0' }}>All patients · {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {redCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '9px 16px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} className="animate-pulse"/>
                <span style={{ color: '#EF4444', fontWeight: 700, fontSize: 14 }}>{redCount} critical</span>
              </div>
            )}
            {yellowCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '9px 16px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }}/>
                <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 14 }}>{yellowCount} warning</span>
              </div>
            )}
          </div>
        </div>

        <p style={{ color: '#94A3B8', fontSize: 13, margin: '0 0 22px' }}>Critical alerts shown first. Click any alert to expand details and recommended actions.</p>

        {/* Alert list */}
        {activeAlerts.length === 0 ? (
          <div style={{ ...CARD, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>All clear</p>
            <p style={{ color: '#9CA3AF', fontSize: 14 }}>No active alerts across all patients.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...activeAlerts].sort((a, b) => (a.severity === 'red' ? -1 : 1)).map(alert => {
              const sv = SEVERITY[alert.severity]
              const cat = CATEGORY_COLORS[alert.category] || { bg: 'rgba(255,255,255,0.05)', text: '#9CA3AF' }
              const ptColor = PATIENT_COLORS[alert.patientId] || { bg: 'rgba(255,255,255,0.05)', text: '#9CA3AF' }
              const isExpanded = expanded.has(alert.id)
              return (
                <div key={alert.id} style={{ ...CARD, borderLeft: `3px solid ${sv.color}`, overflow: 'hidden' }}>
                  <button onClick={() => toggleExpand(alert.id)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16, padding: 20, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: sv.bg, border: `1px solid ${sv.border}` }}>
                      <AlertIcon severity={alert.severity}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: sv.color, background: sv.bg, border: `1px solid ${sv.border}` }}>{sv.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: ptColor.text, background: ptColor.bg }}>{alert.patientName}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999, color: cat.text, background: cat.bg }}>{alert.category}</span>
                        <span style={{ color: '#94A3B8', fontSize: 12, marginLeft: 'auto' }}>
                          {new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 15, margin: 0 }}>{alert.title}</p>
                      <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 500, margin: '4px 0 0', lineHeight: 1.6 }}>{alert.message}</p>
                    </div>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2} style={{ flexShrink: 0, marginTop: 4, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, marginTop: 14 }}>
                        <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Recommended Action</p>
                        <p style={{ color: '#F3F4F6', fontSize: 14, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{alert.recommendedAction}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <button onClick={() => dismiss(alert.id)} style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '7px 14px', borderRadius: 9, cursor: 'pointer' }} className="hover:bg-white/10">Dismiss</button>
                        <button style={{ fontSize: 13, fontWeight: 600, color: '#60A5FA', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', padding: '7px 14px', borderRadius: 9, cursor: 'pointer' }} className="hover:bg-[#3B82F6]/25">Mark Reviewed</button>
                        <Link to={`/clinician/patient/${alert.patientId}`} style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '7px 14px', borderRadius: 9, marginLeft: 'auto', textDecoration: 'none' }} className="hover:bg-white/10">View patient →</Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {dismissed.size > 0 && (
          <button onClick={() => setDismissed(new Set())} style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer', marginTop: 16 }} className="hover:text-white">
            Restore {dismissed.size} dismissed alert{dismissed.size > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </ClinicianLayout>
  )
}
