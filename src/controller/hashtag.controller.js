import { getPostsByHashtag, getTrendingHashtags } from "../repository/hashtag.repository.js"


export async function getbyHashtag(req, res) {
    const { hashtag } = req.params
    const user_id = res.locals.user
    const render = [];
    try {
        const feed = await getPostsByHashtag(hashtag, user_id)
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
                hashtags: e.tags,
                comments: {
                    count_comments: e.count_comments,
                    comments: e.content.map((content, idx) => {
                        return {
                            content: content,
                            author_id: e.commenter_id[idx],
                            author: e.comment_user[idx],
                            authorPhoto: e.comment_pic[idx],
                            user_follows: e.user_follows[idx]
                        }
                    })
                },
                reposts: {
                    count_reposts: e.count_reposts || 0,
                    users: e.repost_users || []
                }
            })
        })

        res.status(200).send(render);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function trendingHashtags(_, res) {
    try {
        const hashtags = await getTrendingHashtags()
        res.status(200).send(hashtags)
    } catch (error) {
        res.status(500).send(error.message)
    }
}