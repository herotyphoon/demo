const socket = io();

    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatBox = document.getElementById('chat-box');

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (message !== "") {
        socket.emit('chatMessage', message);
        messageInput.value = '';
      }
    });

    socket.on('chatMessage', (msg) => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerText = msg;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    });