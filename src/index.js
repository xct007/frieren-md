import { main } from "./helper/connect.js";
import readCommand from "./helper/readCommand.js";
import express from 'express'

async function server() {
    const app = express()
    app.use("/", (req, res) => {
        res.send({
            "test": "test"
        })
    })

}

server()
await readCommand();
main();
