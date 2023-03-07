import express from "express";
import cors from "cors"
import hashtagRouter from "./router/hashtag.router.js";
import dotenv from 'dotenv'
dotenv.config()

import userRouter from "../src/Routers/UserRouter.js"

const server = express()
server.use(express.json())
server.use(cors())
server.use([hashtagRouter])
server.use(userRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));