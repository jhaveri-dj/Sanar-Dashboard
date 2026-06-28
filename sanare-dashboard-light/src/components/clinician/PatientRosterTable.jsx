import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal, Download, Check } from 'lucide-react'
import { clinicianRoster } from '../../data/clinicianData'
import { patients } from '../../data/patients'

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

const SORT_OPTIONS = [
  'Patient Name',
  'Week in Recovery',
  'ROM (High to Low)',
  'Adherence (High to Low)',
  'Symmetry (High to Low)',
  'Strength (High to Low)',
  'RTM Status',
]

function metricColor(val) {
  if (val >= 85) return '#16A34A'
  if (val >= 70) return '#D97706'
  return '#DC2626'
}

function rtmStyle(status) {
  if (status === 'On Track')   return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', stripe: '#16A34A' }
  if (status === 'At Risk')    return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', stripe: '#DC2626' }
  return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', stripe: '#16A34A' }
}

export default function PatientRosterTable({
  title = 'Patient Recovery Statistics',
  subtitle = "Today's clinical overview · click a row for full profile",
}) {
  const [search, setSearch]         = useState('')
  const [sortBy, setSortBy]         = useState('Patient Name')
  const [sortOpen, setSortOpen]     = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const navigate = useNavigate()

  const filteredRows = useMemo(() => {
    return clinicianRoster.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.injury.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      switch (sortBy) {
        case 'Week in Recovery':        return b.week - a.week
        case 'ROM (High to Low)':       return parseInt(b.rom) - parseInt(a.rom)
        case 'Adherence (High to Low)': return b.adherence - a.adherence
        case 'Symmetry (High to Low)':  return b.symmetry - a.symmetry
        case 'Strength (High to Low)':  return b.strength - a.strength
        case 'RTM Status':              return a.rtm.localeCompare(b.rtm)
        default:                        return a.name.localeCompare(b.name)
      }
    })
  }, [filteredRows, sortBy])

  return (
    <div style={CARD}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E8EAED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{title}</span>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search patients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 180,
              fontSize: 13,
              padding: '6px 12px',
              background: '#F9FAFB',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              color: '#1F2937',
              outline: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            <button
              style={BTN_GHOST}
              onClick={() => { setSortOpen(o => !o); setFilterOpen(false) }}
            >
              Sort By
              <ChevronDown size={14} color="#374151" strokeWidth={2} />
            </button>
            {sortOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setSortOpen(false)} />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E8EAED',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  zIndex: 50,
                  minWidth: 200,
                  padding: '4px 0',
                }}>
                  {SORT_OPTIONS.map(opt => {
                    const isSelected = sortBy === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setSortOpen(false) }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '8px 14px',
                          fontSize: 13,
                          color: isSelected ? '#4F52C4' : '#1F2937',
                          background: isSelected ? '#EEF2FF' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          gap: 8,
                        }}
                      >
                        <span style={{ width: 14, flexShrink: 0 }}>
                          {isSelected && <Check size={12} color="#4F52C4" />}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              style={BTN_GHOST}
              onClick={() => { setFilterOpen(o => !o); setSortOpen(false) }}
            >
              <SlidersHorizontal size={14} color="#374151" strokeWidth={2} />
              Filter
            </button>
            {filterOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setFilterOpen(false)} />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E8EAED',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  zIndex: 50,
                  minWidth: 220,
                  padding: '14px 16px',
                }}>
                  {[
                    { label: 'RTM Status',  opts: ['On Track', 'At Risk', 'Progressing Well'] },
                    { label: 'Injury Type', opts: ['Patellar Tendon', 'Hamstring'] },
                  ].map(({ label, opts }, gi) => (
                    <div key={label}>
                      {gi > 0 && <div style={{ height: 1, background: '#F3F4F6', margin: '10px 0' }} />}
                      <p style={{ fontSize: 10, fontWeight: 500, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                        {label}
                      </p>
                      {opts.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 6, fontSize: 13, color: '#1F2937' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: '#4F52C4' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button style={BTN_GHOST}>
            <Download size={14} color="#374151" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ width: 3, padding: 0 }} />
              {['Patient', 'Injury', 'Week', 'ROM', 'Adherence', 'Symmetry', 'Strength', 'RTM Status'].map(label => (
                <th
                  key={label}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#374151',
                    padding: '10px 16px',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    ...(label === 'RTM Status' ? { minWidth: 158 } : {}),
                    ...(label === 'Patient' ? { minWidth: 160 } : {}),
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => {
              const badge = rtmStyle(row.rtm)
              const patient = patients.find(p => p.id === row.id)
              const isLast = idx === sortedRows.length - 1
              return (
                <tr
                  key={row.id}
                  style={{ borderBottom: isLast ? 'none' : '1px solid #F3F4F6', cursor: 'pointer' }}
                  onClick={() => navigate(`/clinician/patient/${row.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ width: 3, padding: 0, background: badge.stripe }} />
                  <td style={{ padding: '12px 16px', maxWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={row.avatar} alt={row.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', display: 'block' }}>{row.name}</span>
                        {patient?.notes && (
                          <span style={{
                            fontSize: 11, color: '#6B7280', lineHeight: 1.4, marginTop: 2, display: 'block',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180,
                          }}>
                            {patient.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#374151', padding: '12px 16px', whiteSpace: 'nowrap' }}>{row.injury}</td>
                  <td style={{ fontSize: 13, color: '#374151', padding: '12px 16px' }}>Wk {row.week}</td>
                  <td style={{ fontSize: 13, color: '#4F52C4', fontWeight: 500, padding: '12px 16px' }}>{row.rom}</td>
                  <td style={{ fontSize: 13, color: metricColor(row.adherence), fontWeight: 500, padding: '12px 16px' }}>{row.adherence}%</td>
                  <td style={{ fontSize: 13, color: metricColor(row.symmetry), fontWeight: 500, padding: '12px 16px' }}>{row.symmetry}%</td>
                  <td style={{ fontSize: 13, color: metricColor(row.strength), fontWeight: 500, padding: '12px 16px' }}>{row.strength}%</td>
                  <td style={{ padding: '12px 16px', minWidth: 158 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500, borderRadius: 20, padding: '3px 10px',
                      background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                      whiteSpace: 'nowrap', display: 'inline-block',
                    }}>
                      {row.rtm}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
