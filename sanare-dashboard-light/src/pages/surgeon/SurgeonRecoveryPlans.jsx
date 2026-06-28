import { Link } from 'react-router-dom'
import { ChevronRight, Pencil } from 'lucide-react'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import { clinicianRoster, rehabPhaseMap } from '../../data/clinicianData'
import { patients } from '../../data/patients'
import { getPatientAvatar } from '../../data/patientAvatars'

export default function SurgeonRecoveryPlans() {
  return (
    <SurgeonLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Surgical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Recovery Plans</span>
        </div>
      </div>

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Recovery Plans</h1>
          <p className="page-subtitle">Review and customize exercise protocols by patient and recovery phase</p>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {clinicianRoster.map((row, idx) => {
            const patient = patients.find(p => p.id === row.id)
            const phases = rehabPhaseMap[row.id] || []
            const current = phases.find(ph => ph.status === 'current')
            return (
              <div
                key={row.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: idx === clinicianRoster.length - 1 ? 'none' : '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <img src={getPatientAvatar(row.id, 40)} alt={row.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6B7280' }}>
                      {current ? `Phase ${current.number}: ${current.name}` : patient?.currentPhase?.name} · Wk {row.week}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/surgeon/patient/${row.id}/rehab-plan`}
                  className="btn-ghost"
                  style={{ textDecoration: 'none', flexShrink: 0 }}
                >
                  <Pencil size={14} />
                  Edit protocol
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </SurgeonLayout>
  )
}
