import { useNavigate } from 'react-router-dom'
import { Stethoscope, ClipboardList, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import hero from '../assets/hero.png'
import sanarelogo from '../assets/sanare-logo.png'

export default function Login() {
  const { selectRole } = useAuth()
  const navigate = useNavigate()

  function enter(role) {
    selectRole(role)
    const dest = role === 'clinician' ? '/clinician/dashboard' : role === 'surgeon' ? '/surgeon/dashboard' : '/patient/home'
    navigate(dest, { replace: true })
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={hero}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(8,10,18,0.92) 0%, rgba(8,10,18,0.75) 35%, rgba(8,10,18,0.2) 70%, transparent 100%)' }}
      />
      <div className="relative z-10">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px',
            maxWidth: '50%',
          }}
        >
          <img src={sanarelogo} alt="Sanaré" className="w-56 h-auto mb-6" />
          <h1 className="text-5xl font-bold text-white tracking-tight leading-none mb-1">
            Movement is medicine<span className="text-blue-500">.</span>
          </h1>
          <p className="text-lg font-normal text-slate-200 mb-7">We make sure none of it goes unseen.</p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => enter('clinician')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:border-blue-500/30 transition-colors duration-150 text-left"
              style={{
                background: 'rgba(10,12,20,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <ClipboardList size={16} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white leading-tight">Physiotherapist Dashboard</p>
                <p className="text-sm text-slate-300 mt-0.5">Sarah Mitchell · PT, DPT, SCS</p>
              </div>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button
              onClick={() => enter('patient')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:border-blue-500/30 transition-colors duration-150 text-left"
              style={{
                background: 'rgba(10,12,20,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white leading-tight">Patient Dashboard</p>
                <p className="text-sm text-slate-300 mt-0.5">Alex Chen · Week 12 Recovery</p>
              </div>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button
              onClick={() => enter('surgeon')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:border-blue-500/30 transition-colors duration-150 text-left"
              style={{
                background: 'rgba(10,12,20,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <Stethoscope size={16} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white leading-tight">Surgeon Portal</p>
                <p className="text-sm text-slate-300 mt-0.5">Dr. James Ortiz · Orthopedic Surgeon</p>
              </div>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Footer disclaimer */}
        <p className="absolute bottom-10 left-12 text-[10px] text-slate-500">
          All data is synthetic · For demonstration purposes only
        </p>
      </div>
    </div>
  )
}
