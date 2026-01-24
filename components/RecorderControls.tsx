"use client";

import { useState } from "react";
import {
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
} from "@/lib/recorder";
import { uploadVideoToCloudinary } from "@/lib/actions/cloudinary-client";

type RecorderControlsProps = {
  onFinish: (file: File) => void;
};

export default function RecorderControls({onFinish} : RecorderControlsProps) {
  const [state, setState] = useState<
    "idle" | "recording" | "paused" | "saving"
  >("idle");

  const handleStart = async () => {
    await startRecording({ mode: "screen" });
    setState("recording");
  };

  const handleStop = async () => {
    setState("saving");
    const file = await stopRecording();
    // await uploadVideoToCloudinary(file);
    onFinish(file)
    setState("idle");
  };

  return (
    <div>
      {state === "idle" && (
        <button onClick={handleStart}>Start</button>
      )}

      {state === "recording" && (
        <>
          <button onClick={() => { pauseRecording(); setState("paused"); }}>
            Pause
          </button>
          <button onClick={handleStop}>Stop</button>
        </>
      )}

      {state === "paused" && (
        <>
          <button onClick={() => { resumeRecording(); setState("recording"); }}>
            Resume
          </button>
          <button onClick={handleStop}>Stop</button>
        </>
      )}
    </div>
  );
}
