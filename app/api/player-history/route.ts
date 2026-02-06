import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const HISTORY_FILE = path.join(process.cwd(), 'data', 'player-history.json');

interface HistoryEntry {
  timestamp: string;
  rank: number;
  rankScore: number;
  league: string;
  leagueNumber: number;
  change: number;
}

interface PlayerHistory {
  name: string;
  steamName: string;
  history: HistoryEntry[];
}

function loadHistory(): Record<string, PlayerHistory> {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading history:', err);
  }
  return {};
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playerName = searchParams.get('name');
  const timeRange = searchParams.get('range') || '7d'; // 24h, 7d, season
  
  if (!playerName) {
    return NextResponse.json(
      { error: 'Player name required' },
      { status: 400 }
    );
  }
  
  const history = loadHistory();
  const playerData = history[playerName];
  
  if (!playerData || !playerData.history.length) {
    return NextResponse.json(
      { error: 'No history found for player' },
      { status: 404 }
    );
  }
  
  // Filter by time range
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (timeRange) {
    case '24h':
      cutoffDate.setDate(now.getDate() - 1);
      break;
    case '7d':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case 'season':
    default:
      cutoffDate = new Date('2025-12-01'); // Season start
  }
  
  const filteredHistory = playerData.history.filter(
    h => new Date(h.timestamp) >= cutoffDate
  );
  
  // Calculate point changes between entries
  const historyWithChanges = filteredHistory.map((entry, index) => {
    let pointChange = 0;
    if (index > 0) {
      pointChange = entry.rankScore - filteredHistory[index - 1].rankScore;
    }
    
    return {
      ...entry,
      pointChange
    };
  });
  
  return NextResponse.json({
    name: playerData.name,
    steamName: playerData.steamName,
    history: historyWithChanges,
    totalSnapshots: playerData.history.length
  });
}
