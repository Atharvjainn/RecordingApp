"use client";

import { useEffect, useRef } from "react";
import "cloudinary-video-player/cld-video-player.min.css";

type CloudinaryVideoPlayerProps = {
  publicId: string;
  className?: string;
};

export default function CloudinaryVideoPlayer({
  publicId,
  className = "",
}: CloudinaryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let player: any;

    const loadPlayer = async () => {
      if (!videoRef.current) return;

      // ✅ Import ONLY on client
      const cloudinaryModule = await import("cloudinary-video-player");

      const cloudinary = (window as any).cloudinary;

      player = cloudinary.videoPlayer(videoRef.current, {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        controls: true,
        autoplay: false,
        muted: false,
        preload: "auto",
        sourceTypes: ["hls", "dash", "mp4"],
      });

      player.source(publicId);
    };

    loadPlayer();

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [publicId]);

  return (
    <video
      ref={videoRef}
      className={`cld-video-player ${className}`}
    />
  );
}
