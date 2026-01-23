'use client';

export const uploadVideoToCloudinary = async (file: File) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await res.json();

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    duration : data.duration as number,
  }
};
