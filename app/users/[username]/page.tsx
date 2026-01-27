
type Params = {
    params : Promise <{username : string}>
}

const page = async ({params} : Params) => {
    const { username } = await params;
    
}