import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DemoBadge from '../components/shared/DemoBadge'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = login(email, password)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    navigate(result.role === 'clinician' ? '/clinician/dashboard' : '/patient/home', { replace: true })
  }

  function fillDemo(role) {
    if (role === 'clinician') {
      setEmail('dr.sarah@sanare.com')
      setPassword('clinic123')
    } else {
      setEmail('alex@patient.com')
      setPassword('patient123')
    }
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center px-4">
      <DemoBadge />

      {/* Logo + wordmark */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6] mb-4 shadow-lg">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4C9.58 4 6 7.58 6 12c0 5.25 8 15 8 15s8-9.75 8-15c0-4.42-3.58-8-8-8z" fill="white" opacity="0.9"/>
            <circle cx="14" cy="12" r="3" fill="white"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sanaré</h1>
        <p className="text-[#6B7280] text-sm mt-1">ACL Rehabilitation Platform</p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm bg-[#111827] rounded-2xl p-8 shadow-2xl border border-white/5">
        <h2 className="text-white text-xl font-semibold mb-6">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-[#1F2937] text-white placeholder-[#4B5563] rounded-lg px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-[#1F2937] text-white placeholder-[#4B5563] rounded-lg px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg py-3 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Demo quick-fill */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-xs text-[#6B7280] text-center mb-3 uppercase tracking-wider">Demo accounts</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('clinician')}
              className="flex-1 bg-[#1F2937] hover:bg-[#374151] border border-white/10 text-[#9CA3AF] hover:text-white rounded-lg py-2 text-xs font-medium transition"
            >
              Clinician
            </button>
            <button
              type="button"
              onClick={() => fillDemo('patient')}
              className="flex-1 bg-[#1F2937] hover:bg-[#374151] border border-white/10 text-[#9CA3AF] hover:text-white rounded-lg py-2 text-xs font-medium transition"
            >
              Patient
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#4B5563] text-center">
        All data is synthetic. For demonstration purposes only.
      </p>
    </div>
  )
}
