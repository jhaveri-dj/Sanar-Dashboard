import { useParams } from 'react-router-dom'
import SurgeonLayout from '../../components/surgeon/SurgeonLayout'
import RehabPlanEditor from '../../components/shared/RehabPlanEditor'

export default function SurgeonRehabPlan() {
  const { id } = useParams()
  return (
    <SurgeonLayout>
      <RehabPlanEditor
        patientId={id}
        recoveryPlansPath="/surgeon/recovery-plans"
        breadcrumbLabel="Recovery Plans"
      />
    </SurgeonLayout>
  )
}
