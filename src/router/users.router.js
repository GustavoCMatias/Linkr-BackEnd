import { postRegister, postSignIn, returnUser } from "../controller/users.controllers.js";
import { registerVerifications, signInVerifications } from "../middleware/user.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { register, signIn } from "../schema/user.schema.js";
import { Router } from "express";
import tokenValidation from "../middleware/authValidation.middleware.js";


const usersRouter = Router();

usersRouter.post('/sign-up', validateSchema(register), registerVerifications, postRegister);
usersRouter.post('/sign-in', validateSchema(signIn), signInVerifications, postSignIn);
usersRouter.get('/return-user', tokenValidation, returnUser)

export default usersRouter;