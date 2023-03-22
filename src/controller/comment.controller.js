import { insertNewComment } from "../repository/comment.repository.js"


export async function postComment(req, res){
    const {content, post_id} = req.body
    const user_id = res.locals.user

    try{
        res.status(200).send(render);
        await insertNewComment(content, post_id, user_id)
    }catch (error) {
        res.status(500).send(error.message)
    }
}