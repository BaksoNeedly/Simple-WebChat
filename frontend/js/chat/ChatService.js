import ApiResponse from "../core/ApiResponse.js";

export default class ChatService {

    static async searchUser(data) {
        const response = await fetch("/chat/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return new ApiResponse(response);
    }

    static async newChat(data) {
        const response = await fetch("/chat/new", {
            method: "POST",
            body: JSON.stringify(data)
        });
        return new ApiResponse(response)
    }
    
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

    static async chat(packetData) {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packetData)
        });

        return await new ApiResponse(response);
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