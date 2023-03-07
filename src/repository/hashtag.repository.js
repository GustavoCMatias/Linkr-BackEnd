import { db } from "../database/database.connection.js";


export async function getPostsByHashtag(hashtag){
    const {rows, rowCount} = await db.query(`SELECT p.link, p.messgae 
    FROM posts AS p
    JOIN posts_hastags AS ps
    ON p.id = ps.post_id
    JOIN hashtags AS h
    ON ph.hashtag_id = h.id
    WHERE h.name = $1
    `, [hashtag])
    return [rows, rowCount]
}