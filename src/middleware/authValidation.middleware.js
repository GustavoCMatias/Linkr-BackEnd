import { searchToken } from "../repository/auth.repository.js"


export default async function tokenValidation(req, res, next){
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")

    if(!token) return res.sendStatus(401)

    try{
        const row_info = await searchToken(token)

        if(row_info[1] === 0) return res.sendStatus(401)

        res.locals.user = row_info[0][0].user_id
        
        next();
    }catch(error){
        res.status(500).send(error.message)
    }

}