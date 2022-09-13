const localStorage = window.localStorage;
let connected = false;
let connection = null;
let username = 'Anonymous';
let socket = io({ autoConnect: false });

const connectBtn = document.getElementById('connect');
const disconnectBtn = document.getElementById('disconnect');
const setNameBtn = document.getElementById('setname');
const messageBox = document.getElementById('chatbox');
const messageForm = document.getElementById('msgform');
const messageInput = document.getElementById('textinput');

function checkName() {
  if (username == "Anonymous") {
    if (localStorage.getItem('username') != null) {
      username = localStorage.getItem('username');
    }
  }
}
checkName();

connectBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.connect();
});

disconnectBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.disconnect();
});

setNameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const newName = prompt(`Twoja aktualna nazwa: ${username}\nPodaj swoją nową nazwę:`);
  if (newName == null | newName == '') return;
  localStorage.setItem('username', newName);
  username = localStorage.getItem('username');
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msgContent = messageInput.value;
  if (msgContent.trim() == '') {
    return;
  }
  messageInput.value = '';
  socket.emit('sendMsg', { author: username, content: msgContent.trim() });
});

socket.on('connect', () => {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = 'color:green';
  newMsg.textContent = 'Połączono z czatem!';
  messageBox.appendChild(newMsg);
  socket.emit('join', { name: username });
});

socket.on('disconnect', () => {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = 'color:red';
  newMsg.textContent = 'Rozłączono z czatem!';
  messageBox.appendChild(newMsg);
});

socket.on('message', (message) => {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = 'color:white';
  newMsg.textContent = `${message.author}: ${message.content}`;
  messageBox.appendChild(newMsg);
});

socket.on('userJoin', (message) => {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = 'color:lightgrey';
  newMsg.textContent = `${message.name} dołączył(a) do czatu.`;
  messageBox.appendChild(newMsg);
});

socket.on('userLeave', (message) => {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = 'color:lightgrey';
  newMsg.textContent = `${message.name} opuścił(a) czat.`;
  messageBox.appendChild(newMsg);
});