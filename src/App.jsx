import React, { useState, useEffect } from 'react';
import { DEFAULT_PLAYERS } from './data/players';
import { getXpForLevel, savePlayers, loadPlayers } from './utils/helpers';

import Particles from './components/Particles';
import NavBar from './components/NavBar';
import CardViewScreen from './components/CardViewScreen';
import CollectionScreen from './components/CollectionScreen';
import TrainingScreen from './components/TrainingScreen';
import EditorScreen from './components/EditorScreen';
import LevelUpModal from './components/LevelUpModal';

export default function App() {
  // Load saved players or use defaults
  const [players, setPlayers] = useState(() => loadPlayers() || DEFAULT_PLAYERS);
  const [screen, setScreen] = useState("home");
  const [selectedId, setSelectedId] = useState("latif");
  const [editingNew, setEditingNew] = useState(false);
  const [levelUp, setLevelUp] = useState(null);

  const selectedPlayer = players.find(p => p.id === selectedId) || players[0];

  // Auto-save on any change
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const updatePlayer = (id, updates) => {
    setPlayers(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addXp = (playerId, xp, statBoost) => {
    setPlayers(ps => ps.map(p => {
      if (p.id !== playerId) return p;

      let newXp = p.xp + xp;
      let newLevel = p.level;
      let newStats = { ...p.stats };

      // Apply stat boost
      if (statBoost) {
        newStats[statBoost.stat] = Math.min(99, newStats[statBoost.stat] + statBoost.boost);
      }

      // Check level up
      const needed = getXpForLevel(newLevel);
      if (newXp >= needed) {
        newXp -= needed;
        newLevel++;
        // Show level up modal
        setTimeout(() => setLevelUp({ ...p, level: newLevel }), 300);
      }

      return { ...p, xp: newXp, level: newLevel, stats: newStats };
    }));
  };

  const handleNavigate = (target) => {
    if (target === "editor") setEditingNew(false);
    setScreen(target);
  };

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      background: "radial-gradient(ellipse at 40% 20%, #0f1e40 0%, #060e1a 60%, #000 100%)",
      fontFamily: "'Rajdhani',sans-serif", position: "relative", paddingBottom: 70,
    }}>
      <Particles theme={selectedPlayer?.theme || "gold"} />

      {/* Header */}
      <header style={{
        textAlign: "center", padding: "16px 16px 8px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 11,
          letterSpacing: 6, color: "rgba(198,160,74,.5)",
        }}>
          ⭑ LATIF CARD PRO · FC ACHINSK ACADEMY ⭑
        </div>
      </header>

      {/* Screens */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {screen === "home" && (
          <CardViewScreen
            player={selectedPlayer}
            onBack={() => setScreen("collection")}
            onTrain={() => setScreen("train")}
            onEdit={() => { setEditingNew(false); setScreen("editor"); }}
            onPhotoChange={(data) => updatePlayer(selectedId, { photo: data })}
          />
        )}

        {screen === "collection" && (
          <CollectionScreen
            players={players}
            onSelect={(p) => { setSelectedId(p.id); setScreen("home"); }}
            onCreateNew={() => { setEditingNew(true); setScreen("editor"); }}
          />
        )}

        {screen === "train" && (
          <TrainingScreen
            player={selectedPlayer}
            onComplete={(xp, statBoost) => addXp(selectedId, xp, statBoost)}
            onBack={() => setScreen("home")}
          />
        )}

        {screen === "editor" && (
          <EditorScreen
            player={editingNew ? null : selectedPlayer}
            isNew={editingNew}
            onSave={(p) => {
              if (editingNew) {
                setPlayers(ps => [...ps, p]);
                setSelectedId(p.id);
              } else {
                updatePlayer(p.id, p);
              }
              setScreen("home");
            }}
            onBack={() => setScreen("home")}
          />
        )}
      </main>

      {/* Level Up Modal */}
      {levelUp && <LevelUpModal player={levelUp} onClose={() => setLevelUp(null)} />}

      {/* Navigation */}
      <NavBar screen={screen} onNavigate={handleNavigate} />
    </div>
  );
}
