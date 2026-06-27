import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, User } from 'lucide-react'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { clinicianRoster } from '../../data/clinicianData'
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

export default function SurgeonPatients() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return clinicianRoster.filter(row =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.injury.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <SurgeonLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Surgical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Patients</span>
        </div>
      </div>

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Patient Directory</h1>
          <p className="page-subtitle">
            Post-op recovery overview — {clinicianRoster.length} patients under your care
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search by name or injury…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', maxWidth: 360, fontSize: 14, padding: '10px 14px',
              background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: 10, outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(row => {
            const patient = patients.find(p => p.id === row.id)
            const badge = rtmStyle(row.rtm)
            return (
              <div key={row.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '18px 18px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <img
                    src={getPatientAvatar(row.id, 56)}
                    alt={row.name}
                    style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>{row.name}</h2>
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
                  </div>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
                  borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6',
                  background: '#FAFBFC',
                }}>
                  {[
                    { label: 'ROM', value: row.rom, color: '#4F52C4' },
                    { label: 'Symmetry', value: `${row.symmetry}%`, color: metricColor(row.symmetry) },
                    { label: 'Strength', value: `${row.strength}%`, color: metricColor(row.strength) },
                  ].map(({ label, value, color }, i) => (
                    <div key={label} style={{
                      padding: '10px 8px', textAlign: 'center',
                      borderRight: i < 2 ? '1px solid #F3F4F6' : undefined,
                    }}>
                      <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '10px 14px' }}>
                  <Link
                    to={`/surgeon/patient/${row.id}`}
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 12 }}
                  >
                    <User size={14} />
                    View profile
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SurgeonLayout>
  )
}
