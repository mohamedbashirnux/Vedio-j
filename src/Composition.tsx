import React from "react";
import { AbsoluteFill, Series, useCurrentFrame, interpolate, Easing } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2AppIntro } from "./scenes/Scene2AppIntro";
import { Scene3SmartRouting } from "./scenes/Scene3SmartRouting";
import { Scene4Alerts } from "./scenes/Scene4Alerts";
import { Scene5SmartCity } from "./scenes/Scene5SmartCity";
import { Scene6CTA } from "./scenes/Scene6CTA";

// Scene durations at 30fps:
// Scene 1 — Problem Intro:     0–8s   = 240 frames
// Scene 2 — App Intro:         8–15s  = 210 frames
// Scene 3 — Smart Routing:     15–28s = 390 frames
// Scene 4 — Real-time Alerts:  28–38s = 300 frames
// Scene 5 — Smart City Vision: 38–50s = 360 frames
// Scene 6 — CTA:               50–60s = 300 frames
// Total: 1800 frames = 60s

// Cinematic transition overlay between scenes
const SceneTransition: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // Flash on scene start
  const flashIn = interpolate(frame, [0, 6], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out at scene end
  const fadeOut = interpolate(frame, [totalFrames - 12, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <>
      {/* Flash in */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(255,107,0,${flashIn})`,
        pointerEvents: "none",
        zIndex: 100,
      }} />
      {/* Fade out */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(6,6,16,${fadeOut})`,
        pointerEvents: "none",
        zIndex: 100,
      }} />
    </>
  );
};

export const JaamAlertVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#060610" }}>
      <Series>
        <Series.Sequence durationInFrames={240}>
          <AbsoluteFill>
            <Scene1Hook />
            <SceneTransition totalFrames={240} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={210}>
          <AbsoluteFill>
            <Scene2AppIntro />
            <SceneTransition totalFrames={210} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={390}>
          <AbsoluteFill>
            <Scene3SmartRouting />
            <SceneTransition totalFrames={390} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={300}>
          <AbsoluteFill>
            <Scene4Alerts />
            <SceneTransition totalFrames={300} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={360}>
          <AbsoluteFill>
            <Scene5SmartCity />
            <SceneTransition totalFrames={360} />
          </AbsoluteFill>
        </Series.Sequence>

        <Series.Sequence durationInFrames={300}>
          <AbsoluteFill>
            <Scene6CTA />
            <SceneTransition totalFrames={300} />
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
