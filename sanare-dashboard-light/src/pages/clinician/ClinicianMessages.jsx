import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ClinicianLayout from '../../components/clinician/ClinicianLayout'
import { clinicianRoster } from '../../data/clinicianData'
import { messageThreads } from '../../data/clinicianMessages'
import { getPatientAvatar } from '../../data/patientAvatars'
import { patients } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E8EAED',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  overflow: 'hidden',
}

function SendIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>
  )
}

export default function ClinicianMessages() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState({})
  const [threads, setThreads] = useState(messageThreads)
  const bottomRef = useRef(null)

  const rows = clinicianRoster.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeId = patientId && threads[patientId] ? patientId : rows[0]?.id
  const activePatient = patients.find(p => p.id === activeId)
  const activeThread = activeId ? threads[activeId] : null
  const draft = drafts[activeId] || ''

  useEffect(() => {
    if (!patientId && rows[0]) {
      navigate(`/clinician/messages/${rows[0].id}`, { replace: true })
    }
  }, [patientId, rows, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, threads])

  function sendMessage() {
    const text = draft.trim()
    if (!text || !activeId) return
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setThreads(prev => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        preview: text,
        time,
        unread: 0,
        messages: [
          ...prev[activeId].messages,
          { id: Date.now(), sender: 'dr_mitchell', text, time },
        ],
      },
    }))
    setDrafts(prev => ({ ...prev, [activeId]: '' }))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <ClinicianLayout>
      <div style={{
        height: 52, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
        padding: '0 32px', display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#374151' }}>Clinical</span>
          <ChevronRight size={12} color="#D1D5DB" strokeWidth={2} />
          <span style={{ color: '#111827', fontWeight: 500 }}>Messaging</span>
        </div>
      </div>

      <div style={{ padding: '24px 32px', background: '#F4F5F7', height: 'calc(100vh - 52px - 100vh + 100vh)', minHeight: 560 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111827' }}>Messaging</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
            Secure patient–clinician channels · RTM (CPT 98980 / 98981)
          </p>
        </div>

        <div style={{ ...CARD, display: 'flex', height: 'calc(100vh - 180px)', minHeight: 480 }}>
          {/* Thread list */}
          <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid #E8EAED', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #E8EAED' }}>
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', fontSize: 13, padding: '8px 12px',
                  background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {rows.map(row => {
                const thread = threads[row.id]
                const active = row.id === activeId
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => navigate(`/clinician/messages/${row.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                      padding: '14px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: active ? '#EEF2FF' : 'transparent',
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <img
                      src={getPatientAvatar(row.id, 44)}
                      alt={row.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.name}</span>
                        <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{thread?.time}</span>
                      </div>
                      <p style={{
                        margin: '3px 0 0', fontSize: 12, color: '#6B7280',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {thread?.preview}
                      </p>
                    </div>
                    {thread?.unread > 0 && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F52C4', flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conversation */}
          {activePatient && activeThread ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid #E8EAED',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <img
                  src={getPatientAvatar(activePatient.id, 40)}
                  alt={activePatient.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' }}>{activePatient.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
                    Week {activePatient.weekInRecovery} · {activePatient.currentPhase.name}
                  </p>
                </div>
                <Link
                  to={`/clinician/patient/${activePatient.id}`}
                  style={{ fontSize: 13, color: '#4F52C4', fontWeight: 500, textDecoration: 'none' }}
                >
                  View profile →
                </Link>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#FAFAFA' }}>
                {activeThread.messages.map(msg => {
                  const isClinician = msg.sender === 'dr_mitchell'
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isClinician ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                      {!isClinician && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <img
                            src={getPatientAvatar(activePatient.id, 28)}
                            alt=""
                            style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{activePatient.name}</span>
                        </div>
                      )}
                      <div style={{
                        maxWidth: '72%', borderRadius: 16, padding: '12px 16px', fontSize: 14, lineHeight: 1.5,
                        background: isClinician ? '#EEF2FF' : '#4F52C4',
                        color: isClinician ? '#1F2937' : '#FFFFFF',
                        borderTopRightRadius: isClinician ? 4 : 16,
                        borderTopLeftRadius: isClinician ? 16 : 4,
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{msg.time}</span>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid #E8EAED', display: 'flex', gap: 10, background: '#FFFFFF' }}>
                <textarea
                  value={draft}
                  onChange={e => setDrafts(prev => ({ ...prev, [activeId]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activePatient.name}…`}
                  rows={1}
                  style={{
                    flex: 1, fontSize: 14, padding: '10px 14px', borderRadius: 12,
                    border: '1px solid #D1D5DB', background: '#F9FAFB', resize: 'none', outline: 'none',
                    minHeight: 42, maxHeight: 120,
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  style={{
                    width: 42, height: 42, borderRadius: '50%', border: 'none', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: draft.trim() ? '#4F52C4' : '#F3F4F6',
                    color: draft.trim() ? '#FFFFFF' : '#9CA3AF',
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </ClinicianLayout>
  )
}
