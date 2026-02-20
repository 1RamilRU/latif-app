import React, { useState } from 'react';
import { POSITIONS } from '../data/constants';
import { getRating } from '../utils/helpers';
import PlayerCard from './PlayerCard';

export default function CollectionScreen({ players, onSelect, onCreateNew }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? players : players.filter(p => p.pos === filter);

  return (
    <div style={{ padding: "12px 16px", width: "100%", maxWidth: 800, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#c6a04a",
          letterSpacing: 6, margin: 0,
        }}>📋 КОЛЛЕКЦИЯ</h2>
        <p style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 11,
          color: "rgba(198,160,74,.5)", letterSpacing: 3,
        }}>
          {players.length} {players.length === 1 ? "КАРТОЧКА" : players.length < 5 ? "КАРТОЧКИ" : "КАРТОЧЕК"}
        </p>
      </div>

      {/* Position Filters */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        {["ALL", ...POSITIONS].map(pos => (
          <button key={pos} onClick={() => setFilter(pos)} style={{
            padding: "6px 14px", borderRadius: 20,
            border: `1px solid ${filter === pos ? "#c6a04a" : "rgba(198,160,74,.3)"}`,
            background: filter === pos ? "rgba(198,160,74,.2)" : "rgba(10,22,40,.8)",
            color: filter === pos ? "#e8c875" : "rgba(198,160,74,.5)",
            fontFamily: "'Oswald',sans-serif", fontSize: 10, letterSpacing: 2, cursor: "pointer",
          }}>
            {pos === "ALL" ? "ВСЕ" : pos}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {filtered.map((p, idx) => (
          <div key={p.id} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            cursor: "pointer", animation: `slideUp 0.4s ${idx * 0.08}s ease both`,
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <PlayerCard player={p} size="small" onClick={onSelect} />
            <div style={{ textAlign: "center" }}>
              <span style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 14,
                color: "#fff", display: "block",
              }}>{p.first}</span>
              <span style={{
                fontFamily: "'Oswald',sans-serif", fontSize: 9,
                color: "rgba(198,160,74,.6)", letterSpacing: 2,
              }}>
                OVR {getRating(p.stats)} · LVL {p.level}
              </span>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <div onClick={onCreateNew} style={{
          width: 300 * 0.55, height: 490 * 0.55,
          border: "2px dashed rgba(198,160,74,.25)", borderRadius: 16,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", gap: 8, transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c6a04a"; e.currentTarget.style.background = "rgba(198,160,74,.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(198,160,74,.25)"; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 36, opacity: 0.4 }}>➕</span>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 10,
            color: "rgba(198,160,74,.4)", letterSpacing: 2,
          }}>НОВАЯ КАРТОЧКА</span>
        </div>
      </div>
    </div>
  );
}
