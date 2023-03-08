import { db } from "../database/database.connection.js";

export async function searchUserById(userId){
    const {rows,rowCount} = await db.query("SELECT * FROM users WHERE _id = $1",[userId]);
    return [rows,rowCount];
}

export async function searchUsersByString(string){
    const rows= await db.query("SELECT * FROM users WHERE position($1 in name)>0",[string]);
    return rows;
}