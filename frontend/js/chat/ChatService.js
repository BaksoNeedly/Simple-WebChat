export default class ChatService {
    
    static async createNewChat(packet) {
        const response = await fetch("/chat/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packet)
        });
        return await response.json();
    }

    static async openChatRoom(packet) {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packet)
        });
        return await response.json();
    }
}