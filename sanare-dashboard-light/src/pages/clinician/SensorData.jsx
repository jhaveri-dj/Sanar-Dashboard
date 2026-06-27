import { Link } from 'react-router-dom'
import { Activity, ChevronRight } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import AnatomyHeatmap from '../../components/clinician/AnatomyHeatmap'
import { patients } from '../../data/patients'
import { patientDataMap } from '../../data/clinicianData'
import { getPatientAvatar } from '../../data/patientAvatars'

function getLatestEmg(patientId) {
  const weekly = patientDataMap[patientId]?.weeklyData
  if (!weekly?.length) return null
  return weekly[weekly.length - 1].emg
}

function getAvgActivation(emg) {
  if (!emg) return 0
  const values = Object.values(emg)
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

export default function SensorData() {
  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Sensor Data</span>
        </div>
      </div>
      <ClinicianTopTabs />

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Sensor data</h1>
          <p className="page-subtitle">
            Latest EMG muscle activation from Sanaré Sleeve · all active patients
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {patients.map(patient => {
            const emg = getLatestEmg(patient.id)
            const summary = patientDataMap[patient.id]?.currentWeekSummary
            const avgActivation = getAvgActivation(emg)

            return (
              <div key={patient.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={getPatientAvatar(patient.id, 48)}
                      alt={patient.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {patient.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                        Week {patient.weekInRecovery} · {patient.currentPhase.name}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/clinician/patient/${patient.id}`}
                    className="btn-ghost"
                    style={{ textDecoration: 'none' }}
                  >
                    Full profile
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0 }}>
                  <div style={{ padding: '20px 24px', borderRight: '1px solid var(--card-border)' }}>
                    {emg ? (
                      <AnatomyHeatmap muscles={emg} />
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                        No sensor data available yet.
                      </p>
                    )}
                  </div>

                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Activity size={16} color="var(--accent)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        Session summary
                      </span>
                    </div>

                    <div style={{ display: 'grid', gap: 10 }}>
                      {[
                        { label: 'Avg activation', value: `${avgActivation}%` },
                        { label: 'Symmetry index', value: `${summary?.symmetryIndex ?? '—'}%` },
                        { label: 'ROM achieved', value: `${summary?.rom ?? '—'}°` },
                        { label: 'Risk score', value: summary?.riskScore ?? '—' },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {summary?.clinicianFlag && (
                      <div style={{
                        marginTop: 'auto',
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        fontSize: 12,
                        color: '#92400E',
                        lineHeight: 1.4,
                      }}>
                        {summary.clinicianFlag}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ClinicianLayout>
  )
}
