// ══════════════════════════════════════
// THEMES & CONSTANTS
// ══════════════════════════════════════

export const THEMES = {
  gold:    { primary: "#c6a04a", secondary: "#e8c875", dark1: "#0d2560", dark2: "#1a3a7a", icon: "🥇", name: "GOLD" },
  silver:  { primary: "#8b9bb4", secondary: "#c5d1e0", dark1: "#1a2332", dark2: "#2d3e52", icon: "🥈", name: "SILVER" },
  bronze:  { primary: "#cd7f32", secondary: "#e8a864", dark1: "#2b1810", dark2: "#4a2817", icon: "🥉", name: "BRONZE" },
  totw:    { primary: "#ff3636", secondary: "#ff6b6b", dark1: "#0a0a0a", dark2: "#1a1a1a", icon: "🔥", name: "TOTW" },
  special: { primary: "#9b59b6", secondary: "#e74c3c", dark1: "#2c3e50", dark2: "#34495e", icon: "💎", name: "SPECIAL" },
  hero:    { primary: "#00e676", secondary: "#69f0ae", dark1: "#0d1f12", dark2: "#1b3a20", icon: "🌟", name: "HERO" },
};

export const POSITIONS = ["FWD", "MID", "DEF", "GK"];

export const STAT_LABELS = {
  pac: "PAC", sho: "SHO", pas: "PAS",
  dri: "DRI", def: "DEF", phy: "PHY",
};

export const SKILL_NAMES = {
  pac: "SPEED",    sho: "SHOOTING",  pas: "PASSING",
  dri: "DRIBBLING", def: "DEFENCE",  phy: "PHYSICAL",
};

export const TRAINING_GAMES = [
  { id: "reaction", name: "⚡ РЕАКЦИЯ",  desc: "Нажми как можно быстрее!", stat: "pac", icon: "⚡" },
  { id: "accuracy", name: "🎯 ТОЧНОСТЬ",  desc: "Попади в цель!",          stat: "sho", icon: "🎯" },
  { id: "memory",   name: "🧠 ПАМЯТЬ",    desc: "Запомни последовательность!", stat: "pas", icon: "🧠" },
  { id: "dribble",  name: "⚽ ДРИБЛИНГ",  desc: "Собери как можно больше!", stat: "dri", icon: "⚽" },
  { id: "defend",   name: "🛡️ ЗАЩИТА",   desc: "Поймай все мячи!",        stat: "def", icon: "🛡️" },
  { id: "power",    name: "💪 СИЛА",      desc: "Нажимай быстро!",         stat: "phy", icon: "💪" },
];
