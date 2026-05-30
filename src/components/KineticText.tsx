import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";

interface KineticTextProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
  mode?: "slide-up" | "slide-left" | "scale" | "glitch" | "word-by-word" | "char-by-char";
  stagger?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame,
  fontSize = 72,
  color = "#FFFFFF",
  weight = 900,
  letterSpacing = -2,
  style = {},
  mode = "slide-up",
  stagger = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (mode === "word-by-word") {
    const words = text.split(" ");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", ...style }}>
        {words.map((word, i) => {
          const wf = Math.max(0, frame - (startFrame + i * stagger));
          const opacity = interpolate(wf, [0, 10], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const y = interpolate(wf, [0, 14], [30, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.exp),
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color,
                fontSize,
                fontWeight: weight,
                letterSpacing,
                opacity,
                transform: `translateY(${y}px)`,
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (mode === "char-by-char") {
    const chars = text.split("");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
        {chars.map((char, i) => {
          const cf = Math.max(0, frame - (startFrame + i * stagger));
          const opacity = interpolate(cf, [0, 8], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const y = interpolate(cf, [0, 10], [20, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.5)),
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color,
                fontSize,
                fontWeight: weight,
                letterSpacing: char === " " ? "0.3em" : letterSpacing,
                opacity,
                transform: `translateY(${y}px)`,
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                width: char === " " ? "0.3em" : "auto",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    );
  }

  if (mode === "glitch") {
    const lf = Math.max(0, frame - startFrame);
    const opacity = interpolate(lf, [0, 6], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const glitchX = lf < 12 ? (Math.random() - 0.5) * 6 : 0;
    const glitchY = lf < 12 ? (Math.random() - 0.5) * 3 : 0;
    return (
      <div style={{ position: "relative", ...style }}>
        {/* Red ghost */}
        <div style={{
          position: "absolute",
          color: "#E8281E",
          fontSize,
          fontWeight: weight,
          letterSpacing,
          opacity: opacity * (lf < 12 ? 0.6 : 0),
          transform: `translate(${glitchX * 2}px, ${glitchY}px)`,
          fontFamily: "'Arial Black', sans-serif",
          mixBlendMode: "screen",
        }}>{text}</div>
        {/* Blue ghost */}
        <div style={{
          position: "absolute",
          color: "#00BFFF",
          fontSize,
          fontWeight: weight,
          letterSpacing,
          opacity: opacity * (lf < 12 ? 0.4 : 0),
          transform: `translate(${-glitchX}px, ${glitchY}px)`,
          fontFamily: "'Arial Black', sans-serif",
          mixBlendMode: "screen",
        }}>{text}</div>
        {/* Main */}
        <div style={{
          color,
          fontSize,
          fontWeight: weight,
          letterSpacing,
          opacity,
          fontFamily: "'Arial Black', sans-serif",
        }}>{text}</div>
      </div>
    );
  }

  const lf = Math.max(0, frame - startFrame);
  const sp = spring({ frame: lf, fps, config: { damping: 14, stiffness: 180, mass: 0.8 } });
  const opacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  let transform = "";
  if (mode === "slide-up") {
    const y = interpolate(sp, [0, 1], [50, 0]);
    transform = `translateY(${y}px)`;
  } else if (mode === "slide-left") {
    const x = interpolate(sp, [0, 1], [80, 0]);
    transform = `translateX(${x}px)`;
  } else if (mode === "scale") {
    const s = interpolate(sp, [0, 1], [0.6, 1]);
    transform = `scale(${s})`;
  }

  return (
    <div
      style={{
        color,
        fontSize,
        fontWeight: weight,
        letterSpacing,
        opacity,
        transform,
        fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
