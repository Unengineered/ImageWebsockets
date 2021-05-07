
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const app = express()
const fs = require('fs')
//initialize a simple http server
const server = http.createServer(app)

//to use the upload folder
app.use('/uploads', express.static(__dirname + '/uploads'))

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + "/browser.html")
})

//to convert string to arrayBuffer
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        let data = JSON.parse(message)
        let image = new Buffer.from(str2ab(data.ab));
        fs.writeFile('./uploads/' + data.fileName, image, 'binary', function (err) {
            if (err) {
                console.log("error")
            }
            else {
                console.log("done")
            }
        }
        )


        let fileInfo = {
            fileName: data.fileName,
            fileSize: data.fileSize,
            fileType: data.fileType
        }
        console.log(fileInfo)
        //log the received message and send it back to the client
        console.log(`received:${data.fileName}`);
        for (var cl of wss.clients) {
            cl.send(message);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});