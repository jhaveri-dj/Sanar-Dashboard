import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { allAlerts } from '../../data/clinicianData'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  overflow: 'hidden',
}

const SEVERITY = {
  red: {
    leftBorder: '#DC2626',
    label: 'Critical',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    pillBg: '#FEF2F2',
    pillColor: '#DC2626',
    pillBorder: '#FECACA',
  },
  yellow: {
    leftBorder: '#D97706',
    label: 'Warning',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    pillBg: '#FFFBEB',
    pillColor: '#D97706',
    pillBorder: '#FDE68A',
  },
}

export default function Alerts() {
  const [dismissed, setDismissed] = useState(new Set())
  const [expanded, setExpanded] = useState(new Set(['mw-1']))

  const activeAlerts = allAlerts.filter(a => !dismissed.has(a.id))
  const redCount = activeAlerts.filter(a => a.severity === 'red').length

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
      <div style={{ padding: '28px 32px', background: '#F4F5F7', minHeight: '100%' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0 }}>Alerts inbox</h1>
              <p style={{ fontSize: 13, color: '#374151', margin: '4px 0 0' }}>
                All patients · {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>
            {redCount > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 20,
                padding: '6px 12px',
              }}>
                <div
                  className="animate-pulse"
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#DC2626' }}>{redCount} critical</span>
              </div>
            )}
          </div>

          {/* ── Alert list ── */}
          {activeAlerts.length === 0 ? (
            <div style={{ ...CARD, padding: 48, textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#16A34A', margin: '0 0 4px' }}>All clear</p>
              <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>No active alerts across all patients.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[...activeAlerts].sort((a, b) => {
                if (a.severity === b.severity) return 0
                return a.severity === 'red' ? -1 : 1
              }).map(alert => {
                const sv = SEVERITY[alert.severity] || SEVERITY.yellow
                const isOpen = expanded.has(alert.id)
                return (
                  <div key={alert.id} style={{ ...CARD, borderLeft: `4px solid ${sv.leftBorder}` }}>

                    {/* Card header row — clickable to expand */}
                    <button
                      onClick={() => toggleExpand(alert.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 16,
                        padding: 20,
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Warning icon box */}
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: sv.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        <AlertTriangle size={18} color={sv.iconColor} strokeWidth={2} />
                      </div>

                      {/* Main content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Tags + timestamp row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                          <span style={{
                            fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                            background: sv.pillBg, color: sv.pillColor, border: `1px solid ${sv.pillBorder}`,
                          }}>
                            {sv.label}
                          </span>
                          <span style={{
                            fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                            background: '#F3F4F6', color: '#1F2937',
                          }}>
                            {alert.patientName}
                          </span>
                          <span style={{
                            fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                            background: '#EFF6FF', color: '#3B82F6',
                          }}>
                            {alert.category}
                          </span>
                          <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>
                            {new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                            {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>{alert.title}</p>
                        <p style={{ fontSize: 13, color: '#374151', margin: '6px 0 0', lineHeight: 1.6 }}>{alert.message}</p>
                      </div>

                      {/* Chevron */}
                      <ChevronDown
                        size={16}
                        color="#9CA3AF"
                        strokeWidth={2}
                        style={{
                          flexShrink: 0,
                          marginTop: 4,
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </button>

                    {/* Expanded panel */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #E5E7EB', padding: 16, background: '#F9FAFB' }}>
                        <p style={{
                          fontSize: 10, fontWeight: 500,
                          textTransform: 'uppercase', letterSpacing: '0.1em',
                          color: '#6B7280', margin: '0 0 8px',
                        }}>
                          Recommended Action
                        </p>
                        <p style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.6, margin: '0 0 16px' }}>
                          {alert.recommendedAction}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => dismiss(alert.id)}
                            style={{
                              fontSize: 13, fontWeight: 500,
                              color: '#1F2937', background: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                            }}
                          >
                            Dismiss
                          </button>
                          <button style={{
                            fontSize: 13, fontWeight: 500,
                            color: '#FFFFFF', background: '#4F52C4',
                            border: '1px solid #4F52C4',
                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                          }}>
                            Mark Reviewed
                          </button>
                          <Link
                            to={`/clinician/patient/${alert.patientId}`}
                            style={{
                              fontSize: 13, fontWeight: 500,
                              color: '#4F52C4', background: 'transparent',
                              border: 'none', marginLeft: 'auto',
                              textDecoration: 'none', cursor: 'pointer',
                            }}
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

          {/* Restore dismissed */}
          {dismissed.size > 0 && (
            <button
              onClick={() => setDismissed(new Set())}
              style={{
                fontSize: 13, fontWeight: 500,
                color: '#374151', background: 'transparent',
                border: 'none', cursor: 'pointer', marginTop: 16,
              }}
            >
              Restore {dismissed.size} dismissed alert{dismissed.size > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </ClinicianLayout>
  )
}
