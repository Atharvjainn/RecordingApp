'use server'

import { prisma } from "../prisma"
import { Video } from "../types"

export const uploadVideoToPrisma = async(data : Video) => {
    try {
        const video = await prisma.video.create({data})
        return video
    } catch (error) {
        console.error("Prisma upload video error:", error);
        throw error
    } 
}

export const getVideosByid = async (userId : string) => {
    try {
        const videos = await prisma.video.findMany({
            where : {
                userId : userId
            }
        })
        return videos;
    } catch (error) {
        console.log("something went wrong in the server");
    }
}


export const getVideoByid = async (videoId : string) => {
    try {
        const video = await prisma.video.findFirst({
            where : {
                videoId : videoId
            }
        })

        if(!video) throw new Error("cannot find this video")
        return video
    } catch (error) {
        console.log("something went wrong in the server");
    }
}