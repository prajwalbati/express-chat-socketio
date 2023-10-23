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
        $("#chats").scrollTop($("#chats").height());
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
        socket.emit("new_message", { username: username.val(), message: message.val() }, () => {
            // ack
        });

        let messageBox = `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                    <p class="text-sm">${message.val()}</p>
                </div>
                <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        </div>`;

        chatroom.append(messageBox);
        message.val("");
        scrollChat();
    })

    //listen to message
    socket.on("new_message", (data)=> {
        feedback.html("");

        let messageBox = `<div class="flex w-full mt-2 space-x-3 max-w-xs">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                <p class="text-sm">${data.message}</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">2 min ago</span>
            </div>
        </div>`;

        chatroom.append(messageBox);
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