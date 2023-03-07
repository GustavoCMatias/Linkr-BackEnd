import { db } from "../database/database.connection";

export function GetUserInfo(req,res){
    const userId = req.params.id;
    try {
        const user = [userId];//funcao no repository para achar usuario pelo id;
        if(user.rowCount==0) res.status(404).send('User not found');
        res.send(user.row[0]);
    } catch (error) {
        res.status(500).send(error);
    }
}