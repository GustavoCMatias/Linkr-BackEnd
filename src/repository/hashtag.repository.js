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