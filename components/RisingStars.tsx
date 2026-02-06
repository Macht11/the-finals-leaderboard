'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types';
import { getPlayerDisplayName } from '@/lib/api';
import { formatRankScore, getRankTier } from '@/lib/ranks';
import RankBadge from './RankBadge';
import PlatformIcon from './PlatformIcon';
import { TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

interface RisingStarsProps {
  players: Player[];
}

export default function RisingStars({ players }: RisingStarsProps) {
  // Get players with biggest rank gains
  const risingStars = useMemo(() => {
    return [...players]
      .filter(p => p.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 10);
  }, [players]);
  
  // Get players who recently hit Ruby
  const newRubyPlayers = useMemo(() => {
    return players
      .filter(p => p.leagueNumber === 21 && p.change > 0)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 5);
  }, [players]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Biggest Climbers */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold text-white">Biggest Climbers</h3>
          <span className="text-xs text-text-muted ml-auto">Last 24h</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {risingStars.map((player, index) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center gap-4 hover:bg-surface-light transition-colors group"
            >
              {/* Rank change */}
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-2xl font-black text-emerald-400">+{player.change}</span>
                <span className="text-xs text-text-muted">ranks</span>
              </div>
              
              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <PlatformIcon player={player} size={14} />
                  <span className="font-medium text-white truncate">
                    {getPlayerDisplayName(player)}
                  </span>
                  {player.clubTag && (
                    <span className="text-xs px-1.5 py-0.5 bg-surface-light rounded text-text-secondary">
                      {player.clubTag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-text-secondary">#{player.rank}</span>
                  <span className="text-xs text-text-muted">
                    {formatRankScore(player.rankScore)} RS
                  </span>
                </div>
              </div>
              
              {/* Rank badge */}
              <RankBadge player={player} size="sm" showGlow={false} />
              
              {/* Arrow */}
              <ArrowUpRight 
                className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                size={18} 
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Ruby Contenders */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Sparkles className="text-ruby" size={20} />
          <h3 className="text-lg font-bold text-white">Ruby Elite</h3>
          <span className="text-xs text-text-muted ml-auto">Top 500</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {newRubyPlayers.length > 0 ? (
            newRubyPlayers.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 flex items-center gap-4 hover:bg-surface-light transition-colors"
              >
                {/* Rank */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg
                  ${player.rank <= 3 ? 'bg-ruby/20 text-ruby' : 'bg-surface-light text-text-secondary'}
                `}>
                  #{player.rank}
                </div>
                
                {/* Player info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <PlatformIcon player={player} size={14} />
                    <span className="font-medium text-white truncate">
                      {getPlayerDisplayName(player)}
                    </span>
                    {player.clubTag && (
                      <span className="text-xs px-1.5 py-0.5 bg-ruby/20 rounded text-ruby">
                        {player.clubTag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-mono text-white">
                      {formatRankScore(player.rankScore)} RS
                    </span>
                  </div>
                </div>
                
                {/* Ruby badge */}
                <div className="px-2 py-1 bg-ruby/20 rounded text-ruby text-xs font-bold">
                  RUBY
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-text-muted">
              No Ruby players with recent gains
            </div>
          )}
        </div>
        
        {/* Top 500 cutoff info */}
        <div className="p-4 bg-surface-light border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Top 500 Cutoff</span>
            <span className="font-mono font-bold text-white">
              {formatRankScore(
                players.find(p => p.rank === 500)?.rankScore || 50000
              )} RS
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
