import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

type PinColor = "green" | "yellow" | "red";

const MapPin: React.FC<{
  x: number;
  y: number;
  color: PinColor;
  delay: number;
  label?: string;
  pulse?: boolean;
}> = ({ x, y, color, delay, label, pulse }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const dropProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 },
  });

  const colorMap: Record<PinColor, string> = {
    green: "#22cc44",
    yellow: "#ffaa00",
    red: "#E8281E",
  };

  const pinColor = colorMap[color];

  const pulseScale = pulse
    ? interpolate(frame % 50, [0, 50], [1, 2.2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const pulseOpacity = pulse
    ? interpolate(frame % 50, [0, 50], [0.7, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const labelOpacity = interpolate(localFrame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelX = interpolate(localFrame, [15, 25], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pinDropY = interpolate(dropProgress, [0, 1], [-40, 0]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pulse ring */}
      {pulse && (
        <circle
          r={14}
          fill="none"
          stroke={pinColor}
          strokeWidth={2}
          opacity={pulseOpacity * dropProgress}
          transform={`scale(${pulseScale})`}
        />
      )}

      {/* Pin */}
      <g transform={`translate(0, ${pinDropY})`} opacity={dropProgress}>
        <path
          d="M0,-22 C-10,-22 -16,-14 -16,-6 C-16,6 0,22 0,22 C0,22 16,6 16,-6 C16,-14 10,-22 0,-22Z"
          fill={pinColor}
          filter="url(#pinShadow)"
        />
        <circle cx={0} cy={-6} r={6} fill="rgba(0,0,0,0.3)" />
      </g>

      {/* Label */}
      {label && (
        <g
          transform={`translate(${20 + labelX}, -6)`}
          opacity={labelOpacity * dropProgress}
        >
          <rect
            x={0}
            y={-14}
            width={label.length * 9 + 16}
            height={28}
            rx={6}
            fill="#1a1a1a"
            stroke={pinColor}
            strokeWidth={1.5}
          />
          <text
            x={8}
            y={5}
            fill={pinColor}
            fontSize={13}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

export const Scene4LiveIntersections: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text fly in from left
  const textX = interpolate(frame, [20, 40], [-400, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2X = interpolate(frame, [30, 50], [-400, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const text2Opacity = interpolate(frame, [30, 50], [0, 1], {
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
      {/* Top-down intersection map */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id="pinShadow">
            <feDropShadow dx={0} dy={4} stdDeviation={4} floodOpacity={0.5} />
          </filter>
        </defs>

        {/* Road network */}
        {/* Horizontal roads */}
        <rect x={0} y={200} width={1280} height={70} fill="#1c1c1c" />
        <rect x={0} y={420} width={1280} height={70} fill="#1c1c1c" />
        <rect x={0} y={580} width={1280} height={70} fill="#1c1c1c" />

        {/* Vertical roads */}
        <rect x={200} y={0} width={70} height={720} fill="#1c1c1c" />
        <rect x={500} y={0} width={70} height={720} fill="#1c1c1c" />
        <rect x={800} y={0} width={70} height={720} fill="#1c1c1c" />
        <rect x={1050} y={0} width={70} height={720} fill="#1c1c1c" />

        {/* Intersection highlights */}
        <rect x={200} y={200} width={70} height={70} fill="#222" />
        <rect x={500} y={200} width={70} height={70} fill="#222" />
        <rect x={800} y={200} width={70} height={70} fill="#222" />
        <rect x={1050} y={200} width={70} height={70} fill="#222" />
        <rect x={200} y={420} width={70} height={70} fill="#222" />
        <rect x={500} y={420} width={70} height={70} fill="#222" />
        <rect x={800} y={420} width={70} height={70} fill="#222" />
        <rect x={1050} y={420} width={70} height={70} fill="#222" />

        {/* Road center dashes */}
        <line x1={0} y1={235} x2={1280} y2={235} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={0} y1={455} x2={1280} y2={455} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={235} y1={0} x2={235} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={535} y1={0} x2={535} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={835} y1={0} x2={835} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />
        <line x1={1085} y1={0} x2={1085} y2={720} stroke="#333" strokeWidth={1} strokeDasharray="20,15" />

        {/* Map pins dropping */}
        <MapPin x={235} y={235} color="green" delay={10} />
        <MapPin x={535} y={235} color="yellow" delay={18} />
        <MapPin x={835} y={235} color="red" delay={26} pulse label="Jaam detected" />
        <MapPin x={1085} y={235} color="green" delay={34} />
        <MapPin x={235} y={455} color="yellow" delay={22} />
        <MapPin x={535} y={455} color="green" delay={30} />
        <MapPin x={835} y={455} color="green" delay={38} />
        <MapPin x={1085} y={455} color="red" delay={42} pulse />
      </svg>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: textX,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          See every jam.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: text2X,
          opacity: text2Opacity,
        }}
      >
        <div
          style={{
            color: "#E8281E",
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "-1px",
          }}
        >
          Before you leave.
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
