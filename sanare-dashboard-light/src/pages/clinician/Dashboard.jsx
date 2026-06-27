import { useMemo, useState } from 'react'
import {
  ChevronRight, ChevronDown, Plus,
} from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import PatientDirectoryGrid from '../../components/clinician/PatientDirectoryGrid'
import { clinicianRoster } from '../../data/clinicianData'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
}

const BTN_GHOST = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 500,
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid #D1D5DB',
  background: '#FFFFFF',
  color: '#1F2937',
  cursor: 'pointer',
}

export default function Dashboard() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return clinicianRoster.filter(row =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.injury.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <ClinicianLayout>
      <div style={{
        height: 52,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#374151' }}>Recovery Intelligence</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Overview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={BTN_GHOST}
            onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF' }}
          >
            Export
            <ChevronDown size={14} color="#374151" strokeWidth={2} />
          </button>
          <button
            style={{ ...BTN_GHOST, background: '#4F52C4', color: '#FFFFFF', borderColor: '#4F52C4' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4338CA'; e.currentTarget.style.borderColor = '#4338CA' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#4F52C4'; e.currentTarget.style.borderColor = '#4F52C4' }}
          >
            <Plus size={14} color="#FFFFFF" strokeWidth={2} />
            Add Patient
          </button>
        </div>
      </div>

      <ClinicianTopTabs />

      <div style={{ padding: '28px 32px', background: '#F4F5F7', minHeight: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111827' }}>Overview</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
            Your daily command center — roster and at-a-glance metrics
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Active patients', value: String(clinicianRoster.length), sub: '↑ 1 new this month', accent: '#4F52C4' },
            { label: 'Avg adherence', value: `${Math.round(clinicianRoster.reduce((s, r) => s + r.adherence, 0) / clinicianRoster.length)}%`, sub: 'Across active roster', accent: '#16A34A' },
          ].map(({ label, value, sub, accent }) => (
            <div
              key={label}
              style={{
                ...CARD,
                padding: '14px 18px',
                flex: '1 1 180px',
                minWidth: 160,
                borderLeft: `3px solid ${accent}`,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600, color: '#111827', lineHeight: 1 }}>{value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: accent === '#16A34A' ? '#16A34A' : '#6B7280' }}>{sub}</p>
            </div>
          ))}
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

        <PatientDirectoryGrid rows={filtered} />
      </div>
    </ClinicianLayout>
  )
}
