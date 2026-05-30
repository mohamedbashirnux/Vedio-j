import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { GlowingRoute } from "../components/GlowingRoute";
import { GPSPin, SpeedBadge, ScanLine } from "../components/HUDElements";

// Moving car dot on route
const MovingDot: React.FC<{
  points: { x: number; y: number }[];
  startFrame: number;
  duration: number;
  color?: string;
}> = ({ points, startFrame, duration, color = "#00BFFF" }) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const progress = interpolate(lf, [0, duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  if (points.length < 2) return null;
  const total = points.length - 1;
  const drawn = progress * total;
  const idx = Math.min(Math.floor(drawn), total - 1);
  const t = drawn - idx;
  const p1 = points[idx];
  const p2 = points[idx + 1];
  const cx = p1.x + (p2.x - p1.x) * t;
  const cy = p1.y + (p2.y - p1.y) * t;

  const pulse = 1 + 0.3 * Math.sin((frame * Math.PI) / 12);

  return (
    <g>
      <circle cx={cx} cy={cy} r={14 * pulse} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.9} />
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
};

// AI detection animation
const AIDetectionBox: React.FC<{ x: number; y: number; w: number; h: number; startFrame: number }> = ({
  x, y, w, h, startFrame
}) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const sc = spring({ frame: lf, fps: 30, config: { damping: 10, stiffness: 200, mass: 0.6 } });
  const opacity = interpolate(lf, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanY = interpolate(lf % 40, [0, 40], [y, y + h], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={opacity} transform={`scale(${sc}) translate(${x * (1 - sc)}, ${y * (1 - sc)})`}>
      {/* Box */}
      <rect x={x} y={y} width={w} height={h} fill="rgba(232,40,30,0.1)" stroke="#E8281E" strokeWidth={1.5} rx={4} />
      {/* Corner brackets */}
      <path d={`M ${x} ${y + 10} L ${x} ${y} L ${x + 10} ${y}`} fill="none" stroke="#E8281E" strokeWidth={2} />
      <path d={`M ${x + w - 10} ${y} L ${x + w} ${y} L ${x + w} ${y + 10}`} fill="none" stroke="#E8281E" strokeWidth={2} />
      <path d={`M ${x} ${y + h - 10} L ${x} ${y + h} L ${x + 10} ${y + h}`} fill="none" stroke="#E8281E" strokeWidth={2} />
      <path d={`M ${x + w - 10} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - 10}`} fill="none" stroke="#E8281E" strokeWidth={2} />
      {/* Scan line */}
      <line x1={x + 2} y1={scanY} x2={x + w - 2} y2={scanY} stroke="#E8281E" strokeWidth={1} opacity={0.6} />
      {/* Label */}
      <rect x={x} y={y - 18} width={80} height={16} rx={3} fill="#E8281E" />
      <text x={x + 4} y={y - 6} fill="white" fontSize={9} fontFamily="monospace">JAM DETECTED</text>
    </g>
  );
};

export const Scene3SmartRouting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Map zoom/pan
  const mapScale = interpolate(frame, [0, 200], [1.15, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const mapX = interpolate(frame, [0, 200], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Route points
  const blockedRoute = [
    { x: 80, y: 360 }, { x: 300, y: 360 }, { x: 500, y: 360 },
    { x: 640, y: 360 }, { x: 800, y: 360 }, { x: 1000, y: 360 }, { x: 1200, y: 360 },
  ];

  const smartRoute = [
    { x: 80, y: 360 }, { x: 200, y: 360 }, { x: 200, y: 200 },
    { x: 400, y: 200 }, { x: 600, y: 200 }, { x: 800, y: 200 },
    { x: 1000, y: 200 }, { x: 1000, y: 360 }, { x: 1200, y: 360 },
  ];

  // Text animations
  const texts = [
    { text: "Avoid traffic before you reach it.", frame: 40, color: "#FFFFFF" },
    { text: "Smarter routes. Faster arrival.", frame: 80, color: "#FF6B00" },
    { text: "AI-powered navigation.", frame: 120, color: "#00BFFF" },
  ];

  // Feature icons
  const icons = [
    { icon: "📍", label: "GPS Tracking", x: 40, y: 80, delay: 20 },
    { icon: "🤖", label: "AI Routing", x: 40, y: 160, delay: 30 },
    { icon: "⚡", label: "Real-time", x: 40, y: 240, delay: 40 },
    { icon: "🛣️", label: "Smart Roads", x: 40, y: 320, delay: 50 },
  ];

  return (
    <div style={{
      width, height,
      background: "#080810",
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Map */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${mapScale}) translateX(${mapX}px)`,
        transformOrigin: "center center",
      }}>
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Road grid */}
          <rect x={0} y={330} width={1280} height={60} fill="#111118" />
          <rect x={0} y={170} width={1280} height={50} fill="#111118" />
          <rect x={0} y={480} width={1280} height={50} fill="#111118" />
          <rect x={0} y={580} width={1280} height={40} fill="#111118" />
          <rect x={170} y={0} width={50} height={720} fill="#111118" />
          <rect x={370} y={0} width={50} height={720} fill="#111118" />
          <rect x={570} y={0} width={50} height={720} fill="#111118" />
          <rect x={770} y={0} width={50} height={720} fill="#111118" />
          <rect x={970} y={0} width={50} height={720} fill="#111118" />
          <rect x={1170} y={0} width={50} height={720} fill="#111118" />

          {/* Road dashes */}
          {[355, 195, 505].map((y, i) => (
            <line key={i} x1={0} y1={y} x2={1280} y2={y} stroke="#1a1a28" strokeWidth={1.5} strokeDasharray="20,14" />
          ))}

          {/* Congestion on blocked route */}
          {frame > 5 && (
            <>
              <rect x={300} y={330} width={500} height={60} fill="rgba(232,40,30,0.25)" rx={2} />
              <rect x={300} y={330} width={500} height={60} fill="url(#jamGrad)" rx={2} />
            </>
          )}

          <defs>
            <linearGradient id="jamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8281E" stopOpacity="0" />
              <stop offset="30%" stopColor="#E8281E" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#E8281E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E8281E" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* AI detection boxes */}
          {frame > 8 && <AIDetectionBox x={310} y={332} w={180} h={56} startFrame={8} />}
          {frame > 15 && <AIDetectionBox x={560} y={332} w={160} h={56} startFrame={15} />}
          {frame > 22 && <AIDetectionBox x={720} y={332} w={140} h={56} startFrame={22} />}

          {/* Blocked route */}
          <GlowingRoute
            points={blockedRoute}
            color="#E8281E"
            width={4}
            startFrame={5}
            duration={25}
            glowIntensity={8}
          />

          {/* X marks on blocked route */}
          {frame > 30 && [500, 640, 780].map((x, i) => {
            const lf = Math.max(0, frame - (30 + i * 5));
            const sc = spring({ frame: lf, fps, config: { damping: 8, stiffness: 300, mass: 0.4 } });
            const op = interpolate(lf, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={i} transform={`translate(${x}, 360) scale(${sc})`} opacity={op}>
                <circle r={14} fill="#E8281E" opacity={0.9} />
                <line x1={-7} y1={-7} x2={7} y2={7} stroke="white" strokeWidth={2.5} strokeLinecap="round" />
                <line x1={7} y1={-7} x2={-7} y2={7} stroke="white" strokeWidth={2.5} strokeLinecap="round" />
              </g>
            );
          })}

          {/* Smart blue route */}
          <GlowingRoute
            points={smartRoute}
            color="#00BFFF"
            width={5}
            startFrame={30}
            duration={35}
            glowIntensity={14}
            animated
          />

          {/* Moving car on smart route */}
          {frame > 65 && (
            <MovingDot points={smartRoute} startFrame={65} duration={120} color="#00BFFF" />
          )}

          {/* GPS pins */}
          <GPSPin cx={80} cy={360} color="#FF6B00" startFrame={0} label="You" size={0.9} />
          <GPSPin cx={1200} cy={360} color="#00BFFF" startFrame={35} label="Dest" size={0.9} />

          {/* Speed indicator on smart route */}
          {frame > 70 && (
            <g>
              <rect x={850} y={140} width={90} height={40} rx={8} fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.4)" strokeWidth={1} />
              <text x={895} y={157} textAnchor="middle" fill="#00BFFF" fontSize={10} fontFamily="monospace">FASTER</text>
              <text x={895} y={172} textAnchor="middle" fill="#00BFFF" fontSize={14} fontWeight="bold" fontFamily="monospace">+12 MIN</text>
            </g>
          )}
        </svg>
      </div>

      {/* Left feature icons */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 160, background: "rgba(8,8,16,0.85)", borderRight: "1px solid rgba(0,191,255,0.15)" }}>
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ color: "rgba(0,191,255,0.6)", fontSize: 9, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>FEATURES</div>
          {icons.map(({ icon, label, delay }, i) => {
            const lf = Math.max(0, frame - delay);
            const opacity = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = interpolate(lf, [0, 14], [-30, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.exp),
            });
            return (
              <div key={i} style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "rgba(0,191,255,0.05)",
                border: "1px solid rgba(0,191,255,0.1)",
                borderRadius: 8,
              }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Arial", fontWeight: 600 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: 180,
        right: 40,
      }}>
        {texts.map(({ text, frame: tf, color }, i) => {
          const lf = Math.max(0, frame - tf);
          const opacity = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(lf, [0, 14], [25, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.exp),
          });
          const prevOpacity = i < texts.length - 1
            ? interpolate(Math.max(0, frame - texts[i + 1].frame), [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;

          return (
            <div key={i} style={{
              position: "absolute",
              bottom: 0,
              opacity: opacity * prevOpacity,
              transform: `translateY(${y}px)`,
            }}>
              <div style={{
                color,
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: -1,
                fontFamily: "'Arial Black', sans-serif",
                textShadow: color === "#00BFFF" ? "0 0 30px rgba(0,191,255,0.5)" : color === "#FF6B00" ? "0 0 30px rgba(255,107,0,0.5)" : "none",
              }}>
                {text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed badge */}
      <SpeedBadge speed={85} startFrame={70} x={1100} y={60} />

      {/* Scan line */}
      <ScanLine opacity={0.04} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 60% 50%, transparent 40%, rgba(8,8,16,0.6) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
