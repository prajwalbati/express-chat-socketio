$(function() {
    // make connection
    const socketURL = $("#socketURL").val();
    var socket = io.connect(socketURL);
    // let socket = io.connect("https://express-chat-socketio.onrender.com");
    //buttons and inputs
    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("#send_username")
    var chatroom = $("#chats")
    var feedback = $("#feedback")

    //emit a username
    send_username.click(function() {
        socket.emit("change_username", {username:username.val()}, () => {
            chatroom.append("<p class='userEnterMessage'>You entered chatroom. Welcome "+username.val()+"</p>")
        })
    })

    socket.on("new_user_enters", (data)=>{
        chatroom.append("<p class='userEnterMessage'>"+data.username+" entered chatroom. Welcome "+data.username+"</p>")
    })

    // emit message
    send_message.click(function(e) {
        e.preventDefault();
        socket.emit("new_message", {message:message.val()}, () => {
            // ack
        })
        chatroom.append("<p class='message'>"+username.val()+" : "+message.val()+"</p>")
        message.val("")
    })

    //listen to message
    socket.on("new_message", (data)=> {
        feedback.html("");
        chatroom.append("<p class='message'>"+data.username+" : "+data.message+"</p>")
    })

    // listen to typing
    message.bind("keypress",() => {
        socket.emit("typing");
    })

    // listen on typing
    socket.on("typing", (data)=> {
        feedback.html("<p><i>"+data.username+" is typing a message...</i></p>")
    })

});