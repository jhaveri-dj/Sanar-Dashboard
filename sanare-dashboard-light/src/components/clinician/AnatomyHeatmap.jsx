import { useState } from 'react'

function getColor(pct) {
  if (pct >= 65) return '#16A34A'
  if (pct >= 50) return '#D97706'
  return '#DC2626'
}

function getStatus(pct) {
  if (pct >= 65) return { label: 'On target',       color: '#16A34A' }
  if (pct >= 50) return { label: 'Below target',    color: '#D97706' }
  return              { label: 'Needs attention',   color: '#DC2626' }
}

const MUSCLE_META = {
  rf:      { label: 'RF',      name: 'Rectus Femoris',         prevWeek: 66 },
  vl:      { label: 'VL',      name: 'Vastus Lateralis',        prevWeek: 75 },
  vmo:     { label: 'VMO',     name: 'Vastus Medialis Oblique', prevWeek: 66 },
  bf:      { label: 'BF',      name: 'Biceps Femoris',          prevWeek: 72 },
  gastroc: { label: 'Gastroc', name: 'Gastrocnemius',           prevWeek: 78 },
}

const ZONES = [
  { key: 'vmo',     cx: 85,  cy: 285, rx: 28, ry: 22, svgLabel: 'VMO'     },
  { key: 'vl',      cx: 130, cy: 240, rx: 26, ry: 30, svgLabel: 'VL'      },
  { key: 'rf',      cx: 105, cy: 200, rx: 22, ry: 35, svgLabel: 'RF'      },
  { key: 'bf',      cx: 105, cy: 165, rx: 18, ry: 20, svgLabel: 'BF*'     },
  { key: 'gastroc', cx: 105, cy: 360, rx: 24, ry: 32, svgLabel: 'Gastroc' },
]

const LEG_PATH =
  'M105,30 C75,30 60,60 58,100 C56,140 55,170 58,200 C61,230 65,260 70,285 ' +
  'C75,305 85,315 88,320 C90,325 88,330 85,335 C80,345 78,355 80,375 ' +
  'C82,390 90,410 105,420 C120,410 128,390 130,375 C132,355 130,345 125,335 ' +
  'C122,330 120,325 122,320 C125,315 135,305 140,285 C145,260 149,230 152,200 ' +
  'C155,170 154,140 152,100 C150,60 135,30 105,30 Z'

export default function AnatomyHeatmap({ muscles }) {
  const [activeZone, setActiveZone]   = useState(null)
  const [hoveredZone, setHoveredZone] = useState(null)

  function toggle(key) {
    setActiveZone(prev => prev === key ? null : key)
  }

  return (
    <div className="flex gap-6 items-start">

      {/* ── Left: SVG leg diagram ── */}
      <div className="flex-shrink-0 w-44">
        <p className="text-[10px] font-medium text-center mb-1 tracking-wide" style={{ color: '#9CA3AF' }}>
          Anterior View
        </p>

        <svg
          viewBox="0 0 200 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E8EAED' }}
        >
          {/* Leg body fill */}
          <path d={LEG_PATH} fill="#F1F5F9"/>

          {/* Muscle zone ellipses */}
          {ZONES.map(zone => {
            const val = muscles[zone.key]
            const color = getColor(val)
            const isActive  = activeZone  === zone.key
            const isHovered = hoveredZone === zone.key
            const highlight = isActive || isHovered

            return (
              <g
                key={zone.key}
                onClick={() => toggle(zone.key)}
                onMouseEnter={() => setHoveredZone(zone.key)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: 'pointer' }}
                opacity={
                  activeZone === null
                    ? (isHovered ? 1 : 0.88)
                    : (isActive ? 1 : 0.45)
                }
              >
                <ellipse
                  cx={zone.cx} cy={zone.cy}
                  rx={zone.rx} ry={zone.ry}
                  fill={color}
                  fillOpacity={0.85}
                  stroke="#FFFFFF"
                  strokeOpacity={1}
                  strokeWidth={highlight ? 2 : 1.5}
                />
                <text
                  x={zone.cx} y={zone.cy - 2}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none select-none"
                >
                  {zone.svgLabel}
                </text>
                <text
                  x={zone.cx} y={zone.cy + 9}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8"
                  opacity="0.95"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none select-none"
                >
                  {val}%
                </text>
              </g>
            )
          })}

          {/* Leg silhouette outline */}
          <path
            d={LEG_PATH}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="2"
          />

          {/* Kneecap */}
          <circle
            cx="105" cy="310" r="16"
            fill="#F1F5F9"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <text
            x="105" y="314"
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="7"
            fontFamily="Inter, sans-serif"
            className="pointer-events-none select-none"
          >
            patella
          </text>
        </svg>

        <p className="text-[9px] text-center mt-1 leading-tight" style={{ color: '#9CA3AF' }}>
          * BF shown in anterior view — posterior muscle
        </p>
      </div>

      {/* ── Right: muscle detail panel ── */}
      <div className="flex-1 space-y-2">
        <p
          className="text-xs font-medium mb-3"
          style={{
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 11,
          }}
        >
          {activeZone ? 'Selected Muscle' : 'Active muscle zones · Week 12'}
        </p>

        {activeZone ? (
          <div className="rounded-xl p-4" style={{ background: '#F9FAFB', border: '1px solid #E8EAED' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm" style={{ color: '#111827' }}>{MUSCLE_META[activeZone].name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>({MUSCLE_META[activeZone].label})</p>
              </div>
              <button
                onClick={() => setActiveZone(null)}
                className="text-lg leading-none"
                style={{ color: '#9CA3AF' }}
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#6B7280' }}>Current activation</span>
                <span className="font-semibold text-lg" style={{ color: '#111827' }}>{muscles[activeZone]}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: '#E5E7EB' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${muscles[activeZone]}%`, backgroundColor: getColor(muscles[activeZone]) }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9CA3AF' }}>
                <span>0%</span>
                <span style={{ color: '#D97706' }}>50%</span>
                <span style={{ color: '#16A34A' }}>65%</span>
                <span>100%</span>
              </div>
              <div className="pt-2 flex items-center justify-between" style={{ borderTop: '1px solid #E5E7EB' }}>
                <div>
                  <p className="text-xs" style={{ color: '#6B7280' }}>vs last week</p>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>
                    {MUSCLE_META[activeZone].prevWeek}% → {muscles[activeZone]}%
                    <span className="ml-1" style={{ color: '#16A34A' }}>+{muscles[activeZone] - MUSCLE_META[activeZone].prevWeek}%</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: getStatus(muscles[activeZone]).color }}>
                    {getStatus(muscles[activeZone]).label}
                  </p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Target: ≥65% MVIC</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(muscles).map(([key, val]) => {
              const color  = getColor(val)
              const status = getStatus(val)
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition text-left"
                  style={{ background: '#F9FAFB', border: '1px solid #E8EAED' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                  <span className="text-xs font-medium w-14" style={{ color: '#6B7280' }}>{MUSCLE_META[key].label}</span>
                  <div className="flex-1 rounded-full h-1.5 mx-1" style={{ background: '#E5E7EB' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${val}%`, backgroundColor: color }}/>
                  </div>
                  <span className="text-xs font-semibold w-10 text-right" style={{ color: '#111827' }}>{val}%</span>
                  <span className="text-xs w-24 text-right" style={{ color: status.color }}>{status.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 pt-2">
          {[
            { color: '#DC2626', label: '< 50%'  },
            { color: '#D97706', label: '50–65%' },
            { color: '#16A34A', label: '≥ 65%'  },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}/>
              <span className="text-xs" style={{ color: '#6B7280' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
