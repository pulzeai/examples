const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
    console.log('WebSocket Client Connected');
};

ws.onmessage = function(e) {
    const response = JSON.parse(e.data);
    updateChat(`Bot: ${response.message}`, false);
};

function updateChat(message, isUser) {
    const chatDiv = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight; // Auto-scroll to the latest message
}

function sendMessage() {
    const input = document.getElementById('input');
    const message = input.value;
    input.value = '';

    updateChat(`You: ${message}`, true);

    ws.send(message);
}
