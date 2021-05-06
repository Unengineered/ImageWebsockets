
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

app.get('/upload',(req,res)=>{
    res.sendFile(__dirname+"/browser.html")
})

wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        let data =  new Buffer.from(message);
        fs.writeFile('./uploads/'+ data.length+'.png', data, 'binary', function (err) {
                if (err) {
                    console.log("error")
                }
                else {
                    console.log("done")
                }
            }
        )
        //log the received message and send it back to the client
        //console.log('received: %s', message);
        for(var cl of wss.clients) {
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