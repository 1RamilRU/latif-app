import React from 'react';
import { THEMES } from '../data/constants';

export default function LevelUpModal({ player, onClose }) {
  const t = THEMES[player.theme] || THEMES.gold;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(160deg,${t.dark1},${t.dark2})`,
        border: `2px solid ${t.primary}`, borderRadius: 20, padding: 36,
        textAlign: "center", maxWidth: 320, width: "85vw",
        animation: "popIn 0.5s ease",
        boxShadow: `0 0 60px ${t.primary}33`,
      }}>
        <div style={{ fontSize: 64, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }}>🌟</div>

        <h2 style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, color: t.primary,
          letterSpacing: 5, margin: 0,
        }}>LEVEL UP!</h2>

        <p style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 56, color: "#fff",
          margin: "8px 0", textShadow: `0 0 20px ${t.primary}88`,
        }}>{player.level}</p>

        <p style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 13,
          color: "rgba(255,255,255,.5)", letterSpacing: 2,
        }}>{player.first} стал сильнее!</p>

        <button onClick={onClose} style={{
          marginTop: 22, padding: "14px 36px", borderRadius: 12, border: "none",
          background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
          color: t.dark1, fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3,
          cursor: "pointer", boxShadow: `0 4px 16px ${t.primary}44`,
        }}>КРУТО! 🎉</button>
      </div>
    </div>
  );
}
