export default function ViewToggle({ value, onChange, options = ['Weekly', 'Daily'] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {options.map(opt => {
        const active = value === opt.toLowerCase()
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt.toLowerCase())}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid',
              cursor: 'pointer',
              background: active ? '#EEF2FF' : '#FFFFFF',
              color: active ? '#4F52C4' : '#374151',
              borderColor: active ? '#C7D2FE' : '#E5E7EB',
              transition: 'all 0.15s ease',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
