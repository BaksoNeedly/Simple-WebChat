import WebSocketClient from "./WebSocketClient.js";
import SidebarUI from "./SidebarUI.js";
import NewChatUI from "./NewChatUI.js";
import Connect from "./models/Connect.js";
import CreateRoom from "./packets/CreateRoom.js";

import ChatUI from "./ChatUI.js";
import MessagePacket from "../packets/websocket/MessagePacket.js";
import JoinMessagePacket from "../packets/websocket/JoinMessagePacket.js";
import GlobalJoinPacket from "../packets/websocket/GlobalJoinPacket.js";
import UpdateStatusPacket from "../packets/websocket/UpdateStatusPacket.js";
import TotalUserPacket from "../packets/websocket/TotalUserPacket.js";

export default class ChatApp {

    constructor(){
        this.webSocketClient = new WebSocketClient();
        this.sidebarUI = new SidebarUI();
        this.newChatUI = new NewChatUI();
        this.chatUI = new ChatUI();
        this.setupEvents();
    }

    async loadUsers(){
        const loadUser = await fetch("/chat/load");
        return await loadUser.json();
    }

    setupEvents(){

        this.webSocketClient.onOpen = async () => {
            const loadUser = await fetch("/chat/load");
            const loadUserData = await loadUser.json();

            console.log(loadUserData);

            const username = loadUserData["username"];
            JSON.parse(loadUserData["contacts"]).forEach(contact => {
                this.sidebarUI.addUser(contact);
            });
            this.sidebarUI.setUsername(username)

            this.webSocketClient.sendData(new UpdateStatusPacket().toData());

            // Clear any existing ping interval to avoid memory leaks on reconnect
            if (this.pingInterval) clearInterval(this.pingInterval);

            // Send a ping packet every 30 seconds
            this.pingInterval = setInterval(() => {
                this.webSocketClient.sendData({
                    type: "ping"
                });
                console.log("CLICK");
            }, 1000 * 1);
        }

        this.webSocketClient.onMessage = (event) => {
            console.log(event.data)
            const data = JSON.parse(event.data)
            if(!data) return;

            const type = data.type;
            if(!type) return;

            switch(type){
                case "total_user":
                    const totalUserPacket = TotalUserPacket.fromData(data);
                    this.chatUI.setTotalUser(totalUserPacket);
                    break;
                case "update_status":
                    console.log("GLOBAL JOIN");
                    const packet = UpdateStatusPacket.fromData(data);
                    document.querySelectorAll(".user-2-chat").forEach(element => {
                        if(element.querySelector(".user-2-name").textContent === packet.getUsername()){
                            const status = element.querySelector(".user-2-status");
                            status.textContent = "ONLINE";
                            status.style.color = "lightgreen";
                        }
                    });
                    break;
                case "search_user":
                    const valid = data.valid;
                    const label = this.newChatUI.getLabel();
                    if(!valid){
                        label.textContent = "User not found.";
                        label.style.color = "red";
                        return;
                    }

                    createRoom = new CreateRoom(data.username);
                    break;
                case "message":
                    this.chatUI.addReceivedMessage(MessagePacket.fromData(data));
                    break;

                case "join_message":
                    this.chatUI.addJoinMessage(JoinMessagePacket.fromData(data));
                    break;
            }
        }

        this.webSocketClient.onClose = (event) => {
            if (this.pingInterval) clearInterval(this.pingInterval);
        }

        this.sidebarUI.onClickNewChat(
            () => {                
                this.newChatUI.show();
            }
        );
        this.newChatUI.onCancel(
            () => {
                this.newChatUI.hide();
            }
        );
        this.newChatUI.onStartNewChat(
            async (packet) => {
                console.log(packet.toData());
                const response = await fetch("/chat/new", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(packet.toData())
                });
                const data = await response.json();
                if(data.message){
                    this.newChatUI.setLabel(data.message, data.success === true ? "black" : "red");
                }
                if(data.success){
                    this.newChatUI.hide();
                    this.sidebarUI.addUser(packet.getUsername());
                }
            }
        );


        this.sidebarUI.onClickUser(
            async (packet) => {
                const chatResponse = await fetch("/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(packet.toData())
                })
                const chatData = await chatResponse.json();
                if(chatData.success){
                    this.chatUI.clearMessages();
                    // console.log(chatData);
                    this.chatUI.show();
                    this.chatUI.setTitle(packet.getUsername());

                    this.webSocketClient.sendData((new JoinMessagePacket()).toData())
                }                
            }
        );

        this.chatUI.onSendMessage(
            (packet) => {
                this.chatUI.addSentMessage(packet);
                this.chatUI.clearInput();
                this.webSocketClient.sendData(packet.toData());
            }
        );
    }
}