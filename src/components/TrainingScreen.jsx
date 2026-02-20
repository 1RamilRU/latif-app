import React, { useState, useRef, useEffect, useCallback } from 'react';
import { THEMES, TRAINING_GAMES, STAT_LABELS } from '../data/constants';

// ═══════════════════════════════════
// TRAINING MENU
// ═══════════════════════════════════
export default function TrainingScreen({ player, onComplete, onBack }) {
  const [game, setGame] = useState(null);
  const t = THEMES[player.theme] || THEMES.gold;

  if (game) {
    return (
      <TrainingGame
        gameType={game} player={player}
        onComplete={(xp, stat) => { onComplete(xp, stat); setGame(null); }}
        onBack={() => setGame(null)}
      />
    );
  }

  return (
    <div style={{ padding: "12px 16px", maxWidth: 500, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${t.primary}50`, borderRadius: 8,
        padding: "6px 14px", color: t.primary,
        fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: 2, cursor: "pointer", marginBottom: 16,
      }}>← НАЗАД</button>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 28,
          color: t.primary, letterSpacing: 6, margin: 0,
        }}>⚡ ТРЕНИРОВКА</h2>
        <p style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 11,
          color: "rgba(255,255,255,.4)", letterSpacing: 2, margin: "4px 0 0",
        }}>ТРЕНИРУЙ {player.first} — ПРОКАЧИВАЙ НАВЫКИ!</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {TRAINING_GAMES.map((g, idx) => (
          <button key={g.id} onClick={() => setGame(g)} style={{
            background: "rgba(255,255,255,.05)", border: `1px solid ${t.primary}50`,
            borderRadius: 12, padding: 14, cursor: "pointer", textAlign: "center",
            animation: `slideUp 0.4s ${idx * 0.06}s ease both`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${t.primary}20`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{g.icon}</div>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15,
              color: "#fff", letterSpacing: 2,
            }}>{g.name}</div>
            <div style={{
              fontFamily: "'Rajdhani',sans-serif", fontSize: 11,
              color: "rgba(255,255,255,.5)", marginTop: 2,
            }}>{g.desc}</div>
            <div style={{
              fontFamily: "'Oswald',sans-serif", fontSize: 9,
              color: t.primary, letterSpacing: 2, marginTop: 6,
              background: `${t.primary}15`, borderRadius: 10, padding: "2px 8px", display: "inline-block",
            }}>+{STAT_LABELS[g.stat]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// TRAINING MINI-GAME
// ═══════════════════════════════════
function TrainingGame({ gameType, player, onComplete, onBack }) {
  const [phase, setPhase] = useState("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [targets, setTargets] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [showingSeq, setShowingSeq] = useState(false);
  const [activeCell, setActiveCell] = useState(-1);
  const [reactionPhase, setReactionPhase] = useState("wait");
  const [reactionStart, setReactionStart] = useState(0);
  const timerRef = useRef(null);
  const t = THEMES[player.theme] || THEMES.gold;

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(timerRef.current); }, []);

  const spawnTarget = () => {
    setTargets([{ id: Date.now(), x: 10 + Math.random() * 70, y: 10 + Math.random() * 70 }]);
  };

  const spawnTargets = () => {
    setTargets(Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i, x: 5 + Math.random() * 80, y: 5 + Math.random() * 80,
    })));
  };

  const startGame = useCallback(() => {
    setPhase("playing");
    setScore(0);
    setTimeLeft(10);
    setPlayerSeq([]);

    if (gameType.id === "reaction") {
      setReactionPhase("wait");
      const delay = 1500 + Math.random() * 3000;
      timerRef.current = setTimeout(() => {
        setReactionPhase("go");
        setReactionStart(Date.now());
      }, delay);
    } else if (gameType.id === "memory") {
      const len = 3 + Math.floor(Math.random() * 3); // 3-5 items
      const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9));
      setSequence(seq);
      setShowingSeq(true);
      setPlayerSeq([]);
      let i = 0;
      const show = () => {
        if (i < seq.length) {
          setActiveCell(seq[i]);
          setTimeout(() => { setActiveCell(-1); i++; setTimeout(show, 300); }, 600);
        } else { setShowingSeq(false); }
      };
      setTimeout(show, 500);
    } else {
      if (gameType.id === "accuracy") spawnTarget();
      if (gameType.id === "defend") spawnTargets();
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); setPhase("result"); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  }, [gameType]);

  const hitTarget = (id) => {
    setScore(s => s + 1);
    setTargets(ts => ts.filter(tt => tt.id !== id));
    if (gameType.id === "accuracy") setTimeout(spawnTarget, 200);
    if (gameType.id === "defend") setTimeout(spawnTargets, 400);
  };

  const handleTap = () => {
    if (gameType.id === "power" || gameType.id === "dribble") {
      setScore(s => s + 1);
    }
  };

  const handleReactionTap = () => {
    if (reactionPhase === "wait") {
      clearTimeout(timerRef.current);
      setReactionPhase("early");
      setTimeout(() => setPhase("result"), 800);
    } else if (reactionPhase === "go") {
      setScore(Date.now() - reactionStart);
      setPhase("result");
    }
  };

  const handleMemoryCell = (idx) => {
    if (showingSeq) return;
    const newSeq = [...playerSeq, idx];
    setPlayerSeq(newSeq);
    setActiveCell(idx);
    setTimeout(() => setActiveCell(-1), 200);

    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      setScore(newSeq.length - 1);
      setTimeout(() => setPhase("result"), 300);
    } else if (newSeq.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => setPhase("result"), 300);
    }
  };

  const getXpReward = () => {
    if (gameType.id === "reaction") {
      if (reactionPhase === "early") return 5;
      return score < 300 ? 35 : score < 500 ? 20 : 10;
    }
    if (gameType.id === "memory") return score * 8;
    return Math.min(Math.round(score * 2.5), 40);
  };

  const getStatBoost = () => {
    const xp = getXpReward();
    if (xp >= 30) return 2;
    if (xp >= 15) return 1;
    return 0;
  };

  const gameArea = {
    width: "100%", maxWidth: 340, aspectRatio: "1/1", margin: "0 auto",
    background: "rgba(255,255,255,.03)", border: `1px solid ${t.primary}35`,
    borderRadius: 16, position: "relative", overflow: "hidden", userSelect: "none",
  };

  // ── READY SCREEN ──
  if (phase === "ready") {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "0 auto", textAlign: "center", animation: "fadeIn 0.3s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: "pulse 2s ease-in-out infinite" }}>{gameType.icon}</div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: t.primary, letterSpacing: 4 }}>{gameType.name}</h2>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, color: "rgba(255,255,255,.6)", margin: "8px 0 24px" }}>{gameType.desc}</p>
        <p style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, color: t.secondary, letterSpacing: 2, marginBottom: 8 }}>
          ПРОКАЧИВАЕТ: {STAT_LABELS[gameType.stat]}
        </p>
        <button onClick={startGame} style={{
          padding: "14px 44px", borderRadius: 12, border: "none",
          background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
          color: t.dark1, fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 3,
          cursor: "pointer", boxShadow: `0 4px 20px ${t.primary}55`,
        }}>▶ СТАРТ</button>
        <div style={{ marginTop: 14 }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", color: "rgba(255,255,255,.35)",
            fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: 2, cursor: "pointer",
          }}>← НАЗАД К ТРЕНИРОВКАМ</button>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (phase === "result") {
    const xpReward = getXpReward();
    const statBoost = getStatBoost();
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "0 auto", textAlign: "center", animation: "popIn 0.5s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: t.primary, letterSpacing: 4 }}>РЕЗУЛЬТАТ!</h2>

        {gameType.id === "reaction" ? (
          <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "#fff", margin: "12px 0" }}>
            {reactionPhase === "early" ? "РАНО! 😅" : `${score} мс`}
          </p>
        ) : (
          <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: "#fff", margin: "12px 0" }}>
            {score} {gameType.id === "memory" ? `/ ${sequence.length}` : "очков"}
          </p>
        )}

        <div style={{
          background: "rgba(255,255,255,.05)", border: `1px solid ${t.primary}40`,
          borderRadius: 12, padding: 16, margin: "16px auto", maxWidth: 250,
        }}>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 12, color: t.secondary, letterSpacing: 2, marginBottom: 8 }}>НАГРАДА</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: t.primary }}>+{xpReward} XP</div>
          {statBoost > 0 && (
            <div style={{
              fontFamily: "'Oswald',sans-serif", fontSize: 14, color: "#4caf50",
              letterSpacing: 1, marginTop: 6, animation: "pulse 1s ease-in-out infinite",
            }}>
              +{statBoost} {STAT_LABELS[gameType.stat]} ↑
            </div>
          )}
        </div>

        <button onClick={() => onComplete(xpReward, statBoost > 0 ? { stat: gameType.stat, boost: statBoost } : null)} style={{
          padding: "12px 36px", borderRadius: 12, border: "none",
          background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
          color: t.dark1, fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3,
          cursor: "pointer", boxShadow: `0 4px 16px ${t.primary}44`,
        }}>✔ ЗАБРАТЬ</button>
      </div>
    );
  }

  // ── PLAYING SCREEN ──
  return (
    <div style={{ padding: "12px 16px", maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: t.primary }}>{gameType.icon} {gameType.name}</span>
        {gameType.id !== "reaction" && gameType.id !== "memory" && (
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 22,
            color: timeLeft <= 3 ? "#ff3636" : "#fff",
            animation: timeLeft <= 3 ? "pulse 0.5s ease-in-out infinite" : "none",
          }}>⏱ {timeLeft}</span>
        )}
      </div>

      {/* REACTION */}
      {gameType.id === "reaction" && (
        <div onClick={handleReactionTap} style={{
          ...gameArea,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          background: reactionPhase === "go" ? "#4caf5025" : reactionPhase === "early" ? "#ff363625" : "rgba(255,255,255,.03)",
          transition: "background 0.15s",
          animation: reactionPhase === "go" ? "glow 0.8s ease-in-out infinite" : "none",
          borderColor: reactionPhase === "go" ? "#4caf50" : `${t.primary}35`,
        }}>
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: reactionPhase === "go" ? 40 : 22,
            color: reactionPhase === "go" ? "#4caf50" : reactionPhase === "early" ? "#ff3636" : "rgba(255,255,255,.35)",
            transition: "all 0.15s",
          }}>
            {reactionPhase === "wait" ? "ЖЖЖДИ..." : reactionPhase === "go" ? "ЖЖМИ!!!" : "РАНО! 😅"}
          </span>
        </div>
      )}

      {/* MEMORY */}
      {gameType.id === "memory" && (
        <div style={{
          ...gameArea, display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, padding: 12, aspectRatio: "auto",
        }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <button key={i} onClick={() => handleMemoryCell(i)} disabled={showingSeq} style={{
              aspectRatio: "1/1", borderRadius: 10, border: "none", cursor: showingSeq ? "default" : "pointer",
              background: activeCell === i
                ? `linear-gradient(135deg,${t.primary},${t.secondary})`
                : "rgba(255,255,255,.08)",
              transition: "all 0.2s",
              transform: activeCell === i ? "scale(0.93)" : "scale(1)",
              boxShadow: activeCell === i ? `0 0 15px ${t.primary}66` : "none",
            }} />
          ))}
          {showingSeq && (
            <div style={{
              position: "absolute", top: 8, left: 0, right: 0, textAlign: "center",
              fontFamily: "'Oswald',sans-serif", fontSize: 12, color: t.primary, letterSpacing: 2,
            }}>ЗАПОМИНАЙ!</div>
          )}
        </div>
      )}

      {/* ACCURACY / DEFEND */}
      {(gameType.id === "accuracy" || gameType.id === "defend") && (
        <div style={gameArea}>
          {targets.map(tgt => (
            <div key={tgt.id} onClick={() => hitTarget(tgt.id)} style={{
              position: "absolute", left: `${tgt.x}%`, top: `${tgt.y}%`,
              width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
              background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: `0 0 15px ${t.primary}66`,
              animation: "popIn 0.3s ease-out",
            }}>
              {gameType.id === "accuracy" ? "🎯" : "⚽"}
            </div>
          ))}
          <div style={{
            position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center",
          }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: t.primary }}>{score}</span>
          </div>
        </div>
      )}

      {/* POWER / DRIBBLE */}
      {(gameType.id === "power" || gameType.id === "dribble") && (
        <div onClick={handleTap} style={{
          ...gameArea,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", gap: 12,
        }}>
          <span style={{ fontSize: 60, transition: "transform 0.1s" }}>{gameType.icon}</span>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: t.primary }}>{score}</span>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 13,
            color: "rgba(255,255,255,.35)", letterSpacing: 2,
          }}>НАЖИМАЙ БЫСТРЕЕ!</span>
          {/* Progress indicator */}
          <div style={{ width: "60%", height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: `linear-gradient(90deg,${t.primary},${t.secondary})`,
              width: `${Math.min(score * 2.5, 100)}%`, transition: "width 0.1s",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
