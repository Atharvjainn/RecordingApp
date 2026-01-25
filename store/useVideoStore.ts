
import { useAuthStore } from './useAuthStore'
import {create} from 'zustand'
import { getVideosByid } from "@/lib/prisma/video"

type VideoStore = {
    isvideosloading : boolean,
    getvideos : () => void,
    videos : any[],

}

export const useVideoStore = create<VideoStore>((set,get) =>({
    isvideosloading : false,
    videos : [],

    getvideos : async () => {
        set({isvideosloading : true})
        try {
            const user = useAuthStore.getState().authUser
            console.log(user);
            
            if(!user){
                console.log("Unauthorised User")
                throw new Error("Unauthorised User")
            }
            const videos = await getVideosByid(user.id)
            set({videos : videos})
        } catch (error) {
            console.log("error in fetching videos",error);
        } finally {
            set({isvideosloading : false})
        }
    }

}))