import { RankTier, Player } from '@/types';

export const RANK_TIERS: RankTier[] = [
  { name: 'Bronze 4', number: 1, minScore: 0, maxScore: 2500, color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', icon: '🥉' },
  { name: 'Bronze 3', number: 2, minScore: 2500, maxScore: 5000, color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', icon: '🥉' },
  { name: 'Bronze 2', number: 3, minScore: 5000, maxScore: 7500, color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', icon: '🥉' },
  { name: 'Bronze 1', number: 4, minScore: 7500, maxScore: 10000, color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', icon: '🥉' },
  { name: 'Silver 4', number: 5, minScore: 10000, maxScore: 12500, color: '#c0c0c0', gradient: 'from-gray-400 to-gray-300', icon: '🥈' },
  { name: 'Silver 3', number: 6, minScore: 12500, maxScore: 15000, color: '#c0c0c0', gradient: 'from-gray-400 to-gray-300', icon: '🥈' },
  { name: 'Silver 2', number: 7, minScore: 15000, maxScore: 17500, color: '#c0c0c0', gradient: 'from-gray-400 to-gray-300', icon: '🥈' },
  { name: 'Silver 1', number: 8, minScore: 17500, maxScore: 20000, color: '#c0c0c0', gradient: 'from-gray-400 to-gray-300', icon: '🥈' },
  { name: 'Gold 4', number: 9, minScore: 20000, maxScore: 22500, color: '#ffd700', gradient: 'from-yellow-500 to-yellow-300', icon: '🥇' },
  { name: 'Gold 3', number: 10, minScore: 22500, maxScore: 25000, color: '#ffd700', gradient: 'from-yellow-500 to-yellow-300', icon: '🥇' },
  { name: 'Gold 2', number: 11, minScore: 25000, maxScore: 27500, color: '#ffd700', gradient: 'from-yellow-500 to-yellow-300', icon: '🥇' },
  { name: 'Gold 1', number: 12, minScore: 27500, maxScore: 30000, color: '#ffd700', gradient: 'from-yellow-500 to-yellow-300', icon: '🥇' },
  { name: 'Platinum 4', number: 13, minScore: 30000, maxScore: 32500, color: '#3eb489', gradient: 'from-emerald-600 to-emerald-400', icon: '💎' },
  { name: 'Platinum 3', number: 14, minScore: 32500, maxScore: 35000, color: '#3eb489', gradient: 'from-emerald-600 to-emerald-400', icon: '💎' },
  { name: 'Platinum 2', number: 15, minScore: 35000, maxScore: 37500, color: '#3eb489', gradient: 'from-emerald-600 to-emerald-400', icon: '💎' },
  { name: 'Platinum 1', number: 16, minScore: 37500, maxScore: 40000, color: '#3eb489', gradient: 'from-emerald-600 to-emerald-400', icon: '💎' },
  { name: 'Diamond 4', number: 17, minScore: 40000, maxScore: 42500, color: '#b9f2ff', gradient: 'from-cyan-400 to-blue-300', icon: '💠' },
  { name: 'Diamond 3', number: 18, minScore: 42500, maxScore: 45000, color: '#b9f2ff', gradient: 'from-cyan-400 to-blue-300', icon: '💠' },
  { name: 'Diamond 2', number: 19, minScore: 45000, maxScore: 47500, color: '#b9f2ff', gradient: 'from-cyan-400 to-blue-300', icon: '💠' },
  { name: 'Diamond 1', number: 20, minScore: 47500, maxScore: 50000, color: '#b9f2ff', gradient: 'from-cyan-400 to-blue-300', icon: '💠' },
  { name: 'Ruby', number: 21, minScore: 50000, maxScore: 999999, color: '#e0115f', gradient: 'from-rose-600 to-red-500', icon: '♦️' },
];

export const RANK_GROUPS = [
  { name: 'Bronze', color: '#cd7f32', minLeague: 1, maxLeague: 4 },
  { name: 'Silver', color: '#c0c0c0', minLeague: 5, maxLeague: 8 },
  { name: 'Gold', color: '#ffd700', minLeague: 9, maxLeague: 12 },
  { name: 'Platinum', color: '#3eb489', minLeague: 13, maxLeague: 16 },
  { name: 'Diamond', color: '#b9f2ff', minLeague: 17, maxLeague: 20 },
  { name: 'Ruby', color: '#e0115f', minLeague: 21, maxLeague: 21 },
];

export function getRankTier(leagueNumber: number): RankTier {
  return RANK_TIERS.find(tier => tier.number === leagueNumber) || RANK_TIERS[0];
}

export function getRankTierByName(league: string): RankTier {
  return RANK_TIERS.find(tier => tier.name === league) || RANK_TIERS[0];
}

export function getRankGroup(leagueNumber: number) {
  return RANK_GROUPS.find(
    group => leagueNumber >= group.minLeague && leagueNumber <= group.maxLeague
  ) || RANK_GROUPS[0];
}

export function getRankColor(leagueNumber: number): string {
  const group = getRankGroup(leagueNumber);
  return group.color;
}

export function formatRankScore(score: number): string {
  return score.toLocaleString();
}

export function getNextRankThreshold(currentLeague: number): number {
  const currentTier = getRankTier(currentLeague);
  const nextTier = RANK_TIERS.find(t => t.number === currentLeague + 1);
  return nextTier ? nextTier.minScore : currentTier.maxScore;
}

export function getProgressToNextRank(player: Player): number {
  const currentTier = getRankTier(player.leagueNumber);
  const nextTier = RANK_TIERS.find(t => t.number === player.leagueNumber + 1);
  
  if (!nextTier) return 100;
  
  const range = nextTier.minScore - currentTier.minScore;
  const progress = player.rankScore - currentTier.minScore;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function getChangeIndicator(change: number): { icon: string; color: string; text: string } {
  if (change > 0) {
    return { icon: '↑', color: '#10b981', text: `+${change}` };
  } else if (change < 0) {
    return { icon: '↓', color: '#ef4444', text: `${change}` };
  }
  return { icon: '−', color: '#6b7280', text: '0' };
}

export function isRuby(player: Player): boolean {
  return player.leagueNumber === 21;
}

export function isTop500(player: Player): boolean {
  return player.rank <= 500;
}

export function isTop100(player: Player): boolean {
  return player.rank <= 100;
}

export function isTop10(player: Player): boolean {
  return player.rank <= 10;
}
