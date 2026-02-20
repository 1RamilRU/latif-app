import React, { useState, useRef } from 'react';
import { THEMES, STAT_LABELS, SKILL_NAMES } from '../data/constants';
import { getRating, getPositionEmoji } from '../utils/helpers';

export default function PlayerCard({
  player, size = "normal", onClick,
  flipped: externalFlipped, interactive = true, onPhotoChange
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = externalFlipped !== undefined ? externalFlipped : internalFlipped;
  const t = THEMES[player.theme] || THEMES.gold;
  const rating = getRating(player.stats);
  const photoInputRef = useRef(null);

  const scale = size === "small" ? 0.55 : size === "medium" ? 0.75 : 1;
  const w = 300 * scale;
  const h = 490 * scale;
  const fs = (base) => Math.round(base * scale);

  const handleClick = () => {
    if (onClick) onClick(player);
    else if (interactive) setInternalFlipped(!flipped);
  };

  const handlePhotoClick = (e) => {
    if (onPhotoChange && size === "normal") {
      e.stopPropagation();
      photoInputRef.current?.click();
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onPhotoChange?.(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const cardStyle = {
    width: w, height: h, position: "relative",
    cursor: interactive || onClick ? "pointer" : "default",
    perspective: "1200px", flexShrink: 0,
  };

  const faceBase = {
    position: "absolute", inset: 0, borderRadius: 16 * scale,
    overflow: "hidden", transition: "transform 0.8s cubic-bezier(.4,.2,.2,1)",
    backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    boxShadow: `0 0 0 ${1.5 * scale}px ${t.primary},
                0 0 ${40 * scale}px ${t.primary}44,
                0 ${20 * scale}px ${50 * scale}px rgba(0,0,0,.9)`,
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      {/* ═══ FRONT ═══ */}
      <div style={{
        ...faceBase,
        transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)",
        display: "flex", flexDirection: "column", background: "#fff",
        zIndex: flipped ? 1 : 2,
      }}>
        {/* Shimmer overlay */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16 * scale,
          pointerEvents: "none", zIndex: 20,
          background: `linear-gradient(115deg,
            transparent 0%, transparent 38%,
            rgba(255,230,80,.15) 46%, rgba(255,255,255,.3) 50%,
            rgba(255,230,80,.15) 54%, transparent 62%, transparent 100%)`,
          backgroundSize: "250% 250%",
          animation: "shimmer 4s ease-in-out infinite",
        }} />

        {/* Header */}
        <div style={{
          height: 58 * scale, flexShrink: 0,
          background: `linear-gradient(135deg,${t.dark2} 0%,${t.dark1} 50%,${t.dark2} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: `0 ${12 * scale}px`, position: "relative",
        }}>
          <div style={{
            width: 40 * scale, height: 40 * scale, background: "#fff", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs(18),
          }}>⚽</div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(10),
              letterSpacing: 4 * scale, color: t.primary, display: "block",
            }}>
              {player.club.split("·")[0]?.trim() || "ACADEMY"}
            </span>
            <span style={{
              fontFamily: "'Oswald',sans-serif", fontSize: fs(8),
              color: "rgba(255,255,255,.4)", letterSpacing: 3 * scale,
            }}>SEASON 2025/2026</span>
          </div>

          <div style={{
            background: `linear-gradient(135deg,${t.primary},${t.secondary},${t.primary})`,
            borderRadius: 9 * scale, padding: `${4 * scale}px ${9 * scale}px`, textAlign: "center",
          }}>
            <span style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(26),
              color: t.dark1, lineHeight: 1, display: "block",
            }}>{rating}</span>
            <span style={{
              fontFamily: "'Oswald',sans-serif", fontSize: fs(8),
              fontWeight: 700, color: t.dark1, letterSpacing: 2 * scale,
            }}>{player.pos}</span>
          </div>

          {/* Header bottom line */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2 * scale,
            background: `linear-gradient(90deg,transparent,${t.primary},${t.secondary},${t.primary},transparent)`,
          }} />
        </div>

        {/* Photo area */}
        <div onClick={handlePhotoClick} style={{
          flex: 1, overflow: "hidden", position: "relative",
          background: player.photo ? "transparent" : `linear-gradient(180deg, ${t.dark1}15 0%, ${t.primary}08 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: onPhotoChange && size === "normal" ? "pointer" : "inherit",
        }}>
          {player.photo ? (
            <img src={player.photo} alt={player.first}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 * scale }}>
              <span style={{ fontSize: fs(50), opacity: 0.5, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))" }}>
                {getPositionEmoji(player.pos)}
              </span>
              {onPhotoChange && size === "normal" && (
                <span style={{
                  fontFamily: "'Oswald',sans-serif", fontSize: fs(9),
                  color: "rgba(0,0,0,.3)", letterSpacing: 2,
                }}>📷 ДОБАВИТЬ ФОТО</span>
              )}
            </div>
          )}
          {player.photo && onPhotoChange && size === "normal" && (
            <div style={{
              position: "absolute", bottom: 6, right: 6,
              background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "3px 8px",
              backdropFilter: "blur(4px)",
            }}>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 8, color: "#fff", letterSpacing: 1 }}>📷</span>
            </div>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
        </div>

        {/* Name */}
        <div style={{
          flexShrink: 0, textAlign: "center", position: "relative",
          background: `linear-gradient(135deg,${t.dark1} 0%,${t.dark2} 50%,${t.dark1} 100%)`,
          padding: `${9 * scale}px ${12 * scale}px ${7 * scale}px`,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2 * scale,
            background: `linear-gradient(90deg,transparent,${t.primary},${t.secondary},${t.primary},transparent)`,
          }} />
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(32), color: "#fff",
            letterSpacing: 5 * scale, lineHeight: 1, display: "block",
          }}>{player.first}</span>
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(13), color: t.primary,
            letterSpacing: 3 * scale, lineHeight: 1, display: "block", marginTop: 2 * scale,
          }}>{player.last}</span>
          {player.level > 1 && (
            <span style={{
              fontFamily: "'Oswald',sans-serif", fontSize: fs(8), color: t.secondary,
              letterSpacing: 2 * scale, display: "block", marginTop: 2 * scale,
            }}>★ LVL {player.level}</span>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          flexShrink: 0, background: "#f8f6f2", display: "flex",
          borderTop: `2px solid ${t.primary}40`,
        }}>
          {Object.entries(STAT_LABELS).map(([key, label]) => (
            <div key={key} style={{
              flex: 1, padding: `${5 * scale}px ${2 * scale}px ${4 * scale}px`,
              textAlign: "center", borderRight: `1px solid ${t.primary}30`,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(18),
                color: t.dark1, lineHeight: 1, display: "block",
              }}>{player.stats[key]}</span>
              <span style={{
                fontFamily: "'Oswald',sans-serif", fontSize: fs(7), fontWeight: 700,
                color: t.primary, letterSpacing: scale, display: "block",
              }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0, textAlign: "center",
          background: `linear-gradient(135deg,${t.primary},${t.secondary},${t.primary})`,
          padding: 4 * scale,
        }}>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: fs(7), fontWeight: 700,
            color: t.dark1, letterSpacing: 3 * scale,
          }}>{player.club}</span>
        </div>
      </div>

      {/* ═══ BACK ═══ */}
      <div style={{
        ...faceBase,
        transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
        display: "flex", flexDirection: "column",
        zIndex: flipped ? 2 : 1,
        background: `linear-gradient(160deg,${t.dark1} 0%,${t.dark2} 50%,${t.dark1} 100%)`,
      }}>
        {/* Back header */}
        <div style={{
          background: `linear-gradient(135deg,${t.primary},${t.secondary},${t.primary})`,
          padding: `${10 * scale}px ${12 * scale}px`, textAlign: "center", flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(17),
            color: t.dark1, letterSpacing: 5 * scale, display: "block",
          }}>🏆 ПРОФИЛЬ ИГРОКА</span>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: fs(7),
            color: `${t.dark1}99`, letterSpacing: 3 * scale,
          }}>ACADEMY CARD · LVL {player.level}</span>
        </div>

        {/* Info & Awards panels */}
        <div style={{
          flex: 1, padding: 10 * scale, display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: 8 * scale, overflow: "hidden",
        }}>
          {/* Info */}
          <div style={{
            background: "rgba(255,255,255,.05)",
            border: `1px solid ${t.primary}`, borderRadius: 9 * scale, padding: 8 * scale,
          }}>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(11),
              color: t.primary, letterSpacing: 3 * scale, textAlign: "center",
              borderBottom: `1px solid ${t.primary}`, paddingBottom: 4 * scale, marginBottom: 7 * scale,
            }}>INFO</div>
            {[
              ["Имя", `${player.first} ${player.last.charAt(0)}.`],
              ["Д.Р.", player.info?.dob || "—"],
              ["Возраст", player.info?.age || "—"],
              ["Клуб", player.club.split("·")[0]?.trim() || "—"],
              ["Номер", player.info?.number || "—"],
              ["Нога", player.info?.foot || "—"],
              ["Рост", player.info?.height || "—"],
              ["Поз.", player.pos],
            ].map(([label, value], i) => (
              <div key={i} style={{ marginBottom: 4 * scale }}>
                <span style={{
                  fontFamily: "'Oswald',sans-serif", fontSize: fs(7), color: t.primary,
                  letterSpacing: 2 * scale, fontWeight: 600, display: "block", textTransform: "uppercase",
                }}>{label}</span>
                <span style={{
                  fontFamily: "'Rajdhani',sans-serif", fontSize: fs(11), color: "#fff",
                  fontWeight: 600, display: "block", lineHeight: 1.2,
                }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Awards */}
          <div style={{
            background: "rgba(255,255,255,.05)",
            border: `1px solid ${t.primary}`, borderRadius: 9 * scale, padding: 8 * scale,
          }}>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(11),
              color: t.primary, letterSpacing: 3 * scale, textAlign: "center",
              borderBottom: `1px solid ${t.primary}`, paddingBottom: 4 * scale, marginBottom: 7 * scale,
            }}>НАГРАДЫ</div>
            {(player.awards || []).slice(0, 5).map((award, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5 * scale, marginBottom: 6 * scale }}>
                <div style={{
                  width: 18 * scale, height: 18 * scale, minWidth: 18 * scale,
                  background: `linear-gradient(135deg,${t.primary},${t.secondary})`,
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: fs(9),
                }}>
                  {["★", "⚡", "♛", "🏅", "❤"][i % 5]}
                </div>
                <span style={{
                  fontFamily: "'Rajdhani',sans-serif", fontSize: fs(10),
                  color: "rgba(255,255,255,.85)", lineHeight: 1.3, fontWeight: 600,
                }}>{award}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill bars */}
        <div style={{ padding: `0 ${10 * scale}px ${8 * scale}px`, flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(10), color: t.primary,
            letterSpacing: 3 * scale, textAlign: "center", marginBottom: 5 * scale,
          }}>⚡ TOP SKILLS</div>
          {["dri", "pac", "pas", "sho"].map(key => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 * scale, marginBottom: 4 * scale }}>
              <span style={{
                fontFamily: "'Oswald',sans-serif", fontSize: fs(8),
                color: "rgba(255,255,255,.6)", width: 48 * scale, textAlign: "right",
              }}>{SKILL_NAMES[key]}</span>
              <div style={{
                flex: 1, height: 5 * scale, background: "rgba(255,255,255,.1)",
                borderRadius: 3 * scale, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 3 * scale,
                  background: `linear-gradient(90deg,${t.primary},${t.secondary})`,
                  width: flipped ? `${player.stats[key]}%` : "0%",
                  transition: "width 1.3s ease",
                }} />
              </div>
              <span style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: fs(11),
                color: t.primary, width: 22 * scale,
              }}>{player.stats[key]}</span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{
          flexShrink: 0, textAlign: "center",
          background: `linear-gradient(135deg,${t.primary},${t.secondary},${t.primary})`,
          padding: `${6 * scale}px ${12 * scale}px`,
        }}>
          <span style={{
            fontFamily: "'Oswald',sans-serif", fontSize: fs(9), fontWeight: 700,
            color: t.dark1, letterSpacing: 2 * scale, fontStyle: "italic",
          }}>"{player.quote}"</span>
        </div>
      </div>
    </div>
  );
}
