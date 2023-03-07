import { Router } from "express";
import { GetUserInfo } from "../Controllers/UserController";

const router = Router();

router.get('/user/:id',/*autenticacao usuario,*/GetUserInfo);

export default router;