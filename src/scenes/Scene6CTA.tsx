import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { ScanLine } from "../components/HUDElements";

// App store badge
const StoreBadge: React.FC<{ type: "apple" | "google"; startFrame: number; x: number; y: number }> = ({
  type, startFrame, x, y
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);
  const sc = spring({ frame: lf, fps, config: { damping: 10, stiffness: 200, mass: 0.7 } });
  const opacity = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${sc})`,
      opacity,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 14,
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 160,
      backdropFilter: "blur(10px)",
      cursor: "pointer",
    }}>
      <div style={{ fontSize: 28 }}>{type === "apple" ? "🍎" : "▶"}</div>
      <div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "Arial", letterSpacing: 1 }}>
          {type === "apple" ? "Download on the" : "Get it on"}
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Arial", letterSpacing: 0.3 }}>
          {type === "apple" ? "App Store" : "Google Play"}
        </div>
      </div>
    </div>
  );
};

// Floating city light particle
const CityLight: React.FC<{ x: number; y: number; size: number; color: string; speed: number; frame: number }> = ({
  x, y, size, color, speed, frame
}) => {
  const fy = ((y + frame * speed) % 100);
  const opacity = 0.1 + 0.15 * Math.sin(frame * 0.05 + x);
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      top: `${fy}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      opacity,
      filter: `blur(${size * 0.5}px)`,
    }} />
  );
};

// Full phone app screen for CTA
const CTAAppScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const mapAnim = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#080812",
      position: "relative",
      overflow: "hidden",
      paddingTop: 40,
    }}>
      {/* Status bar */}
      <div style={{
        position: "absolute", top: 40, left: 12, right: 12,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontFamily: "monospace" }}>9:41</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontFamily: "monospace" }}>●●● 100%</span>
      </div>

      {/* Map */}
      <div style={{ opacity: mapAnim }}>
        <svg width={228} height={220} style={{ position: "absolute", top: 55, left: 0 }}>
          <rect width={228} height={220} fill="#0a0a14" />
          {/* Roads */}
          <rect x={0} y={90} width={228} height={28} fill="#141420" />
          <rect x={0} y={150} width={228} height={20} fill="#141420" />
          <rect x={90} y={0} width={28} height={220} fill="#141420" />
          <rect x={170} y={0} width={22} height={220} fill="#141420" />
          {/* Blue route */}
          <path d="M 10 104 L 90 104 L 90 60 L 170 60 L 220 60"
            fill="none" stroke="#00BFFF" strokeWidth={3} strokeLinecap="round" />
          <path d="M 10 104 L 90 104 L 90 60 L 170 60 L 220 60"
            fill="none" stroke="#00BFFF" strokeWidth={8} strokeLinecap="round" opacity={0.2} />
          {/* Jam */}
          <rect x={90} y={90} width={80} height={28} fill="rgba(232,40,30,0.35)" rx={2} />
          {/* Moving dot */}
          <circle
            cx={10 + (frame * 2) % 210}
            cy={104}
            r={5}
            fill="#FF6B00"
          />
          <circle
            cx={10 + (frame * 2) % 210}
            cy={104}
            r={10}
            fill="#FF6B00"
            opacity={0.2}
          />
        </svg>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 60,
        background: "rgba(10,10,20,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 10px",
      }}>
        {["🗺️", "⚠️", "⛽", "👤"].map((icon, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <div style={{
              width: i === 0 ? 20 : 4,
              height: 2,
              background: i === 0 ? "#FF6B00" : "transparent",
              borderRadius: 1,
            }} />
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {frame > 20 && (
        <div style={{
          position: "absolute",
          top: 280,
          left: 8, right: 8,
          background: "rgba(232,40,30,0.15)",
          border: "1px solid rgba(232,40,30,0.4)",
          borderRadius: 10,
          padding: "8px 12px",
          opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ color: "#E8281E", fontSize: 10, fontWeight: 700, fontFamily: "Arial" }}>⚠️ Jaam ahead — 320m</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "Arial", marginTop: 2 }}>Rerouting via faster road</div>
        </div>
      )}
    </div>
  );
};

