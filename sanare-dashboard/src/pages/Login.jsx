import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DemoBadge from '../components/shared/DemoBadge'

export default function Login() {
  const { selectRole } = useAuth()
  const navigate = useNavigate()

  function enter(role) {
    selectRole(role)
    const dest = role === 'clinician' ? '/clinician/dashboard' : role === 'surgeon' ? '/surgeon/dashboard' : '/patient/home'
    navigate(dest, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center px-4">
      <DemoBadge />

      {/* Logo + wordmark */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3B82F6] mb-5 shadow-xl shadow-blue-500/30">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 4C9.58 4 6 7.58 6 12c0 5.25 8 15 8 15s8-9.75 8-15c0-4.42-3.58-8-8-8z" fill="white" opacity="0.9"/>
            <circle cx="14" cy="12" r="3" fill="white"/>
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Sanaré</h1>
        <p className="text-[#6B7280] text-sm mt-1.5">ACL Rehabilitation Platform</p>
      </div>

      {/* Role selector */}
      <div className="w-full max-w-sm">
        <p className="text-[#4B5563] text-xs text-center uppercase tracking-widest mb-4">Select a portal to continue</p>

        <div className="space-y-3">
          {/* Clinician card */}
          <button
            onClick={() => enter('clinician')}
            className="w-full bg-[#111827] hover:bg-[#1F2937] active:scale-[0.98] border border-white/10 hover:border-[#3B82F6]/40 rounded-2xl p-6 text-left transition-[background-color,border-color,transform] duration-150 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B82F6]/25 transition-colors duration-150">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">Clinician Dashboard</p>
                <p className="text-[#6B7280] text-xs mt-0.5">Sarah Mitchell · PT, DPT, SCS</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4B5563" strokeWidth={2} className="flex-shrink-0 group-hover:stroke-[#3B82F6] transition-colors duration-150">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Patient card */}
          <button
            onClick={() => enter('patient')}
            className="w-full bg-[#111827] hover:bg-[#1F2937] active:scale-[0.98] border border-white/10 hover:border-[#10B981]/40 rounded-2xl p-6 text-left transition-[background-color,border-color,transform] duration-150 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center flex-shrink-0 group-hover:bg-[#10B981]/25 transition-colors duration-150">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">Patient Dashboard</p>
                <p className="text-[#6B7280] text-xs mt-0.5">Alex Chen · Week 12 Recovery</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4B5563" strokeWidth={2} className="flex-shrink-0 group-hover:stroke-[#10B981] transition-colors duration-150">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Surgeon card */}
          <button
            onClick={() => enter('surgeon')}
            className="w-full bg-[#111827] hover:bg-[#1F2937] active:scale-[0.98] border border-white/10 hover:border-[#8B5CF6]/40 rounded-2xl p-6 text-left transition-[background-color,border-color,transform] duration-150 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8B5CF6]/25 transition-colors duration-150">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">Surgeon Portal</p>
                <p className="text-[#6B7280] text-xs mt-0.5">Dr. James Ortiz · Orthopedic Surgeon</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4B5563" strokeWidth={2} className="flex-shrink-0 group-hover:stroke-[#8B5CF6] transition-colors duration-150">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-[#4B5563] text-center">
        All data is synthetic. For demonstration purposes only.
      </p>
    </div>
  )
}
