import { db } from "../database/database.connection.js";


export async function searchToken(token){
    const {rows, rowCount} = await db.query('SELECT user_id FROM sessions WHERE token = $1', [token])
    return [rows, rowCount]
}

export async function searchSessions(token){
    const result = await db.query('SELECT * FROM sessions WHERE token = $1', [token]);
    return res.locals.sessions = result.rows[0];
}