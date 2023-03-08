import { Router } from "express";
import { GetUserInfo } from "../controller/user.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";

const userRouter = Router();

userRouter.get('/user/:id',/* tokenValidation, */GetUserInfo);
userRouter.get('/users/:search')

export default userRouter;