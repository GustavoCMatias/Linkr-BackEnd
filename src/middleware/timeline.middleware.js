import { db } from '../database/database.connection.js'

async function validateCreatePost(req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const findTokenUser = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);

    if (!token || findTokenUser.rows.length === 0) {
        return res.sendStatus(404);
    };

    if (findTokenUser.rows[0].id !== parseInt(findShortUrl.rows[0].id_user)) {
        return res.sendStatus(401)
    };

    res.locals.user = findTokenUser;

    next()

}

export {
    validateCreatePost
}