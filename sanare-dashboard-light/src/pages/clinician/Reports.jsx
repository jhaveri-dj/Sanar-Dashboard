import { useState } from 'react'
import { ChevronRight, Download, TrendingUp, Users } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import { clinicianRoster } from '../../data/clinicianData'

const REPORTS = [
  {
    id: 'weekly-summary',
    title: 'Weekly recovery summary',
    description: 'ROM, adherence, and symmetry trends across all active patients.',
    period: 'Jun 19 – Jun 26, 2026',
    format: 'PDF',
  },
  {
    id: 'rtm-billing',
    title: 'RTM billing report',
    description: 'Interactive communication logs for CPT 98980 / 98981 reimbursement.',
    period: 'June 2026',
    format: 'PDF',
  },
  {
    id: 'emg-compensation',
    title: 'EMG compensation analysis',
    description: 'Muscle activation asymmetry flags and VMO-VL ratio outliers.',
    period: 'Last 12 weeks',
    format: 'PDF',
  },
  {
    id: 'rts-readiness',
    title: 'Return-to-sport readiness',
    description: 'LSI, strength index, and protocol clearance status by patient.',
    period: 'Current snapshot',
    format: 'PDF',
  },
]

function avgMetric(key) {
  const total = clinicianRoster.reduce((sum, row) => sum + row[key], 0)
  return Math.round(total / clinicianRoster.length)
}

function exportReportPdf(report) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${report.title}</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; max-width: 720px; margin: 48px auto; color: #111827; line-height: 1.6; }
  h1 { font-size: 22px; margin: 0 0 8px; color: #4F52C4; }
  .meta { font-size: 13px; color: #6B7280; margin-bottom: 24px; }
  .badge { display: inline-block; background: #EEF2FF; color: #4F52C4; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; margin-bottom: 20px; }
  p { font-size: 14px; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF; }
</style></head><body>
  <div class="badge">Sanaré Tech · Clinical Report</div>
  <h1>${report.title}</h1>
  <p class="meta">${report.period} · Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  <p>${report.description}</p>
  <p>This report contains synthetic demo data for product demonstration purposes only.</p>
  <footer>Sanaré Dashboard · Demo prototype · Not for clinical use</footer>
</body></html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}

export default function Reports() {
  const [downloading, setDownloading] = useState(null)

  function handleDownload(report) {
    setDownloading(report.id)
    exportReportPdf(report)
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Exportable clinical summaries and billing documentation</p>
          </div>
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

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Available reports</span>
          </div>

          {REPORTS.map((report, idx) => (
            <div
              key={report.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '16px 20px',
                borderBottom: idx === REPORTS.length - 1 ? 'none' : '1px solid #F3F4F6',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{report.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{report.description}</p>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{report.period}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(report)}
                disabled={downloading === report.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid #C7D2FE',
                  background: downloading === report.id ? '#EEF2FF' : '#4F52C4',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}
              >
                <Download size={14} />
                {downloading === report.id ? 'Opening…' : 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  )
}
