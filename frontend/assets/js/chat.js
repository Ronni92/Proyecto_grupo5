document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Configuración de WebSocket
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onopen = () => {
        console.log("Conectado al servidor WebSocket.");
    };

    ws.onmessage = (event) => {
        const messages = JSON.parse(event.data);
        chatContainer.innerHTML = "";

        messages.forEach(({ sender, message }) => {
            const msgDiv = document.createElement("div");
            if (sender === 'user') {
                msgDiv.classList.add("user-message-container");
                msgDiv.innerHTML = `<div class="user-message">${message}</div>`;
            } else {
                msgDiv.classList.add("bot-message-container");
                msgDiv.innerHTML = `<div class="bot-message">${message}</div>`;
            }
            chatContainer.appendChild(msgDiv);
        });

        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        alert("Se perdió la conexión con el servidor.");
    };

    sendBtn.addEventListener("click", () => {
        enviarMensaje();
    });

    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            enviarMensaje();
        }
    });

    function enviarMensaje() {
        const message = userInput.value.trim();
        if (message) {
            ws.send(message);
            userInput.value = "";
        }
    }
});
