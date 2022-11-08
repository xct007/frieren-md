import { main } from "./helper/connect.js";
import readCommand from "./helper/readCommand.js";
import express from 'express'

async function server() {
    const app = express()
    const port = 3000;

    app.use("/", (req, res) => {
        res.send({
            "test": "test"
        })
    })

    app.listen(port, () => {
        console.log(`Running on http://localhost:${port}`)
    })
}

server()
await readCommand();
main();
