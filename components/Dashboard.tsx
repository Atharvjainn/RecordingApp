"use client";

import {
  Monitor,
  Camera,
  Filter,
  LayoutGrid,
  List,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import UploadVideoModal from "./UploadVideoModal";
import { useVideoStore } from "@/store/useVideoStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import RecordingModal from "./RecordModal";
import RecorderControls from "./RecorderControls";
import { startRecording } from "@/lib/recorder";
import Hero from "./Hero";
import { formatDuration } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import Loader from "./Loader";


export default function Dashboard() {
  const {RecordControls,closeRecordControls,activeModal,open} = useUiStore()
  const {Myvideos,getMyvideos,getAllVideos,AllVideos,isdeleting} = useVideoStore()
  const {authUser,isCheckingAuth,checkauth} = useAuthStore()
  const [recordedFile,setrecordedFile] = useState<File | null > (null);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all")
  const videos = activeTab === "all" ? AllVideos : Myvideos
  


  useEffect(() => {
  if (!authUser || isCheckingAuth) return

  getMyvideos()
  getAllVideos()
}, [authUser?.id, isCheckingAuth,isdeleting])







  
  

  return (
    <main className="px-8 py-10">

      {/* {RecordControls && <RecorderControls onFinish={(file) => {
        setrecordedFile(file)
        open("Upload")
        closeRecordControls()
      }}/>} */}

      {/* <RecordingModal isOpen={recordOpen} onClose={() => {SetrecordOpen(false)}} 
          onStop={(config) => {
            startRecording({mode : config.source,videoDeviceId : config.cameraDeviceId,audioDeviceId : config.cameraDeviceId
            })
           
          }}      
      /> */}

      {activeModal=="Recorder" && <RecordingModal />}
      {activeModal=="Upload" && <UploadVideoModal/>}
      {/* RECORD ACTIONS */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        {/* <div className="flex items-center gap-5 p-6 rounded-2xl bg-linear-to-br from-[#f2efff] to-[#f7f4ff] border cursor-pointer hover:shadow-md transition" onClick={() => SetrecordOpen(true)}>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-secondary grid place-items-center text-white">
            <Monitor />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Record Screen</h3>
            <p className="text-slate-500 text-sm">
              Capture your screen or window
            </p>
          </div>
        </div> */}

        {/* <div className="flex items-center gap-5 p-6 rounded-2xl bg-linear-to-br from-[#fff0f7] to-[#fff6fb] border cursor-pointer hover:shadow-md transition" onClick={() => setOpen(true)}>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-secondary to-primary grid place-items-center text-white">
            <Camera />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Upload Video</h3>
            <p className="text-slate-500 text-sm">
             Upload Video
            </p>
          </div>
        </div> */}
        <Hero />


        
      {/* </section> */}

      {/* MY VIDEOS HEADER */}
      <section className="mt-12 flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold">
      {activeTab === "all" ? "All Videos" : "My Videos"}
    </h2>
    <p className="text-slate-500 text-sm">
      {activeTab === "all"
        ? `${AllVideos.length} videos`
        : `${Myvideos.length} videos`}
    </p>
  </div>

  {/* TABS */}
  <div className="flex items-center rounded-xl border p-1 bg-slate-100">
    <button
      onClick={() => setActiveTab("all")}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        activeTab === "all"
          ? "bg-white shadow"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      All Videos
    </button>

    <button
      onClick={() => setActiveTab("mine")}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        activeTab === "mine"
          ? "bg-white shadow"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      My Videos
    </button>
  </div>
        </section>


      {/* VIDEO GRID */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {videos.map((video) => (
    <Link
      href={`/videos/${video.videoId}`}
      key={video.id}
      className="group block"
    >
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition">

        {/* THUMBNAIL */}
        <div className="relative aspect-video bg-black">

          {/* Thumbnail image */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover opacity-90"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* Top-left badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>{formatDuration(video.duration) ?? "03:42"}</span>
            <span className="opacity-60">•</span>
            <span>{video.relativeTime ?? "Today"}</span>
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur text-white transition group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-current translate-x-[1px]"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="p-4">
          <h3 className="font-semibold leading-snug line-clamp-2">
            {video.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
           {video.visibility?.[0].toUpperCase() + video.visibility.slice(1)} • 1080p
          </p>
        </div>

      </div>
    </Link>
  ))}
</section>


    </main>
  );
}
