'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, GameMode } from '@/types';
import { getPlayerDisplayName, getPlayerPlatform, getGameModeConfig, formatMetricValue, fetchPlayerHistory, PlayerHistoryEntry } from '@/lib/api';
import { 
  getRankTier, 
  formatRankScore, 
  getProgressToNextRank, 
  getNextRankThreshold,
  isRuby,
} from '@/lib/ranks';
import RankBadge, { RankIcon } from './RankBadge';
import PlatformIcon from './PlatformIcon';
import { 
  X, Trophy, Target, TrendingUp, Award, Share2, 
  History, TrendingDown, Minus, Settings2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlayerProfileProps {
  player: Player | null;
  onClose: () => void;
  gameMode?: GameMode;
}

export default function PlayerProfile({ player, onClose, gameMode = 'ranked' }: PlayerProfileProps) {
  const gameModeConfig = getGameModeConfig(gameMode);
  const isRankedMode = gameMode === 'ranked';
  
  if (!player) return null;
  
  const displayName = getPlayerDisplayName(player);
  const platform = getPlayerPlatform(player);
  
  // For ranked mode, use tier/progress info
  const tier = isRankedMode ? getRankTier(player.leagueNumber) : null;
  const progress = isRankedMode ? getProgressToNextRank(player) : 0;
  const nextThreshold = isRankedMode ? getNextRankThreshold(player.leagueNumber) : 0;
  
  // Get metric value based on game mode
  const metricValue = isRankedMode 
    ? player.rankScore 
    : (player.cashouts || player.points || 0);
  

  

  
  const achievements = isRankedMode ? [
    { icon: Trophy, label: 'Top 100', color: '#ffd700', earned: player.rank <= 100 },
    { icon: Target, label: 'Top 500', color: '#e0115f', earned: player.rank <= 500 },
    { icon: TrendingUp, label: 'Rising Star', color: '#10b981', earned: (player.change || 0) > 50 },
    { icon: Award, label: 'Ruby Elite', color: '#e0115f', earned: isRuby(player) },
  ] : [
    { icon: Trophy, label: 'Top 100', color: '#ffd700', earned: player.rank <= 100 },
    { icon: Target, label: 'Top 500', color: '#e0115f', earned: player.rank <= 500 },
    { icon: TrendingUp, label: 'Top 1000', color: '#10b981', earned: player.rank <= 1000 },
    { icon: Award, label: 'Top 5000', color: '#00d4ff', earned: player.rank <= 5000 },
  ];
  
  return (
    <AnimatePresence>
      {player && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* Modal Container */}
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="relative p-6 border-b border-white/5">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-light transition-colors z-10"
                >
                  <X size={20} className="text-text-muted" />
                </button>
                
                {/* Game Mode Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-light rounded text-xs text-text-secondary">
                    {gameModeConfig.name}
                  </span>
                </div>
                
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${tier?.color || '#ff4655'}22 0%, ${tier?.color || '#ff4655'}44 100%)`,
                      border: `2px solid ${tier?.color || '#ff4655'}`,
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformIcon player={player} size={18} />
                      <h2 className="text-2xl font-bold text-white truncate">
                        {displayName}
                      </h2>
                    </div>
                    
                    {player.clubTag && (
                      <span className="inline-block px-2 py-0.5 bg-surface-light rounded text-sm text-text-secondary mb-2">
                        Club: {player.clubTag}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      {isRankedMode && (
                        <div className="flex items-center gap-2">
                          <RankBadge player={player} size="md" />
                          <span className="text-sm font-medium" style={{ color: tier?.color }}>
                            {tier?.name}
                          </span>
                        </div>
                      )}
                      <span className="text-text-muted">#{player.rank} Global</span>
                      {platform !== 'unknown' && (
                        <span className="text-xs px-2 py-0.5 bg-surface-light rounded text-text-secondary capitalize">
                          {platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">

                
                {/* Metric Display */}
                <div className="mb-6">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-text-secondary">{gameModeConfig.metricLabel}</span>
                    <span className="text-3xl font-black font-mono text-white">
                      {formatMetricValue(metricValue, gameMode)}
                    </span>
                  </div>
                  
                  {/* Progress bar - Only for ranked */}
                  {isRankedMode && tier && !isRuby(player) && (
                    <div className="space-y-1">
                      <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${tier.color} 0%, ${tier.color}88 100%)`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>{formatRankScore(tier.minScore)}</span>
                        <span>Next: {formatRankScore(nextThreshold)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Rank Progression Chart - Only for ranked */}
                {isRankedMode && (
                  <div className="mb-6">
                    <MatchesChart player={player} />
                  </div>
                )}
                
                {/* Key Stats - Only for ranked */}
                {isRankedMode && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard
                      label="Rank Change"
                      value={(player.change || 0) > 0 ? `+${player.change}` : (player.change || 0)}
                      trend={(player.change || 0) > 0 ? 'up' : (player.change || 0) < 0 ? 'down' : 'neutral'}
                    />
                    <StatCard
                      label="Global Rank"
                      value={`#${player.rank.toLocaleString()}`}
                    />
                    <StatCard
                      label="Rank Score"
                      value={player.rankScore.toLocaleString()}
                    />
                  </div>
                )}
                
                {/* Achievements */}
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-3">Achievements</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.label}
                        className={`
                          p-3 rounded-xl border text-center transition-all
                          ${achievement.earned 
                            ? 'bg-surface-light border-white/10' 
                            : 'opacity-40 border-transparent'
                          }
                        `}
                      >
                        <achievement.icon 
                          size={24} 
                          className="mx-auto mb-2"
                          style={{ color: achievement.earned ? achievement.color : '#6a6a7a' }}
                        />
                        <span className="text-xs font-medium text-white">{achievement.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Info for non-ranked modes */}
                {!isRankedMode && (
                  <div className="mt-6 p-4 bg-surface-light/50 rounded-xl border border-white/5">
                    <p className="text-sm text-text-secondary">
                      Detailed statistics are only available for <strong className="text-white">Ranked</strong> mode. 
                      {gameModeConfig.name} mode tracks {gameModeConfig.metricLabel.toLowerCase()} only.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-surface-light">
                <button className="w-full py-2.5 rounded-lg bg-surface border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Share Profile
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({ 
  label, 
  value, 
  trend,
}: { 
  label: string; 
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-text-secondary',
  };
  
  return (
    <div className="bg-surface-light rounded-xl p-4 border border-white/5 relative">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className={`text-xl font-bold font-mono ${trend ? trendColors[trend] : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

// Rank History Chart Component - Uses REAL data from database
function MatchesChart({ player }: { player: Player }) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | 'season'>('7d');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  
  // Fetch real history data
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const history = await fetchPlayerHistory(player.name, timeRange);
        if (history && history.history.length > 0) {
          // Transform to chart format
          const chartData = history.history.map(entry => ({
            timestamp: new Date(entry.timestamp).getTime(),
            date: entry.timestamp,
            points: entry.rankScore,
            rank: entry.rank,
            league: entry.league,
            leagueNumber: entry.leagueNumber,
            change: entry.pointChange || 0,
          }));
          setHistoryData(chartData);
          setHasData(true);
        } else {
          setHasData(false);
          setHistoryData([]);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
  }, [player.name, timeRange]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isPositive = point.change > 0;
      const changeText = point.change !== 0 
        ? `${isPositive ? '+' : ''}${point.change.toLocaleString()}`
        : '-';
      
      return (
        <div className="bg-surface border border-white/10 rounded-lg p-3 shadow-xl">
          <div className="text-xs text-text-muted mb-1">
            {new Date(point.timestamp).toLocaleDateString('en-US', { 
              day: 'numeric', month: 'short', year: 'numeric'
            })} {new Date(point.timestamp).toLocaleTimeString('en-US', { 
              hour: 'numeric', minute: '2-digit', hour12: true 
            })}
          </div>
          <div className="text-sm font-medium text-white mb-1">
            {player.steamName || player.name}
          </div>
          <div className="text-sm text-white">
            Points: <span className="font-mono font-bold">{point.points.toLocaleString()}</span>
          </div>
          {point.change !== 0 && (
            <div className="text-sm">
              <span className="text-text-muted">Points change: </span>
              <span className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {changeText}
              </span>
            </div>
          )}
          <div className="text-sm text-text-muted">
            Rank: <span className="text-white">#{point.rank.toLocaleString()}</span>
          </div>
          <div className="text-sm text-text-muted">
            League: <span style={{ color: getRankColor(point.leagueNumber) }}>{point.league}</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const getRankColor = (leagueNum: number) => {
    if (leagueNum === 21) return '#e0115f';
    if (leagueNum >= 17) return '#b9f2ff';
    if (leagueNum >= 13) return '#00d4ff';
    if (leagueNum >= 9) return '#ffd700';
    if (leagueNum >= 5) return '#c0c0c0';
    return '#cd7f32';
  };
  
  // Format X-axis labels
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeRange === '24h') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }
    return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  };
  
  // Format Y-axis labels
  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(0)}k RS`;
  };
  
  return (
    <div className="bg-surface-light rounded-xl border border-white/5 overflow-hidden">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History size={16} className="text-primary" />
          <span className="text-sm font-medium text-white">Rank History</span>
          {hasData && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
          {(['season', '7d', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {range === 'season' ? 'Entire season' : range === '7d' ? 'Last 7 days' : 'Last 24 hours'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="p-4">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !hasData ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-text-muted">
            <History size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No history data yet</p>
            <p className="text-xs">History will be collected over time</p>
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    stroke="#6a6a7a"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={formatYAxis}
                    stroke="#6a6a7a"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Main line - stepped to show flat periods between matches */}
                  <Line
                    type="stepAfter"
                    dataKey="points"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: '#1a1a2e', strokeWidth: 2, fill: '#10b981' }}
                  />
                  {/* Scatter points for gains */}
                  <Line
                    type="monotone"
                    dataKey={(d: any) => d.change > 0 ? d.points : null}
                    stroke="transparent"
                    dot={{ r: 4, fill: '#10b981', stroke: '#1a1a2e', strokeWidth: 2 }}
                    activeDot={false}
                    connectNulls={false}
                  />
                  {/* Scatter points for losses */}
                  <Line
                    type="monotone"
                    dataKey={(d: any) => d.change < 0 ? d.points : null}
                    stroke="transparent"
                    dot={{ r: 4, fill: '#ef4444', stroke: '#1a1a2e', strokeWidth: 2 }}
                    activeDot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Rank Up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Rank Down</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-emerald-500" />
                <span>Points Trend</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="p-3 bg-surface border-t border-white/5 text-center">
        <p className="text-xs text-text-muted">
          {hasData 
            ? `Showing ${historyData.length} data points from database`
            : 'Data is collected every hour via automated polling'
          }
        </p>
      </div>
    </div>
  );
}
