"use client";

import { useEffect, useState } from "react";
import {
  pauseRecording,
  resumeRecording,
  stopRecording,
} from "@/lib/recorder";

type RecorderControlsProps = {
  onFinish: (file: File) => void;
};

export default function RecorderControls({ onFinish }: RecorderControlsProps) {
  const [state, setState] = useState<
    "recording" | "paused" | "saving"
  >("recording");

  // RecorderControls assumes recording is already started
  useEffect(() => {
    setState("recording");
  }, []);

  const handleStop = async () => {
    setState("saving");
    const file = await stopRecording();
    onFinish(file);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-lg">
      {state === "recording" && (
        <>
          <button
            onClick={() => {
              pauseRecording();
              setState("paused");
            }}
          >
            Pause
          </button>

          <button onClick={handleStop}>Stop</button>
        </>
      )}

      {state === "paused" && (
        <>
          <button
            onClick={() => {
              resumeRecording();
              setState("recording");
            }}
          >
            Resume
          </button>

          <button onClick={handleStop}>Stop</button>
        </>
      )}

      {state === "saving" && <span>Saving…</span>}
    </div>
  );
}
