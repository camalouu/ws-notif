const http = require("http")
const { WebSocketServer } = require("ws")
const PORT = 8080

let client

const wsServer = new WebSocketServer({
    server: http.createServer((req, res) => {
        let reqBody = ""
        req
            .on("data", data => reqBody += data.toString())
            .on("end", _ => {
                console.log("REQUEST BODY: ", reqBody)
                try {
                    client.send(reqBody)
                    res.end(JSON.stringify({
                        message: "Notification is sent to the client",
                        error: false
                    }))
                } catch (error) {
                    res.end(JSON.stringify({
                        message: "The client must establish a connection",
                        error: true
                    }))
                }
            })
    }).listen(PORT, _ => console.log("The service is running on port: ", PORT))
})

wsServer.on("connection", connection => {
    client = connection
    client.on("error", console.error);
    client.on("message", data => console.log("Received: %s", data));
    client.on("close", _ => {
        console.log("Connection closed")
        client = null
    })
    client.send("pong")
});