const socket = io();
// socket used to connect our client to the io in the node server 
// io is used to manage all the clients and here we are connecting to io node server as a client with socket.

// audio sound on an incoming message
var audio = new Audio('/static/ringtone.mp3');



let container = document.querySelector('.container');
form = document.querySelector('.submit');
let msgInput = document.querySelector('.msgInput');


// append function basically append our container to the chat container by creating a div.
const append = (message, direction) => {

    let chat = document.createElement('div');
    chat.innerText = message;
    chat.classList.add('message');
    chat.classList.add(direction);
    container.append(chat);


}

form.addEventListener('submit', (e) => {

    e.preventDefault();
    let msg = msgInput.value;
    msg = msg.trim();
    append(`You: ${msg}`, 'right')
    scroll();
    // emits the event to the server about sent message
    socket.emit('send', msg);
    msgInput.value = ""
})

do {
    name = prompt('Enter your name to join');
} while (!name);

// this emit event to the server about the new user and gives the name in response accepts an event and tells all clients about it except the one who joined
socket.emit('new-user', name);
socket.on('new-user joined', (name) => {
    append(`${name} has joined the chat`, 'left')
    scroll();

})

// this accepts the event and receives the message  
socket.on('receive', (data) => {

    audio.play();
    append(`${data.name}: ${data.message}`, 'left');
    scroll();
})

// on disconnection accepts an event and tells the clients about it except the one who left
socket.on('leave', (name) => {
    append(`${name} has left the chat`, 'left');
    scroll();

})



// this function used to scroll the chat to the latest
function scroll() {
    container.scrollTop = container.scrollHeight;
}
