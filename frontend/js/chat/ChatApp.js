import WebSocketClient from "../core/WebSocketClient.js";
import NewChatUI from "./NewChatUI.js";

import JoinMessagePacket from "../packets/websocket/JoinMessagePacket.js";
import UpdateStatusPacket from "../packets/websocket/UpdateStatusPacket.js";
import TotalUserPacket from "../packets/websocket/TotalUserPacket.js";

import User from "./user/User.js";
import UserService from "./user/UserService.js";
import ChatService from "./ChatService.js";
import RoomManager from "./room/RoomManager.js";
import Room from "./room/Room.js";
import Message from "./message/Message.js";
import ChatUI from "./ui/chat/ChatUI.js";
import SidebarUI from "./ui/sidebar/SidebarUI.js";

export default class ChatApp {
    #user = null;

    constructor() {
        this.socket = new WebSocketClient();
        this.sidebarUI = new SidebarUI();
        this.newChatUI = new NewChatUI();
        this.chatUI = new ChatUI();

        this.setupSocket();
        this.setupEvents();
    }

    async #init() {
        try {
            this.#user = User.fromData(await UserService.fetchProfile());
            const user = this.getUser();
            const contacts = user.getContacts();

            Object.values(contacts).forEach((contact) => {
                this.sidebarUI.getBodyUI().addUser(contact.getUsername());
                RoomManager.create(new Room(contact.getUsername()));
            });

            this.sidebarUI.getFooterUI().setUsername(user.getUsername());
        } catch (error) {
            console.error("Failed to initialize ChatApp:", error);
        }
    }

    getUser() {
        return this.#user;
    }

    isMobile(){
        return window.matchMedia("(max-width: 732px)").matches;
    }

    setupSocket() {
        this.socket.onOpen = async () => {
            this.socket.sendData(new UpdateStatusPacket().toData());

            if (this.pingInterval) clearInterval(this.pingInterval);

            await this.#init();

            this.pingInterval = setInterval(() => {
                this.socket.sendData({ type: "ping" });
            }, 1000);
        };
    }

    setupEvents() {
        this.socket.onMessage = (event) => {
            const data = JSON.parse(event.data);
            if (!data || !data.type) return;

            switch (data.type) {
                case "total_user":
                    const totalUserPacket = TotalUserPacket.fromData(data);
                    this.chatUI.getHeaderUI().setOnlineCount(totalUserPacket.getOnlineUsers());
                    break;

                case "update_status":
                    const statusPacket = UpdateStatusPacket.fromData(data);
                    if (this.getUser()) {
                        this.sidebarUI
                            .getBodyUI()
                            .updateContactStatus(this.getUser().getContact(statusPacket.getUsername()));
                    }
                    break;

                case "message":
                    const message = Message.fromData(data);
                    if (message.getSender() !== this.getUser().getUsername()) {
                        this.chatUI.getBodyUI().addReceivedMessage(message);
                    }
                    const room = this.getUser().getCurrentRoom();
                    if (room) {
                        room.addMessage(message);
                    }
                    break;

                case "join_message":
                    this.chatUI.getBodyUI().addJoinMessage(JoinMessagePacket.fromData(data));
                    break;
            }
        };

        this.socket.onClose = () => {
            if (this.pingInterval) clearInterval(this.pingInterval);
        };

        // Modal New Chat Events (Header & Body)
        this.sidebarUI.getHeaderUI().onClickNewChat(() => {
            this.newChatUI.show();
        });

        this.newChatUI.onCancel(() => {
            this.newChatUI.hide();
        });

        this.newChatUI.onStartNewChat(async (packet) => {
            const data = await ChatService.createNewChat(packet.toData());

            if (data.message) {
                this.newChatUI.setLabel(data.message, data.success ? "black" : "red");
            }
            if (data.success) {
                this.newChatUI.hide();
                const newContact = packet.getUsername();
                this.#user.addContact(newContact);
                this.sidebarUI.getBodyUI().addUser(newContact);
            }
        });

        // Chat Room Navigation Events (Body)
        this.sidebarUI.getBodyUI().onClickRoom(async (packet) => {
            const chatData = await ChatService.openChatRoom(packet.toData());
            if (chatData.success) {
                this.chatUI.getBodyUI().clearMessages();
                this.chatUI.getBodyUI().show();
                this.chatUI.getHeaderUI().setTitle(packet.getUsername());

                this.socket.sendData(new JoinMessagePacket().toData());

                const room = RoomManager.get(packet.getUsername());
                this.getUser().setCurrentRoom(room);

                if(this.isMobile()){
                    this.sidebarUI.hide();
                    this.chatUI.show();
                }

                Object.entries(room.getMessages()).forEach(([, message]) => {
                    if (message.getSender() === this.getUser().getUsername()) {
                        this.chatUI.getBodyUI().addSentMessage(message);
                    } else {
                        this.chatUI.getBodyUI().addReceivedMessage(message);
                    }
                });
            }
        });

        this.chatUI.getHeaderUI().onExit(
            () => {
                this.chatUI.hide();
                this.sidebarUI.show();
            }
        );

        // Send Message Events
        this.chatUI.onSendMessage(async (message) => {
            this.chatUI.getBodyUI().addSentMessage(message);
            this.socket.sendData(message.toData());
        });

        // File Attachment Events
        this.chatUI.getFooterUI().onAttachFile((file) => {
            if (file) {
                this.chatUI.getFooterUI().attachFile(file);
            }
        });

        this.chatUI.getFooterUI().onAttachCancel(() => {
            this.chatUI.getFooterUI().removeAttachedFile();
        });

    }
}