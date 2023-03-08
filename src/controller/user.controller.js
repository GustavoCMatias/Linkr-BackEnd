import { searchUserById } from "../repository/user.repository.js";

export async function GetUserInfo(req,res){
    const userId = req.params.id;
    try {
        const [userRow,userRowCount] = await searchUserById(userId);
        if(userRowCount==0) res.status(404).send('User not found');
        res.send(userRow[0]);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function GetUsersBySearch(req,res){
    const searchTerm = req.params.search;
    try {
        const searchRow = await searchUserById(searchTerm);
        res.send({searchRow});
    } catch (error) {
        res.status(500).send(error);
    }
}