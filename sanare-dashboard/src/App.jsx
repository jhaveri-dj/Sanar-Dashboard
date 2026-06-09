import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Login from './pages/Login'
import Dashboard from './pages/clinician/Dashboard'
import PatientDetail from './pages/clinician/PatientDetail'
import RehabPlan from './pages/clinician/RehabPlan'
import Alerts from './pages/clinician/Alerts'
import Home from './pages/patient/Home'
import Progress from './pages/patient/Progress'
import Log from './pages/patient/Log'
import Messages from './pages/patient/Messages'
import Insights from './pages/patient/Insights'
import SurgeonDashboard from './pages/surgeon/SurgeonDashboard'
import SurgeonPatientDetail from './pages/surgeon/SurgeonPatientDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

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
            <ProtectedRoute requiredRole="clinician"><Alerts /></ProtectedRoute>
          } />

          <Route path="/patient/home" element={
            <ProtectedRoute requiredRole="patient"><Home /></ProtectedRoute>
          } />
          <Route path="/patient/progress" element={
            <ProtectedRoute requiredRole="patient"><Progress /></ProtectedRoute>
          } />
          <Route path="/patient/log" element={
            <ProtectedRoute requiredRole="patient"><Log /></ProtectedRoute>
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
          <Route path="/surgeon/patient/:id" element={
            <ProtectedRoute requiredRole="surgeon"><SurgeonPatientDetail /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
