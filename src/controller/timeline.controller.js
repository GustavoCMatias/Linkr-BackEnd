import { db } from '../database/database.connection.js'
import { validateCreatePost } from '../middleware/timeline.middleware.js'

async function createPost(req, res) {

    const { link, message } = req.body
    const findUser = res.locals.user

    try {
        await db.query(`
        INSERT INTO posts (link, message, user_id)
        VALUES ($1, $2, $3)`,
            [link, message, findUser.rows[0].user_id])

        res.status(201)
    } catch (error) {
        res.status(500).send(error.message)
    }

}

async function getTimeline(req, res) {

    // uso o validate que já está no middleware acima?

    try {

        const fedd = await db.query(`
        SELECT * FROM users.id, users.name, posts.*, count(likes.post_id) AS count_likes, likes.user_id
        FROM users
        JOIN posts
        ON users.id = posts.user_id
        JOIN likes
        ON posts.id = likes.post_id
        GROUP BY users.id
        ORDER BY posts.created_at DESC
        LIMIT 20;
        `)

        res.status(200).send(fedd.rows)

    } catch (error) {
        send.status(500).send(error.message)
    }
}

export {
    createPost,
    getTimeline
}