import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const FuelIcon: React.FC<{
  x: number;
  y: number;
  delay: number;
  price: string;
  cheapest?: boolean;
}> = ({ x, y, delay, price, cheapest }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const dropY = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 },
  });

  const priceOpacity = interpolate(localFrame, [15, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const priceScale = spring({
    frame: Math.max(0, localFrame - 15),
    fps,
    config: { damping: 10, stiffness: 250, mass: 0.5 },
  });

  // Cheapest highlight ring
  const ringScale = cheapest
    ? interpolate(frame % 50, [0, 50], [1, 1.6], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const ringOpacity = cheapest
    ? interpolate(frame % 50, [0, 50], [0.8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const translateY = interpolate(dropY, [0, 1], [-60, 0]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Cheapest highlight ring */}
      {cheapest && (
        <circle
          r={32}
          fill="none"
          stroke="#22cc44"
          strokeWidth={2.5}
          opacity={ringOpacity * dropY}
          transform={`scale(${ringScale})`}
        />
      )}

      {/* Icon drop */}
      <g transform={`translate(0, ${translateY})`} opacity={dropY}>
        {/* Fuel pump icon */}
        <rect
          x={-18}
          y={-22}
          width={36}
          height={44}
          rx={6}
          fill={cheapest ? "#22cc44" : "#2a2a2a"}
          stroke={cheapest ? "#22cc44" : "#444"}
          strokeWidth={1.5}
        />
        {/* Pump body */}
        <rect x={-10} y={-14} width={20} height={18} rx={3} fill={cheapest ? "rgba(0,0,0,0.3)" : "#1a1a1a"} />
        {/* Nozzle */}
        <rect x={12} y={-18} width={8} height={12} rx={2} fill={cheapest ? "#1a8a2a" : "#333"} />
        <rect x={18} y={-10} width={4} height={8} rx={1} fill={cheapest ? "#1a8a2a" : "#333"} />
        {/* Fuel symbol */}
        <text
          x={0}
          y={14}
          textAnchor="middle"
          fill={cheapest ? "#000" : "#888"}
          fontSize={14}
          fontWeight="bold"
          fontFamily="Arial"
        >
          ⛽
        </text>
      </g>

      {/* Price tag */}
      <g
        transform={`translate(28, -10) scale(${priceScale})`}
        opacity={priceOpacity * dropY}
      >
        <rect
          x={0}
          y={-14}
          width={80}
          height={28}
          rx={8}
          fill={cheapest ? "#22cc44" : "#1a1a1a"}
          stroke={cheapest ? "#22cc44" : "#444"}
          strokeWidth={1.5}
        />
        {/* Tag triangle */}
        <polygon
          points="-8,0 0,-8 0,8"
          fill={cheapest ? "#22cc44" : "#1a1a1a"}
        />
        <text
          x={40}
          y={5}
          textAnchor="middle"
          fill={cheapest ? "#000" : "#fff"}
          fontSize={13}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {price}
        </text>
      </g>
    </g>
  );
};

export const Scene7GasStations: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const textOpacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [65, 85], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width,
        height,
        background: "#0C0C0C",
        position: "relative",
        overflow: "hidden",
        opacity: sceneOpacity,
        fontFamily: "'Arial Black', 'Impact', sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Road network */}
        <rect x={0} y={320} width={1280} height={80} fill="#1c1c1c" />
        <rect x={0} y={160} width={1280} height={60} fill="#1c1c1c" />
        <rect x={0} y={520} width={1280} height={60} fill="#1c1c1c" />
        <rect x={200} y={0} width={60} height={720} fill="#1c1c1c" />
        <rect x={550} y={0} width={60} height={720} fill="#1c1c1c" />
        <rect x={900} y={0} width={60} height={720} fill="#1c1c1c" />

        {/* Road center lines */}
        <line x1={0} y1={360} x2={1280} y2={360} stroke="#333" strokeWidth={2} strokeDasharray="25,18" />
        <line x1={230} y1={0} x2={230} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={580} y1={0} x2={580} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={930} y1={0} x2={930} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />

        {/* City blocks */}
        <rect x={261} y={221} width={288} height={98} fill="#111" />
        <rect x={611} y={221} width={288} height={98} fill="#111" />
        <rect x={261} y={421} width={288} height={98} fill="#111" />
        <rect x={611} y={421} width={288} height={98} fill="#111" />

        {/* Fuel stations dropping */}
        <FuelIcon x={320} y={280} delay={10} price="$1.04/L" />
        <FuelIcon x={640} y={280} delay={20} price="$0.91/L" />
        <FuelIcon x={960} y={280} delay={30} price="$0.82/L" cheapest />
        <FuelIcon x={320} y={460} delay={38} price="$0.95/L" />
        <FuelIcon x={640} y={460} delay={46} price="$0.88/L" />
      </svg>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-1px",
          }}
        >
          Find the{" "}
          <span style={{ color: "#22cc44" }}>cheapest gas</span> nearby.
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, #0C0C0C 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
