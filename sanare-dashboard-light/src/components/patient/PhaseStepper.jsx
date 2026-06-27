/** Five-phase step indicator — no percentages, marathon-not-sprint framing. */
export default function PhaseStepper({ phases, size = 'md' }) {
  const dotSize = size === 'sm' ? 10 : 12
  const gap = size === 'sm' ? 6 : 8

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      {phases.map((phase, i) => {
        const isComplete = phase.status === 'completed'
        const isCurrent = phase.status === 'current'
        return (
          <div key={phase.number} style={{ display: 'flex', alignItems: 'center', gap }}>
            <div
              title={`Phase ${phase.number}: ${phase.name}`}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                flexShrink: 0,
                background: isComplete ? '#16A34A' : isCurrent ? '#4F52C4' : '#E5E7EB',
                boxShadow: isCurrent ? '0 0 0 3px rgba(79,82,196,0.2)' : undefined,
              }}
            />
            {i < phases.length - 1 && (
              <div style={{
                width: size === 'sm' ? 20 : 28,
                height: 2,
                borderRadius: 1,
                background: isComplete ? '#16A34A' : '#E5E7EB',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
