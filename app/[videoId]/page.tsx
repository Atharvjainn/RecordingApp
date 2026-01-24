import VideoPage from "@/components/Videopage"
import { getVideoByid } from "@/lib/actions/video-server"
import { prisma } from "@/lib/prisma"

type Params = {
  params: Promise<{
    videoId: string
  }>
}

const page = async ({ params }: Params) => {
  const { videoId } = await params

  const videoUrl = `https://res.cloudinary.com/dm9xxhm5b/video/upload/f_auto,q_auto,vc_auto/${videoId}`
  const video = await getVideoByid(videoId)

  if(!video) {
    // notFound()
  }


  return (
    <VideoPage
      video={video}
      videoUrl={videoUrl}
    />
  )
}

export default page
