import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Login from './pages/Login'
import PortalEntry from './pages/PortalEntry'
import Dashboard from './pages/clinician/Dashboard'
import PatientDetail from './pages/clinician/PatientDetail'
import RehabPlan from './pages/clinician/RehabPlan'
import Patients from './pages/clinician/Patients'
import SensorData from './pages/clinician/SensorData'
import Reports from './pages/clinician/Reports'
import RecoveryPlans from './pages/clinician/RecoveryPlans'
import AiInsights from './pages/clinician/AiInsights'
import ClinicianMessages from './pages/clinician/ClinicianMessages'
import Home from './pages/patient/Home'
import Progress from './pages/patient/Progress'
import PatientRehabPlan from './pages/patient/RehabPlan'
import Log from './pages/patient/Log'
import Workout from './pages/patient/Workout'
import Messages from './pages/patient/Messages'
import Insights from './pages/patient/Insights'
import SurgeonDashboard from './pages/surgeon/SurgeonDashboard'
import SurgeonPatients from './pages/surgeon/SurgeonPatients'
import SurgeonSensorData from './pages/surgeon/SurgeonSensorData'
import SurgeonReports from './pages/surgeon/SurgeonReports'
import SurgeonPatientDetail from './pages/surgeon/SurgeonPatientDetail'
import SurgeonRecoveryPlans from './pages/surgeon/SurgeonRecoveryPlans'
import SurgeonRehabPlan from './pages/surgeon/SurgeonRehabPlan'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/pt" element={<PortalEntry role="clinician" />} />
          <Route path="/clinician" element={<Navigate to="/pt" replace />} />
          <Route path="/patient" element={<PortalEntry role="patient" />} />
          <Route path="/surgeon" element={<PortalEntry role="surgeon" />} />

          <Route path="/clinician/dashboard" element={
            <ProtectedRoute requiredRole="clinician"><Dashboard /></ProtectedRoute>
          } />
          <Route path="/clinician/patient/:id" element={
            <ProtectedRoute requiredRole="clinician"><PatientDetail /></ProtectedRoute>
          } />
          <Route path="/clinician/patient/:id/rehab-plan" element={
            <ProtectedRoute requiredRole="clinician"><RehabPlan /></ProtectedRoute>
          } />
          <Route path="/clinician/alerts" element={
            <ProtectedRoute requiredRole="clinician"><Navigate to="/clinician/dashboard" replace /></ProtectedRoute>
          } />
          <Route path="/clinician/patients" element={
            <ProtectedRoute requiredRole="clinician"><Patients /></ProtectedRoute>
          } />
          <Route path="/clinician/sensor-data" element={
            <ProtectedRoute requiredRole="clinician"><SensorData /></ProtectedRoute>
          } />
          <Route path="/clinician/reports" element={
            <ProtectedRoute requiredRole="clinician"><Reports /></ProtectedRoute>
          } />
          <Route path="/clinician/recovery-plans" element={
            <ProtectedRoute requiredRole="clinician"><RecoveryPlans /></ProtectedRoute>
          } />
          <Route path="/clinician/ai-insights" element={
            <ProtectedRoute requiredRole="clinician"><AiInsights /></ProtectedRoute>
          } />
          <Route path="/clinician/messages" element={
            <ProtectedRoute requiredRole="clinician"><ClinicianMessages /></ProtectedRoute>
          } />
          <Route path="/clinician/messages/:patientId" element={
            <ProtectedRoute requiredRole="clinician"><ClinicianMessages /></ProtectedRoute>
          } />

          <Route path="/patient/home" element={
            <ProtectedRoute requiredRole="patient"><Home /></ProtectedRoute>
          } />
          <Route path="/patient/progress" element={
            <ProtectedRoute requiredRole="patient"><Progress /></ProtectedRoute>
          } />
          <Route path="/patient/rehab-plan" element={
            <ProtectedRoute requiredRole="patient"><PatientRehabPlan /></ProtectedRoute>
          } />
          <Route path="/patient/log" element={
            <ProtectedRoute requiredRole="patient"><Log /></ProtectedRoute>
          } />
          <Route path="/patient/workout" element={
            <ProtectedRoute requiredRole="patient"><Workout /></ProtectedRoute>
          } />
          <Route path="/patient/messages" element={
            <ProtectedRoute requiredRole="patient"><Messages /></ProtectedRoute>
          } />
          <Route path="/patient/insights" element={
            <ProtectedRoute requiredRole="patient"><Insights /></ProtectedRoute>
          } />

          <Route path="/surgeon/dashboard" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonDashboard /></ProtectedRoute>
          } />
          <Route path="/surgeon/patients" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonPatients /></ProtectedRoute>
          } />
          <Route path="/surgeon/sensor-data" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonSensorData /></ProtectedRoute>
          } />
          <Route path="/surgeon/reports" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonReports /></ProtectedRoute>
          } />
          <Route path="/surgeon/recovery-plans" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonRecoveryPlans /></ProtectedRoute>
          } />
          <Route path="/surgeon/patient/:id/rehab-plan" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonRehabPlan /></ProtectedRoute>
          } />
          <Route path="/surgeon/patient/:id" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonPatientDetail /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
