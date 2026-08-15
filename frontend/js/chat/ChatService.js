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

    static async uploadFile(file){
        if(file){
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/upload", {
                method: "POST",
                body: formData
            })
        }
    }

    static async downloadFile(packet){
        const response = await fetch("/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packet.toData())
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = packet.getName();
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}