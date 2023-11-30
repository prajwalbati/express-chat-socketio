# Simple Chat App
This is a simple chat app created using node.js and socket.io

To run the application in development: `npm run dev`

To run the application in production:  `npm run start`


## To run in docker
To build docker image: `docker build -t express-chat-socketio .`

To run docker image in container: `docker run express-chat-socketio`


### TODO:
1. A registration system with the possibility to chat in a one-to-one chatroom
2. History of all the conversations
3. Online/offline labels
4. Copy every features of WhatsApp
