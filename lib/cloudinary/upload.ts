'use server'
import crypto from 'crypto'

export const UploadVideoToCloudinary = async(file : Blob) => {
    const timestamp = Math.floor(Date.now()/1000);
    const signature = crypto
        .createHash("sha1")
        .update(
            `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
        )
        .digest('hex')

    const cloudinaryForm = new FormData()
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    cloudinaryForm.append("timestamp", timestamp.toString());
    cloudinaryForm.append("signature", signature);


    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
            method : "POST",
            body : cloudinaryForm
        }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", data);
      throw new Error("Something went wrong in the upload of the file")
    }

    return data;

}