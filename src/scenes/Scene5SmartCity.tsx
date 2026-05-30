import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { GlowingRoute } from "../components/GlowingRoute";
import { ScanLine } from "../components/HUDElements";

// Skyline building
const Building: React.FC<{ x: number; w: number; h: number; delay: number; color?: string }> = ({
  x, w, h, delay, color = "#0d0d1a"
}) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - delay);
  const rise = spring({ frame: lf, fps: 30, config: { damping: 14, stiffness: 80, mass: 1.2 } });
  const buildH = interpolate(rise, [0, 1], [0, h]);
  const opacity = interpolate(lf, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Window lights
  const windows = [];
  const cols = Math.floor(w / 14);
  const rows = Math.floor(h / 18);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * cols + c + delay) % 3 !== 0;
      const blink = lit && Math.sin((frame * 0.1 + r * 0.7 + c * 1.3)) > 0.7;
      windows.push({ r, c, lit: lit && !blink });
    }
  }

  return (
    <g opacity={opacity}>
      <rect x={x} y={720 - buildH} width={w} height={buildH} fill={color} />
      <rect x={x} y={720 - buildH} width={w} height={2} fill="rgba(0,191,255,0.3)" />
      {windows.map(({ r, c, lit }, i) => (
        <rect
          key={i}
          x={x + 4 + c * 14}
          y={720 - buildH + 8 + r * 18}
          width={8}
          height={10}
          rx={1}
          fill={lit ? "rgba(255,200,100,0.6)" : "rgba(0,0,0,0.3)"}
        />
      ))}
      {/* Antenna */}
      {w > 30 && (
        <line
          x1={x + w / 2} y1={720 - buildH}
          x2={x + w / 2} y2={720 - buildH - 20}
          stroke="rgba(0,191,255,0.4)" strokeWidth={1}
        />
      )}
    </g>
  );
};

// Flowing data stream
const DataStream: React.FC<{ x: number; startFrame: number }> = ({ x, startFrame }) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const opacity = interpolate(lf, [0, 20], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dots = Array.from({ length: 8 }, (_, i) => {
    const y = ((lf * 3 + i * 80) % 720);
    const o = Math.sin((lf * 0.1 + i)) * 0.5 + 0.5;
    return { y, o };
  });

  return (
    <g opacity={opacity}>
      {dots.map(({ y, o }, i) => (
        <circle key={i} cx={x} cy={y} r={2} fill="#00BFFF" opacity={o} />
      ))}
    </g>
  );
};

