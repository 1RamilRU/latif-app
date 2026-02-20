import React, { useState } from 'react';
import { THEMES } from '../data/constants';
import { getXpForLevel } from '../utils/helpers';
import PlayerCard from './PlayerCard';

function ActionBtn({ label, onClick, theme }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 100,
      background: `${theme.primary}20`, border: `1px solid ${theme.primary}`,
      borderRadius: 10, padding: "10px 14px", color: theme.primary,
      fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 600,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    }}
      onMouseEnter={e => e.currentTarget.style.background = `${theme.primary}35`}
      onMouseLeave={e => e.currentTarget.style.background = `${theme.primary}20`}
    >
      {label}
    </button>
  );
}

export default function CardViewScreen({ player, onBack, onTrain, onEdit, onPhotoChange }) {
  const [flipped, setFlipped] = useState(false);
  const t = THEMES[player.theme] || THEMES.gold;
  const xpNeeded = getXpForLevel(player.level);
  const xpPct = Math.min((player.xp / xpNeeded) * 100, 100);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 16, padding: "12px 16px", maxWidth: 500, margin: "0 auto",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        alignSelf: "flex-start", background: "none",
        border: `1px solid ${t.primary}50`, borderRadius: 8,
        padding: "6px 14px", color: t.primary,
        fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: 2, cursor: "pointer",
      }}>
        ← КОЛЛЕКЦИЯ
      </button>

      {/* Card */}
      <div style={{ animation: "popIn 0.5s ease" }}>
        <PlayerCard player={player} flipped={flipped} interactive={false} onPhotoChange={onPhotoChange} />
      </div>

      {/* XP Bar */}
      <div style={{ width: "min(300px, 88vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 10,
            color: t.primary, letterSpacing: 2,
          }}>
            ⭐ УРОВЕНЬ {player.level}
          </span>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 10,
            color: "rgba(255,255,255,.4)", letterSpacing: 1,
          }}>
            {player.xp}/{xpNeeded} XP
          </span>
        </div>
        <div style={{
          height: 8, background: "rgba(255,255,255,.1)",
          borderRadius: 4, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 4, transition: "width 0.6s ease",
            background: `linear-gradient(90deg,${t.primary},${t.secondary})`,
            width: `${xpPct}%`,
          }} />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        justifyContent: "center", width: "min(340px, 92vw)",
      }}>
        <ActionBtn label="🔄 ПЕРЕВЕРНУТЬ" onClick={() => setFlipped(!flipped)} theme={t} />
        <ActionBtn label="⚡ ТРЕНИРОВКА" onClick={onTrain} theme={t} />
        <ActionBtn label="✏️ РЕДАКТОР" onClick={onEdit} theme={t} />
      </div>

      <div style={{
        fontFamily: "'Oswald',sans-serif", fontSize: 11,
        color: "rgba(198,160,74,.35)", letterSpacing: 3, textAlign: "center",
      }}>
        ← СВАЙП ИЛИ КНОПКА ЧТОБЫ ПЕРЕВЕРНУТЬ →
      </div>
    </div>
  );
}
