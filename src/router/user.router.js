import { Router } from "express";
import { GetUserInfo, GetUsersBySearch } from "../controller/user.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";

const userRouter = Router();

userRouter.get('/user/:id', tokenValidation, GetUserInfo);
userRouter.get('/users/:search',GetUsersBySearch);

export default userRouter;