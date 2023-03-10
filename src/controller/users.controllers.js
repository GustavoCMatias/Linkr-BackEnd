import { db } from "../database/database.connection.js";
import { searchUser } from "../repository/user.repository.js";


export async function postRegister(req, res) {
    const { email, cryptoPassword, username, picture_url } = res.locals.register;
    try {
        await db.query('INSERT INTO users (email, password, username, picture_url ) VALUES ($1, $2, $3, $4)', [email, cryptoPassword, username, picture_url])
        res.status(201).send();

    } catch (error) {
        return res.status(500).send('server error: ' + error)
    };
}

export async function postSignIn(req, res) {
    const { userId, token } = res.locals.session;
    try {
        await db.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [userId, token]);


        return res.status(200).send({ token })
    } catch (error) {
        return res.status(500).send("server error: " + error);
    }
}

export async function returnUser(req, res) {
    const user_id  = res.locals.user;
    console.log(res.locals.user)

    try {
        const user = await searchUser(user_id);

        return res.status(200).send(user[0][0] );
    } catch (error) {
        return res.status(500).send("server error: " + error);
    }
}