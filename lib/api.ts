import { LeaderboardResponse, Player, Platform, Season, SteamStats, GameMode, GameModeConfig } from '@/types';

const API_BASE = 'https://api.the-finals-leaderboard.com';

// Cache for Steam stats to avoid repeated API calls
const steamDataCache = new Map<string, { stats: SteamStats; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Game mode configurations
export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'ranked',
    name: 'Ranked',
    description: 'Competitive ranked matches',
    metricField: 'rankScore',
    metricLabel: 'Rank Score',
    hasRanks: true,
    icon: 'trophy',
  },
  {
    id: 'worldtour',
    name: 'World Tour',
    description: 'Global cashout competition',
    metricField: 'cashouts',
    metricLabel: 'Cashouts',
    hasRanks: false,
    icon: 'globe',
  },
  {
    id: 'quickcash',
    name: 'Quick Cash',
    description: 'Fast-paced cash collection',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'zap',
  },
  {
    id: 'powershift',
    name: 'Power Shift',
    description: 'Control the moving platform',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'move',
  },
  {
    id: 'teamdeathmatch',
    name: 'Team Deathmatch',
    description: 'Elimination mode',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'crosshair',
  },
  {
    id: 'head2head',
    name: 'Head to Head',
    description: '1v1 tournament style',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'swords',
  },
  {
    id: 'pointbreak',
    name: 'Point Break',
    description: 'Capture and hold points',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'flag',
  },
  {
    id: 'sponsor',
    name: 'Sponsor',
    description: 'Sponsor challenges',
    metricField: 'points',
    metricLabel: 'Points',
    hasRanks: false,
    icon: 'award',
  },
];

export function getGameModeConfig(mode: GameMode): GameModeConfig {
  return GAME_MODES.find(m => m.id === mode) || GAME_MODES[0];
}

export function getGameModeEndpoint(mode: GameMode, season: Season = 's9'): string {
  if (mode === 'ranked') {
    return `${season}`;
  }
  return `${season}${mode}`;
}

export async function fetchLeaderboard(
  season: Season = 's9',
  platform: Platform = 'crossplay',
  mode: GameMode = 'ranked'
): Promise<LeaderboardResponse> {
  const endpoint = getGameModeEndpoint(mode, season);
  const response = await fetch(`${API_BASE}/v1/leaderboard/${endpoint}/${platform}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPlayerByName(
  name: string,
  season: Season = 's9',
  platform: Platform = 'crossplay',
  mode: GameMode = 'ranked'
): Promise<Player | null> {
  const endpoint = getGameModeEndpoint(mode, season);
  const response = await fetch(
    `${API_BASE}/v1/leaderboard/${endpoint}/${platform}?name=${encodeURIComponent(name)}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to search player: ${response.statusText}`);
  }
  
  const data: LeaderboardResponse = await response.json();
  return data.data[0] || null;
}

export async function fetchRankDistribution(
  season: Season = 's9',
  platform: Platform = 'crossplay'
): Promise<Map<string, number>> {
  // Rank distribution only makes sense for ranked mode
  const response = await fetch(`${API_BASE}/v1/leaderboard/${season}/${platform}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch rank distribution: ${response.statusText}`);
  }
  
  const data: LeaderboardResponse = await response.json();
  const distribution = new Map<string, number>();
  
  data.data.forEach((player) => {
    const count = distribution.get(player.league) || 0;
    distribution.set(player.league, count + 1);
  });
  
  return distribution;
}

/**
 * Get the display value for a player based on game mode
 */
export function getPlayerMetricValue(player: Player, mode: GameMode): number {
  const config = getGameModeConfig(mode);
  const value = player[config.metricField];
  return value || 0;
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number, mode: GameMode): string {
  if (mode === 'worldtour') {
    // Format cashouts as currency
    return '$' + value.toLocaleString();
  }
  if (mode === 'ranked') {
    // Format rank score with commas
    return value.toLocaleString();
  }
  // Default format
  return value.toLocaleString();
}

/**
 * Fetch estimated stats for a player
 */
export async function fetchSteamData(player: Player): Promise<{ stats: SteamStats } | null> {
  // Only fetch for Steam players
  if (!player.steamName) {
    return null;
  }
  
  const cacheKey = `${player.name}-${player.steamName}`;
  const cached = steamDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { stats: cached.stats };
  }
  
  try {
    const params = new URLSearchParams({
      steamName: player.steamName,
      playerName: player.name,
      rankScore: (player.rankScore || 0).toString(),
      rank: (player.rank || 0).toString(),
    });
    
    const response = await fetch(`/api/steam-stats?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    const data = await response.json();
    
    // Cache the results
    steamDataCache.set(cacheKey, { stats: data.stats, timestamp: Date.now() });
    
    return { stats: data.stats };
    
  } catch (error) {
    console.warn('Failed to fetch stats:', error);
    return {
      stats: generateEstimatedStats(player),
    };
  }
}

