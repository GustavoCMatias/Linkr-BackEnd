import { getPostById, insertNewRepost } from "../repository/reposts.repository.js";


export async function PostRepost(req,res){
    const postId = req.body.post_id;
    const userRequestingId = res.locals.user;
    try {
        const postRows = await getPostById(postId);
        if(postRows.rowCount == 0) return res.status(404).send('post não encontrado')
        await insertNewRepost(postId,userRequestingId);
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}