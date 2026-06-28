import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import PatientDirectoryGrid from '../../components/clinician/PatientDirectoryGrid'
import { clinicianRoster } from '../../data/clinicianData'

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

      <div style={{ padding: '28px 32px', background: '#F4F5F7', minHeight: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111827' }}>Patients</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
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

        <PatientDirectoryGrid rows={filtered} portal="surgeon" />
      </div>
    </SurgeonLayout>
  )
}
