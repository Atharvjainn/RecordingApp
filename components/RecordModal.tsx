"use client";

import { useEffect, useState } from "react";
import { Select } from "./Select";
import RecorderControls from "./RecorderControls";

type RecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStop : () => void
};

const SOURCE_OPTIONS = [
  "Full Screen",
  "Window",
  "Current Tab",
  "Camera Only",
];

const CAMERA_OPTIONS = [
  "EasyCamera (USB-57F8)",
  "Built-in Camera",
  "External HD Camera",
  "Virtual Camera",
];

const MIC_OPTIONS = [
  "No Microphone",
  "Default – MacBook Air Microphone",
  "Blue Yeti Microphone",
  "Rode NT-USB Microphone",
  "Logitech StreamCam Mic",
];

export default function RecordingModal({
  isOpen,
  onClose,
  onStop,
}: RecordModalProps) {
  const [source, setSource] = useState("Full Screen");
  const [camera, setCamera] = useState("");
  const [mic, setMic] = useState("");

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  

  const fetchdevices = async() => {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameras(devices.filter(d => d.kind === "videoinput"));
        setMics(devices.filter(d => d.kind === "audioinput"));
        console.log(cameras.map(c => c.label));
        
  }

        const cameraOptions: string[] = cameras.map(
            c => c.label || "Camera"
            );

        const micOptions: string[] = mics.map(
        m => m.label || "Microphone"
        );
        

  useEffect(() => {
    fetchdevices()
  },[])

  

  // ⌨️ Close on ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // ❌ Don’t render if closed
  if (!isOpen) return null;

  return (
    // 🌑 BACKDROP
    <>

    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* 🪟 MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[420px] rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <h3 className="mb-4 text-sm font-semibold text-gray-700">
          Video settings
        </h3>

        {/* Source */}
        <Select
          label="Screen and Camera"
          value={source}
          options={SOURCE_OPTIONS}
          onChange={setSource}
        />

        {/* Camera */}
        <Select
          label="Camera"
          value={camera}
          options={cameraOptions}
          onChange={setCamera}
        />

        {/* Microphone */}
        <Select
          label="Microphone"
          value={mic}
          options={micOptions}
          onChange={setMic}
          highlight="pink"
        />

        {/* Countdown */}
        {/* <div className="mt-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-white">
            3
          </div>
          <button className="mt-2 text-xs text-gray-400 hover:text-gray-600">
            Skip
          </button>
        </div> */}

        {/* Bottom Control Bar */}
        {/* <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-lg">
          <span className="text-xs text-gray-500">
            Here we go! It’s time to record
          </span>
          <span className="text-xs font-medium text-gray-700">4:58</span>
        </div> */}

        <button className="bg-pink-300 rounded-lg px-2 py-4" onClick={() => {
            onStop()
            onClose()
        }
            
            
        }>
            Start Recording
        </button>
      </div>
    </div>
    </>
  );
}
