import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const CarIcon: React.FC<{ x: number; y: number; opacity: number }> = ({
  x,
  y,
  opacity,
}) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <rect x={-18} y={-10} width={36} height={20} rx={4} fill="#333" />
    <rect x={-12} y={-14} width={24} height={10} rx={3} fill="#444" />
    <circle cx={-10} cy={10} r={5} fill="#222" stroke="#555" strokeWidth={1} />
    <circle cx={10} cy={10} r={5} fill="#222" stroke="#555" strokeWidth={1} />
    <rect x={-16} y={-8} width={10} height={6} rx={1} fill="#88aaff" opacity={0.6} />
    <rect x={6} y={-8} width={10} height={6} rx={1} fill="#88aaff" opacity={0.6} />
  </g>
);

const WarningIcon: React.FC<{ x: number; y: number; delay: number }> = ({
  x,
  y,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;
  const localFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.5 },
  });

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <polygon points="0,-20 18,14 -18,14" fill="#E8281E" opacity={0.9} />
      <text
        x={0}
        y={10}
        textAnchor="middle"
        fill="white"
        fontSize={16}
        fontWeight="bold"
      >
        !
      </text>
    </g>
  );
};

const WordText: React.FC<{
  words: string[];
  startFrame: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}> = ({ words, startFrame, x, y, fontSize, color }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        maxWidth: 900,
      }}
    >
      {words.map((word, i) => {
        const wordFrame = Math.max(0, frame - (startFrame + i * 6));
        const opacity = interpolate(wordFrame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(wordFrame, [0, 8], [15, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        return (
          <span
            key={i}
            style={{
              color,
              fontSize,
              fontWeight: 900,
              opacity,
              transform: `translateY(${translateY}px)`,
              display: "inline-block",
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              letterSpacing: "-1px",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cars slow down and stop
  const car1X = interpolate(frame, [0, 60, 90], [100, 380, 390], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const car2X = interpolate(frame, [0, 60, 90], [0, 300, 310], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const car3X = interpolate(frame, [10, 70, 90], [50, 430, 440], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Road lines turn red
  const roadRedProgress = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Clock tick rotation
  const clockRotation = interpolate(frame, [0, 150], [0, 720], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clockOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
      {/* Map / Road SVG */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Main horizontal road */}
        <rect x={0} y={310} width={1280} height={100} fill="#1a1a1a" />
        {/* Road center line */}
        <line
          x1={0}
          y1={360}
          x2={1280}
          y2={360}
          stroke="#333"
          strokeWidth={2}
          strokeDasharray="30,20"
        />

        {/* Intersection block */}
        <rect x={480} y={200} width={120} height={320} fill="#1a1a1a" />
        {/* Intersection cross */}
        <rect x={480} y={310} width={120} height={100} fill="#222" />

        {/* Road turning red */}
        <rect
          x={0}
          y={310}
          width={480 * roadRedProgress}
          height={100}
          fill={`rgba(232, 40, 30, ${0.25 * roadRedProgress})`}
        />
        <rect
          x={600}
          y={310}
          width={(680) * roadRedProgress}
          height={100}
          fill={`rgba(232, 40, 30, ${0.25 * roadRedProgress})`}
        />

        {/* Cars */}
        <CarIcon x={car1X} y={340} opacity={1} />
        <CarIcon x={car2X} y={375} opacity={1} />
        <CarIcon x={car3X} y={345} opacity={0.8} />

        {/* Warning icons stacking up */}
        <WarningIcon x={540} y={260} delay={30} />
        <WarningIcon x={510} y={220} delay={45} />
        <WarningIcon x={570} y={215} delay={55} />

        {/* Clock icon */}
        <g
          transform={`translate(1050, 200)`}
          opacity={clockOpacity}
        >
          <circle r={45} fill="none" stroke="#444" strokeWidth={3} />
          <circle r={4} fill="#E8281E" />
          {/* Hour hand */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-28}
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${clockRotation * 0.083})`}
          />
          {/* Minute hand - fast */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-38}
            stroke="#E8281E"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${clockRotation})`}
          />
          {/* Tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (angle) => (
              <line
                key={angle}
                x1={0}
                y1={-38}
                x2={0}
                y2={-44}
                stroke="#555"
                strokeWidth={2}
                transform={`rotate(${angle})`}
              />
            )
          )}
        </g>
      </svg>

      {/* Text overlay */}
      <WordText
        words={["Every", "day,", "thousands", "of", "drivers", "get", "stuck."]}
        startFrame={20}
        x={80}
        y={120}
        fontSize={52}
        color="#FFFFFF"
      />

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
