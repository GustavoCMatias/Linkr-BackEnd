import { deleteFollowUser, followUser, getFollowersForUser, searchUserById, searchUsersByString, userFollowsUser } from "../repository/user.repository.js";

export async function GetUserInfo(req,res){
    const userId = req.params.id;
    const userRequestingId = res.locals.user;
    try {
        const [userRow,userRowCount] = await searchUserById(userId);
        const rowFollow = await userFollowsUser(userRequestingId,userId);
        if(userRowCount==0) return res.status(404).send('User not found');
        res.send({...userRow[0], isFollowing: rowFollow>0});
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function GetUsersBySearch(req,res){
    const searchTerm = req.params.search;
    const userId = res.locals.user;
    try {
        const searchRow = await searchUsersByString(userId,searchTerm);
        res.send([searchRow]);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function FollowUser(req,res){
    const userId = req.body.userId;
    const userRequestingId = res.locals.user;
    try {
        const [userRowCount] = await searchUserById(userId);
        if(userRowCount==0) return res.status(404).send('User not found');
        await followUser(userRequestingId,userId);
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function UnfollowUser(req,res){
    const userId = req.body.userId;
    const userRequestingId = res.locals.user;
    try {
        const [userRowCount] = await searchUserById(userId);
        if(userRowCount==0) return res.status(404).send('User not found');
        await deleteFollowUser(userRequestingId,userId);
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function GetUserFollows(req,res){
    const userId = res.locals.user;
    try {
        const rows = await getFollowersForUser(userId);
        res.send(rows);
    } catch (error) {
        res.status(500).send(error);
    }
}