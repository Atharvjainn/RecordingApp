import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1️⃣ Read incoming file
    const incomingForm = await req.formData();
    const file = incomingForm.get("file");

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    // 2️⃣ Create timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // 3️⃣ Generate Cloudinary signature
    const signature = crypto
      .createHash("sha1")
      .update(
        `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest("hex");

    // 4️⃣ Build Cloudinary form data
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file as Blob);
    cloudinaryForm.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    cloudinaryForm.append("timestamp", timestamp.toString());
    cloudinaryForm.append("signature", signature);

    // 5️⃣ Upload to Cloudinary
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const data = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      console.error("Cloudinary error:", data);
      return new Response("Cloudinary upload failed", { status: 500 });
    }

    // 6️⃣ Return everything the client needs
    return Response.json({
      url: data.secure_url as string,
      publicId: data.public_id as string,
      duration: data.duration as number,
    });
  } catch (error) {
    console.error("Upload-video error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
