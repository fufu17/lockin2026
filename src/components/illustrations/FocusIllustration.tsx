export function FocusIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shapes */}
      <circle cx="200" cy="150" r="120" fill="#E0E7FF" fillOpacity="0.5" />
      <circle cx="200" cy="150" r="80" fill="#E0E7FF" />

      {/* Person at desk */}
      <rect x="120" y="180" width="160" height="8" rx="4" fill="#6366F1" />
      <rect x="130" y="188" width="6" height="40" fill="#4F46E5" />
      <rect x="264" y="188" width="6" height="40" fill="#4F46E5" />

      {/* Monitor */}
      <rect x="160" y="120" width="80" height="55" rx="4" fill="#1F2937" />
      <rect x="164" y="124" width="72" height="44" rx="2" fill="#374151" />
      <rect x="195" y="175" width="10" height="5" fill="#1F2937" />
      <rect x="185" y="180" width="30" height="3" rx="1" fill="#1F2937" />

      {/* Screen content - timer */}
      <circle cx="200" cy="146" r="16" stroke="#6366F1" strokeWidth="3" fill="none" />
      <path d="M200 134V146L208 150" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />

      {/* Person */}
      <circle cx="200" cy="95" r="18" fill="#FCD34D" />
      <ellipse cx="200" cy="140" rx="20" ry="25" fill="#6366F1" />
      <path d="M180 130C180 130 185 120 200 120C215 120 220 130 220 130" stroke="#4F46E5" strokeWidth="2" fill="none" />

      {/* Coffee cup */}
      <rect x="270" y="165" width="15" height="15" rx="2" fill="#92400E" />
      <path d="M285 168C290 168 292 172 290 176" stroke="#92400E" strokeWidth="2" fill="none" />
      <path d="M272 162C274 158 276 158 278 162" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" />
      <path d="M276 162C278 158 280 158 282 162" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" />

      {/* Plant */}
      <rect x="115" y="165" width="12" height="15" rx="2" fill="#92400E" />
      <ellipse cx="121" cy="158" rx="8" ry="10" fill="#10B981" />
      <ellipse cx="116" cy="155" rx="5" ry="6" fill="#059669" />
      <ellipse cx="126" cy="155" rx="5" ry="6" fill="#059669" />

      {/* Focus sparkles */}
      <circle cx="145" cy="100" r="3" fill="#FCD34D" />
      <circle cx="255" cy="105" r="2" fill="#FCD34D" />
      <circle cx="260" cy="130" r="2.5" fill="#FCD34D" />
      <circle cx="140" cy="130" r="2" fill="#FCD34D" />

      {/* Decorative dots */}
      <circle cx="320" cy="100" r="4" fill="#E0E7FF" />
      <circle cx="335" cy="115" r="3" fill="#C7D2FE" />
      <circle cx="80" cy="120" r="4" fill="#E0E7FF" />
      <circle cx="65" cy="140" r="3" fill="#C7D2FE" />
    </svg>
  )
}
