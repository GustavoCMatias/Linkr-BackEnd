import express from "express";
import cors from "cors"

import userRouter from "../src/Routers/UserRouter.js"

const server = express()
server.use(express.json())
server.use(cors())
server.use([])
server.use(userRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));