/**
 * @deprecated Use fetchSteamData instead
 */
export async function fetchSteamStats(player: Player): Promise<SteamStats | null> {
  const data = await fetchSteamData(player);
  return data?.stats || null;
}

/**
 * Generate estimated stats based on leaderboard data
 */
function generateEstimatedStats(player: Player): SteamStats {
  const rankScore = player.rankScore || 0;
  const estimatedMatches = Math.max(1, Math.floor(rankScore / 150));
  const estimatedWins = Math.max(0, Math.floor(rankScore / 300));
  
  const nameHash = player.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomFactor = (nameHash % 30) / 100;
  
  const baseWinRate = 0.45 + randomFactor;
  const baseKd = 0.9 + (randomFactor * 2);
  
  const avgKillsPerMatch = 6 * baseKd;
  const totalKills = Math.floor(estimatedMatches * avgKillsPerMatch);
  const totalDeaths = Math.floor(estimatedMatches * 6);
  
  // Estimate hours based on matches (avg 20-25 min per match)
  const estimatedHours = Math.floor(estimatedMatches * 0.4);
  
  return {
    matchesPlayed: estimatedMatches,
    wins: estimatedWins,
    winRate: parseFloat(Math.min(80, baseWinRate * 100 + ((player.rank || 0) < 1000 ? 8 : 0)).toFixed(1)),
    kd: parseFloat(Math.min(4.5, baseKd + ((player.rank || 0) < 1000 ? 0.4 : 0)).toFixed(2)),
    kills: totalKills,
    deaths: totalDeaths,
    hoursPlayed: estimatedHours,
    isEstimated: true,
    lastUpdated: new Date().toISOString(),
  };
}

export function getPlayerDisplayName(player: Player): string {
  if (player.steamName) return player.steamName;
  if (player.psnName) return player.psnName;
  if (player.xboxName) return player.xboxName;
  return player.name.split('#')[0];
}

export function getPlayerPlatform(player: Player): 'steam' | 'psn' | 'xbox' | 'unknown' {
  if (player.steamName) return 'steam';
  if (player.psnName) return 'psn';
  if (player.xboxName) return 'xbox';
  return 'unknown';
}

// Interface for player history
export interface PlayerHistoryEntry {
  timestamp: string;
  rank: number;
  rankScore: number;
  league: string;
  leagueNumber: number;
  change: number;
  pointChange: number;
}

export interface PlayerHistory {
  name: string;
  steamName: string;
  history: PlayerHistoryEntry[];
  totalSnapshots: number;
}

// Fetch player history from our database
export async function fetchPlayerHistory(
  playerName: string,
  range: '24h' | '7d' | 'season' = '7d'
): Promise<PlayerHistory | null> {
  try {
    const response = await fetch(
      `/api/player-history?name=${encodeURIComponent(playerName)}&range=${range}`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No history yet
      }
      throw new Error('Failed to fetch history');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Failed to fetch player history:', error);
    return null;
  }
}
