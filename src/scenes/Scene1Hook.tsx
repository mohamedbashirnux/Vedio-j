import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { KineticText } from "../components/KineticText";
import { ScanLine } from "../components/HUDElements";

// Animated car on road
const AnimatedCar: React.FC<{ startX: number; endX: number; y: number; startFrame: number; duration: number; color?: string }> = ({
  startX, endX, y, startFrame, duration, color = "#2a2a2a"
}) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const x = interpolate(lf, [0, duration], [startX, endX], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const opacity = interpolate(lf, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <rect x={-20} y={-10} width={40} height={20} rx={5} fill={color} />
      <rect x={-13} y={-17} width={26} height={12} rx={4} fill={color === "#2a2a2a" ? "#333" : "#555"} />
      <rect x={16} y={-7} width={6} height={5} rx={1} fill="#ffffaa" opacity={0.7} />
      <rect x={16} y={2} width={6} height={5} rx={1} fill="#ffffaa" opacity={0.7} />
      <circle cx={-11} cy={10} r={5} fill="#111" stroke="#444" strokeWidth={1} />
      <circle cx={11} cy={10} r={5} fill="#111" stroke="#444" strokeWidth={1} />
    </g>
  );
};

// Congestion heat overlay
const CongestionOverlay: React.FC<{ x: number; y: number; w: number; h: number; startFrame: number }> = ({
  x, y, w, h, startFrame
}) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const opacity = interpolate(lf, [0, 20], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.7 + 0.3 * Math.sin((frame * Math.PI) / 18);

  return (
    <rect x={x} y={y} width={w} height={h} rx={4}
      fill="url(#congestionGrad)"
      opacity={opacity * pulse}
    />
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Camera zoom effect
  const zoom = interpolate(frame, [0, 150], [1.08, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Map pan
  const mapX = interpolate(frame, [0, 150], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Red overlay builds up
  const redOverlay = interpolate(frame, [30, 90], [0, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      width, height,
      background: "#080810",
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Map layer */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${zoom}) translateX(${mapX}px)`,
        transformOrigin: "center center",
      }}>
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="congestionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8281E" stopOpacity="0" />
              <stop offset="50%" stopColor="#E8281E" stopOpacity="1" />
              <stop offset="100%" stopColor="#E8281E" stopOpacity="0" />
            </linearGradient>
            <filter id="mapBlur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* City block grid — dark */}
          {/* Major roads */}
          <rect x={0} y={160} width={1280} height={55} fill="#141420" />
          <rect x={0} y={310} width={1280} height={65} fill="#141420" />
          <rect x={0} y={460} width={1280} height={55} fill="#141420" />
          <rect x={0} y={580} width={1280} height={45} fill="#141420" />

          <rect x={120} y={0} width={55} height={720} fill="#141420" />
          <rect x={320} y={0} width={55} height={720} fill="#141420" />
          <rect x={560} y={0} width={65} height={720} fill="#141420" />
          <rect x={800} y={0} width={55} height={720} fill="#141420" />
          <rect x={1020} y={0} width={55} height={720} fill="#141420" />
          <rect x={1180} y={0} width={55} height={720} fill="#141420" />

          {/* City blocks */}
          {[
            [176, 0, 143, 159], [376, 0, 183, 159], [616, 0, 183, 159], [856, 0, 163, 159],
            [176, 216, 143, 93], [376, 216, 183, 93], [616, 216, 183, 93], [856, 216, 163, 93],
            [176, 376, 143, 83], [376, 376, 183, 83], [616, 376, 183, 83], [856, 376, 163, 83],
            [176, 516, 143, 63], [376, 516, 183, 63], [616, 516, 183, 63], [856, 516, 163, 63],
          ].map(([bx, by, bw, bh], i) => (
            <rect key={i} x={bx} y={by} width={bw} height={bh} fill="#0d0d18" />
          ))}

          {/* Road center lines */}
          {[187, 342, 487, 607].map((y, i) => (
            <line key={i} x1={0} y1={y} x2={1280} y2={y} stroke="#1e1e30" strokeWidth={1.5} strokeDasharray="24,16" />
          ))}
          {[147, 347, 587, 827, 1047, 1207].map((x, i) => (
            <line key={i} x1={x} y1={0} x2={x} y2={720} stroke="#1e1e30" strokeWidth={1.5} strokeDasharray="24,16" />
          ))}

          {/* Congestion overlays on roads */}
          <CongestionOverlay x={0} y={305} w={560} h={75} startFrame={20} />
          <CongestionOverlay x={560} y={305} w={720} h={75} startFrame={35} />
          <CongestionOverlay x={315} y={0} w={75} h={375} startFrame={28} />
          <CongestionOverlay x={555} y={155} w={75} h={230} startFrame={40} />

          {/* Traffic warning dots */}
          {frame > 25 && [
            [147, 342], [347, 342], [587, 342], [827, 342],
            [347, 187], [587, 187], [347, 487],
          ].map(([cx, cy], i) => {
            const lf = Math.max(0, frame - (25 + i * 5));
            const r = interpolate(lf % 40, [0, 40], [8, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const o = interpolate(lf % 40, [0, 40], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sc = spring({ frame: lf, fps: 30, config: { damping: 8, stiffness: 300, mass: 0.4 } });
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8281E" strokeWidth={1.5} opacity={o} />
                <circle cx={cx} cy={cy} r={7 * sc} fill="#E8281E" opacity={0.9 * sc} />
                <circle cx={cx} cy={cy} r={3} fill="white" opacity={sc} />
              </g>
            );
          })}
        </svg>

        {/* Cars stuck in traffic */}
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          <AnimatedCar startX={50} endX={280} y={330} startFrame={0} duration={40} color="#2a2a35" />
          <AnimatedCar startX={-30} endX={200} y={355} startFrame={5} duration={45} color="#252530" />
          <AnimatedCar startX={100} endX={310} y={330} startFrame={8} duration={50} color="#303040" />
          <AnimatedCar startX={700} endX={500} y={330} startFrame={0} duration={40} color="#2a2a35" />
          <AnimatedCar startX={900} endX={650} y={355} startFrame={3} duration={45} color="#252530" />
          <AnimatedCar startX={1100} endX={820} y={330} startFrame={6} duration={50} color="#303040" />
          {/* Stopped cars */}
          <AnimatedCar startX={310} endX={315} y={330} startFrame={40} duration={200} color="#2a2a35" />
          <AnimatedCar startX={290} endX={295} y={355} startFrame={45} duration={200} color="#252530" />
          <AnimatedCar startX={330} endX={335} y={330} startFrame={42} duration={200} color="#303040" />
          <AnimatedCar startX={500} endX={505} y={330} startFrame={40} duration={200} color="#2a2a35" />
          <AnimatedCar startX={520} endX={525} y={355} startFrame={43} duration={200} color="#252530" />
        </svg>
      </div>

      {/* Red tint overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(232, 40, 30, ${redOverlay})`,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(8,8,16,0.85) 100%)",
        pointerEvents: "none",
      }} />

      {/* Scan line */}
      <ScanLine opacity={0.06} />

      {/* HUD corner elements */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        {/* Top-left bracket */}
        {frame > 10 && (
          <g opacity={interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d="M 30 60 L 30 30 L 60 30" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <path d="M 1250 30 L 1250 30 L 1220 30" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <path d="M 1250 30 L 1250 60" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <path d="M 30 660 L 30 690 L 60 690" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <path d="M 1250 690 L 1250 660" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <path d="M 1250 690 L 1220 690" fill="none" stroke="#FF6B00" strokeWidth={2} />
            <text x={40} y={26} fill="#FF6B00" fontSize={10} fontFamily="monospace" opacity={0.7}>MOGADISHU TRAFFIC NETWORK</text>
            <text x={40} y={700} fill="#FF6B00" fontSize={10} fontFamily="monospace" opacity={0.7}>LIVE FEED • {Math.floor(frame / 30)}s</text>
          </g>
        )}
      </svg>

      {/* Main text */}
      <div style={{
        position: "absolute",
        bottom: 140,
        left: 80,
        right: 80,
      }}>
        <KineticText
          text="Jaam in Mogadishu"
          startFrame={15}
          fontSize={82}
          color="#FFFFFF"
          weight={900}
          letterSpacing={-3}
          mode="word-by-word"
          stagger={6}
          style={{ marginBottom: 4 }}
        />
        <KineticText
          text="is wasting your time."
          startFrame={30}
          fontSize={82}
          color="#FF6B00"
          weight={900}
          letterSpacing={-3}
          mode="word-by-word"
          stagger={6}
        />
      </div>

      {/* Bottom data bar */}
      {frame > 50 && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(8,8,16,0.9)",
          borderTop: "1px solid rgba(255,107,0,0.3)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          gap: 40,
          opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {[
            { label: "ACTIVE JAMS", value: "14" },
            { label: "AVG DELAY", value: "23 MIN" },
            { label: "AFFECTED ROADS", value: "8" },
            { label: "STATUS", value: "CRITICAL" },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace", letterSpacing: 1 }}>{label}</span>
              <span style={{ color: i === 3 ? "#E8281E" : "#FF6B00", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
