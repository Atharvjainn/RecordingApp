import { prisma } from '@/lib/prisma';
import { getcurrentUser } from '@/lib/actions/auth-actions';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, visibility, extra } = body;

  const user = await getcurrentUser();
  if (!user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const videoId = randomUUID();

  const thumbnailUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${extra.publicId}.jpg`;

  const video = await prisma.video.create({
    data: {
      id: videoId,
      title,
      description,
      videoUrl: extra.url,
      videoId: extra.publicId,
      duration: extra.duration,
      visibility,
      thumbnailUrl,
      userId: user.id,
    },
  });

  return Response.json({ success: true, data: video });
}
