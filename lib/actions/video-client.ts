'use server'

import { prisma } from "../prisma"


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