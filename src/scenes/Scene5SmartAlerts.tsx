import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

export const Scene5SmartAlerts: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Car moves along road
  const carX = interpolate(frame, [0, 100], [80, 820], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Radar circle expands from intersection
  const radarScale = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const radarPulse1 = interpolate(frame % 60, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radarPulse1Opacity = interpolate(frame % 60, [0, 60], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radarPulse2 = interpolate((frame + 20) % 60, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radarPulse2Opacity = interpolate((frame + 20) % 60, [0, 60], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Notification slides down
  const notifY = interpolate(frame, [50, 70], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const notifOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text
  const textOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [60, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const intersectionX = 950;
  const roadY = 360;

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
        {/* Main road */}
        <rect x={0} y={roadY - 40} width={1280} height={80} fill="#1c1c1c" />
        <line
          x1={0}
          y1={roadY}
          x2={1280}
          y2={roadY}
          stroke="#333"
          strokeWidth={2}
          strokeDasharray="30,20"
        />

        {/* Intersection */}
        <rect
          x={intersectionX - 50}
          y={0}
          width={100}
          height={720}
          fill="#1c1c1c"
        />
        <rect
          x={intersectionX - 50}
          y={roadY - 40}
          width={100}
          height={80}
          fill="#222"
        />

        {/* Red jam indicator at intersection */}
        <circle
          cx={intersectionX}
          cy={roadY}
          r={18}
          fill="#E8281E"
          opacity={0.9}
        />
        <text
          x={intersectionX}
          y={roadY + 6}
          textAnchor="middle"
          fill="white"
          fontSize={16}
          fontWeight="bold"
          fontFamily="Arial"
        >
          !
        </text>

        {/* Radar circles */}
        {frame > 30 && (
          <>
            <circle
              cx={intersectionX}
              cy={roadY}
              r={200 * radarPulse1}
              fill="none"
              stroke="#E8281E"
              strokeWidth={2}
              opacity={radarPulse1Opacity * radarScale}
            />
            <circle
              cx={intersectionX}
              cy={roadY}
              r={200 * radarPulse2}
              fill="none"
              stroke="#E8281E"
              strokeWidth={1.5}
              opacity={radarPulse2Opacity * radarScale}
            />
            {/* Static radar ring */}
            <circle
              cx={intersectionX}
              cy={roadY}
              r={200}
              fill="rgba(232,40,30,0.05)"
              stroke="#E8281E"
              strokeWidth={1}
              strokeDasharray="8,6"
              opacity={radarScale * 0.6}
            />
            {/* 500m label */}
            <text
              x={intersectionX - 210}
              y={roadY - 10}
              fill="#E8281E"
              fontSize={12}
              fontFamily="Arial"
              opacity={radarScale * 0.8}
            >
              500m
            </text>
          </>
        )}

        {/* Car icon */}
        <g transform={`translate(${carX}, ${roadY - 15})`}>
          {/* Car body */}
          <rect x={-22} y={-12} width={44} height={24} rx={5} fill="#444" />
          <rect x={-14} y={-20} width={28} height={14} rx={4} fill="#555" />
          {/* Headlights */}
          <rect x={18} y={-8} width={6} height={5} rx={1} fill="#ffffaa" opacity={0.9} />
          <rect x={18} y={3} width={6} height={5} rx={1} fill="#ffffaa" opacity={0.9} />
          {/* Wheels */}
          <circle cx={-12} cy={12} r={6} fill="#222" stroke="#666" strokeWidth={1} />
          <circle cx={12} cy={12} r={6} fill="#222" stroke="#666" strokeWidth={1} />
          {/* Windows */}
          <rect x={-12} y={-18} width={10} height={8} rx={1} fill="#88aaff" opacity={0.5} />
          <rect x={2} y={-18} width={10} height={8} rx={1} fill="#88aaff" opacity={0.5} />
        </g>

        {/* Distance indicator */}
        {frame > 40 && carX < intersectionX - 50 && (
          <>
            <line
              x1={carX + 22}
              y1={roadY - 30}
              x2={intersectionX - 50}
              y2={roadY - 30}
              stroke="#555"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text
              x={(carX + 22 + intersectionX - 50) / 2}
              y={roadY - 38}
              textAnchor="middle"
              fill="#888"
              fontSize={12}
              fontFamily="Arial"
            >
              {Math.round(((intersectionX - 50 - carX - 22) / 700) * 500)}m
            </text>
          </>
        )}
      </svg>

      {/* Phone notification */}
      <div
        style={{
          position: "absolute",
          top: 60 + notifY,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: notifOpacity,
          background: "rgba(28,28,28,0.95)",
          border: "1px solid #E8281E",
          borderRadius: 16,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 380,
          boxShadow: "0 8px 32px rgba(232,40,30,0.3)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "#E8281E",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          ⚠️
        </div>
        <div>
          <div
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 0.5,
            }}
          >
            JaamAlert
          </div>
          <div
            style={{
              color: "#ccc",
              fontSize: 14,
              fontFamily: "Arial, sans-serif",
              marginTop: 2,
            }}
          >
            Jaam ahead — 480m away
          </div>
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
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
          We warn you{" "}
          <span style={{ color: "#E8281E" }}>before</span> you hit it.
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
