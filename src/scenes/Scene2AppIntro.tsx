import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { ScanLine } from "../components/HUDElements";

// App screen content
const AppScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const mapOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#080812",
      position: "relative",
      overflow: "hidden",
      paddingTop: 40,
    }}>
      {/* Status bar */}
      <div style={{
        position: "absolute", top: 40, left: 0, right: 0,
        display: "flex", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "monospace" }}>9:41</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "monospace" }}>●●●</span>
      </div>

      {/* Mini map */}
      <div style={{ opacity: mapOpacity }}>
        <svg width={228} height={200} style={{ position: "absolute", top: 55, left: 0 }}>
          {/* Map background */}
          <rect width={228} height={200} fill="#0a0a14" />
          {/* Roads */}
          <rect x={0} y={80} width={228} height={30} fill="#141420" />
          <rect x={0} y={140} width={228} height={20} fill="#141420" />
          <rect x={80} y={0} width={30} height={200} fill="#141420" />
          <rect x={160} y={0} width={25} height={200} fill="#141420" />
          {/* Glowing route */}
          <path d="M 20 95 C 60 95 60 95 80 95 C 80 95 80 60 80 40 C 80 20 120 20 160 20 C 180 20 200 20 220 20"
            fill="none" stroke="#00BFFF" strokeWidth={3} strokeLinecap="round"
            opacity={0.9}
          />
          <path d="M 20 95 C 60 95 60 95 80 95 C 80 95 80 60 80 40 C 80 20 120 20 160 20 C 180 20 200 20 220 20"
            fill="none" stroke="#00BFFF" strokeWidth={8} strokeLinecap="round"
            opacity={0.2}
          />
          {/* Jam area */}
          <rect x={80} y={80} width={80} height={30} fill="rgba(232,40,30,0.4)" rx={2} />
          <text x={120} y={100} textAnchor="middle" fill="#E8281E" fontSize={8} fontFamily="monospace">JAM</text>
          {/* GPS pin */}
          <circle cx={20} cy={95} r={5} fill="#FF6B00" />
          <circle cx={20} cy={95} r={9} fill="none" stroke="#FF6B00" strokeWidth={1.5} opacity={0.5} />
          {/* Destination */}
          <circle cx={220} cy={20} r={5} fill="#00BFFF" />
        </svg>
      </div>

      {/* App logo */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 52,
          height: 52,
          background: "linear-gradient(135deg, #FF6B00, #E8281E)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(255,107,0,0.5)",
        }}>
          <svg width={28} height={28} viewBox="0 0 40 40">
            <path d="M20 3 C11 3 4 10 4 19 C4 30 20 39 20 39 C20 39 36 30 36 19 C36 10 29 3 20 3Z" fill="white" />
            <circle cx={20} cy={19} r={7} fill="#FF6B00" />
            <circle cx={20} cy={19} r={3} fill="white" />
          </svg>
        </div>
        <div style={{
          color: "#fff",
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 2,
          fontFamily: "'Arial Black', sans-serif",
        }}>JaamAlert</div>
        <div style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 9,
          fontFamily: "monospace",
          letterSpacing: 1,
        }}>SMART NAVIGATION</div>
      </div>
    </div>
  );
};

