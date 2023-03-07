import { getPostsByHashtag } from "../repository/hashtag.repository.js"



export async function getbyHashtag(req, res){
    const {hashtag} = req.params
    try{
        const posts = getPostsByHashtag(hashtag)
        res.status(200).send(posts)
    }catch (error) {
        res.status(500).send(error.message)
    }
    

}