import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import { clinicianRoster } from '../../data/clinicianData'

const INSIGHTS = [
  {
    title: 'Marcus Webb — adherence risk',
    body: 'Session completion dropped to 52% this week. Pattern suggests weekend drop-off. Consider RTM outreach.',
    severity: 'warning',
    patientId: 'marcus-webb-002',
  },
  {
    title: 'Alex Chen — ROM on track',
    body: 'Flexion at 138° at week 12 — within normal range (130–140°). Ahead of typical protocol curve.',
    severity: 'positive',
    patientId: 'alex-chen-001',
  },
  {
    title: 'Priya Sharma — clearance candidate',
    body: 'Symmetry index 91% and strength index 88%. Phase 4 criteria met — review for return-to-sport progression.',
    severity: 'positive',
    patientId: 'priya-sharma-003',
  },
]

export default function AiInsights() {
  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>AI Insights</span>
        </div>
      </div>
      <ClinicianTopTabs />

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">AI Insights</h1>
          <p className="page-subtitle">Automated clinical signals across {clinicianRoster.length} active patients</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INSIGHTS.map(insight => (
            <div key={insight.title} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: insight.severity === 'warning' ? '#FFFBEB' : '#F0FDF4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={16} color={insight.severity === 'warning' ? '#D97706' : '#16A34A'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{insight.title}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{insight.body}</p>
                  <Link
                    to={`/clinician/patient/${insight.patientId}`}
                    style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: '#4F52C4', fontWeight: 500, textDecoration: 'none' }}
                  >
                    View patient →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  )
}
