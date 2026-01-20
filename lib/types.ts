export interface User {
    email : string,
    emailVerified : boolean,
    id : string,
    image? : string | null | undefined,
    name : string,
    createdAt : Date,
    updatedAt : Date
}