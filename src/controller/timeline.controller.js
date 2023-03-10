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
        users.id AS user_id, users.username, users.picture_url AS profile_picture,
        posts.id AS post_id, posts.link, posts.message, posts.created_at,
        COUNT(likes.post_id) AS count_likes,
        array_agg(likers.username) AS likers
        FROM posts
        JOIN users
            ON users.id = posts.user_id
        LEFT JOIN likes 
            ON posts.id = likes.post_id
        LEFT JOIN users AS likers 
            ON likes.user_id = likers.id
        GROUP BY users.id, posts.id
        ORDER BY posts.created_at DESC
        LIMIT 20;
        `)
        
        let render = [];
        const mapRender = feed.rows.forEach((e) => {
            render.push({
                post_id: e.post_id,
                user_id: e.user_id,
                username: e.username,
                profile_picture: e.profile_picture,
                link: e.link,
                message: e.message,
                created_at: e.created_at,
                likes: {
                    count_likes: e.count_likes,
                    likers: e.likers
                }
            })
        })

        res.status(200).send(render);

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
    const {url} = req.body;
    getLinkPreview(url).then((data) => {
        console.debug(data);
        const response = {
            url: data.url,
            title: data.title,
            description: data.description,
            image: data.images
        }
        res.send(response);
    })
    .catch(err=>res.status(500).send());
}

export {
    createPost,
    getTimeline,
    GetMetadataFromLink,
    deletePost,
    updatePost
}