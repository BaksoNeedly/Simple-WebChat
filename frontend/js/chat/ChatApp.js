import WebSocketClient from "../core/WebSocketClient.js";
import SidebarUI from "./SidebarUI.js";
import NewChatUI from "./NewChatUI.js";

import ChatUI from "./ChatUI.js";
import MessagePacket from "../packets/websocket/MessagePacket.js";
import JoinMessagePacket from "../packets/websocket/JoinMessagePacket.js";
import UpdateStatusPacket from "../packets/websocket/UpdateStatusPacket.js";
import TotalUserPacket from "../packets/websocket/TotalUserPacket.js";
import User from "./user/User.js";
import UserService from "./user/UserService.js";
import ChatService from "./ChatService.js";
import RoomManager from "./room/RoomManager.js";
import Room from "./room/Room.js";
import MessageHistoryPacket from "../packets/websocket/MessageHistoryPacket.js";
import Message from "./message/Message.js";

export default class ChatApp {

    #user = null;

    constructor(){
        this.socket = new WebSocketClient();
        this.sidebarUI = new SidebarUI();
        this.newChatUI = new NewChatUI();
        this.chatUI = new ChatUI();

        this.setupSocket();
        this.setupEvents();

        this.#init();
    }

    async #init(){
        try{
            this.#user = User.fromData(await UserService.fetchProfile());
            const user = this.getUser();
            const contacts = user.getContacts();
            Object.values(contacts).forEach(contact => {
                this.sidebarUI.addUser(contact.getUsername());
                RoomManager.create(
                    new Room(contact.getUsername())
                );
            });
            this.sidebarUI.setUsername(user.getUsername());            
        }catch(error){
            console.error("Failed to initialize ChatApp:", error);
        }
    }

    getUser(){
        return this.#user;
    }

    setupSocket(){
        this.socket.onOpen = async () => {
            this.socket.sendData(new UpdateStatusPacket().toData());            

            // Clear any existing ping interval to avoid memory leaks on reconnect
            if (this.pingInterval) clearInterval(this.pingInterval);

            this.pingInterval = setInterval(() => {
                this.socket.sendData({
                    type: "ping"
                });  
                // console.log(RoomManager.getAll())
            }, 1000 * 1);

        }
    }

    setupEvents(){        

        this.socket.onMessage = (event) => {
            // console.log(event.data)
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
                    const packet = UpdateStatusPacket.fromData(data);
                    if(this.getUser()){
                        this.sidebarUI.updateContactStatus(this.getUser().getContact(packet.getUsername()));
                    }
                    break;
                case "message":
                    const message = Message.fromData(data);
                    if(message.getSender() !== this.getUser().getUsername())
                        this.chatUI.addReceivedMessage(Message.fromData(data));
                    const room = this.getUser().getCurrentRoom();
                    if(room){
                        room.addMessage(message);
                    }
                    break;

                case "join_message":
                    this.chatUI.addJoinMessage(JoinMessagePacket.fromData(data));
                    break;
            }
        }

        this.socket.onClose = (event) => {
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
        this.newChatUI.onStartNewChat(async (packet) => {
            const data = await ChatService.createNewChat(packet.toData());
            
            if (data.message) {
                this.newChatUI.setLabel(data.message, data.success ? "black" : "red");
            }
            if (data.success) {
                this.newChatUI.hide();
                const newContact = packet.getUsername();
                
                this.#user.addContact(newContact);
                this.sidebarUI.addUser(newContact);
            }
        });

        this.sidebarUI.onClickRoom(async (packet) => {
            const chatData = await ChatService.openChatRoom(packet.toData());
            
            if (chatData.success) {
                this.chatUI.clearMessages();
                this.chatUI.show();
                this.chatUI.setTitle(packet.getUsername());
                this.socket.sendData(new JoinMessagePacket().toData());
                const room = RoomManager.get(packet.getUsername());
                this.getUser().setCurrentRoom(room);
                Object.entries(room.getMessages()).forEach(([key, message]) => {
                    if(message.getSender() === this.getUser().getUsername()){
                        this.chatUI.addSentMessage(message);                        
                    }else this.chatUI.addReceivedMessage(message);
                })
            }
        });

        this.chatUI.onSendMessage(
            (packet) => {
                this.chatUI.addSentMessage(packet);
                this.chatUI.clearInput();
                this.socket.sendData(packet.toData());
            }
        );
    }
}