import { useState, useRef, useEffect } from 'react'
import PatientLayout from '../../components/patient/PatientLayout'

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'dr_mitchell',
    text: "Hi Alex, great work this week! ROM hit 118° — that's your personal best. The terminal knee extensions are really paying off.",
    time: 'Jun 3, 10:42 AM',
  },
  {
    id: 2,
    sender: 'patient',
    text: "Thanks Sarah Mitchell! Should I increase the weight on single-leg press? It's been feeling easier at 45lbs.",
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
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    const text = draft.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'patient',
        text,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      },
    ])
    setDraft('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <PatientLayout>
      {/* Fixed header inside the scrollable content area */}
      <div className="sticky top-11 z-20 bg-white border-b border-[#E5E5E5] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            SM
          </div>
          <div className="min-w-0">
            <p className="text-[#0A0A0A] font-semibold text-sm leading-tight">Dr. Sarah Mitchell</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"/>
              <p className="text-[#6B6B6B] text-xs">Physical Therapist · Sanaré</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="px-4 py-4 space-y-4 pb-28">
        {/* Date divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E5E5]"/>
          <span className="text-[#9CA3AF] text-xs font-medium">June 3</span>
          <div className="flex-1 h-px bg-[#E5E5E5]"/>
        </div>

        {messages.map(msg => {
          const isPatient = msg.sender === 'patient'
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
            >
              {!isPatient && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                    SM
                  </div>
                  <span className="text-[#6B6B6B] text-xs font-medium">Sarah Mitchell</span>
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isPatient
                    ? 'bg-[#1E3A5F] text-white rounded-tr-sm'
                    : 'bg-white border border-[#E5E5E5] text-[#0A0A0A] rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[10px] text-[#9CA3AF] mt-1 ${isPatient ? 'mr-1' : 'ml-1'}`}>
                {msg.time}
              </p>
            </div>
          )
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input bar — sits above the bottom tab bar */}
      <div className="fixed bottom-[65px] left-0 right-0 z-30 bg-white border-t border-[#E5E5E5] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Sarah Mitchell..."
            rows={1}
            className="flex-1 bg-[#F7F7F8] border border-[#E5E5E5] rounded-2xl px-4 py-2.5 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] resize-none outline-none focus:border-[#1E3A5F] transition-colors leading-relaxed"
            style={{ minHeight: '42px', maxHeight: '120px', overflow: 'auto' }}
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              draft.trim()
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-[#F0F0F0] text-[#9CA3AF]'
            }`}
          >
            <SendIcon/>
          </button>
        </div>
      </div>
    </PatientLayout>
  )
}
