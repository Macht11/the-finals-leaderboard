import { NextRequest, NextResponse } from 'next/server';
import { SteamStats } from '@/types';

// This endpoint now returns estimated stats only
// Steam API key functionality has been removed as it doesn't provide
// accurate The Finals-specific stats

// In-memory cache
const cache = new Map<string, { stats: SteamStats; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playerName = searchParams.get('playerName');
  const rankScore = parseInt(searchParams.get('rankScore') || '0');
  const rank = parseInt(searchParams.get('rank') || '0');

  if (!playerName) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const cacheKey = `${playerName}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ stats: cached.stats });
  }

  // Return estimated stats based on rank data
  const estimatedStats = generateEstimatedStats(rankScore, rank, playerName);
  
  cache.set(cacheKey, { stats: estimatedStats, timestamp: Date.now() });
  return NextResponse.json({ stats: estimatedStats });
}

function generateEstimatedStats(rankScore: number, rank: number, playerName: string): SteamStats {
  // Estimate based on rankScore
  const estimatedMatches = Math.max(1, Math.floor(rankScore / 150));
  const estimatedWins = Math.max(0, Math.floor(rankScore / 300));

  // Add consistent randomness based on player name
  const nameHash = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
    winRate: parseFloat(Math.min(80, baseWinRate * 100 + (rank < 1000 ? 8 : 0)).toFixed(1)),
    kd: parseFloat(Math.min(4.5, baseKd + (rank < 1000 ? 0.4 : 0)).toFixed(2)),
    kills: totalKills,
    deaths: totalDeaths,
    hoursPlayed: estimatedHours,
    hasRealPlaytime: false,
    isEstimated: true,
    lastUpdated: new Date().toISOString(),
  };
}
