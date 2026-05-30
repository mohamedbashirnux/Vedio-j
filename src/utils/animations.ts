import { interpolate, Easing } from "remotion";

export const easeOutExpo = Easing.out(Easing.exp);
export const easeOutBack = Easing.out(Easing.back(1.8));
export const easeInOutCubic = Easing.inOut(Easing.cubic);
export const easeOutCubic = Easing.out(Easing.cubic);
export const easeInExpo = Easing.in(Easing.exp);

export const fadeIn = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });

export const fadeOut = (frame: number, start: number, duration = 10) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInExpo,
  });

export const slideUp = (frame: number, start: number, distance = 40, duration = 18) =>
  interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

export const slideLeft = (frame: number, start: number, distance = 80, duration = 18) =>
  interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

export const scaleIn = (frame: number, start: number, from = 0.7, duration = 16) =>
  interpolate(frame, [start, start + duration], [from, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutBack,
  });

export const pulse = (frame: number, speed = 1) =>
  1 + 0.04 * Math.sin((frame * speed * Math.PI) / 20);

export const glitch = (frame: number, intensity = 4) => {
  const t = frame % 8;
  if (t < 2) return (Math.random() - 0.5) * intensity;
  return 0;
};
