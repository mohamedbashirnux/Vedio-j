import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface RoutePoint { x: number; y: number; }

interface GlowingRouteProps {
  points: RoutePoint[];
  color?: string;
  width?: number;
  startFrame?: number;
  duration?: number;
  glowIntensity?: number;
  dashed?: boolean;
  animated?: boolean;
}

const buildPath = (points: RoutePoint[], progress: number): string => {
  if (points.length < 2) return "";
  const total = points.length - 1;
  const drawn = progress * total;
  const full = Math.floor(drawn);
  const partial = drawn - full;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < full && i < total; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.5;
    const cp1y = points[i].y;
    const cp2x = points[i].x + (points[i + 1].x - points[i].x) * 0.5;
    const cp2y = points[i + 1].y;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${points[i + 1].x} ${points[i + 1].y}`;
  }
  if (full < total && partial > 0) {
    const p1 = points[full];
    const p2 = points[full + 1];
    const ex = p1.x + (p2.x - p1.x) * partial;
    const ey = p1.y + (p2.y - p1.y) * partial;
    const cp1x = p1.x + (p2.x - p1.x) * 0.5;
    d += ` C ${cp1x} ${p1.y} ${cp1x} ${ey} ${ex} ${ey}`;
  }
  return d;
};

export const GlowingRoute: React.FC<GlowingRouteProps> = ({
  points,
  color = "#00BFFF",
  width = 5,
  startFrame = 0,
  duration = 40,
  glowIntensity = 12,
  dashed = false,
  animated = false,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  const progress = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated dash offset for flowing effect
  const dashOffset = animated ? -(frame * 3) % 40 : 0;

  const pathD = buildPath(points, progress);
  const id = `route-${color.replace("#", "")}-${startFrame}`;

  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer glow */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={width * 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.2}
        filter={`url(#glow-${id})`}
        strokeDasharray={dashed ? "20,12" : undefined}
        strokeDashoffset={dashed ? dashOffset : undefined}
      />
      {/* Mid glow */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={width * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
        strokeDasharray={dashed ? "20,12" : undefined}
        strokeDashoffset={dashed ? dashOffset : undefined}
      />
      {/* Core line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "20,12" : undefined}
        strokeDashoffset={dashed ? dashOffset : undefined}
      />
    </g>
  );
};
