import express from "express";
import cors from "cors"
import hashtagRouter from "./router/hashtag.router.js";
import dotenv from 'dotenv'
import usersRouter from "./router/users.router.js";
dotenv.config()

const server = express()
server.use(express.json())
server.use(cors())
server.use([hashtagRouter, usersRouter])

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));