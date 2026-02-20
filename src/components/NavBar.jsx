import React from 'react';

const NAV_ITEMS = [
  { id: "home",       icon: "🏠", label: "КАРТОЧКА" },
  { id: "collection", icon: "📋", label: "КОЛЛЕКЦИЯ" },
  { id: "train",      icon: "⚡", label: "ТРЕНИРОВКА" },
  { id: "editor",     icon: "✏️", label: "РЕДАКТОР" },
];

export default function NavBar({ screen, onNavigate }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(6,14,26,.95)", borderTop: "1px solid rgba(198,160,74,.2)",
      display: "flex", justifyContent: "space-around", padding: "6px 0 10px",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      {NAV_ITEMS.map(n => (
        <button key={n.id} onClick={() => onNavigate(n.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          opacity: screen === n.id ? 1 : 0.35, transition: "all 0.2s",
          transform: screen === n.id ? "scale(1.1)" : "scale(1)",
        }}>
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 8,
            color: "#c6a04a", letterSpacing: 2,
          }}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}
