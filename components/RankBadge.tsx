'use client';

import { motion } from 'framer-motion';
import { getRankTier, getRankGroup, isRuby } from '@/lib/ranks';
import { Player } from '@/types';
import Image from 'next/image';

interface RankBadgeProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  animated?: boolean;
}

export default function RankBadge({ 
  player, 
  size = 'md', 
  showGlow = true,
  animated = true 
}: RankBadgeProps) {
  const tier = getRankTier(player.leagueNumber);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };
  
  const glowClass = showGlow && isRuby(player) ? 'drop-shadow-[0_0_10px_rgba(224,17,95,0.8)]' : '';
  
  const content = (
    <div className={`${sizeClasses[size]} ${glowClass}`} title={tier.name}>
      <RankIcon 
        leagueNumber={player.leagueNumber} 
        size={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48}
      />
    </div>
  );
  
  if (!animated) return content;
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="inline-block"
    >
      {content}
    </motion.div>
  );
}

// Get image path for a rank
function getRankImagePath(leagueNumber: number): string | null {
  // Ruby = 21
  if (leagueNumber === 21) {
    return '/ranks/ruby.png';
  }
  // Diamond = 17-20
  if (leagueNumber >= 17 && leagueNumber <= 20) {
    const tier = 21 - leagueNumber; // 17->4, 18->3, 19->2, 20->1
    return `/ranks/diamond${tier}.png`;
  }
  // Platinum = 13-16
  if (leagueNumber >= 13 && leagueNumber <= 16) {
    const tier = 17 - leagueNumber; // 13->4, 14->3, 15->2, 16->1
    return `/ranks/platinum${tier}.png`;
  }
  return null;
}

// Rank Icon Component
interface RankIconProps {
  leagueNumber: number;
  size: number;
  className?: string;
}

export function RankIcon({ leagueNumber, size, className = '' }: RankIconProps) {
  const tier = getRankTier(leagueNumber);
  const imagePath = getRankImagePath(leagueNumber);
  
  // If we have an image, use it
  if (imagePath) {
    return (
      <Image
        src={imagePath}
        alt={tier.name}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        unoptimized
      />
    );
  }
  
  // Otherwise use SVG fallback
  return <RankIconSvg leagueNumber={leagueNumber} size={size} className={className} />;
}

// SVG Fallbacks for ranks without images
interface RankIconSvgProps {
  leagueNumber: number;
  size: number;
  className?: string;
}

function RankIconSvg({ leagueNumber, size, className = '' }: RankIconSvgProps) {
  const group = getRankGroup(leagueNumber);
  const color = group.color;
  
  // Simple colored circle with initial
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="15" fill={`${color}20`} stroke={color} strokeWidth="2"/>
      <text x="16" y="20" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">
        {group.name.charAt(0)}
      </text>
    </svg>
  );
}

// Export helpers
export { getRankTier, getRankGroup, getRankImagePath };
