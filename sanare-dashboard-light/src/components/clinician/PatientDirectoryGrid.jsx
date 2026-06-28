import { Link } from 'react-router-dom'
import { MessageCircle, Pencil, User, FileText } from 'lucide-react'
import { patients } from '../../data/patients'
import { getPatientAvatar } from '../../data/patientAvatars'

function metricColor(val) {
  if (val >= 85) return '#16A34A'
  if (val >= 70) return '#D97706'
  return '#DC2626'
}

function rtmStyle(status) {
  if (status === 'On Track') return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' }
  if (status === 'At Risk') return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
  return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' }
}

export default function PatientDirectoryGrid({ rows, portal = 'clinician' }) {
  const isSurgeon = portal === 'surgeon'
  const profilePath = id => isSurgeon ? `/surgeon/patient/${id}` : `/clinician/patient/${id}`
  const protocolPath = id => isSurgeon ? `/surgeon/patient/${id}/rehab-plan` : `/clinician/patient/${id}/rehab-plan`
  const thirdPath = id => isSurgeon ? `/surgeon/reports?patient=${id}` : `/clinician/messages/${id}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {rows.map(row => {
        const patient = patients.find(p => p.id === row.id)
        const badge = rtmStyle(row.rtm)
        return (
          <div key={row.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <img
                src={getPatientAvatar(row.id, 72)}
                alt={row.name}
                style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>{row.name}</h2>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, flexShrink: 0,
                    background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                  }}>
                    {row.rtm}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{row.injury}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                  {patient?.currentPhase.name} · Week {row.week}
                </p>
                {patient?.notes && (
                  <p style={{
                    margin: '8px 0 0', fontSize: 11, color: '#6B7280', lineHeight: 1.45,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {patient.notes}
                  </p>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
              borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6',
              background: '#FAFBFC',
            }}>
              {[
                { label: 'ROM', value: row.rom, color: '#4F52C4' },
                { label: 'Adherence', value: `${row.adherence}%`, color: metricColor(row.adherence) },
                { label: 'Symmetry', value: `${row.symmetry}%`, color: metricColor(row.symmetry) },
                { label: 'Strength', value: `${row.strength}%`, color: metricColor(row.strength) },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{
                  padding: '12px 10px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid #F3F4F6' : undefined,
                }}>
                  <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
              <Link
                to={profilePath(row.id)}
                className="btn-ghost"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: 12 }}
              >
                <User size={14} />
                Profile
              </Link>
              <Link
                to={protocolPath(row.id)}
                className="btn-ghost"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: 12 }}
              >
                <Pencil size={14} />
                Protocol
              </Link>
              <Link
                to={thirdPath(row.id)}
                className="btn-ghost"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: 12 }}
              >
                {isSurgeon ? <FileText size={14} /> : <MessageCircle size={14} />}
                {isSurgeon ? 'Report' : 'Message'}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
