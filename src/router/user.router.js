import { Router } from "express";
import { FollowUser, GetUserFollows, GetUserInfo, GetUsersBySearch, UnfollowUser } from "../controller/user.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { followUser } from "../schema/user.schema.js";

const userRouter = Router();

userRouter.get('/user/:id', tokenValidation, GetUserInfo);
userRouter.get('/users/:search',tokenValidation,GetUsersBySearch);
userRouter.post('/user/follow', validateSchema(followUser),tokenValidation, FollowUser)
userRouter.post('/user/unfollow', validateSchema(followUser),tokenValidation, UnfollowUser)
userRouter.get('/userfollows', tokenValidation, GetUserFollows)

export default userRouter;