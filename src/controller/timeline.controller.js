import { getLinkPreview } from 'link-preview-js'
import { db } from '../database/database.connection.js'

async function createPost(req, res) {

    const { link, message } = req.body
    const findUser = res.locals.user

    try {
        await db.query(`
        INSERT INTO posts (link, message, user_id)
        VALUES ($1, $2, $3)`,
            [link, message, findUser.rows[0].user_id])

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }

}

async function getTimeline(req, res) {

    try {

        const feed = await db.query(`
        SELECT
        users.id AS user_id, users.username,
        posts.id AS post_id, posts.link, posts.message, posts.created_at,
        count(likes.post_id) AS count_likes
        FROM users
        JOIN posts
        ON users.id = posts.user_id
        LEFT JOIN likes
        ON posts.id = likes.post_id
        GROUP BY users.id, posts.id
        ORDER BY posts.created_at DESC
        LIMIT 20;
        `)

        // PENSAR EM UM JEITO DE RENDERIZAR O NOME DAS PESSOAS QUE CURTIRAM
        
        const trending = await db.query(`
        SELECT count(hashtags.id) AS count_trending
        FROM hashtags
        ORDER BY count_trending DESC
        LIMIT 10;
        `)

        res.status(200).send(feed.rows);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function deletePost(req, res) {

    const { id } = req.params

    try {
        await db.query(`DELETE FROM posts WHERE id = $1`, [id])

        res.sendStatus(204);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function updatePost(req, res) {

    const { link, message } = req.body
    const { id } = req.params

    try {

        await db.query(`UPDATE posts SET link = $1, message = $2 WHERE id = $3`, [link, message, id])

        res.sendStatus(204);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function GetMetadataFromLink(req, res) {
    const {url} = req.headers;
    getLinkPreview(url).then((data) => {
        const response = {
            url: data.url,
            title: data.title,
            description: data.description,
            image: data.images
        }
        res.send(response);
    })
    .catch(err=>res.status(500).send(err));
}

export {
    createPost,
    getTimeline,
    deletePost,
    updatePost,
    GetMetadataFromLink
}