import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
    xl: 'text-3xl font-extrabold tracking-tight',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Golden Laurel & Digital Circuit Book Logo Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Laurel Leaves - Left */}
          <path
            d="M 50 160 C 25 130 20 80 55 45 C 57 43 62 48 60 52 C 35 85 40 125 60 150 Z"
            fill="url(#goldGradient)"
          />
          <path d="M 38 65 C 28 60 32 45 45 52 C 42 62 38 65 38 65 Z" fill="url(#goldGradient)" />
          <path d="M 30 90 C 18 88 20 72 34 77 C 32 86 30 90 30 90 Z" fill="url(#goldGradient)" />
          <path d="M 28 115 C 16 115 16 100 30 102 C 30 112 28 115 28 115 Z" fill="url(#goldGradient)" />
          <path d="M 32 140 C 22 142 20 128 35 128 C 34 136 32 140 32 140 Z" fill="url(#goldGradient)" />

          {/* Outer Laurel Leaves - Right */}
          <path
            d="M 150 160 C 175 130 180 80 145 45 C 143 43 138 48 140 52 C 165 85 160 125 140 150 Z"
            fill="url(#goldGradient)"
          />
          <path d="M 162 65 C 172 60 168 45 155 52 C 158 62 162 65 162 65 Z" fill="url(#goldGradient)" />
          <path d="M 170 90 C 182 88 180 72 166 77 C 168 86 170 90 170 90 Z" fill="url(#goldGradient)" />
          <path d="M 172 115 C 184 115 184 100 170 102 C 170 112 172 115 172 115 Z" fill="url(#goldGradient)" />
          <path d="M 168 140 C 178 142 180 128 165 128 C 166 136 168 140 168 140 Z" fill="url(#goldGradient)" />

          {/* Bottom Laurel Tie Ribbon */}
          <path
            d="M 85 165 Q 100 175 115 165 Q 100 160 85 165 Z"
            fill="url(#goldGradient)"
          />

          {/* Top WiFi Signals */}
          <path
            d="M 86 52 A 20 20 0 0 1 114 52"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 78 44 A 32 32 0 0 1 122 44"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="59" r="2.5" fill="#FBBF24" />

          {/* Book Spine & Base In Dark Navy */}
          <path
            d="M 60 70 L 98 75 L 98 145 L 60 140 Z"
            fill="#0F172A"
            stroke="url(#goldGradient)"
            strokeWidth="2"
          />
          <path
            d="M 140 70 L 102 75 L 102 145 L 140 140 Z"
            fill="#0F172A"
            stroke="url(#goldGradient)"
            strokeWidth="2"
          />

          {/* Digital Circuit Lines Left Page */}
          <path
            d="M 72 82 L 85 82 L 85 96 L 94 96"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="72" cy="82" r="2.5" fill="#FBBF24" />
          <circle cx="94" cy="96" r="2.5" fill="#FBBF24" />

          <path
            d="M 68 105 L 78 105 L 86 115 L 86 130"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="68" cy="105" r="2.5" fill="#FBBF24" />
          <circle cx="86" cy="130" r="2.5" fill="#FBBF24" />

          {/* Digital Circuit Lines Right Page */}
          <path
            d="M 128 82 L 115 82 L 115 96 L 106 96"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="128" cy="82" r="2.5" fill="#FBBF24" />
          <circle cx="106" cy="96" r="2.5" fill="#FBBF24" />

          <path
            d="M 132 105 L 122 105 L 114 115 L 114 130"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="132" cy="105" r="2.5" fill="#FBBF24" />
          <circle cx="114" cy="130" r="2.5" fill="#FBBF24" />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div>
        <div className={`flex items-baseline gap-1.5 ${titleSizes[size]}`}>
          <span className={light ? 'text-white' : 'text-slate-900'}>Apna</span>
          <span className="text-amber-400 font-extrabold">Library</span>
        </div>
        {showTagline && (
          <p className="text-[10px] tracking-widest uppercase font-semibold text-amber-300/80 -mt-0.5">
            Digital Study Hub
          </p>
        )}
      </div>
    </div>
  );
};
