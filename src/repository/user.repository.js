import { db } from "../database/database.connection.js";

export async function searchUserById(userId){
    const {rows,rowCount} = await db.query("SELECT username, picture_url as picture FROM users WHERE id = $1",[userId]);
    return [rows,rowCount];
}

export async function searchUsersByString(userId, string){
    const {rows}= await db.query("SELECT id, username, picture_url as picture, EXISTS(SELECT * FROM user_follows WHERE user_id = $1 AND user_follow_id = users.id) as following FROM users WHERE position($2 in username)>0",[userId,string]);
    return rows;
}

export async function searchUser(userId){
    const {rows,rowCount} = await db.query("SELECT id, username, picture_url FROM users WHERE id = $1",[userId]);
    return [rows,rowCount];
}

export async function userFollowsUser(userId, followUserId){
    const {rowCount} = await db.query("SELECT * FROM user_follows WHERE user_id = $1 AND user_follow_id = $2",[userId,followUserId]);
    return rowCount;
}

export async function followUser(userId, followUserId){
    const rows = await db.query("INSERT INTO user_follows(user_id,user_follow_id) VALUES($1,$2)",[userId,followUserId]);
    return rows;
}

export async function deleteFollowUser(userId, followUserId){
    const rows = await db.query("DELETE FROM user_follows WHERE user_id = $1 AND user_follow_id = $2",[userId,followUserId]);
    return rows;
}