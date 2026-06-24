export default function IslamicPattern({ color = '#D4A017', opacity = 0.07 }) {
  const id = `ip-${color.replace('#', '')}`
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="0.8" fill="none" opacity={opacity * 14}>
            {/* 8-pointed star */}
            <polygon points="40,12 56,24 68,40 56,56 40,68 24,56 12,40 24,24" />
            <polygon points="40,20 52,30 60,40 52,50 40,60 28,50 20,40 28,30" />
            {/* Corner diamonds */}
            <polygon points="0,40 10,30 20,40 10,50" />
            <polygon points="80,40 70,30 60,40 70,50" />
            <polygon points="40,0 50,10 40,20 30,10" />
            <polygon points="40,80 50,70 40,60 30,70" />
            {/* Connecting lines */}
            <line x1="20" y1="40" x2="12" y2="40" />
            <line x1="60" y1="40" x2="68" y2="40" />
            <line x1="40" y1="20" x2="40" y2="12" />
            <line x1="40" y1="60" x2="40" y2="68" />
            <line x1="24" y1="24" x2="18" y2="18" />
            <line x1="56" y1="24" x2="62" y2="18" />
            <line x1="24" y1="56" x2="18" y2="62" />
            <line x1="56" y1="56" x2="62" y2="62" />
            {/* Corner squares (shared between tiles) */}
            <rect x="-8" y="-8" width="16" height="16" transform="rotate(45 0 0)" />
            <rect x="72" y="-8" width="16" height="16" transform="rotate(45 80 0)" />
            <rect x="-8" y="72" width="16" height="16" transform="rotate(45 0 80)" />
            <rect x="72" y="72" width="16" height="16" transform="rotate(45 80 80)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
