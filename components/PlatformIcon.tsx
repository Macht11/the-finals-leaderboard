'use client';

import { Player } from '@/types';
import { getPlayerPlatform } from '@/lib/api';

interface PlatformIconProps {
  player: Player;
  size?: number;
}

export default function PlatformIcon({ player, size = 16 }: PlatformIconProps) {
  const platform = getPlayerPlatform(player);
  
  const icons: Record<string, React.ReactNode> = {
    steam: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        {/* Steam logo - circle with connecting arm and smaller circle */}
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="10" cy="14" r="3" fill="currentColor"/>
        <path 
          d="M12.5 16.5l4 1.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-1 0-1.8.5-2.2 1.2L12.5 14" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="17" cy="15.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    psn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        {/* PlayStation logo - stylized P and S */}
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M8.5 14.5c0-1.5 1-2 2.5-2.5l3-1v-2c0-.5-.5-1-1-1h-2c-.5 0-1 .5-1 1v.5h-2v-.5c0-1.5 1.5-3 3-3h2c1.5 0 3 1.5 3 3v3c0 1.5-1 2-2.5 2.5l-3 1v2c0 .5.5 1 1 1h2c.5 0 1-.5 1-1v-.5h2v.5c0 1.5-1.5 3-3 3h-2c-1.5 0-3-1.5-3-3v-3z"/>
      </svg>
    ),
    xbox: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        {/* Xbox logo - sphere with X */}
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path 
          d="M7 7l10 10M17 7L7 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {/* Xbox sphere effect */}
        <path 
          d="M6.5 7.5c2-1.5 5.5-2 5.5-2s3.5.5 5.5 2c-1-2.5-3.5-4-5.5-4s-4.5 1.5-5.5 4z"
          fill="currentColor"
          opacity="0.3"
        />
        <path 
          d="M6.5 16.5c2 1.5 5.5 2 5.5 2s3.5-.5 5.5-2c-1 2.5-3.5 4-5.5 4s-4.5-1.5-5.5-4z"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    ),
    unknown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path 
          d="M12 16v-1.5c0-1.5 1-2 2-2.5 1-.5 2-1.5 2-3 0-2-1.5-3.5-4-3.5S8 7 8 9" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    ),
  };
  
  const colors: Record<string, string> = {
    steam: '#66c0f4',
    psn: '#0070d1',
    xbox: '#107c10',
    unknown: '#6a6a7a',
  };
  
  return (
    <span 
      className="inline-flex items-center justify-center"
      style={{ color: colors[platform] }}
      title={platform.toUpperCase()}
    >
      {icons[platform]}
    </span>
  );
}
