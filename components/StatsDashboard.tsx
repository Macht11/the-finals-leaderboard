'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types';
import { Users, Trophy, Target, TrendingUp, Award, Hash } from 'lucide-react';

interface StatsDashboardProps {
  players: Player[];
}

export default function StatsDashboard({ players }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const totalPlayers = players.length;
    const rubyPlayers = players.filter(p => p.leagueNumber === 21).length;
    const diamondPlayers = players.filter(p => p.leagueNumber >= 17 && p.leagueNumber <= 20).length;
    
    const topScore = Math.max(...players.map(p => p.rankScore));
    const avgScore = players.reduce((sum, p) => sum + p.rankScore, 0) / totalPlayers;
    
    const risingPlayers = players.filter(p => p.change > 0).length;
    const fallingPlayers = players.filter(p => p.change < 0).length;
    
    const top500Cutoff = players.find(p => p.rank === 500)?.rankScore || 50000;
    
    return {
      totalPlayers,
      rubyPlayers,
      diamondPlayers,
      topScore,
      avgScore,
      risingPlayers,
      fallingPlayers,
      top500Cutoff,
    };
  }, [players]);
  
  const cards = [
    {
      icon: Users,
      label: 'Total Players',
      value: stats.totalPlayers.toLocaleString(),
      color: '#00d4ff',
    },
    {
      icon: Trophy,
      label: 'Ruby Players',
      value: stats.rubyPlayers.toLocaleString(),
      subValue: `${((stats.rubyPlayers / stats.totalPlayers) * 100).toFixed(1)}%`,
      color: '#e0115f',
    },
    {
      icon: Target,
      label: 'Diamond Players',
      value: stats.diamondPlayers.toLocaleString(),
      color: '#b9f2ff',
    },
    {
      icon: Award,
      label: 'Top Score',
      value: stats.topScore.toLocaleString(),
      subValue: 'RS',
      color: '#ffd700',
    },
    {
      icon: Hash,
      label: 'Average Score',
      value: Math.floor(stats.avgScore).toLocaleString(),
      subValue: 'RS',
      color: '#3eb489',
    },
    {
      icon: TrendingUp,
      label: 'Active Climbers',
      value: stats.risingPlayers.toLocaleString(),
      subValue: '24h',
      color: '#10b981',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-surface rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all group"
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${card.color}22` }}
          >
            <card.icon size={20} style={{ color: card.color }} />
          </div>
          
          <div className="text-2xl font-black font-mono text-white mb-1">
            {card.value}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">{card.label}</span>
            {card.subValue && (
              <span className="text-xs font-medium" style={{ color: card.color }}>
                {card.subValue}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
