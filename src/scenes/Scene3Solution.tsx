import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const PhoneMockup: React.FC<{ slideProgress: number; popProgress: number }> = ({
  slideProgress,
  popProgress,
}) => {
  const phoneY = interpolate(slideProgress, [0, 1], [300, 0], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, calc(-50% + ${phoneY}px))`,
        width: 220,
        height: 440,
      }}
    >
      {/* Phone body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)",
          borderRadius: 36,
          border: "2px solid #333",
          boxShadow: "0 0 60px rgba(232,40,30,0.3), 0 20px 60px rgba(0,0,0,0.8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 20,
            background: "#0C0C0C",
            borderRadius: 10,
            zIndex: 10,
          }}
        />

        {/* Screen */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            background: "#0C0C0C",
            borderRadius: 28,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* App logo area */}
          <div
            style={{
              transform: `scale(${popProgress})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Logo icon */}
            <div
              style={{
                width: 70,
                height: 70,
                background: "#E8281E",
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(232,40,30,0.6)",
              }}
            >
              <svg width={40} height={40} viewBox="0 0 40 40">
                {/* Alert/map pin icon */}
                <path
                  d="M20 4 C12 4 6 10 6 18 C6 28 20 38 20 38 C20 38 34 28 34 18 C34 10 28 4 20 4Z"
                  fill="white"
                />
                <circle cx={20} cy={18} r={6} fill="#E8281E" />
              </svg>
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 2,
                fontFamily: "'Arial Black', sans-serif",
              }}
            >
              JaamAlert
            </div>
            {/* Mini map preview */}
            <div
              style={{
                width: 140,
                height: 80,
                background: "#111",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <svg width={140} height={80}>
                <line x1={0} y1={40} x2={140} y2={40} stroke="#2a2a2a" strokeWidth={8} />
                <line x1={70} y1={0} x2={70} y2={80} stroke="#2a2a2a" strokeWidth={8} />
                <circle cx={70} cy={40} r={8} fill="#E8281E" opacity={0.9} />
                <circle cx={30} cy={40} r={4} fill="#22cc44" opacity={0.8} />
                <circle cx={110} cy={40} r={4} fill="#ffaa00" opacity={0.8} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div
        style={{
          position: "absolute",
          right: -4,
          top: 80,
          width: 4,
          height: 50,
          background: "#333",
          borderRadius: "0 2px 2px 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 70,
          width: 4,
          height: 35,
          background: "#333",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 115,
          width: 4,
          height: 35,
          background: "#333",
          borderRadius: "2px 0 0 2px",
        }}
      />
    </div>
  );
};

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
  });

  const popProgress = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.6 },
  });

  // Pulse ring
  const pulseScale = interpolate(
    frame % 45,
    [0, 45],
    [1, 2.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pulseOpacity = interpolate(
    frame % 45,
    [0, 45],
    [0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pulseVisible = frame > 30 ? 1 : 0;

  // "Introducing JaamAlert" — letters slide in one by one
  const introText = "Introducing JaamAlert";
  const letters = introText.split("");

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
      {/* Subtle grid background */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 40}
            x2={1280}
            y2={i * 40}
            stroke="#333"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 33 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 40}
            y1={0}
            x2={i * 40}
            y2={720}
            stroke="#333"
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {/* Pulse ring behind phone */}
      {pulseVisible > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${pulseScale})`,
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: "3px solid #E8281E",
            opacity: pulseOpacity,
          }}
        />
      )}

      {/* Phone mockup */}
      <PhoneMockup slideProgress={slideProgress} popProgress={popProgress} />

      {/* "Introducing JaamAlert" text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 0 }}>
          {letters.map((letter, i) => {
            const letterFrame = Math.max(0, frame - (35 + i * 3));
            const letterOpacity = interpolate(letterFrame, [0, 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const letterY = interpolate(letterFrame, [0, 8], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <span
                key={i}
                style={{
                  color: letter === " " ? "transparent" : "#FFFFFF",
                  fontSize: 48,
                  fontWeight: 900,
                  opacity: letterOpacity,
                  transform: `translateY(${letterY}px)`,
                  display: "inline-block",
                  letterSpacing: "-1px",
                  width: letter === " " ? 16 : "auto",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            );
          })}
        </div>

        {/* Red underline swoosh */}
        <div
          style={{
            height: 4,
            background: "#E8281E",
            borderRadius: 2,
            width: interpolate(
              Math.max(0, frame - 55),
              [0, 20],
              [0, 420],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            ),
            boxShadow: "0 0 12px rgba(232,40,30,0.8)",
          }}
        />
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, #0C0C0C 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
