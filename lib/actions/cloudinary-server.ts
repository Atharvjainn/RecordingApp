import crypto from "crypto";

export async function deleteFromCloudinary(
  publicId: string
): Promise<void> {
  if (!publicId) {
    throw new Error("publicId is required");
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature format:
  // public_id=<id>&timestamp=<ts><api_secret>
  const signature = crypto
    .createHash("sha1")
    .update(
      `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
    )
    .digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
    console.error("Cloudinary signed delete failed:", data);
    throw new Error("Cloudinary signed delete failed");
  }
}
