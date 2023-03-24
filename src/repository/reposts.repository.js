import { db } from "../database/database.connection.js";

export async function insertNewRepost(post_id, user_id) {
    await db.query(`
    INSERT INTO reposts (post_id, user_id)
    VALUES ($1, $2);
    `, [post_id, user_id]);
}

export async function getPostById(post_id){
    const rows = await db.query(`
    SELECT * FROM posts 
    WHERE id = $1
    `,[post_id])
    return rows
}