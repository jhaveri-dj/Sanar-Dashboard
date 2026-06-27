import { ChevronRight } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import ClinicianTopTabs from '../../components/clinician/ClinicianTopTabs'
import PatientRosterTable from '../../components/clinician/PatientRosterTable'
import { clinicianRoster } from '../../data/clinicianData'

export default function Patients() {
  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Patients</span>
        </div>
      </div>
      <ClinicianTopTabs />

      <div className="page-shell">
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title">Patient Directory</h1>
          <p className="page-subtitle">
            Search, filter, and sort — {clinicianRoster.length} patients under your care
          </p>
        </div>

        <PatientRosterTable
          title="Patient Recovery Statistics"
          subtitle="Click a row for full profile · use filters to narrow your roster"
        />
      </div>
    </ClinicianLayout>
  )
}
