"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { User, Video } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Play, Calendar } from "lucide-react";

export default function PublicProfilePage({
  user,
  videos,
}: {
  user: User;
  videos: Video[];
}) {
  const [sort, setSort] = useState<"recent" | "oldest">("recent");

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const aTime = new Date(a.createdAt!).getTime();
      const bTime = new Date(b.createdAt!).getTime();
      return sort === "recent" ? bTime - aTime : aTime - bTime;
    });
  }, [videos, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 ">
      {/* ================= PROFILE HEADER ================= */}
      <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-sm">
        <img
          src={user.image ?? "/avatar-fallback.png"}
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />

        <div>
          <h1 className="text-2xl font-semibold text-black">
            {user.name}
          </h1>
          {user.email && (
            <p className="text-sm text-slate-500">{user.email}</p>
          )}
        </div>
      </div>

      {/* ================= SORT ================= */}
      <div className="flex justify-end">
        <div className="flex items-center rounded-full border border-black/10 bg-white px-1 py-1 shadow-sm">
          <button
            onClick={() => setSort("recent")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              sort === "recent"
                ? "bg-black text-white"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Most recent
          </button>
          <button
            onClick={() => setSort("oldest")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              sort === "oldest"
                ? "bg-black text-white"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* ================= VIDEOS ================= */}
      {sortedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5">
            <Play className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-black">
            No videos yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            This user hasn’t uploaded any videos yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedVideos.map((video) => (
            <Link
              key={video.videoId}
              href={`/videos/${video.videoId}`}
              className="group block"
            >
              <div className="rounded-2xl overflow-hidden bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                {/* THUMBNAIL */}
                <div className="relative aspect-video bg-black">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover opacity-95"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

                  {/* Duration */}
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    {formatDuration(video.duration!)}
                  </span>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur text-white transition group-hover:scale-110">
                      <Play className="h-5 w-5 fill-white translate-x-px" />
                    </div>
                  </div>
                </div>

                {/* META */}
                <div className="p-4">
                  <h3 className="font-semibold leading-snug line-clamp-2 text-black">
                    {video.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
