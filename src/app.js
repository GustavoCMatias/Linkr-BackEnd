import express from "express";
import cors from "cors"

const server = express()
server.use(express.json())
server.use(cors())
server.use([])

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running in port: ${port}`));

