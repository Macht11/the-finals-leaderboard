'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types';
import { getPlayerDisplayName } from '@/lib/api';
import { formatRankScore, getRankTier } from '@/lib/ranks';
import RankBadge from './RankBadge';
import PlatformIcon from './PlatformIcon';
import { X, Plus, Users, Scale } from 'lucide-react';

interface PlayerComparisonProps {
  players: Player[];
  selectedPlayers: Player[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (player: Player) => void;
  onClear: () => void;
}

export default function PlayerComparison({
  players,
  selectedPlayers,
  onAddPlayer,
  onRemovePlayer,
  onClear,
}: PlayerComparisonProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  
  const filteredPlayers = players.filter(p => 
    !selectedPlayers.find(sp => sp.name === p.name) &&
    (getPlayerDisplayName(p).toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 10);
  
  const maxPlayers = 4;
  const canAddMore = selectedPlayers.length < maxPlayers;
  
  if (selectedPlayers.length === 0 && !showSelector) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-4">
          <Scale className="text-text-muted" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Compare Players</h3>
        <p className="text-text-secondary mb-4">Select up to 4 players to compare stats</p>
        <button
          onClick={() => setShowSelector(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus size={18} />
          Add Players
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Selected Players */}
      {selectedPlayers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Stat</th>
                {selectedPlayers.map((player) => (
                  <th key={player.name} className="text-center py-3 px-4 min-w-[180px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <PlatformIcon player={player} size={14} />
                        <span className="text-white font-semibold">
                          {getPlayerDisplayName(player)}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemovePlayer(player)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <ComparisonRow label="Rank" players={selectedPlayers} getValue={(p) => `#${p.rank}`} />
              <ComparisonRow 
                label="League" 
                players={selectedPlayers} 
                getValue={(p) => <RankBadge player={p} size="sm" showGlow={false} />} 
              />
              <ComparisonRow 
                label="Rank Score" 
                players={selectedPlayers} 
                getValue={(p) => formatRankScore(p.rankScore)}
                isNumber
              />
              <ComparisonRow 
                label="24h Change" 
                players={selectedPlayers} 
                getValue={(p) => p.change > 0 ? `+${p.change}` : p.change}
                isNumber
                highlightBest={(p) => p.change > 0}
              />
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add More Button */}
      {canAddMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="px-4 py-2 bg-surface-light hover:bg-surface-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {showSelector ? <X size={18} /> : <Plus size={18} />}
            {showSelector ? 'Cancel' : 'Add Player'}
          </button>
        </div>
      )}
      
      {/* Player Selector */}
      <AnimatePresence>
        {showSelector && canAddMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface rounded-xl border border-white/5 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5">
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-surface-light border border-white/10 rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                autoFocus
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredPlayers.map((player) => (
                <button
                  key={player.name}
                  onClick={() => {
                    onAddPlayer(player);
                    if (selectedPlayers.length + 1 >= maxPlayers) {
                      setShowSelector(false);
                    }
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-4 hover:bg-surface-light transition-colors text-left"
                >
                  <PlatformIcon player={player} size={16} />
                  <span className="font-medium text-white">{getPlayerDisplayName(player)}</span>
                  <span className="text-sm text-text-muted">#{player.rank}</span>
                  <span className="ml-auto">
                    <RankBadge player={player} size="sm" showGlow={false} />
                  </span>
                </button>
              ))}
              
              {filteredPlayers.length === 0 && (
                <div className="p-4 text-center text-text-muted">
                  No players found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Clear Button */}
      {selectedPlayers.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onClear}
            className="text-sm text-text-muted hover:text-red-400 transition-colors"
          >
            Clear all players
          </button>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ 
  label, 
  players, 
  getValue,
  isNumber = false,
  highlightBest
}: { 
  label: string; 
  players: Player[]; 
  getValue: (player: Player) => React.ReactNode;
  isNumber?: boolean;
  highlightBest?: (player: Player) => boolean;
}) {
  return (
    <tr>
      <td className="py-3 px-4 text-sm text-text-secondary">{label}</td>
      {players.map((player) => (
        <td key={player.name} className="py-3 px-4 text-center">
          <span className={`
            ${isNumber ? 'font-mono font-bold' : ''}
            ${highlightBest?.(player) ? 'text-emerald-400' : 'text-white'}
          `}>
            {getValue(player)}
          </span>
        </td>
      ))}
    </tr>
  );
}
