const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');
const HISTORY_FILE = path.join(DATA_DIR, 'player-history.json');

// Load existing history or create new
function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  }
  return {};
}

// Save history
function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Process all snapshots
function processSnapshots() {
  const history = loadHistory();
  
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    console.log('No snapshots directory');
    return;
  }
  
  const files = fs.readdirSync(SNAPSHOTS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();
  
  console.log(`Processing ${files.length} snapshots...`);
  
  for (const file of files) {
    const filepath = path.join(SNAPSHOTS_DIR, file);
    const timestamp = file.replace('s9-', '').replace('.json', '');
    const date = new Date(
      parseInt(timestamp.slice(0, 4)),
      parseInt(timestamp.slice(4, 6)) - 1,
      parseInt(timestamp.slice(6, 8)),
      parseInt(timestamp.slice(9, 11)),
      parseInt(timestamp.slice(11, 13))
    );
    
    try {
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      
      if (data.data && Array.isArray(data.data)) {
        for (const player of data.data) {
          const playerId = player.name;
          
          if (!history[playerId]) {
            history[playerId] = {
              name: player.name,
              steamName: player.steamName,
              history: []
            };
          }
          
          // Check if we already have this timestamp
          const exists = history[playerId].history.some(
            h => h.timestamp === date.toISOString()
          );
          
          if (!exists) {
            history[playerId].history.push({
              timestamp: date.toISOString(),
              rank: player.rank,
              rankScore: player.rankScore,
              league: player.league,
              leagueNumber: player.leagueNumber,
              change: player.change
            });
            
            // Sort by timestamp
            history[playerId].history.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            
            // Keep only last 500 entries per player
            if (history[playerId].history.length > 500) {
              history[playerId].history = history[playerId].history.slice(-500);
            }
          }
        }
      }
      
      // Delete processed snapshot
      fs.unlinkSync(filepath);
      
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  saveHistory(history);
  console.log('History updated successfully');
}

processSnapshots();
