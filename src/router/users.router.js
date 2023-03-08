import { postRegister, postSignIn } from "../controller/users.controllers.js";
import { registerVerifications, signInVerifications } from "../middleware/user.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { register, signIn } from "../schema/user.schema.js";
import { Router } from "express";


const usersRouter = Router();

usersRouter.post('/sign-up', validateSchema(register), registerVerifications, postRegister);
usersRouter.post('/sign-in', validateSchema(signIn), signInVerifications, postSignIn);

export default usersRouter;