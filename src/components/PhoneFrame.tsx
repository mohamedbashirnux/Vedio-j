import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface PhoneFrameProps {
  startFrame?: number;
  children?: React.ReactNode;
  glowColor?: string;
  scale?: number;
  rotateY?: number;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  startFrame = 0,
  children,
  glowColor = "#FF6B00",
  scale = 1,
  rotateY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = Math.max(0, frame - startFrame);

  const slideUp = spring({
    frame: lf,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1.2 },
  });

  const translateY = interpolate(slideUp, [0, 1], [200, 0]);
  const opacity = interpolate(lf, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = 1 + 0.15 * Math.sin((frame * Math.PI) / 25);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        position: "relative",
        width: 240,
        height: 480,
        perspective: 1000,
      }}
    >
      {/* Glow aura */}
      <div
        style={{
          position: "absolute",
          inset: -30,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${glowColor}44 0%, transparent 70%)`,
          transform: `scale(${glowPulse})`,
          filter: "blur(20px)",
        }}
      />

      {/* Phone body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #1e1e1e 0%, #0a0a0a 100%)",
          borderRadius: 40,
          border: `1.5px solid rgba(255,255,255,0.12)`,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05),
            0 30px 80px rgba(0,0,0,0.8),
            0 0 60px ${glowColor}33,
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Screen bezel */}
        <div
          style={{
            position: "absolute",
            inset: 6,
            background: "#050505",
            borderRadius: 34,
            overflow: "hidden",
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 22,
              background: "#000",
              borderRadius: 11,
              zIndex: 10,
            }}
          />
          {children}
        </div>

        {/* Side button */}
        <div style={{
          position: "absolute", right: -3, top: 100,
          width: 3, height: 60, background: "#2a2a2a", borderRadius: "0 2px 2px 0",
        }} />
        {/* Volume buttons */}
        <div style={{
          position: "absolute", left: -3, top: 90,
          width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px",
        }} />
        <div style={{
          position: "absolute", left: -3, top: 140,
          width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px",
        }} />
      </div>
    </div>
  );
};
