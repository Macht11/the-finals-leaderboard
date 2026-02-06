'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types';
import { getPlayerDisplayName } from '@/lib/api';
import { isRuby, formatRankScore } from '@/lib/ranks';
import RankBadge from './RankBadge';
import ChangeIndicator from './ChangeIndicator';
import PlatformIcon from './PlatformIcon';
import { Crown, Trophy, Medal, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  topPlayers: Player[];
}

export default function HeroSection({ topPlayers }: HeroSectionProps) {
  if (topPlayers.length < 3) return null;
  
  const [first, second, third] = topPlayers.slice(0, 3);
  
  const podiumOrder = [second, first, third];
  const positions = [2, 1, 3];
  const medals = [
    { icon: Medal, color: '#c0c0c0', label: '2nd' },
    { icon: Crown, color: '#ffd700', label: '1st' },
    { icon: Trophy, color: '#cd7f32', label: '3rd' },
  ];
  
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
          <span className="gradient-text">THE FINALS</span>
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
          Professional Ranked Leaderboard • Season 9
        </p>
      </motion.div>
      
      {/* Podium */}
      <div className="relative max-w-5xl mx-auto">
        <div className="flex justify-center items-end gap-4 sm:gap-6 lg:gap-8">
          {podiumOrder.map((player, index) => {
            const position = positions[index];
            const medal = medals[index];
            const isFirst = position === 1;
            const Icon = medal.icon;
            
            return (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className={`relative flex flex-col items-center ${
                  isFirst ? 'z-10' : 'z-0'
                }`}
              >
                {/* Player card */}
                <div
                  className={`relative w-full max-w-[280px] rounded-t-2xl p-4 sm:p-6 ${
                    isFirst ? 'podium-1 scale-110' : position === 2 ? 'podium-2' : 'podium-3'
                  }`}
                >
                  {/* Medal icon */}
                  <motion.div
                    animate={isFirst ? { 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${medal.color} 0%, ${medal.color}88 100%)`,
                        boxShadow: `0 0 30px ${medal.color}50`,
                      }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Position number */}
                  <div className="text-center mt-6 mb-4">
                    <span
                      className="text-5xl sm:text-6xl font-black"
                      style={{
                        background: `linear-gradient(180deg, ${medal.color} 0%, ${medal.color}88 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: `0 0 30px ${medal.color}30`,
                      }}
                    >
                      #{position}
                    </span>
                  </div>
                  
                  {/* Player info */}
                  <div className="text-center space-y-3">
                    {/* Club tag */}
                    {player.clubTag && (
                      <span className="inline-block px-2 py-0.5 bg-surface-light rounded text-xs font-mono text-text-secondary">
                        {player.clubTag}
                      </span>
                    )}
                    
                    {/* Name */}
                    <div className="flex items-center justify-center gap-2">
                      <PlatformIcon player={player} size={16} />
                      <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                        {getPlayerDisplayName(player)}
                      </h3>
                    </div>
                    
                    {/* Rank badge */}
                    <div className="flex justify-center">
                      <RankBadge player={player} size="md" />
                    </div>
                    
                    {/* Score */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                        {formatRankScore(player.rankScore)}
                        <span className="text-sm text-text-secondary ml-1">RS</span>
                      </div>
                      <div className="mt-1">
                        <ChangeIndicator change={player.change} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Ruby glow for #1 */}
                  {isFirst && isRuby(player) && (
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-t-2xl pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(224, 17, 95, 0.3) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </div>
                
                {/* Podium base */}
                <div
                  className={`w-full bg-surface-light border-t border-white/5 ${
                    isFirst ? 'h-16' : position === 2 ? 'h-10' : 'h-6'
                  }`}
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Sparkles decoration */}
        {isRuby(first) && (
          <>
            <motion.div
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 left-1/4 text-ruby"
            >
              <Sparkles size={20} />
            </motion.div>
            <motion.div
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, -180, -360]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-4 right-1/4 text-ruby"
            >
              <Sparkles size={16} />
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
