'use client';

export const uploadVideoToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload-video", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Upload-video response:", text);
    throw new Error("Upload failed");
  }

  return res.json() as Promise<{
    url: string;
    publicId: string;
    duration: number;
  }>;
};
