import React from 'react';

export const TrigunaLogo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="sattva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="rajas-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="tamas-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Circle Border */}
      <circle cx="50" cy="50" r="48" stroke="#f1f5f9" strokeWidth="1" />

      <g filter="url(#logo-glow)">
        {/* Sattva Swirl (Top-ish) */}
        <path 
          d="M50 50 L50 2 A48 48 0 0 1 91.57 74 L50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#sattva-grad)"
          transform="rotate(0 50 50)"
        />
        <path 
          d="M50 2 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#sattva-grad)"
        />
        
        {/* Rajas Swirl (Bottom Right-ish) */}
        <path 
          d="M50 50 L50 2 A48 48 0 0 1 91.57 74 L50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#rajas-grad)"
          transform="rotate(120 50 50)"
        />
        <path 
          d="M50 2 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#rajas-grad)"
          transform="rotate(120 50 50)"
        />

        {/* Tamas Swirl (Bottom Left-ish) */}
        <path 
          d="M50 50 L50 2 A48 48 0 0 1 91.57 74 L50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#tamas-grad)"
          transform="rotate(240 50 50)"
        />
        <path 
          d="M50 2 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2 Z" 
          fill="url(#tamas-grad)"
          transform="rotate(240 50 50)"
        />

        {/* The "Eyes" (Seeds of other Gunas) */}
        {/* Sattva's Eye (Rajas colored) */}
        <circle cx="50" cy="26" r="4" fill="#f59e0b" />
        
        {/* Rajas's Eye (Tamas colored) */}
        <circle 
          cx="50" cy="26" r="4" fill="#6366f1" 
          transform="rotate(120 50 50)" 
        />
        
        {/* Tamas's Eye (Sattva colored) */}
        <circle 
          cx="50" cy="26" r="4" fill="#10b981" 
          transform="rotate(240 50 50)" 
        />
      </g>

      {/* Central Balance Point */}
      <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
    </svg>
  );
};
