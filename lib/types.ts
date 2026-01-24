export interface User {
    email : string,
    emailVerified : boolean,
    id : string,
    image? : string | null | undefined,
    name : string,
    createdAt : Date,
    updatedAt : Date
}

type Visibility = 'public' | 'private' 

export interface Video {
    id : string,
    title : string,
    description : string,
    videoId : string,
    videoUrl : string,
    thumbnailUrl : string,
    visibility : Visibility,
    duration : number,
    createdAt : Date,
    updatedAt : Date,
    userId : string
}