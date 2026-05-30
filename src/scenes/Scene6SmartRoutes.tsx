import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const Scene6SmartRoutes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Red route draw progress
  const redRouteProgress = interpolate(frame, [5, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Green route draw progress
  const greenRouteProgress = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // X mark on red route
  const xOpacity = interpolate(frame, [38, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xScale = spring({
    frame: Math.max(0, frame - 38),
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.5 },
  });

  // Car moving on green route
  const carProgress = interpolate(frame, [55, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Badge pop in
  const badgeScale = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.5 },
  });
  const badgeOpacity = interpolate(frame, [65, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const textOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [70, 90], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Red route path points (goes through congested area)
  const redPath = [
    [100, 360],
    [300, 360],
    [500, 360],
    [500, 200],
    [700, 200],
    [900, 200],
    [1100, 200],
    [1180, 200],
  ];

  // Green route path (goes around)
  const greenPath = [
    [100, 360],
    [300, 360],
    [300, 520],
    [600, 520],
    [900, 520],
    [1100, 520],
    [1100, 200],
    [1180, 200],
  ];

  const getPointOnPath = (
    path: number[][],
    progress: number
  ): [number, number] => {
    if (progress <= 0) return [path[0][0], path[0][1]];
    if (progress >= 1) return [path[path.length - 1][0], path[path.length - 1][1]];

    const totalSegments = path.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const segmentT = segmentProgress - segmentIndex;

    const p1 = path[Math.min(segmentIndex, path.length - 1)];
    const p2 = path[Math.min(segmentIndex + 1, path.length - 1)];

    return [
      p1[0] + (p2[0] - p1[0]) * segmentT,
      p1[1] + (p2[1] - p1[1]) * segmentT,
    ];
  };

  const buildPathD = (points: number[][], progress: number): string => {
    if (points.length < 2) return "";
    const totalLength = points.length - 1;
    const drawn = progress * totalLength;
    const fullSegments = Math.floor(drawn);
    const partial = drawn - fullSegments;

    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < fullSegments && i < points.length - 1; i++) {
      d += ` L ${points[i + 1][0]} ${points[i + 1][1]}`;
    }
    if (fullSegments < points.length - 1 && partial > 0) {
      const p1 = points[fullSegments];
      const p2 = points[fullSegments + 1];
      d += ` L ${p1[0] + (p2[0] - p1[0]) * partial} ${
        p1[1] + (p2[1] - p1[1]) * partial
      }`;
    }
    return d;
  };

  const carPos = getPointOnPath(greenPath, carProgress);

  // Glow animation for green route
  const glowOpacity = interpolate(frame % 40, [0, 20, 40], [0.4, 1, 0.4], {
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
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id="greenGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background road grid */}
        <rect x={0} y={340} width={1280} height={40} fill="#1a1a1a" />
        <rect x={0} y={500} width={1280} height={40} fill="#1a1a1a" />
        <rect x={0} y={180} width={1280} height={40} fill="#1a1a1a" />
        <rect x={280} y={0} width={40} height={720} fill="#1a1a1a" />
        <rect x={480} y={0} width={40} height={720} fill="#1a1a1a" />
        <rect x={880} y={0} width={40} height={720} fill="#1a1a1a" />
        <rect x={1080} y={0} width={40} height={720} fill="#1a1a1a" />

        {/* Red route (blocked) */}
        <path
          d={buildPathD(redPath, redRouteProgress)}
          fill="none"
          stroke="#E8281E"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />

        {/* Congestion on red route */}
        {redRouteProgress > 0.5 && (
          <>
            <rect x={480} y={170} width={240} height={50} fill="rgba(232,40,30,0.2)" />
            <text x={600} y={202} textAnchor="middle" fill="#E8281E" fontSize={12} fontFamily="Arial">
              CONGESTED
            </text>
          </>
        )}

        {/* X mark on red route */}
        <g
          transform={`translate(640, 200) scale(${xScale})`}
          opacity={xOpacity}
        >
          <circle r={22} fill="#E8281E" opacity={0.9} />
          <line x1={-10} y1={-10} x2={10} y2={10} stroke="white" strokeWidth={3} strokeLinecap="round" />
          <line x1={10} y1={-10} x2={-10} y2={10} stroke="white" strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Green route (clear) */}
        <path
          d={buildPathD(greenPath, greenRouteProgress)}
          fill="none"
          stroke="#22cc44"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={glowOpacity}
          filter="url(#greenGlow)"
        />
        <path
          d={buildPathD(greenPath, greenRouteProgress)}
          fill="none"
          stroke="#22cc44"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Car on green route */}
        {frame > 55 && (
          <g transform={`translate(${carPos[0]}, ${carPos[1]})`}>
            <circle r={14} fill="#22cc44" opacity={0.3} />
            <circle r={8} fill="#22cc44" />
            <circle r={4} fill="white" />
          </g>
        )}

        {/* Start and end markers */}
        <circle cx={100} cy={360} r={10} fill="#fff" opacity={0.8} />
        <circle cx={1180} cy={200} r={10} fill="#fff" opacity={0.8} />
        <text x={100} y={395} textAnchor="middle" fill="#888" fontSize={12} fontFamily="Arial">START</text>
        <text x={1180} y={235} textAnchor="middle" fill="#888" fontSize={12} fontFamily="Arial">END</text>
      </svg>

      {/* "Faster" badge */}
      <div
        style={{
          position: "absolute",
          top: 420,
          right: 200,
          transform: `scale(${badgeScale})`,
          opacity: badgeOpacity,
          background: "#22cc44",
          borderRadius: 12,
          padding: "8px 18px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "0 0 20px rgba(34,204,68,0.5)",
        }}
      >
        <span
          style={{
            color: "#000",
            fontSize: 20,
            fontWeight: 900,
            fontFamily: "'Arial Black', sans-serif",
          }}
        >
          Faster ↑
        </span>
      </div>

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
          Smart routes.{" "}
          <span style={{ color: "#E8281E" }}>Zero guessing.</span>
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
