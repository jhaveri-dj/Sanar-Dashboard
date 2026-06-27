import { currentPatient } from '../../data/patients'

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EAECF0',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

export default function PatientContextHeader({
  title,
  facts,
  patient = currentPatient,
  showAvatar = true,
  avatarSrc = 'https://i.pravatar.cc/56?img=11',
}) {
  const graftShort = patient.graftType.replace(' Autograft', '')
  const summary = `ACL recovery · ${graftShort} · ${patient.affectedLeg} knee`

  return (
    <div style={{
      ...CARD,
      padding: '20px 24px',
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
    }}>
      {showAvatar && (
        <img
          src={avatarSrc}
          alt={patient.name}
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#111827',
            }}>
              {title}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
              {summary}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: 999,
              background: '#EEF2FF',
              color: '#4F52C4',
              border: '1px solid #C7D2FE',
              whiteSpace: 'nowrap',
            }}>
              {patient.currentPhase.name}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: 999,
              background: '#F0FDF4',
              color: '#16A34A',
              border: '1px solid #BBF7D0',
              whiteSpace: 'nowrap',
            }}>
              RTS {patient.projectedRTSDate}
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))`,
          background: '#FAFBFC',
          borderRadius: 10,
          border: '1px solid #EAECF0',
        }}>
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              style={{
                padding: '11px 16px',
                borderLeft: index > 0 ? '1px solid #EAECF0' : undefined,
              }}
            >
              <p style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
              }}>
                {fact.label}
              </p>
              <p style={{
                margin: '3px 0 0',
                fontSize: 13,
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
