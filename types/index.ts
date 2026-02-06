export interface Player {
  rank: number;
  change: number;
  name: string;
  steamName: string;
  psnName: string;
  xboxName: string;
  clubTag: string;
  leagueNumber: number;
  league: string;
  rankScore: number;
  // Mode-specific fields
  cashouts?: number;
  points?: number;
}

export interface LeaderboardResponse {
  meta: {
    leaderboardVersion: string;
    leaderboardPlatform: string;
    dataSource: string;
    exactClubTag: boolean;
    returnCountOnly: boolean;
  };
  count: number;
  data: Player[];
}

export interface RankTier {
  name: string;
  number: number;
  minScore: number;
  maxScore: number;
  color: string;
  gradient: string;
  icon: string;
}

export interface RankDistribution {
  league: string;
  count: number;
  percentage: number;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  winRate: number;
  kd: number;
  matchesPlayed: number;
  avgRankChange: number;
}

export interface SteamStats {
  matchesPlayed: number;
  wins: number;
  winRate: number;
  kd: number;
  kills?: number;
  deaths?: number;
  hoursPlayed?: number;
  hasRealPlaytime?: boolean;
  isEstimated?: boolean;
  lastUpdated?: string;
}

export type Platform = 'crossplay' | 'steam' | 'psn' | 'xbox';
export type Season = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 'cb1' | 'cb2' | 'ob';

export type GameMode = 
  | 'ranked'
  | 'worldtour' 
  | 'quickcash'
  | 'powershift'
  | 'teamdeathmatch'
  | 'head2head'
  | 'pointbreak'
  | 'sponsor';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  metricField: 'rankScore' | 'cashouts' | 'points';
  metricLabel: string;
  hasRanks: boolean;
  icon: string;
}
