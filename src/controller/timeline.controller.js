import { getLinkPreview } from 'link-preview-js'
import { db } from '../database/database.connection.js'

async function createPost(req, res) {

    const { link, message } = req.body
    const findUser = res.locals.user

    const hashtags = []

    const arrMessage = message.split('#')

    const new_message = arrMessage[0]

    if (message && arrMessage[1]) {
        arrMessage.shift()
        arrMessage.forEach(item => {
            if (item.split(' ')[0].length > 0) hashtags.push(item.split(' ')[0])
        })

    }

    try {
        const { rows } = await db.query(`
        INSERT INTO posts (link, message, user_id)
        VALUES ($1, $2, $3)
        RETURNING id`,
            [link, new_message, findUser.rows[0].user_id])
        const postId = rows[0].id

        const placeHolder = hashtags.map((_, i) => `$${i + 1}`).join(", ")
        const { rows: hashtagNameId } = await db.query(`
        SELECT hashtag_name, id
        FROM hashtags
        WHERE hashtag_name IN (${placeHolder})`,
            hashtags)


        const remainingHashtags = hashtags.filter(item => {
            let match = false
            hashtagNameId.forEach(each => {
                if (item === each.hashtag_name) return match = true
            })
            return !match
        })

        const placeHolder2 = remainingHashtags.map((_, i) => `$${i + 1}`).join("), (")

        let hashtag_ids

        if (remainingHashtags.length > 0) {
            const { rows: rows3 } = await db.query(`
            INSERT INTO hashtags (hashtag_name)
            VALUES (${placeHolder2})
            RETURNING hashtag_name, id`,
                remainingHashtags
            )
            hashtag_ids = hashtagNameId.concat(rows3).map(item => item.id)
        } else {
            hashtag_ids = hashtagNameId.map(item => item.id)
        }


        const placeHolder3 = hashtag_ids.map((_, i) => `$${i + 2}`).join(", $1), (")

        hashtag_ids.unshift(postId)

        await db.query(`
        INSERT INTO posts_hashtags (hashtag_id, post_id)
        VALUES (${placeHolder3}, $1)`,
            hashtag_ids
        )

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }

}

