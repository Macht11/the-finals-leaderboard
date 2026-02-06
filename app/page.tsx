'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, GameMode } from '@/types';
import { fetchLeaderboard, GAME_MODES, getGameModeConfig } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LeaderboardTable from '@/components/LeaderboardTable';
import RankDistribution from '@/components/RankDistribution';
import RisingStars from '@/components/RisingStars';
import StatsDashboard from '@/components/StatsDashboard';
import PlayerProfile from '@/components/PlayerProfile';
import PlayerComparison from '@/components/PlayerComparison';
import GameModeSelector from '@/components/GameModeSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs';
import { Trophy, BarChart3, Target, Users, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('leaderboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ranked');
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaderboard('s9', 'crossplay', gameMode);
      setPlayers(data.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [gameMode]);
  
  useEffect(() => {
    loadData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);
  
  const handleAddComparisonPlayer = (player: Player) => {
    if (comparisonPlayers.length < 4 && !comparisonPlayers.find(p => p.name === player.name)) {
      setComparisonPlayers([...comparisonPlayers, player]);
    }
  };
  
  const handleRemoveComparisonPlayer = (player: Player) => {
    setComparisonPlayers(comparisonPlayers.filter(p => p.name !== player.name));
  };
  
  const top3Players = players.slice(0, 3);
  const gameModeConfig = getGameModeConfig(gameMode);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* Leaderboard View */}
          {currentView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section - Only show for ranked mode */}
              {gameMode === 'ranked' && <HeroSection topPlayers={top3Players} />}
              
              {/* Main Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Game Mode Selector */}
                <div className="mb-6">
                  <GameModeSelector 
                    currentMode={gameMode} 
                    onModeChange={setGameMode}
                  />
                </div>
                
                {/* Update Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted">{gameModeConfig.name}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light text-text-secondary hover:text-white transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                
                {error ? (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="bg-surface border border-white/5 p-1 rounded-lg inline-flex">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                          <Trophy size={16} />
                          All Players
                        </TabsTrigger>
                        {gameMode === 'ranked' && (
                          <TabsTrigger value="compare" className="flex items-center gap-2">
                            <Users size={16} />
                            Compare
                          </TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-6">
                        <LeaderboardTable 
                          players={players} 
                          loading={loading}
                          onPlayerClick={setSelectedPlayer}
                          gameMode={gameMode}
                        />
                      </TabsContent>
                      
                      {gameMode === 'ranked' && (
                        <TabsContent value="compare" className="mt-6">
                          <div className="bg-surface rounded-xl border border-white/5 p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                              <Users size={20} />
                              Player Comparison
                            </h2>
                            <PlayerComparison
                              players={players}
                              selectedPlayers={comparisonPlayers}
                              onAddPlayer={handleAddComparisonPlayer}
                              onRemovePlayer={handleRemoveComparisonPlayer}
                              onClear={() => setComparisonPlayers([])}
                            />
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Rising Stars View */}
          {currentView === 'rising' && (
            <motion.div
              key="rising"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Target className="text-primary" size={32} />
                  Rising Stars
                </h1>
                <p className="text-text-secondary">
                  Players making significant moves on the leaderboard
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <RisingStars players={players} />
              )}
            </motion.div>
          )}
          
          {/* Statistics View */}
          {currentView === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <BarChart3 className="text-primary" size={32} />
                  Statistics
                </h1>
                <p className="text-text-secondary">
                  Comprehensive analytics and insights
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <div className="space-y-8">
                  <StatsDashboard players={players} />
                  <RankDistribution players={players} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
      
      {/* Player Profile Modal */}
      <PlayerProfile 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        gameMode={gameMode}
      />
    </div>
  );
}
