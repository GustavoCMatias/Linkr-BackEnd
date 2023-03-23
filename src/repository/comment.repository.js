
import { db } from "../database/database.connection.js";


export async function insertNewComment(content, post_id, user_id) {
    const { rows } = await db.query(`
    INSERT INTO comments (content, post_id, user_id)
    VALUES ($1, $2, $3);
    `, [content, post_id, user_id])
    return rows
}