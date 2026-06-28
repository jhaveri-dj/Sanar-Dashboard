import { useMemo, useState } from 'react'
import { ChevronRight, Download, TrendingUp, Users } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import { clinicianRoster } from '../../data/clinicianData'
import { getPatientAvatar } from '../../data/patientAvatars'
import { CLINICIAN_REPORT_TYPES, exportPatientReportPdf } from '../../utils/exportPatientReport'

function avgMetric(key) {
  const total = clinicianRoster.reduce((sum, row) => sum + row[key], 0)
  return Math.round(total / clinicianRoster.length)
}

export default function Reports() {
  const [downloading, setDownloading] = useState(null)

  const sortedRoster = useMemo(() => [...clinicianRoster], [])

  function handleDownload(reportId, patientId) {
    const key = `${reportId}-${patientId}`
    setDownloading(key)
    exportPatientReportPdf({ reportType: reportId, patientId, portalLabel: 'Clinical Report' })
    setTimeout(() => setDownloading(null), 800)
  }

  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Reports</span>
        </div>
      </div>
      <ClinicianTopTabs />

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Download recovery summaries and billing documentation by patient</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Active patients', value: clinicianRoster.length, icon: Users, color: 'var(--accent)' },
            { label: 'Avg adherence', value: `${avgMetric('adherence')}%`, icon: TrendingUp, color: '#16A34A' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sortedRoster.map(row => (
            <div key={row.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <img src={getPatientAvatar(row.id, 40)} alt={row.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>{row.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6B7280' }}>
                    {row.injury} · Week {row.week} · Adherence {row.adherence}%
                  </p>
                </div>
              </div>

              {CLINICIAN_REPORT_TYPES.map((report, idx) => {
                const key = `${report.id}-${row.id}`
                return (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '14px 20px',
                      borderBottom: idx === CLINICIAN_REPORT_TYPES.length - 1 ? 'none' : '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{report.title}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{report.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(report.id, row.id)}
                      disabled={downloading === key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 500,
                        padding: '8px 14px',
                        borderRadius: 8,
                        border: '1px solid #C7D2FE',
                        background: downloading === key ? '#EEF2FF' : '#4F52C4',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Download size={14} />
                      {downloading === key ? 'Opening…' : 'Download PDF'}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  )
}
