'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types';
import { RANK_GROUPS } from '@/lib/ranks';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface RankDistributionProps {
  players: Player[];
}

export default function RankDistribution({ players }: RankDistributionProps) {
  const distribution = useMemo(() => {
    const dist = new Map<string, number>();
    
    players.forEach(player => {
      const group = RANK_GROUPS.find(
        g => player.leagueNumber >= g.minLeague && player.leagueNumber <= g.maxLeague
      );
      if (group) {
        dist.set(group.name, (dist.get(group.name) || 0) + 1);
      }
    });
    
    return Array.from(dist.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: (count / players.length) * 100,
      color: RANK_GROUPS.find(g => g.name === name)?.color || '#888888'
    }));
  }, [players]);
  
  const detailedDistribution = useMemo(() => {
    const dist = new Map<string, number>();
    
    players.forEach(player => {
      dist.set(player.league, (dist.get(player.league) || 0) + 1);
    });
    
    return Array.from(dist.entries())
      .map(([league, count]) => ({
        league,
        count,
        percentage: (count / players.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [players]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-text-secondary">
            {data.count.toLocaleString()} players ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl border border-white/5 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Rank Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {distribution.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-text-secondary">{item.name}</span>
              <span className="text-sm font-mono text-white">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-white/5 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Players by Tier</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#6a6a7a" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#a0a0b0" 
                fontSize={12}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      {/* Detailed Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-surface rounded-xl border border-white/5 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Detailed Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {detailedDistribution.map((item, index) => (
            <motion.div
              key={item.league}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="bg-surface-light rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="text-xs text-text-muted mb-1">{item.league}</div>
              <div className="text-lg font-bold font-mono text-white">
                {item.count.toLocaleString()}
              </div>
              <div className="text-xs text-text-secondary">
                {item.percentage.toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
