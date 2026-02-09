"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select } from "./Select";
import { useUiStore } from "@/store/useUiStore";
import { startRecording } from "@/lib/recorder";
import { motion, AnimatePresence } from "framer-motion";

const SOURCE_OPTIONS = ["camera", "screen"];

export default function RecordingModal() {
  const { close, activeModal, openRecordControls } = useUiStore();

  const [source, setSource] = useState<"camera" | "screen">("screen");
  const [camera, setCamera] = useState("");
  const [mic, setMic] = useState("");

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch devices - FIXED VERSION
  useEffect(() => {
    if (activeModal !== "Recorder") return;

    const fetchDevices = async () => {
      setLoading(true);
      setError("");
      
      try {
        // First, just enumerate to see what's available (without labels)
        const devicesWithoutPermission = await navigator.mediaDevices.enumerateDevices();
        
        // Only request actual stream if we need camera
        if (source === "camera") {
          // Request with a shorter timeout constraint
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: { 
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          // Stop tracks immediately after getting permission
          stream.getTracks().forEach(track => track.stop());
        } else {
          // For screen mode, just request audio
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false
          });
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Now enumerate again to get device labels
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        const audioDevices = devices.filter((d) => d.kind === "audioinput");
        
        setCameras(videoDevices);
        setMics(audioDevices);
        
        // Set defaults
        if (videoDevices.length > 0 && !camera) {
          setCamera(videoDevices[0].label || "Default Camera");
        }
        if (audioDevices.length > 0 && !mic) {
          setMic(audioDevices[0].label || "Default Microphone");
        }
        
      } catch (err: any) {
        console.error("Media device error:", err);
        
        if (err.name === "NotAllowedError") {
          setError("Permission denied. Please allow camera/microphone access.");
        } else if (err.name === "NotFoundError") {
          setError("No camera or microphone found.");
        } else if (err.name === "NotReadableError") {
          setError("Camera/microphone is already in use by another application.");
        } else if (err.name === "OverconstrainedError") {
          setError("Camera doesn't support requested settings.");
        } else {
          setError(`Error: ${err.message || "Could not access media devices"}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [activeModal, source]); // Re-fetch when source changes

  // ESC handling
  useEffect(() => {
    if (activeModal !== "Recorder") return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [activeModal, close]);

  const cameraOptions = cameras.map((c) => c.label || "Camera");
  const micOptions = mics.map((m) => m.label || "Microphone");

  const selectedCamera = cameras.find((c) => c.label === camera);
  const selectedMic = mics.find((m) => m.label === mic);

  const handleStartRecording = async () => {
    try {
      await startRecording({
        mode: source,
        videoDeviceId: selectedCamera?.deviceId,
        audioDeviceId: selectedMic?.deviceId,
      });
      openRecordControls();
      close();
    } catch (err: any) {
      console.error("Failed to start recording:", err);
      setError(`Failed to start recording: ${err.message}`);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {activeModal === "Recorder" && (
        <motion.div
          key="recording-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={close}
        >
          <motion.div
            key="recording-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
            }}
            className="relative w-[420px] rounded-3xl bg-[#fbf7ef] p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <h3 className="mb-6 text-sm font-semibold text-black">
              Recording settings
            </h3>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-600">
                Loading devices...
              </div>
            )}

            <Select
              label="Recording source"
              value={source}
              options={SOURCE_OPTIONS}
              onChange={(v) => setSource(v as "camera" | "screen")}
            />

            <Select
              label="Camera"
              value={camera}
              options={cameraOptions.length > 0 ? cameraOptions : ["No camera found"]}
              onChange={setCamera}
            />

            <Select
              label="Microphone"
              value={mic}
              options={micOptions.length > 0 ? micOptions : ["No microphone found"]}
              onChange={setMic}
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-6 w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleStartRecording}
              disabled={loading || !!error || cameras.length === 0 || mics.length === 0}
            >
              {loading ? "Loading..." : "Start recording"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}