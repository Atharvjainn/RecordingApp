"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select } from "./Select";

type RecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStop: () => void;
};

const SOURCE_OPTIONS = [
  "Full Screen",
  "Window",
  "Current Tab",
  "Camera Only",
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

  // 🔍 Fetch devices
  const fetchDevices = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    setCameras(devices.filter(d => d.kind === "videoinput"));
    setMics(devices.filter(d => d.kind === "audioinput"));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // ⌨️ ESC key close
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

  const cameraOptions = cameras.map(c => c.label || "Camera");
  const micOptions = mics.map(m => m.label || "Microphone");

  return (
    // 🌑 BACKDROP
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 🪟 MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-105 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

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

        {/* Action Button */}
        <button
          className="mt-6 w-full rounded-lg bg-pink-500 py-3 text-sm font-medium text-white hover:bg-pink-600 transition"
          onClick={() => {
            onStop();   // tell parent to start recording
            onClose();  // close modal
          }}
        >
          Start Recording
        </button>
      </div>
    </div>
  );
}
