import React, { useMemo } from 'react';
import { THEMES } from '../data/constants';

export default function Particles({ theme = "gold" }) {
  const t = THEMES[theme] || THEMES.gold;

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 3,
      left: Math.random() * 100,
      dur: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    })), []
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", borderRadius: "50%",
          background: `${t.primary}55`,
          width: p.size, height: p.size, left: `${p.left}%`,
          animation: `pfloat ${p.dur}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}
