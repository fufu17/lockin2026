export function TimerIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring background */}
      <circle cx="150" cy="150" r="130" fill="#F3F4F6" />
      <circle cx="150" cy="150" r="115" fill="#FFFFFF" />

      {/* Progress arc */}
      <circle
        cx="150"
        cy="150"
        r="100"
        stroke="#E0E7FF"
        strokeWidth="12"
        fill="none"
      />
      <circle
        cx="150"
        cy="150"
        r="100"
        stroke="#6366F1"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="471"
        strokeDashoffset="141"
        transform="rotate(-90 150 150)"
      />

      {/* Inner circle */}
      <circle cx="150" cy="150" r="85" fill="#FAFAFA" />

      {/* Timer display */}
      <text
        x="150"
        y="145"
        textAnchor="middle"
        fontSize="42"
        fontWeight="bold"
        fill="#171717"
        fontFamily="system-ui"
      >
        25:00
      </text>
      <text
        x="150"
        y="170"
        textAnchor="middle"
        fontSize="14"
        fill="#6B7280"
        fontFamily="system-ui"
      >
        remaining
      </text>

      {/* Top button */}
      <rect x="142" y="8" width="16" height="24" rx="4" fill="#4F46E5" />
      <rect x="145" y="2" width="10" height="8" rx="2" fill="#6366F1" />

      {/* Tick marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="150"
          y1="35"
          x2="150"
          y2={angle % 90 === 0 ? '45' : '40'}
          stroke={angle % 90 === 0 ? '#4F46E5' : '#D1D5DB'}
          strokeWidth={angle % 90 === 0 ? '3' : '2'}
          strokeLinecap="round"
          transform={`rotate(${angle} 150 150)`}
        />
      ))}

      {/* Decorative elements */}
      <circle cx="60" cy="60" r="8" fill="#E0E7FF" />
      <circle cx="40" cy="90" r="5" fill="#C7D2FE" />
      <circle cx="240" cy="70" r="6" fill="#E0E7FF" />
      <circle cx="260" cy="100" r="4" fill="#C7D2FE" />
      <circle cx="250" cy="230" r="7" fill="#E0E7FF" />
      <circle cx="50" cy="220" r="5" fill="#C7D2FE" />
    </svg>
  )
}
