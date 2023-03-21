import { db } from "../database/database.connection.js";


export async function getPostsByHashtag(hashtag) {
    const feed = await db.query(`
    
    SELECT
    users.id AS user_id, users.username, users.picture_url AS profile_picture,
    posts.id AS post_id, posts.link, posts.message, posts.created_at,
    COUNT(likes.post_id) AS count_likes,
    array_agg(likers.username) AS likers,
    info.tags AS tags
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
    
    LEFT JOIN likes 
        ON posts.id = likes.post_id
    LEFT JOIN users AS likers 
        ON likes.user_id = likers.id
    WHERE $1 = ANY(info.tags)
    GROUP BY users.id, posts.id, info.tags
    ORDER BY posts.created_at DESC
    LIMIT 20;
    `, [hashtag])
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