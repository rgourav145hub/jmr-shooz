interface LogoProps {
  variant?: 'light' | 'dark' | 'full'
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
}

export function Logo({
  size = 'md',
  showTagline = true,
  className = ''
}: LogoProps) {
  // Determine sizing classes
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  const brandSizes = {
    sm: 'text-base tracking-[0.2em]',
    md: 'text-xl tracking-[0.24em]',
    lg: 'text-3xl tracking-[0.28em]'
  }

  const tagSizes = {
    sm: 'text-[9px] tracking-[0.3em]',
    md: 'text-[10px] tracking-[0.34em]',
    lg: 'text-xs tracking-[0.4em]'
  }

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Luxury Geometric Crest Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {/* Subtle Gold Outer Ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-200/20 via-amber-500/10 to-transparent border border-amber-400/30 group-hover:border-amber-400/60 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(217,169,76,0.25)]" />
        
        {/* SVG Crest Monogram */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle background shield outline */}
          <path
            d="M24 4L40 10V22C40 33 24 44 24 44C24 44 8 33 8 22V10L24 4Z"
            fill="url(#crestGrad)"
            fillOpacity="0.15"
            stroke="url(#goldStroke)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          
          {/* Sleek stylized sole / dynamic ribbon arc */}
          <path
            d="M14 26C18 19 28 17 34 23C34 23 26 27 20 27C16 27 14 26 14 26Z"
            fill="url(#goldStroke)"
            fillOpacity="0.4"
          />

          {/* JMR Monogram Lettering stylized */}
          <path
            d="M17 17H21V27C21 28.5 20 29.5 18.5 29.5C17.2 29.5 16.5 28.8 16 28"
            stroke="#FBF6E9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 29.5V17L27 24L31 17V29.5"
            stroke="#E5BA6C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="crestGrad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E5BA6C" stopOpacity="0.3" />
              <stop stopColor="#8C6627" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="goldStroke" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9DF98" />
              <stop stopColor="#E5BA6C" />
              <stop stopColor="#9C732B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold text-white uppercase font-sans ${brandSizes[size]}`}>
          JMR <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent font-black">SHOOZ</span>
        </div>
        {showTagline && (
          <div className={`text-slate-400 font-medium uppercase mt-1 tracking-widest ${tagSizes[size]}`}>
            Footwear Distribution
          </div>
        )}
      </div>
    </div>
  )
}