export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // City lights
  const lights = Array.from({ length: 25 }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: (i * 73.1) % 100,
    size: 2 + (i % 4) * 3,
    color: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#00BFFF" : "#ffffff",
    speed: 0.05 + (i % 5) * 0.02,
  }));

  // Logo reveal
  const logoScale = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, stiffness: 120, mass: 1.1 } });
  const logoOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ring rotation
  const ring1 = frame * 1.2;
  const ring2 = -frame * 0.8;

  // Main text
  const title1Opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const title1Y = interpolate(frame, [20, 35], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const title2Opacity = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const title2Y = interpolate(frame, [35, 50], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const title3Opacity = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const title3Y = interpolate(frame, [50, 65], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // CTA button pulse
  const btnPulse = 1 + 0.05 * Math.sin((frame * Math.PI) / 18);
  const btnOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnScale = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 8, stiffness: 200, mass: 0.7 } });

  return (
    <div style={{
      width, height,
      background: "#060610",
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Animated city lights background */}
      {lights.map((l, i) => (
        <CityLight key={i} {...l} frame={frame} />
      ))}

      {/* Radial glow */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: 800, height: 800,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, rgba(0,191,255,0.05) 40%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* Grid */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, opacity: 0.06 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 42} x2={1280} y2={i * 42} stroke="#00BFFF" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 32 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 42} y1={0} x2={i * 42} y2={720} stroke="#00BFFF" strokeWidth={0.5} />
        ))}
      </svg>

      {/* Left — Logo + rings */}
      <div style={{
        position: "absolute",
        left: 140,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Rings */}
        <svg width={260} height={260} style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <circle cx={130} cy={130} r={115} fill="none" stroke="rgba(255,107,0,0.12)" strokeWidth={1} />
          <circle cx={130} cy={130} r={95} fill="none" stroke="rgba(0,191,255,0.08)" strokeWidth={1} />
          <circle cx={130} cy={130} r={115} fill="none" stroke="#FF6B00" strokeWidth={1.5}
            strokeDasharray="6,14" opacity={0.5}
            transform={`rotate(${ring1}, 130, 130)`}
          />
          <circle cx={130} cy={130} r={95} fill="none" stroke="#00BFFF" strokeWidth={1}
            strokeDasharray="4,16" opacity={0.4}
            transform={`rotate(${ring2}, 130, 130)`}
          />
          {/* Orbit dots */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = ((angle + ring1) * Math.PI) / 180;
            const dx = 130 + 115 * Math.cos(rad);
            const dy = 130 + 115 * Math.sin(rad);
            return <circle key={angle} cx={dx} cy={dy} r={3} fill="#FF6B00" opacity={0.7} />;
          })}
        </svg>

        {/* Logo */}
        <div style={{
          width: 90,
          height: 90,
          background: "linear-gradient(135deg, #FF6B00 0%, #E8281E 100%)",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 80px rgba(255,107,0,0.5), 0 0 160px rgba(255,107,0,0.2)",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          position: "relative",
          zIndex: 2,
        }}>
          <svg width={50} height={50} viewBox="0 0 40 40">
            <path d="M20 3 C11 3 4 10 4 19 C4 30 20 39 20 39 C20 39 36 30 36 19 C36 10 29 3 20 3Z" fill="white" />
            <circle cx={20} cy={19} r={7} fill="#FF6B00" />
            <circle cx={20} cy={19} r={3} fill="white" />
          </svg>
        </div>
      </div>

      {/* Center text */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-20%, -50%)",
        textAlign: "center",
      }}>
        <div style={{ opacity: title1Opacity, transform: `translateY(${title1Y}px)`, marginBottom: 4 }}>
          <div style={{
            background: "linear-gradient(90deg, #FF6B00, #E8281E, #FF6B00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1,
            fontFamily: "'Arial Black', sans-serif",
          }}>JaamAlert</div>
        </div>

        <div style={{ opacity: title2Opacity, transform: `translateY(${title2Y}px)`, marginBottom: 16 }}>
          <div style={{
            color: "#FFFFFF",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 2,
            fontFamily: "'Arial Black', sans-serif",
            textTransform: "uppercase",
          }}>Escape the Jam.</div>
        </div>

        <div style={{ opacity: title3Opacity, transform: `translateY(${title3Y}px)`, marginBottom: 40 }}>
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: 4,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
          }}>Navigate Smarter.</div>
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: btnOpacity,
          transform: `scale(${btnScale * btnPulse})`,
          display: "inline-block",
          marginBottom: 30,
        }}>
          <div style={{
            background: "linear-gradient(90deg, #FF6B00, #E8281E)",
            borderRadius: 50,
            padding: "18px 52px",
            boxShadow: "0 0 40px rgba(255,107,0,0.5), 0 8px 30px rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}>
            <span style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 1,
              fontFamily: "'Arial Black', sans-serif",
            }}>Download Free →</span>
          </div>
        </div>

        {/* Store badges */}
        <div style={{ position: "relative", height: 60 }}>
          <StoreBadge type="apple" startFrame={100} x={-180} y={0} />
          <StoreBadge type="google" startFrame={110} x={10} y={0} />
        </div>
      </div>

      {/* Right — Phone */}
      <div style={{
        position: "absolute",
        right: 100,
        top: "50%",
        transform: "translateY(-50%)",
      }}>
        <PhoneFrame startFrame={5} glowColor="#FF6B00" scale={1.05}>
          <CTAAppScreen frame={Math.max(0, frame - 5)} />
        </PhoneFrame>
      </div>

      {/* Bottom tagline */}
      {frame > 120 && (
        <div style={{
          position: "absolute",
          bottom: 30,
          left: 0, right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}>
            Built for Mogadishu • Smart Navigation • Free Download
          </div>
        </div>
      )}

      <ScanLine opacity={0.04} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 45%, rgba(6,6,16,0.7) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
