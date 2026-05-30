import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const FeatureCard: React.FC<{
  icon: string;
  label: string;
  x: number;
  y: number;
  delay: number;
}> = ({ icon, label, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });

  const opacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity,
        background: "rgba(20,20,20,0.9)",
        border: "1px solid #333",
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        width: 110,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div
        style={{
          color: "#ccc",
          fontSize: 11,
          fontWeight: 700,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone glow
  const glowOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowPulse = interpolate(frame % 60, [0, 30, 60], [0.6, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "JaamAlert" letter by letter
  const brandText = "JaamAlert";
  const brandLetters = brandText.split("");

  // Subtext fade
  const subtextOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtextY = interpolate(frame, [80, 100], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button
  const btnScale = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 8, stiffness: 250, mass: 0.6 },
  });
  const btnOpacity = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button pulse
  const btnPulse = interpolate(frame % 50, [0, 25, 50], [1, 1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo fade in at end
  const logoOpacity = interpolate(frame, [120, 140], [0, 1], {
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
      {/* Feature cards zooming into phone */}
      <FeatureCard icon="🗺️" label="Live Intersections" x={80} y={200} delay={5} />
      <FeatureCard icon="⚠️" label="500m Alerts" x={80} y={360} delay={12} />
      <FeatureCard icon="🛣️" label="Smart Routes" x={1090} y={200} delay={18} />
      <FeatureCard icon="⛽" label="Gas Stations" x={1090} y={360} delay={25} />

      {/* Phone glow aura */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232,40,30,${0.25 * glowOpacity * glowPulse}) 0%, transparent 70%)`,
        }}
      />

      {/* Phone mockup */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 180,
          height: 360,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)",
            borderRadius: 30,
            border: `2px solid rgba(232,40,30,${0.4 * glowOpacity})`,
            boxShadow: `0 0 ${40 * glowOpacity * glowPulse}px rgba(232,40,30,${0.4 * glowOpacity}), 0 20px 60px rgba(0,0,0,0.8)`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 16,
              background: "#0C0C0C",
              borderRadius: 8,
            }}
          />
          {/* App icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "#E8281E",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(232,40,30,0.6)",
              }}
            >
              <svg width={32} height={32} viewBox="0 0 40 40">
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
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 1,
                fontFamily: "'Arial Black', sans-serif",
              }}
            >
              JaamAlert
            </div>
          </div>
        </div>
      </div>

      {/* "JaamAlert" big text */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {brandLetters.map((letter, i) => {
          const letterFrame = Math.max(0, frame - (35 + i * 4));
          const letterOpacity = interpolate(letterFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const letterScale = spring({
            frame: letterFrame,
            fps,
            config: { damping: 8, stiffness: 300, mass: 0.5 },
          });

          return (
            <span
              key={i}
              style={{
                color: "#FFFFFF",
                fontSize: 96,
                fontWeight: 900,
                opacity: letterOpacity,
                transform: `scale(${letterScale})`,
                display: "inline-block",
                letterSpacing: "-2px",
                textShadow: "0 0 40px rgba(232,40,30,0.4)",
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Subtext */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtextOpacity,
          transform: `translateY(${subtextY}px)`,
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "3px",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Built for Mogadishu. Built for you.
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: `translateX(-50%) scale(${btnScale * btnPulse})`,
          opacity: btnOpacity,
        }}
      >
        <div
          style={{
            background: "#E8281E",
            borderRadius: 50,
            padding: "18px 48px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 0 30px rgba(232,40,30,0.5), 0 8px 24px rgba(0,0,0,0.4)",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "1px",
              fontFamily: "'Arial Black', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Download Free →
          </span>
        </div>
      </div>

      {/* Final logo centered */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "#E8281E",
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 40 40">
            <path
              d="M20 4 C12 4 6 10 6 18 C6 28 20 38 20 38 C20 38 34 28 34 18 C34 10 28 4 20 4Z"
              fill="white"
            />
            <circle cx={20} cy={18} r={6} fill="#E8281E" />
          </svg>
        </div>
        <span
          style={{
            color: "#555",
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "2px",
          }}
        >
          JAAMALERT
        </span>
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
