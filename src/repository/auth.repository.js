import { db } from "../database/database.connection.js";


export async function searchToken(token){
    const {rows, rowCount} = await db.query('SELECT user_id FROM sessions WHERE token = $1', [token])
    return [rows, rowCount]
}