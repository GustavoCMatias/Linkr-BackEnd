import { getPostsByHashtag, getTrendingHashtags } from "../repository/hashtag.repository.js"


export async function getbyHashtag(req, res){
    const {hashtag} = req.params
    const  render = [];
    try{
        const feed = await getPostsByHashtag(hashtag)
        feed.rows.forEach((e) => {
            render.push({
                post_id: e.post_id,
                user_id: e.user_id,
                username: e.username,
                profile_picture: e.profile_picture,
                link: e.link,
                message: e.message,
                created_at: e.created_at,
                likes: {
                    count_likes: e.count_likes,
                    likers: e.likers
                },
                hashtags: e.tags
            })
        })

        res.status(200).send(render);

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