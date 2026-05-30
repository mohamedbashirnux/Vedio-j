import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { ScanLine, RadarSweep } from "../components/HUDElements";
import { GlowingRoute } from "../components/GlowingRoute";

// Glassmorphism alert card
const AlertCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  startFrame: number;
  x: number;
  y: number;
  width?: number;
}> = ({ icon, title, subtitle, tag, tagColor, startFrame, x, y, width: w = 380 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);

  const slideY = spring({ frame: lf, fps, config: { damping: 12, stiffness: 130, mass: 0.9 } });
  const ty = interpolate(slideY, [0, 1], [-80, 0]);
  const opacity = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulse glow
  const glow = 0.3 + 0.2 * Math.sin((frame * Math.PI) / 20);

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y + ty,
      opacity,
      width: w,
      background: "rgba(10,10,20,0.8)",
      backdropFilter: "blur(24px)",
      border: `1px solid rgba(255,255,255,0.08)`,
      borderTop: `2px solid ${tagColor}`,
      borderRadius: 20,
      padding: "18px 22px",
      boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 30px ${tagColor}${Math.round(glow * 40).toString(16).padStart(2, "0")}`,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: `${tagColor}22`,
            border: `1px solid ${tagColor}44`,
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>{icon}</div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Arial", letterSpacing: 0.3 }}>{title}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }}>JaamAlert • now</div>
          </div>
        </div>
        <div style={{
          background: `${tagColor}22`,
          border: `1px solid ${tagColor}55`,
          borderRadius: 20,
          padding: "3px 10px",
          color: tagColor,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "monospace",
          letterSpacing: 1,
        }}>{tag}</div>
      </div>
      {/* Body */}
      <div style={{
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        fontFamily: "Arial",
        lineHeight: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 10,
      }}>{subtitle}</div>
    </div>
  );
};

// Map pulse effect
const MapPulse: React.FC<{ cx: number; cy: number; color: string; startFrame: number }> = ({
  cx, cy, color, startFrame
}) => {
  const frame = useCurrentFrame();
  const lf = Math.max(0, frame - startFrame);

  return (
    <>
      {[0, 20, 40].map((offset) => {
        const lf2 = Math.max(0, lf - offset);
        const r = interpolate(lf2 % 60, [0, 60], [10, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const o = interpolate(lf2 % 60, [0, 60], [0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <circle key={offset} cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={1.5} opacity={o}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.9} />
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </>
  );
};

export const Scene4Alerts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Map movement
  const mapX = interpolate(frame, [0, 200], [-15, 15], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const routePoints = [
    { x: 100, y: 400 }, { x: 300, y: 400 }, { x: 300, y: 250 },
    { x: 600, y: 250 }, { x: 900, y: 250 }, { x: 900, y: 400 }, { x: 1180, y: 400 },
  ];

  const altRoute = [
    { x: 100, y: 400 }, { x: 200, y: 400 }, { x: 200, y: 550 },
    { x: 500, y: 550 }, { x: 800, y: 550 }, { x: 1000, y: 550 }, { x: 1180, y: 400 },
  ];

  return (
    <div style={{
      width, height,
      background: "#080810",
      position: "relative",
      overflow: "hidden",
      opacity: sceneIn,
    }}>
      {/* Map background */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `translateX(${mapX}px)`,
      }}>
        <svg width={width + 40} height={height} style={{ position: "absolute", top: 0, left: -20 }}>
          {/* Roads */}
          <rect x={0} y={370} width={1320} height={60} fill="#111118" />
          <rect x={0} y={220} width={1320} height={50} fill="#111118" />
          <rect x={0} y={520} width={1320} height={50} fill="#111118" />
          <rect x={270} y={0} width={50} height={720} fill="#111118" />
          <rect x={570} y={0} width={50} height={720} fill="#111118" />
          <rect x={870} y={0} width={50} height={720} fill="#111118" />
          <rect x={1170} y={0} width={50} height={720} fill="#111118" />

          {/* Jam area */}
          <rect x={400} y={370} width={350} height={60} fill="rgba(232,40,30,0.3)" rx={2} />

          {/* Routes */}
          <GlowingRoute points={routePoints} color="#00BFFF" width={4} startFrame={0} duration={30} glowIntensity={12} animated />
          <GlowingRoute points={altRoute} color="#FF6B00" width={3} startFrame={20} duration={30} glowIntensity={8} dashed />

          {/* Pulse points */}
          {frame > 5 && <MapPulse cx={300} cy={400} color="#FF6B00" startFrame={5} />}
          {frame > 15 && <MapPulse cx={580} cy={400} color="#E8281E" startFrame={15} />}
          {frame > 25 && <MapPulse cx={900} cy={250} color="#00BFFF" startFrame={25} />}

          {/* Radar sweep */}
          <RadarSweep cx={580} cy={400} radius={100} color="#E8281E" startFrame={10} />
        </svg>
      </div>

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(8,8,16,0.75) 100%)",
        pointerEvents: "none",
      }} />

      {/* Notification cards */}
      <AlertCard
        icon="🚨"
        title="Heavy Traffic Ahead"
        subtitle="Congestion detected on Maka Al-Mukarama Road. Estimated delay: 18 minutes."
        tag="CRITICAL"
        tagColor="#E8281E"
        startFrame={10}
        x={60}
        y={60}
      />
      <AlertCard
        icon="🔀"
        title="Alternative Route Found"
        subtitle="Faster path via Wadnaha Road. Save 14 minutes. Route updated automatically."
        tag="REROUTING"
        tagColor="#00BFFF"
        startFrame={35}
        x={60}
        y={200}
      />
      <AlertCard
        icon="⚠️"
        title="Road Congestion Detected"
        subtitle="KM4 intersection blocked. 3 alternative routes available."
        tag="WARNING"
        tagColor="#FF6B00"
        startFrame={60}
        x={60}
        y={340}
        width={360}
      />

      {/* Right side stats */}
      {frame > 40 && (
        <div style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {[
            { label: "ALERTS SENT", value: "2,847", color: "#FF6B00" },
            { label: "ROUTES SAVED", value: "1,203", color: "#00BFFF" },
            { label: "TIME SAVED", value: "4.2h", color: "#22cc44" },
          ].map(({ label, value, color }, i) => {
            const lf = Math.max(0, frame - (40 + i * 10));
            const sc = spring({ frame: lf, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });
            return (
              <div key={i} style={{
                transform: `scale(${sc})`,
                background: "rgba(10,10,20,0.85)",
                border: `1px solid ${color}33`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 12,
                padding: "14px 20px",
                minWidth: 160,
              }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace", letterSpacing: 2, marginBottom: 4 }}>{label}</div>
                <div style={{ color, fontSize: 32, fontWeight: 900, fontFamily: "'Arial Black', sans-serif", lineHeight: 1 }}>{value}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom text */}
      <div style={{
        position: "absolute",
        bottom: 50,
        left: 60,
        opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [70, 90], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) })}px)`,
      }}>
        <div style={{
          color: "#FFFFFF",
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: -1,
          fontFamily: "'Arial Black', sans-serif",
        }}>
          Always one step <span style={{ color: "#FF6B00" }}>ahead.</span>
        </div>
      </div>

      <ScanLine opacity={0.04} />
    </div>
  );
};
