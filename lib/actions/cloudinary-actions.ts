import { randomUUID } from "crypto"
import { getcurrentUser } from "./auth-actions"
import { prisma } from '../prisma'


export const uploadVideo = async (data : {title : string,description : string,visibility : 'public' | 'private',extra : {url : string,publicId : string,duration : number}}) => {
    try {
        const { title,description,visibility,extra } = data
        const user = await getcurrentUser()
        const userId = user?.id
        if(!userId){
            throw new Error("Unauthorised")
        }
        const videoId = randomUUID()
       
        // const Vidupload = await cloudinary.uploader.upload(vidurl,{
        //     public_id : publicId  ,
        //     resource_type : "video"
        // })

        const thumbnailUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${extra.publicId}.jpg`;

        // const ImageUpload = await cloudinary.uploader.upload(imgurl,{
        //     public_id : publicId,
        //     resource_type : "image"
        // })

        const video = await prisma.video.create({
            data : {
                id : videoId,
                title : title,
                description : description,
                videoUrl : extra.url   ,
                videoId : extra.publicId,
                thumbnailUrl : thumbnailUrl,
                visibility : visibility,
                duration : extra.duration,
                userId : userId!
            }
        })
        return { 
            data : video,
            success : true,
            message : "Video uploaded!"
        };

    } catch (error) {
        console.log("error in upload video server fn!",error);
        return {
            data : {},
            success : false,
            message: "Failed to upload video. Please try again."
        }
        
    }
    

}