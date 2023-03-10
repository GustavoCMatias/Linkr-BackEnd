import { getPostsByHashtag, getTrendingHashtags } from "../repository/hashtag.repository.js"



export async function getbyHashtag(req, res){
    const {hashtag} = req.params
    try{
        const posts = await getPostsByHashtag(hashtag)
        res.status(200).send(posts[0])
    }catch (error) {
        res.status(500).send(error.message)
    }
}

export async function trendingHashtags(_, res){
    try{
        const hashtags = await getTrendingHashtags()
        res.status(200).send(hashtags)
    }catch (error) {
        res.status(500).send(error.message)
    }
}