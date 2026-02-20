// ══════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════

export function getXpForLevel(level) {
  return level * 100;
}

export function getRating(stats) {
  const values = Object.values(stats);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getPositionEmoji(pos) {
  switch (pos) {
    case "GK":  return "🧤";
    case "DEF": return "🛡️";
    case "MID": return "👟";
    default:    return "⚽";
  }
}

// Save players to localStorage
export function savePlayers(players) {
  try {
    localStorage.setItem("latif-card-pro-players", JSON.stringify(players));
  } catch (e) {
    console.warn("Не удалось сохранить:", e);
  }
}

// Load players from localStorage
export function loadPlayers() {
  try {
    const data = localStorage.getItem("latif-card-pro-players");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Не удалось загрузить:", e);
    return null;
  }
}
