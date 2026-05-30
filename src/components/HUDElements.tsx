import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// Scanning line effect
export const ScanLine: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  const frame = useCurrentFrame();
  const y = (frame * 3) % 720;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 2,
        background: `linear-gradient(90deg, transparent, rgba(0,191,255,${opacity}), transparent)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Corner bracket HUD decoration
export const CornerBrackets: React.FC<{
  x: number; y: number; size?: number; color?: string; startFrame?: number;
}> = ({ x, y, size = 20, color = "#00BFFF", startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const opacity = interpolate(lf, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const s = 2;
  return (
    <g opacity={opacity}>
      {/* Top-left */}
      <path d={`M ${x} ${y + size} L ${x} ${y} L ${x + size} ${y}`} fill="none" stroke={color} strokeWidth={s} />
      {/* Top-right */}
      <path d={`M ${x + 60 - size} ${y} L ${x + 60} ${y} L ${x + 60} ${y + size}`} fill="none" stroke={color} strokeWidth={s} />
      {/* Bottom-left */}
      <path d={`M ${x} ${y + 30 - size} L ${x} ${y + 30} L ${x + size} ${y + 30}`} fill="none" stroke={color} strokeWidth={s} />
      {/* Bottom-right */}
      <path d={`M ${x + 60 - size} ${y + 30} L ${x + 60} ${y + 30} L ${x + 60} ${y + 30 - size}`} fill="none" stroke={color} strokeWidth={s} />
    </g>
  );
};

// Floating glassmorphism notification card
export const NotificationCard: React.FC<{
  icon: string;
  title: string;
  body: string;
  startFrame: number;
  x?: number;
  y?: number;
  accentColor?: string;
}> = ({ icon, title, body, startFrame, x = 0, y = 0, accentColor = "#FF6B00" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);

  const slideY = spring({ frame: lf, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const translateY = interpolate(slideY, [0, 1], [-60, 0]);
  const opacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + translateY,
        opacity,
        background: "rgba(15,15,20,0.85)",
        backdropFilter: "blur(20px)",
        border: `1px solid rgba(255,255,255,0.1)`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 16,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        minWidth: 340,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${accentColor}22`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          letterSpacing: 0.5,
          marginBottom: 3,
        }}>
          {title}
        </div>
        <div style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          fontFamily: "Arial, sans-serif",
        }}>
          {body}
        </div>
      </div>
    </div>
  );
};

// Animated GPS pin
export const GPSPin: React.FC<{
  cx: number; cy: number; color?: string; startFrame?: number; label?: string; size?: number;
}> = ({ cx, cy, color = "#FF6B00", startFrame = 0, label, size = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);

  const drop = spring({ frame: lf, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const dropY = interpolate(drop, [0, 1], [-50, 0]);
  const opacity = interpolate(lf, [0, 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const pulseR = interpolate(lf % 50, [0, 50], [14, 36], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const pulseO = interpolate(lf % 50, [0, 50], [0.6, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={opacity}>
      {/* Pulse ring */}
      <circle r={pulseR} fill="none" stroke={color} strokeWidth={1.5} opacity={pulseO * drop} />
      {/* Shadow */}
      <ellipse rx={10 * size} ry={4 * size} fill="rgba(0,0,0,0.4)" transform={`translate(0, ${18 * size + dropY})`} />
      {/* Pin */}
      <g transform={`translate(0, ${dropY}) scale(${size})`}>
        <path
          d="M0,-24 C-12,-24 -20,-14 -20,-4 C-20,10 0,28 0,28 C0,28 20,10 20,-4 C20,-14 12,-24 0,-24Z"
          fill={color}
        />
        <circle cy={-4} r={8} fill="rgba(0,0,0,0.3)" />
        <circle cy={-4} r={4} fill="white" opacity={0.9} />
      </g>
      {/* Label */}
      {label && (
        <g transform={`translate(24, ${dropY - 4})`} opacity={interpolate(lf, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect x={0} y={-12} width={label.length * 8 + 16} height={24} rx={6} fill="rgba(10,10,15,0.9)" stroke={color} strokeWidth={1} />
          <text x={8} y={5} fill={color} fontSize={11} fontWeight="bold" fontFamily="Arial">{label}</text>
        </g>
      )}
    </g>
  );
};

// Speed indicator
export const SpeedBadge: React.FC<{
  speed: number; unit?: string; startFrame?: number; x?: number; y?: number;
}> = ({ speed, unit = "km/h", startFrame = 0, x = 0, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);
  const sc = spring({ frame: lf, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });
  const opacity = interpolate(lf, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `scale(${sc})`, opacity,
      background: "rgba(10,10,20,0.9)",
      border: "1px solid rgba(0,191,255,0.3)",
      borderRadius: 12,
      padding: "10px 16px",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxShadow: "0 4px 20px rgba(0,191,255,0.2)",
      minWidth: 80,
    }}>
      <div style={{ color: "#00BFFF", fontSize: 28, fontWeight: 900, fontFamily: "'Arial Black', sans-serif", lineHeight: 1 }}>
        {speed}
      </div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "Arial", letterSpacing: 1 }}>
        {unit}
      </div>
    </div>
  );
};

// Animated radar sweep
export const RadarSweep: React.FC<{
  cx: number; cy: number; radius?: number; color?: string; startFrame?: number;
}> = ({ cx, cy, radius = 80, color = "#FF6B00", startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);
  const angle = (lf * 4) % 360;
  const opacity = interpolate(lf, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rad = (angle * Math.PI) / 180;
  const x2 = cx + radius * Math.cos(rad);
  const y2 = cy + radius * Math.sin(rad);

  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      <circle cx={cx} cy={cy} r={radius * 0.6} fill="none" stroke={color} strokeWidth={0.5} opacity={0.2} />
      <circle cx={cx} cy={cy} r={radius * 0.3} fill="none" stroke={color} strokeWidth={0.5} opacity={0.2} />
      {/* Sweep line */}
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={2} opacity={0.8} />
      {/* Sweep gradient arc - approximated */}
      <circle cx={cx} cy={cy} r={radius} fill={`conic-gradient(from ${angle}deg, ${color}44, transparent 60deg)`} opacity={0.3} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};
