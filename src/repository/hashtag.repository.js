import { db } from "../database/database.connection.js";


export async function getPostsByHashtag(hashtag, user_id) {
    

    const feed = await db.query(`
    SELECT
    users.id AS user_id, users.username, users.picture_url AS profile_picture,
    posts.id AS post_id, posts.link, posts.message, posts.created_at,
    COUNT(likes.post_id) AS count_likes,
    array_agg(likers.username) AS likers,
    info.tags AS tags,
    comments.count_comments AS count_comments,
    comments.content AS content,
    comments.username AS comment_user,
    comments.profile_picture AS comment_pic,
    comments.commenter_id as commenter_id,
    comments.user_follows as user_follows
    
FROM posts
JOIN users
    ON users.id = posts.user_id

LEFT JOIN (
    SELECT
        posts.id AS id,
        array_agg(h.hashtag_name) AS tags
    FROM posts
    LEFT JOIN posts_hashtags AS ph ON posts.id = ph.post_id
    LEFT JOIN hashtags AS h ON ph.hashtag_id = h.id
    GROUP BY posts.id
) AS info ON info.id = posts.id

LEFT JOIN (
    SELECT 
        posts.id AS id,
        array_agg(c.content) AS content,
        array_agg(commenters.id) AS commenter_id,
        array_agg(commenters.username) AS username,
        array_agg(commenters.picture_url) AS profile_picture,
        array_agg(follows.user_follows) AS user_follows,
        COUNT(c.id) AS count_comments
    FROM posts
    LEFT JOIN comments AS c 
        ON posts.id = c.post_id
    LEFT JOIN (
        SELECT c.user_id AS id,
            CASE WHEN $1 = ANY(array_agg(uf.user_id))
                THEN true
                ELSE false
                END as user_follows
        FROM comments AS c
        LEFT JOIN user_follows AS uf
            ON c.user_id = uf.user_follow_id
        GROUP BY c.user_id
    ) as follows ON follows.id = c.user_id
    LEFT JOIN users as commenters
        ON commenters.id = c.user_id
    GROUP BY posts.id
) AS comments ON comments.id = posts.id

LEFT JOIN likes 
    ON posts.id = likes.post_id
LEFT JOIN users AS likers 
    ON likes.user_id = likers.id
WHERE $2 = ANY(info.tags)
GROUP BY users.id, posts.id, info.tags, comments.content, comments.username, comments.profile_picture, comments.count_comments, comments.commenter_id, comments.user_follows
ORDER BY posts.created_at DESC
LIMIT 20;
`, [user_id, hashtag])
   
    return feed
}

export async function getTrendingHashtags() {
    const { rows } = await db.query(`
    SELECT h.hashtag_name, COUNT(p.id)
    FROM hashtags AS h
        JOIN posts_hashtags AS ph
            ON ph.hashtag_id = h.id 
        JOIN posts AS p
            ON p.id = ph.post_id
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 10
    `)
    return rows

}