const express = require('express')
require('dotenv').config();
const app = express()

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get("/", (req, res) => {
    res.render("index")
})

//listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket)=>{
    //default username

    // listen on change_username
    socket.on("change_username", (data, callback) => {
        socket.broadcast.emit("new_user_enters", {username:data.username});
        callback();
    })

    // listen on send_message
    socket.on("new_message", (data, callback)=> {
        socket.broadcast.emit("new_message", {message:data.message, username:data.username})
        callback();
    })

    // listen on typing
    socket.on("typing", (data)=> {
        socket.broadcast.emit("typing", {username:data.username})
    })
})