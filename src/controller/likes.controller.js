import { db } from "../database/database.connection.js";

async function validateLike(req, res) {

    const { postId } = req.params
    const postIdNumber = parseInt(postId)
    const user = res.locals.user

    try {

        const findPost = await db.query(`SELECT * FROM posts WHERE id = $1`, [postIdNumber]);
        if(!findPost.rows.length) {
            return res.sendStatus(404)
        }

        const findLike = await db.query(`SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`, [postIdNumber, user.rows[0].user_id])
        if(findLike.rows.length == 0) {
            await db.query(`INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`, [postIdNumber, user.rows[0].user_id])
            return res.sendStatus(200)
            
        } else {
            await db.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [postIdNumber, user.rows[0].user_id])
            return res.sendStatus(204)
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export {
    validateLike
}