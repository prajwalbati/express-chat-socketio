$(function() {
    const socketURL = $("#socketURL").val();
    let socket = io.connect(socketURL);

    let message = $("#message")
    let username = $("#username")
    let send_message = $("#send_message")
    let send_username = $("#send_username")
    let chatroom = $("#chats")
    let feedback = $("#feedback");

    const scrollChat = () => {
        $("#chatroom").scrollTop($("#chatroom").height());
    };

    //emit a username
    send_username.click(function() {
        let usernameValue = username.val();
        if (usernameValue) {
            $("#usernameLabel, #chatroom, #input_zone").removeClass("hidden");
            $("#usernameLabel label").text(usernameValue);
            $("#connectMessage, #change_username").addClass("hidden");
            socket.emit("change_username", {username:usernameValue}, () => {
                chatroom.append("<p class='systemMessage'>You entered chatroom. Welcome "+usernameValue+"</p>")
                scrollChat();
            });
        }
    });

    socket.on("new_user_enters", (data)=>{
        chatroom.append("<p class='systemMessage'>"+data.username+" entered chatroom. Welcome "+data.username+"</p>");
        scrollChat();
    })

    // emit message
    send_message.click(function(e) {
        e.preventDefault();
        socket.emit("new_message", {username:username.val(), message:message.val()}, () => {
            // ack
        })
        chatroom.append("<p class='message selfSend'>"+username.val()+" : "+message.val()+"</p>")
        message.val("");
        scrollChat();
    })

    //listen to message
    socket.on("new_message", (data)=> {
        feedback.html("");
        chatroom.append("<p class='message'>"+data.username+" : "+data.message+"</p>");
        scrollChat();
    })

    // listen to typing
    message.bind("keypress",() => {
        socket.emit("typing", {username: username.val()});
    })

    // listen on typing
    socket.on("typing", (data)=> {
        feedback.html("<p><i>"+data.username+" is typing a message...</i></p>");
        scrollChat();
    })

});