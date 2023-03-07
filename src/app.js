import express from "express";
import cors from "cors"
import hashtagRouter from "./router/hashtag.router";

const server = express()
server.use(express.json())
server.use(cors())
server.use([hashtagRouter])

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));