async function getTimeline(req, res) {
    const requester_id = req.query.userId
    try {

        const feed = await db.query(`
        SELECT
            users.id AS user_id, users.username, users.picture_url AS profile_picture,
            posts.id AS post_id, posts.link, posts.message, posts.created_at,
            COUNT(likes.post_id) AS count_likes,
            array_agg(likers.username) AS likers,
            info.tags AS tags,
            comments.count_comments AS count_comments,
            comments.content AS content,
            comments.username AS comment_user,
            comments.profile_picture AS comment_pic,
            comments.commenter_id as commenter_id,
			comments.user_follows as user_follows,
            reposters.repost_users as repost_users,
	        reposters.count_repost as count_reposts
            
        FROM posts
        JOIN users
            ON users.id = posts.user_id

        LEFT JOIN (
            SELECT
                posts.id AS id,
                array_agg(h.hashtag_name) AS tags
            FROM posts
            LEFT JOIN posts_hashtags AS ph ON posts.id = ph.post_id
            LEFT JOIN hashtags AS h ON ph.hashtag_id = h.id
            GROUP BY posts.id
        ) AS info ON info.id = posts.id

        LEFT JOIN (
            SELECT 
                posts.id AS id,
                array_agg(c.content) AS content,
                array_agg(commenters.id) AS commenter_id,
                array_agg(commenters.username) AS username,
                array_agg(commenters.picture_url) AS profile_picture,
				array_agg(follows.user_follows) AS user_follows,
                COUNT(c.id) AS count_comments
            FROM posts
            LEFT JOIN comments AS c 
                ON posts.id = c.post_id
			LEFT JOIN (
				SELECT c.user_id AS id,
					CASE WHEN $1 = ANY(array_agg(uf.user_id))
						THEN true
						ELSE false
						END as user_follows
				FROM comments AS c
				LEFT JOIN user_follows AS uf
					ON c.user_id = uf.user_follow_id
				GROUP BY c.user_id
			) as follows ON follows.id = c.user_id
            LEFT JOIN users as commenters
                ON commenters.id = c.user_id
            GROUP BY posts.id
        ) AS comments ON comments.id = posts.id

        LEFT JOIN likes 
            ON posts.id = likes.post_id
        LEFT JOIN users AS likers 
        ON likes.user_id = likers.id
        LEFT JOIN user_follows
        ON posts.user_id = user_follows.user_follow_id
        LEFT JOIN (
            SELECT 
                posts.id as post_id,
                COUNT(reposts.post_id) AS count_repost,
                array_agg(users.username) AS repost_users
            FROM reposts
            JOIN posts
            ON reposts.post_id = posts.id
            JOIN users
            ON reposts.user_id = users.id
            GROUP BY reposts.post_id, posts.id
        )AS reposters ON reposters.post_id = posts.id
        WHERE user_follows.user_id = $1
        GROUP BY users.id, posts.id, info.tags, comments.content, comments.username, comments.profile_picture, comments.count_comments, comments.commenter_id, comments.user_follows,reposters.repost_users,reposters.count_repost
        ORDER BY posts.created_at DESC
        LIMIT 20;
        `, [requester_id])

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
                },
                hashtags: e.tags,
                comments: {
                    count_comments: e.count_comments,
                    comments: e.content.map((content, idx) => {
                        return {
                            content: content,
                            author_id: e.commenter_id[idx],
                            author: e.comment_user[idx],
                            authorPhoto: e.comment_pic[idx],
                            user_follows: e.user_follows[idx]
                        }
                    })
                },
                reposts: {
                    count_reposts: e.count_reposts||0,
                    users: e.repost_users||[]
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

async function getTimelineById(req, res) {
    const userId = req.params.id;
    const { requester_id } = req.query
    try {

        const feed = await db.query(`
        SELECT
            users.id AS user_id, users.username, users.picture_url AS profile_picture,
            posts.id AS post_id, posts.link, posts.message, posts.created_at,
            COUNT(likes.post_id) AS count_likes,
            array_agg(likers.username) AS likers,
            info.tags AS tags,
            comments.count_comments AS count_comments,
            comments.content AS content,
            comments.username AS comment_user,
            comments.profile_picture AS comment_pic,
            comments.commenter_id as commenter_id,
			comments.user_follows as user_follows,
            COUNT(reposts.user_id) as count_reposts
            
        FROM posts
        JOIN users
            ON users.id = posts.user_id

        LEFT JOIN (
            SELECT
                posts.id AS id,
                array_agg(h.hashtag_name) AS tags
            FROM posts
            LEFT JOIN posts_hashtags AS ph ON posts.id = ph.post_id
            LEFT JOIN hashtags AS h ON ph.hashtag_id = h.id
            GROUP BY posts.id
        ) AS info ON info.id = posts.id

        LEFT JOIN (
            SELECT 
                posts.id AS id,
                array_agg(c.content) AS content,
                array_agg(commenters.id) AS commenter_id,
                array_agg(commenters.username) AS username,
                array_agg(commenters.picture_url) AS profile_picture,
				array_agg(follows.user_follows) AS user_follows,
                COUNT(c.id) AS count_comments
            FROM posts
            LEFT JOIN comments AS c 
                ON posts.id = c.post_id
			LEFT JOIN (
				SELECT c.user_id AS id,
					CASE WHEN $1 = ANY(array_agg(uf.user_id))
						THEN true
						ELSE false
						END as user_follows
				FROM comments AS c
				LEFT JOIN user_follows AS uf
					ON c.user_id = uf.user_follow_id
				GROUP BY c.user_id
			) as follows ON follows.id = c.user_id
            LEFT JOIN users as commenters
                ON commenters.id = c.user_id
            GROUP BY posts.id
        ) AS comments ON comments.id = posts.id

        LEFT JOIN likes 
            ON posts.id = likes.post_id
        LEFT JOIN users AS likers 
            ON likes.user_id = likers.id
        LEFT JOIN reposts
                ON reposts.post_id=posts.id
        WHERE users.id = $2
        GROUP BY users.id, posts.id, info.tags, comments.content, comments.username, comments.profile_picture, comments.count_comments, comments.commenter_id, comments.user_follows,reposts.post_id
        ORDER BY posts.created_at DESC
        LIMIT 20;
        `, [requester_id, userId])


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
                },
                hashtags: e.tags,
                comments: {
                    count_comments: e.count_comments,
                    comments: e.content.map((content, idx) => {
                        return {
                            content: content,
                            author_id: e.commenter_id[idx],
                            author: e.comment_user[idx],
                            authorPhoto: e.comment_pic[idx],
                            user_follows: e.user_follows[idx]
                        }
                    })
                },
                reposts: {
                    count_reposts: e.count_reposts||0,
                    users: e.repost_users||[]
                }
            })
        })

        res.status(200).send(render);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

async function GetMetadataFromLink(req, res) {
    const { url } = req.headers;
    getLinkPreview(url).then(data => {
        const response = {
            url: data.url||"",
            title: data.title||"",
            description: data.description||"",
            image: data.images||''
        }
        return res.send(response);
    }).catch(err=>res.status(500).send(err))
}

export {
    createPost,
    getTimeline,
    GetMetadataFromLink,
    deletePost,
    updatePost,
    getTimelineById
}