export const Scene5SmartCity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cinematic zoom out
  const zoom = interpolate(frame, [0, 180], [1.2, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Sky gradient shift
  const skyShift = interpolate(frame, [0, 180], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // City road network
  const cityRoutes = [
    [{ x: 0, y: 500 }, { x: 300, y: 500 }, { x: 500, y: 450 }, { x: 800, y: 450 }, { x: 1280, y: 450 }],
    [{ x: 0, y: 560 }, { x: 400, y: 560 }, { x: 600, y: 520 }, { x: 900, y: 520 }, { x: 1280, y: 520 }],
    [{ x: 200, y: 720 }, { x: 200, y: 500 }, { x: 200, y: 300 }],
    [{ x: 600, y: 720 }, { x: 600, y: 520 }, { x: 600, y: 300 }],
    [{ x: 1000, y: 720 }, { x: 1000, y: 500 }, { x: 1000, y: 300 }],
  ];

  // Text lines
  const textLines = [
    { text: "Built for Mogadishu.", frame: 20, color: "#FFFFFF", size: 68 },
    { text: "Powered by smart technology.", frame: 55, color: "#FF6B00", size: 52 },
    { text: "The future of movement.", frame: 95, color: "#00BFFF", size: 52 },
  ];

  return (
    <div style={{
      width, height,
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Sky */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, 
          hsl(${220 + skyShift * 20}, 60%, ${4 + skyShift * 3}%) 0%, 
          hsl(${210 + skyShift * 15}, 50%, ${6 + skyShift * 4}%) 40%,
          #080810 100%)`,
      }} />

      {/* Stars */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {Array.from({ length: 60 }, (_, i) => {
          const sx = (i * 137.5) % 100;
          const sy = (i * 73.1) % 60;
          const sr = 0.5 + (i % 3) * 0.5;
          const so = 0.2 + (i % 5) * 0.1 + 0.1 * Math.sin(frame * 0.05 + i);
          return <circle key={i} cx={`${sx}%`} cy={`${sy}%`} r={sr} fill="white" opacity={so} />;
        })}
      </svg>

      {/* City layer */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${zoom})`,
        transformOrigin: "bottom center",
      }}>
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Skyline buildings */}
          <Building x={0} w={60} h={180} delay={0} color="#0d0d1a" />
          <Building x={65} w={40} h={120} delay={3} color="#0e0e1c" />
          <Building x={110} w={80} h={260} delay={5} color="#0c0c18" />
          <Building x={195} w={50} h={200} delay={7} color="#0d0d1a" />
          <Building x={250} w={35} h={140} delay={4} color="#0e0e1c" />
          <Building x={290} w={90} h={300} delay={8} color="#0b0b16" />
          <Building x={385} w={45} h={160} delay={6} color="#0d0d1a" />
          <Building x={435} w={70} h={220} delay={9} color="#0c0c18" />
          <Building x={510} w={55} h={180} delay={5} color="#0e0e1c" />
          <Building x={570} w={100} h={340} delay={10} color="#0a0a14" />
          <Building x={675} w={40} h={150} delay={7} color="#0d0d1a" />
          <Building x={720} w={75} h={240} delay={11} color="#0c0c18" />
          <Building x={800} w={50} h={190} delay={8} color="#0e0e1c" />
          <Building x={855} w={85} h={280} delay={12} color="#0b0b16" />
          <Building x={945} w={45} h={160} delay={9} color="#0d0d1a" />
          <Building x={995} w={65} h={210} delay={13} color="#0c0c18" />
          <Building x={1065} w={90} h={320} delay={10} color="#0a0a14" />
          <Building x={1160} w={50} h={170} delay={11} color="#0d0d1a" />
          <Building x={1215} w={65} h={230} delay={14} color="#0c0c18" />

          {/* Ground */}
          <rect x={0} y={718} width={1280} height={2} fill="rgba(0,191,255,0.2)" />

          {/* City road network */}
          {cityRoutes.map((pts, i) => (
            <GlowingRoute
              key={i}
              points={pts}
              color={i % 2 === 0 ? "#00BFFF" : "#FF6B00"}
              width={3}
              startFrame={i * 8}
              duration={30}
              glowIntensity={10}
              animated
            />
          ))}

          {/* Data streams */}
          {[200, 400, 600, 800, 1000, 1200].map((x, i) => (
            <DataStream key={i} x={x} startFrame={i * 5} />
          ))}

          {/* Connection nodes */}
          {frame > 30 && [
            [200, 500], [600, 520], [1000, 500], [400, 450], [800, 450],
          ].map(([cx, cy], i) => {
            const lf = Math.max(0, frame - (30 + i * 8));
            const r = interpolate(lf % 50, [0, 50], [6, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const o = interpolate(lf % 50, [0, 50], [0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sc = spring({ frame: lf, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={o} />
                <circle cx={cx} cy={cy} r={5 * sc} fill="#00BFFF" opacity={0.9 * sc} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Atmospheric glow at horizon */}
      <div style={{
        position: "absolute",
        bottom: 200,
        left: 0, right: 0,
        height: 120,
        background: "linear-gradient(transparent, rgba(0,100,200,0.08), transparent)",
        pointerEvents: "none",
      }} />

      {/* Text overlay */}
      <div style={{
        position: "absolute",
        top: 80,
        left: 0, right: 0,
        textAlign: "center",
      }}>
        {textLines.map(({ text, frame: tf, color, size }, i) => {
          const lf = Math.max(0, frame - tf);
          const opacity = interpolate(lf, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(lf, [0, 16], [30, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.exp),
          });
          const exitOpacity = i < textLines.length - 1
            ? interpolate(Math.max(0, frame - textLines[i + 1].frame), [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;

          return (
            <div key={i} style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              opacity: opacity * exitOpacity,
              transform: `translateY(${y}px)`,
            }}>
              <div style={{
                color,
                fontSize: size,
                fontWeight: 900,
                letterSpacing: -2,
                fontFamily: "'Arial Black', sans-serif",
                textShadow: `0 0 60px ${color}66`,
              }}>{text}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom HUD bar */}
      {frame > 80 && (
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 50,
          background: "rgba(8,8,16,0.9)",
          borderTop: "1px solid rgba(0,191,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {[
            { label: "ACTIVE USERS", value: "12,400+" },
            { label: "CITY COVERAGE", value: "94%" },
            { label: "JAMS AVOIDED", value: "8,200+" },
            { label: "ROUTES OPTIMIZED", value: "31,000+" },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "monospace", letterSpacing: 1 }}>{label}</span>
              <span style={{ color: "#00BFFF", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <ScanLine opacity={0.03} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(8,8,16,0.5) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
