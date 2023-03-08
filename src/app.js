import express from "express";
import cors from "cors"
import hashtagRouter from "./router/hashtag.router.js";
import dotenv from 'dotenv'
import userRouter from "./router/user.router.js";
dotenv.config()

const server = express()
server.use(express.json())
server.use(cors())
server.use([hashtagRouter])
server.use(userRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));