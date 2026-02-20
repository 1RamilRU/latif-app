import React, { useState, useRef } from 'react';
import { THEMES, POSITIONS, STAT_LABELS } from '../data/constants';

export default function EditorScreen({ player, onSave, onBack, isNew = false }) {
  const [form, setForm] = useState({
    first: player?.first || "", last: player?.last || "", pos: player?.pos || "FWD",
    club: player?.club || "", theme: player?.theme || "gold", photo: player?.photo || null,
    stats: { ...(player?.stats || { pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50 }) },
    info: { ...(player?.info || { dob: "", age: "", foot: "Правая", height: "", number: "" }) },
    awards: [...(player?.awards?.length ? player.awards : [""])],
    quote: player?.quote || "",
  });

  const t = THEMES[form.theme] || THEMES.gold;
  const editorPhotoRef = useRef(null);

  const setStat = (key, val) => setForm(f => ({ ...f, stats: { ...f.stats, [key]: parseInt(val) || 0 } }));
  const setInfo = (key, val) => setForm(f => ({ ...f, info: { ...f.info, [key]: val } }));

  const handleEditorPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    onSave({
      ...player,
      id: player?.id || `player_${Date.now()}`,
      first: form.first.toUpperCase() || "PLAYER",
      last: form.last.toUpperCase(),
      pos: form.pos.toUpperCase(),
      club: form.club, theme: form.theme, photo: form.photo,
      stats: form.stats, info: form.info,
      awards: form.awards.filter(a => a.trim()),
      quote: form.quote || "Let's go! ⚽",
      xp: player?.xp || 0, level: player?.level || 1,
    });
  };

  const inputStyle = {
    background: "rgba(255,255,255,.1)", border: `1px solid ${t.primary}40`,
    borderRadius: 8, padding: 10, color: "#fff", width: "100%",
    fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 600, outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontFamily: "'Oswald',sans-serif", fontSize: 8,
    color: "rgba(255,255,255,.4)", letterSpacing: 2, display: "block", marginBottom: 4,
  };

  const sectionTitle = (text) => (
    <div style={{
      fontFamily: "'Oswald',sans-serif", fontSize: 9, color: `${t.primary}AA`,
      letterSpacing: 3, marginBottom: 8, textTransform: "uppercase",
    }}>{text}</div>
  );

  return (
    <div style={{ padding: "12px 16px", maxWidth: 500, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${t.primary}50`, borderRadius: 8,
        padding: "6px 14px", color: t.primary,
        fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: 2, cursor: "pointer", marginBottom: 16,
      }}>← НАЗАД</button>

      <div style={{
        background: "rgba(10,22,40,.92)", border: `1px solid ${t.primary}40`,
        borderRadius: 14, padding: 18,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: t.primary,
          letterSpacing: 4, textAlign: "center",
          borderBottom: `1px solid ${t.primary}30`, paddingBottom: 8, marginBottom: 14,
        }}>✏️ {isNew ? "НОВАЯ КАРТОЧКА" : "РЕДАКТОР"}</div>

        {/* Theme selector */}
        <div style={{ marginBottom: 14 }}>
          <span style={labelStyle}>ТЕМА КАРТОЧКИ</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(THEMES).map(([key, th]) => (
              <button key={key} onClick={() => setForm(f => ({ ...f, theme: key }))} style={{
                width: 40, height: 40, borderRadius: 8, cursor: "pointer",
                border: form.theme === key ? "2px solid #fff" : "2px solid transparent",
                background: `linear-gradient(135deg,${th.primary},${th.secondary})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                boxShadow: form.theme === key ? "0 0 12px rgba(255,255,255,.4)" : "none",
                transition: "all 0.2s",
              }}>{th.icon}</button>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div style={{ marginBottom: 14 }}>
          <span style={labelStyle}>ФОТО ИГРОКА</span>
          <div onClick={() => editorPhotoRef.current?.click()} style={{
            width: "100%", height: 100, borderRadius: 10, overflow: "hidden",
            border: `1px dashed ${t.primary}50`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: form.photo ? "transparent" : "rgba(255,255,255,.03)",
            position: "relative",
          }}>
            {form.photo ? (
              <img src={form.photo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
                <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 10, color: `${t.primary}66`, letterSpacing: 2 }}>
                  НАЖМИ ЧТОБЫ ЗАГРУЗИТЬ
                </span>
              </div>
            )}
          </div>
          <input ref={editorPhotoRef} type="file" accept="image/*" onChange={handleEditorPhoto} style={{ display: "none" }} />
          {form.photo && (
            <button onClick={() => setForm(f => ({ ...f, photo: null }))} style={{
              marginTop: 6, background: "rgba(255,50,50,.12)", border: "1px solid rgba(255,50,50,.25)",
              borderRadius: 6, padding: "4px 12px", color: "#ff6b6b",
              fontFamily: "'Oswald',sans-serif", fontSize: 9, letterSpacing: 1, cursor: "pointer",
            }}>✕ УДАЛИТЬ ФОТО</button>
          )}
        </div>

        {/* Player info */}
        {sectionTitle("Игрок")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div><span style={labelStyle}>ИМЯ</span><input style={inputStyle} value={form.first} onChange={e => setForm(f => ({ ...f, first: e.target.value }))} placeholder="Имя" /></div>
          <div><span style={labelStyle}>ФАМИЛИЯ</span><input style={inputStyle} value={form.last} onChange={e => setForm(f => ({ ...f, last: e.target.value }))} placeholder="Фамилия" /></div>
          <div><span style={labelStyle}>ПОЗИЦИЯ</span>
            <select value={form.pos} onChange={e => setForm(f => ({ ...f, pos: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
              {POSITIONS.map(p => <option key={p} value={p} style={{ background: "#1a2332" }}>{p}</option>)}
            </select>
          </div>
          <div><span style={labelStyle}>КЛУБ / НОМЕР</span><input style={inputStyle} value={form.club} onChange={e => setForm(f => ({ ...f, club: e.target.value }))} placeholder="FC Team · #10" /></div>
        </div>

        {/* Personal */}
        {sectionTitle("Личные данные")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div><span style={labelStyle}>ДАТА РОЖДЕНИЯ</span><input style={inputStyle} value={form.info.dob} onChange={e => setInfo("dob", e.target.value)} placeholder="01.01.2017" /></div>
          <div><span style={labelStyle}>ВОЗРАСТ</span><input style={inputStyle} value={form.info.age} onChange={e => setInfo("age", e.target.value)} placeholder="8 лет" /></div>
          <div><span style={labelStyle}>НОГА</span><input style={inputStyle} value={form.info.foot} onChange={e => setInfo("foot", e.target.value)} placeholder="Правая" /></div>
          <div><span style={labelStyle}>РОСТ</span><input style={inputStyle} value={form.info.height} onChange={e => setInfo("height", e.target.value)} placeholder="125 см" /></div>
          <div><span style={labelStyle}>НОМЕР</span><input style={inputStyle} value={form.info.number} onChange={e => setInfo("number", e.target.value)} placeholder="#10" /></div>
        </div>

        {/* Stats */}
        {sectionTitle("Статистика (0–99)")}
        <div style={{ marginBottom: 14 }}>
          {Object.entries(STAT_LABELS).map(([key, label]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: t.primary, width: 32, flexShrink: 0 }}>{label}</span>
              <input type="range" min="0" max="99" value={form.stats[key]}
                onChange={e => setStat(key, e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "#fff", width: 28, textAlign: "right", flexShrink: 0 }}>
                {form.stats[key]}
              </span>
            </div>
          ))}
        </div>

        {/* Awards */}
        {sectionTitle("Награды")}
        <div style={{ marginBottom: 14 }}>
          {form.awards.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={a}
                onChange={e => { const arr = [...form.awards]; arr[i] = e.target.value; setForm(f => ({ ...f, awards: arr })); }}
                placeholder="Награда..."
              />
              <button onClick={() => setForm(f => ({ ...f, awards: f.awards.filter((_, j) => j !== i) }))} style={{
                background: "rgba(255,50,50,.15)", border: "1px solid rgba(255,50,50,.3)", borderRadius: 8,
                color: "#ff6b6b", width: 36, cursor: "pointer", fontSize: 14,
              }}>✕</button>
            </div>
          ))}
          {form.awards.length < 5 && (
            <button onClick={() => setForm(f => ({ ...f, awards: [...f.awards, ""] }))} style={{
              background: "rgba(255,255,255,.03)", border: `1px dashed ${t.primary}40`,
              borderRadius: 8, padding: "8px 16px", color: `${t.primary}88`, width: "100%",
              fontFamily: "'Oswald',sans-serif", fontSize: 10, letterSpacing: 2, cursor: "pointer",
            }}>+ ДОБАВИТЬ НАГРАДУ</button>
          )}
        </div>

        {/* Quote */}
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>ЦИТАТА</span>
          <input style={inputStyle} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="Мотивационная цитата..." />
        </div>

        {/* Save */}
        <button onClick={handleSave} style={{
          width: "100%", padding: 16, border: "none", borderRadius: 12,
          background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
          color: t.dark1, fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3,
          cursor: "pointer", boxShadow: `0 4px 18px ${t.primary}44`, fontWeight: 700,
        }}>✔ {isNew ? "СОЗДАТЬ КАРТОЧКУ" : "СОХРАНИТЬ"}</button>
      </div>
    </div>
  );
}
