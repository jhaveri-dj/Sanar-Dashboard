import { useState, useRef, useEffect } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'dr_mitchell',
    text: "Hi Alex, great work this week! ROM hit 138° — that's your personal best. The terminal knee extensions are really paying off.",
    time: 'Jun 3, 10:42 AM',
  },
  {
    id: 2,
    sender: 'patient',
    text: "Thanks Sarah! Should I increase the weight on single-leg press? It's been feeling easier at 45lbs.",
    time: 'Jun 3, 11:15 AM',
  },
  {
    id: 3,
    sender: 'dr_mitchell',
    text: "Yes, go up to 60lbs for 3×12. Keep the TKEs daily — 3 sets of 20. See you Saturday for your Week 12 eval. Looking strong!",
    time: 'Jun 3, 11:22 AM',
  },
]

function SendIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>
  )
}

function ReplyBar({ draft, onDraftChange, onSend, onKeyDown, inputRef, disabled }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', background: '#FAFBFC',
      border: '1px solid #E8EAED', borderRadius: 12,
    }}>
      <input
        ref={inputRef}
        value={draft}
        onChange={e => onDraftChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={disabled ? 'Waiting for a message from your PT…' : 'Reply to Dr. Mitchell…'}
        style={{
          flex: 1, background: disabled ? '#F3F4F6' : '#FFFFFF',
          border: '1px solid #E8EAED', borderRadius: 24,
          padding: '10px 18px', fontSize: 14, color: '#1F2937',
          outline: 'none', cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !draft.trim()}
        style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled || !draft.trim() ? 'default' : 'pointer',
          background: !disabled && draft.trim() ? '#4F52C4' : '#F3F4F6',
          color: !disabled && draft.trim() ? '#FFFFFF' : '#9CA3AF',
        }}
      >
        <SendIcon />
      </button>
    </div>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const lastMessage = messages[messages.length - 1]
  const canReply = lastMessage?.sender === 'dr_mitchell'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!canReply) return
    const text = draft.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1, sender: 'patient', text,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      },
    ])
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <PatientLayout>
      <div style={{ padding: '40px 24px 32px', background: '#F7F8FA', minHeight: '100%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          <div style={{ ...CARD, padding: '20px 24px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src="https://i.pravatar.cc/44?img=5"
                  alt="Sarah Mitchell"
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E8EAED' }}
                />
                <div style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#16A34A', border: '1.5px solid #FFFFFF',
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Dr. Sarah Mitchell</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>Your physical therapist · Sanaré</p>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                background: '#EEF2FF', color: '#4F52C4', border: '1px solid #C7D2FE',
              }}>
                RTM Channel
              </span>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6B7280' }}>
              Reply-only — your PT will reach out with updates and you can respond here.
            </p>

            <ReplyBar
              draft={draft}
              onDraftChange={setDraft}
              onSend={sendMessage}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              disabled={!canReply}
            />
          </div>

          <div style={{ ...CARD, padding: 20, minHeight: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#E8EAED' }}/>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>June 3</span>
              <div style={{ flex: 1, height: 1, background: '#E8EAED' }}/>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => {
                const isPatient = msg.sender === 'patient'
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isPatient ? 'flex-end' : 'flex-start',
                      marginBottom: 16,
                    }}
                  >
                    {!isPatient && (
                      <img
                        src="https://i.pravatar.cc/28?img=5"
                        alt=""
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginBottom: 4 }}
                      />
                    )}
                    <div style={{
                      maxWidth: '78%',
                      padding: '12px 16px',
                      fontSize: 14, lineHeight: 1.6,
                      ...(isPatient
                        ? { background: '#4F52C4', color: '#FFFFFF', borderRadius: '16px 4px 16px 16px' }
                        : { background: '#F9FAFB', color: '#1F2937', border: '1px solid #E8EAED', borderRadius: '4px 16px 16px 16px' }
                      ),
                    }}>
                      {msg.text}
                    </div>
                    <p style={{
                      fontSize: 11, color: '#9CA3AF', marginTop: 4,
                      ...(isPatient ? { textAlign: 'right' } : {}),
                    }}>
                      {msg.time}
                    </p>
                  </div>
                )
              })}
              <div ref={bottomRef}/>
            </div>

            {!canReply && (
              <p style={{
                margin: '16px 0 0', fontSize: 13, color: '#6B7280', textAlign: 'center',
                padding: '12px 16px', background: '#F9FAFB', borderRadius: 10,
              }}>
                Your reply was sent. Dr. Mitchell will follow up here — use the reply box above when she messages you.
              </p>
            )}
          </div>

        </div>
      </div>
    </PatientLayout>
  )
}
