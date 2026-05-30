import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { JaamAlertVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JaamAlert"
        component={JaamAlertVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
