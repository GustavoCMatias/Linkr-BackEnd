import { db } from "../database/database.connection.js";

export async function searchUserById(userId){
    const {rows,rowCount} = await db.query("SELECT username, picture_url as picture FROM users WHERE id = $1",[userId]);
    return [rows,rowCount];
}

export async function searchUsersByString(string){
    const {rows}= await db.query("SELECT id, username, picture_url as picture FROM users WHERE position($1 in username)>0",[string]);
    return rows;
}

export async function searchUser(userId){
    const {rows,rowCount} = await db.query("SELECT id, username, picture_url FROM users WHERE id = $1",[userId]);
    return [rows,rowCount];
}