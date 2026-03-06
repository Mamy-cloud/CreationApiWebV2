const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const host = window.location.host;
const socketUrl = `${protocol}${host}/ws/hello`;

const socket = new WebSocket(socketUrl);

socket.onopen = () => {
    console.log("Connexion WebSocket ouverte");
};

socket.onmessage = () => {
    console.log("Message reçu du serveur (ignorer le contenu)"); 
};

socket.onclose = () => {
    console.log("Connexion WebSocket fermée");
};

socket.onerror = (err) => {
    console.error("Erreur WebSocket:", err);
};
