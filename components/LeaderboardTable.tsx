'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, GameMode } from '@/types';
import { getPlayerDisplayName, getGameModeConfig, formatMetricValue } from '@/lib/api';
import { formatRankScore, getChangeIndicator, isRuby, isTop100, isTop10 } from '@/lib/ranks';
import RankBadge from './RankBadge';
import ChangeIndicator from './ChangeIndicator';
import PlatformIcon from './PlatformIcon';
import { Search, ChevronUp, ChevronDown, Filter, Loader2 } from 'lucide-react';

type SortField = 'rank' | 'name' | 'league' | 'metric' | 'change';
type SortDirection = 'asc' | 'desc';

interface LeaderboardTableProps {
  players: Player[];
  loading?: boolean;
  onPlayerClick?: (player: Player) => void;
  gameMode?: GameMode;
}

export default function LeaderboardTable({ 
  players, 
  loading = false,
  onPlayerClick,
  gameMode = 'ranked'
}: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const gameModeConfig = getGameModeConfig(gameMode);
  const isRankedMode = gameMode === 'ranked';
  
  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...players];
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.steamName?.toLowerCase().includes(query) ||
        p.psnName?.toLowerCase().includes(query) ||
        p.xboxName?.toLowerCase().includes(query) ||
        p.clubTag?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'name':
          comparison = getPlayerDisplayName(a).localeCompare(getPlayerDisplayName(b));
          break;
        case 'league':
          comparison = (a.leagueNumber || 0) - (b.leagueNumber || 0);
          break;
        case 'metric':
          const metricA = gameMode === 'ranked' ? a.rankScore : (a.cashouts || a.points || 0);
          const metricB = gameMode === 'ranked' ? b.rankScore : (b.cashouts || b.points || 0);
          comparison = metricA - metricB;
          break;
        case 'change':
          comparison = (a.change || 0) - (b.change || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [players, searchQuery, sortField, sortDirection, gameMode]);
  
  // Paginate
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };
  
  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors group"
    >
      {children}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {sortField === field ? (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ChevronUp size={14} className="opacity-30" />
        )}
      </span>
    </button>
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search players, clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="text-text-secondary text-sm">
          Showing {filteredPlayers.length.toLocaleString()} players
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-light text-text-secondary text-sm">
              <th className="px-4 py-3 text-left font-medium">
                <SortHeader field="rank">Rank</SortHeader>
              </th>
              {isRankedMode && (
                <th className="px-4 py-3 text-left font-medium">
                  <SortHeader field="change">Change</SortHeader>
                </th>
              )}
              <th className="px-4 py-3 text-left font-medium">
                <SortHeader field="name">Player</SortHeader>
              </th>
              {isRankedMode && (
                <th className="px-4 py-3 text-left font-medium hide-mobile">
                  <SortHeader field="league">League</SortHeader>
                </th>
              )}
              <th className="px-4 py-3 text-right font-medium">
                <SortHeader field="metric">
                  {gameModeConfig.metricLabel}
                </SortHeader>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {paginatedPlayers.map((player, index) => {
                const metricValue = gameMode === 'ranked' 
                  ? player.rankScore 
                  : (player.cashouts || player.points || 0);
                
                return (
                  <motion.tr
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => onPlayerClick?.(player)}
                    className={`
                      table-row-hover cursor-pointer
                      ${isRankedMode && isTop10(player) ? 'bg-primary/5' : ''}
                      ${isRankedMode && isRuby(player) ? 'hover:bg-ruby/5' : ''}
                    `}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`
                          font-black font-mono text-lg
                          ${player.rank === 1 ? 'text-yellow-400' : ''}
                          ${player.rank === 2 ? 'text-gray-300' : ''}
                          ${player.rank === 3 ? 'text-amber-600' : ''}
                          ${player.rank > 3 ? 'text-white' : ''}
                        `}>
                          #{player.rank}
                        </span>
                        {isRankedMode && isRuby(player) && (
                          <span className="text-ruby text-xs">♦</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Change - Only for ranked */}
                    {isRankedMode && (
                      <td className="px-4 py-3">
                        <ChangeIndicator change={player.change || 0} size="sm" />
                      </td>
                    )}
                    
                    {/* Player */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PlatformIcon player={player} size={16} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {getPlayerDisplayName(player)}
                            </span>
                            {player.clubTag && (
                              <span className="text-xs px-1.5 py-0.5 bg-surface-light rounded text-text-secondary">
                                {player.clubTag}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted sm:hidden">
                            {isRankedMode ? player.league : gameModeConfig.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* League - Only for ranked */}
                    {isRankedMode && (
                      <td className="px-4 py-3 hide-mobile">
                        <RankBadge player={player} size="sm" showGlow={false} animated={false} />
                      </td>
                    )}
                    
                    {/* Metric Value */}
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-bold text-white">
                        {formatMetricValue(metricValue, gameMode)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-surface-light text-white disabled:opacity-50 hover:bg-surface-hover transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition-colors
                    ${currentPage === pageNum 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-light text-text-secondary hover:bg-surface-hover'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="text-text-muted px-2">...</span>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-surface-light text-white disabled:opacity-50 hover:bg-surface-hover transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
