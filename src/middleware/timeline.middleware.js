import { db } from '../database/database.connection.js'
import { createPostSchema } from '../schema/timeline.schema.js';

async function validateToken(req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const findTokenUser = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);

    if (!token || findTokenUser.rows.length === 0) {
        return res.sendStatus(404);
    };

    res.locals.user = findTokenUser;

    next()
}

async function validateCreatePost(req, res, next) {

    const body = req.body

    const validatePost = createPostSchema.validate(body, { abortEarly: false });
    if (validatePost.error) {
        const mapError = validatePost.error.details.map(e => e.message);
        return res.status(401).send(mapError)
    };

    next()

}

async function validateDeleteOrPut(req, res, next) {

    const { id } = req.params
    const userSession = res.locals.user

    const findPost = await db.query(`SELECT user_id FROM posts WHERE id = $1`, [id]);
    if (!findPost.rows.length) {
        return res.sendStatus(404);
    };
    
    if (userSession.rows[0].user_id !== findPost.rows[0].user_id) {
        return res.sendStatus(401)
    };

    next()
}

async function deleteLikesPost (req, res, next) {

    const { id } = req.params
    await db.query(`DELETE FROM likes WHERE post_id = $1`, [id])

    next()

}

export {
    validateToken,
    validateCreatePost,
    validateDeleteOrPut,
    deleteLikesPost
}