export const Scene2AppIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat drop flash
  const beatFlash = interpolate(frame, [0, 6], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Background particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: ((i * 137.5) % 100),
    y: ((i * 97.3) % 100),
    size: 1 + (i % 3),
    speed: 0.3 + (i % 5) * 0.1,
    opacity: 0.1 + (i % 4) * 0.08,
  }));

  // Logo reveal
  const logoScale = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, stiffness: 150, mass: 1 } });
  const logoOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rotating ring
  const ringRotation = frame * 1.5;

  // Text lines
  const line1Opacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [25, 40], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const line2Opacity = interpolate(frame, [38, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [38, 55], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  return (
    <div style={{
      width, height,
      background: "#080810",
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Beat flash */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(255,107,0,${beatFlash})`,
        pointerEvents: "none",
      }} />

      {/* Animated background grid */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, opacity: 0.12 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 42} x2={1280} y2={i * 42} stroke="#00BFFF" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 32 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 42} y1={0} x2={i * 42} y2={720} stroke="#00BFFF" strokeWidth={0.5} />
        ))}
      </svg>

      {/* Floating particles */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {particles.map((p, i) => {
          const py = ((p.y + frame * p.speed * 0.3) % 100);
          return (
            <circle
              key={i}
              cx={`${p.x}%`}
              cy={`${py}%`}
              r={p.size}
              fill="#FF6B00"
              opacity={p.opacity}
            />
          );
        })}
      </svg>

      {/* Left side — logo + rings */}
      <div style={{
        position: "absolute",
        left: 120,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}>
        {/* Rotating rings */}
        <svg width={280} height={280} style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          opacity: logoOpacity,
        }}>
          <circle cx={140} cy={140} r={120} fill="none" stroke="rgba(255,107,0,0.15)" strokeWidth={1} />
          <circle cx={140} cy={140} r={100} fill="none" stroke="rgba(255,107,0,0.1)" strokeWidth={1} />
          {/* Rotating dashed ring */}
          <circle cx={140} cy={140} r={120} fill="none" stroke="#FF6B00" strokeWidth={1.5}
            strokeDasharray="8,12" opacity={0.5}
            transform={`rotate(${ringRotation}, 140, 140)`}
          />
          <circle cx={140} cy={140} r={100} fill="none" stroke="#00BFFF" strokeWidth={1}
            strokeDasharray="5,15" opacity={0.4}
            transform={`rotate(${-ringRotation * 0.7}, 140, 140)`}
          />
        </svg>

        {/* Logo icon */}
        <div style={{
          width: 100,
          height: 100,
          background: "linear-gradient(135deg, #FF6B00 0%, #E8281E 100%)",
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 60px rgba(255,107,0,0.5), 0 0 120px rgba(255,107,0,0.2)",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          position: "relative",
          zIndex: 2,
        }}>
          <svg width={56} height={56} viewBox="0 0 40 40">
            <path d="M20 3 C11 3 4 10 4 19 C4 30 20 39 20 39 C20 39 36 30 36 19 C36 10 29 3 20 3Z" fill="white" />
            <circle cx={20} cy={19} r={7} fill="#FF6B00" />
            <circle cx={20} cy={19} r={3} fill="white" />
          </svg>
        </div>
      </div>

      {/* Right side — phone */}
      <div style={{
        position: "absolute",
        right: 160,
        top: "50%",
        transform: "translateY(-50%)",
      }}>
        <PhoneFrame startFrame={8} glowColor="#FF6B00">
          <AppScreen frame={Math.max(0, frame - 8)} />
        </PhoneFrame>
      </div>

      {/* Center text */}
      <div style={{
        position: "absolute",
        left: 280,
        top: "50%",
        transform: "translateY(-50%)",
        maxWidth: 500,
      }}>
        <div style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          marginBottom: 12,
        }}>
          <div style={{
            color: "#FFFFFF",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
            fontFamily: "'Arial Black', sans-serif",
          }}>Meet</div>
          <div style={{
            background: "linear-gradient(90deg, #FF6B00, #E8281E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
            fontFamily: "'Arial Black', sans-serif",
          }}>JaamAlert.</div>
        </div>

        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
        }}>
          <div style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 3,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            borderLeft: "3px solid #FF6B00",
            paddingLeft: 16,
          }}>
            Smart Navigation<br />
            <span style={{ color: "#FF6B00" }}>for Mogadishu.</span>
          </div>
        </div>
      </div>

      {/* Scan line */}
      <ScanLine opacity={0.05} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(8,8,16,0.7) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
