import { useState } from 'react'

function getColor(pct) {
  if (pct >= 65) return '#10B981'
  if (pct >= 50) return '#F59E0B'
  return '#EF4444'
}

function getStatus(pct) {
  if (pct >= 65) return { label: 'On target', color: '#10B981' }
  if (pct >= 50) return { label: 'Below target', color: '#F59E0B' }
  return { label: 'Needs attention', color: '#EF4444' }
}

const MUSCLE_META = {
  rf:      { label: 'RF',      name: 'Rectus Femoris',          prevWeek: 66 },
  vl:      { label: 'VL',      name: 'Vastus Lateralis',         prevWeek: 75 },
  vmo:     { label: 'VMO',     name: 'Vastus Medialis Oblique',  prevWeek: 66 },
  bf:      { label: 'BF',      name: 'Biceps Femoris',           prevWeek: 72 },
  gastroc: { label: 'Gastroc', name: 'Gastrocnemius',            prevWeek: 78 },
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
  const [activeZone, setActiveZone] = useState(null)
  const [hoveredZone, setHoveredZone] = useState(null)

  function toggle(key) {
    setActiveZone(prev => prev === key ? null : key)
  }

  return (
    <div className="flex gap-6 items-start">

      {/* ── Left: SVG leg diagram ── */}
      <div className="flex-shrink-0 w-44">
        <p className="text-[#9CA3AF] text-[10px] font-medium text-center mb-1 tracking-wide">
          Anterior View
        </p>

        <svg
          viewBox="0 0 200 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          {/* Leg body fill (behind outline) */}
          <path d={LEG_PATH} fill="#1E293B"/>

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
                  stroke="white"
                  strokeOpacity={highlight ? 1 : 0.3}
                  strokeWidth={highlight ? 2 : 1}
                />
                <text
                  x={zone.cx} y={zone.cy - 2}
                  textAnchor="middle"
                  fill="white"
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
                  fill="white"
                  fontSize="8"
                  opacity="0.9"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none select-none"
                >
                  {val}%
                </text>
              </g>
            )
          })}

          {/* Leg silhouette outline (drawn on top of zones for clean edges) */}
          <path
            d={LEG_PATH}
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Kneecap */}
          <circle
            cx="105" cy="310" r="16"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text
            x="105" y="314"
            textAnchor="middle"
            fill="#64748B"
            fontSize="7"
            fontFamily="Inter, sans-serif"
            className="pointer-events-none select-none"
          >
            patella
          </text>
        </svg>

        <p className="text-[#4B5563] text-[9px] text-center mt-1 leading-tight">
          * BF shown in anterior view — posterior muscle
        </p>
      </div>

      {/* ── Right: muscle detail panel (unchanged) ── */}
      <div className="flex-1 space-y-2">
        <p className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-3">
          {activeZone ? 'Selected Muscle' : 'Click a zone to inspect'}
        </p>

        {activeZone ? (
          <div className="bg-[#0A0F1E] rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{MUSCLE_META[activeZone].name}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">({MUSCLE_META[activeZone].label})</p>
              </div>
              <button onClick={() => setActiveZone(null)} className="text-[#6B7280] hover:text-white text-lg leading-none">×</button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF] text-xs">Current activation</span>
                <span className="text-white font-bold text-lg">{muscles[activeZone]}%</span>
              </div>
              <div className="w-full bg-[#1F2937] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${muscles[activeZone]}%`, backgroundColor: getColor(muscles[activeZone]) }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                <span>0%</span><span className="text-[#F59E0B]">50%</span><span className="text-[#10B981]">65%</span><span>100%</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[#9CA3AF] text-xs">vs last week</p>
                  <p className="text-white text-sm font-medium">
                    {MUSCLE_META[activeZone].prevWeek}% → {muscles[activeZone]}%
                    <span className="text-[#10B981] ml-1">+{muscles[activeZone] - MUSCLE_META[activeZone].prevWeek}%</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: getStatus(muscles[activeZone]).color }}>
                    {getStatus(muscles[activeZone]).label}
                  </p>
                  <p className="text-[#6B7280] text-xs">Target: ≥65% MVIC</p>
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
                  className="w-full flex items-center gap-3 bg-[#0A0F1E] hover:bg-white/5 rounded-lg px-3 py-2.5 transition text-left border border-transparent hover:border-white/10"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                  <span className="text-[#9CA3AF] text-xs font-medium w-14">{MUSCLE_META[key].label}</span>
                  <div className="flex-1 bg-[#1F2937] rounded-full h-1.5 mx-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${val}%`, backgroundColor: color }}/>
                  </div>
                  <span className="text-white text-xs font-semibold w-10 text-right">{val}%</span>
                  <span className="text-xs w-24 text-right" style={{ color: status.color }}>{status.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 pt-2">
          {[
            { color: '#EF4444', label: '< 50%'  },
            { color: '#F59E0B', label: '50–65%' },
            { color: '#10B981', label: '≥ 65%'  },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }}/>
              <span className="text-[#6B7280] text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
