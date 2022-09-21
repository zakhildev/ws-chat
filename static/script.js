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
  let newName = prompt(`Twoja aktualna nazwa: ${username}\nPodaj swoją nową nazwę:`);
  newName = newName.trim();
  if (newName.length > 16) {
    alert("Nazwa nie może być dłuższa niż 16 znaków!");
    return;
  }
  if (newName == null | newName == '') {
    alert("Nazwa nie może być pusta!");
    return;
  };
  localStorage.setItem('username', newName);
  username = localStorage.getItem('username');
  alert(`Nazwa została zmieniona na: ${username}`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msgContent = messageInput.value;
  if (msgContent.trim() == '') {
    return;
  }

  if (msgContent.trim().length > 200) {
    alert(`Wiadomość jest zbyt długa! (${msgContent.trim().length}/200)`);
    return;
  }
  messageInput.value = '';
  socket.emit('sendMsg', { author: username, content: msgContent.trim() });
});

function createMsg(color, msg) {
  const newMsg = document.createElement('div');
  newMsg.className = 'chatmsg';
  newMsg.style = `color:${color}`;
  newMsg.textContent = msg;
  return newMsg;
}

socket.on('connect', () => {
  const newMsg = createMsg('green', 'Połączono z czatem!');
  messageBox.appendChild(newMsg);
  socket.emit('join', { name: username });
});

socket.on('disconnect', () => {
  const newMsg = createMsg('red', 'Rozłączono z czatem!');
  messageBox.appendChild(newMsg);
});

socket.on('message', (message) => {
  const newMsg = createMsg('white', `${message.author}: ${message.content}`);
  messageBox.appendChild(newMsg);
});

socket.on('userJoin', (message) => {
  const newMsg = createMsg('lightgrey', `${message.name} dołączył(a) do czatu.`);
  messageBox.appendChild(newMsg);
});

socket.on('userLeave', (message) => {
  const newMsg = createMsg('lightgrey', `${message.name} opuścił(a) czat.`);
  messageBox.appendChild(newMsg);
});