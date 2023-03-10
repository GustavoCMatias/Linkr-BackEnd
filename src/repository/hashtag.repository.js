import { db } from "../database/database.connection.js";


export async function getPostsByHashtag(hashtag){
    const {rows, rowCount} = await db.query(`
    SELECT p.link, p.message 
        FROM posts AS p
        JOIN posts_hashtags AS ph
            ON p.id = ph.post_id
        JOIN hashtags AS h
            ON ph.hashtag_id = h.id
    WHERE h.hashtag_name = $1
    `, [hashtag])
    return [rows, rowCount]
}

export async function getTrendingHashtags(){
    const {rows} = await db.query(`
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