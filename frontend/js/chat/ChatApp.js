import WebSocketClient from "../core/WebSocketClient.js";
import NewChatUI from "./ui/overlay/new-chat/NewChatUI.js";

import JoinMessagePacket from "../packets/websocket/JoinMessagePacket.js";
import UpdateStatusPacket from "../packets/websocket/UpdateStatusPacket.js";
import TotalUserPacket from "../packets/websocket/TotalUserPacket.js";

import User from "./user/User.js";
import UserService from "./user/UserService.js";
import ChatService from "./ChatService.js";
import RoomManager from "./room/RoomManager.js";
import Room from "./room/Room.js";
import Message from "./message/Message.js";
import SidebarUI from "./ui/sidebar/SidebarUI.js";
import ChatListUI from "./ui/chat/list/ChatListUI.js";
import Contact from "./user/Contact.js";
import ChatAreaUI from "./ui/chat/area/ChatAreaUI.js";
import RoomService from "./room/RoomService.js";
import EnterRoomPacket from "../packets/websocket/EnterRoomPacket.js";
import UserEnterRoomPacket from "../packets/websocket/UserEnterRoomPacket.js";
import LeaveRoomPacket from "../packets/websocket/LeaveRoomPacket.js";
import SettingsUI from "./ui/overlay/settings/SettingsUI.js";

export default class ChatApp {
    #user = null;

    constructor() {
        this.socket = new WebSocketClient();
        this.sidebarUI = new SidebarUI();
        this.newChatUI = new NewChatUI();
        this.chatListUI = new ChatListUI();
        this.chatAreaUI = new ChatAreaUI();
        this.settingsUI = new SettingsUI();

        this.setupEvents();
        this.setupSocket();
    }

   async #init() {
        // try {
            const response = await UserService.fetchProfile();

            this.#user = User.fromData(response.getData());

            const user = this.getUser();
            // const contacts = user.getContacts();

            // Object.values(contacts).forEach((contact) => {
            //     this.sidebarUI.getBodyUI().addUser(contact.getUsername());
            //     RoomManager.create(new Room(contact.getUsername()));
            // });

            this.sidebarUI.getFooterUI().setUsername(user.getUsername());
            this.sidebarUI.getFooterUI().online();
            this.settingsUI.getHeaderUI().setUsername(user.getUsername());
            this.settingsUI.getHeaderUI().online();

        // } catch (error) {
        //     console.error("Failed to initialize ChatApp:", error);
        // }
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

            // if (this.pingInterval) clearInterval(this.pingInterval);

            await this.#init();

            this.pingInterval = setInterval(() => {
                this.socket.sendData({ type: "ping" });

                // console.log("TICK:", RoomManager.getAll());
                // Object.entries(RoomManager.getAll()).forEach(([key, value]) => {
                //     console.log("TICK:", key, "Messages:", value.getMessages());

                //     console.log("TICK:", key+"UNREAD MESSAGES:", value.getUnreadMessages());
                // })

            }, 1000);
        };
    }

    setupEvents() {
        this.socket.onMessage = (event) => {
            const data = JSON.parse(event.data);

            // console.log(data);

            if (!data || !data.type) return;

            switch (data.type) {
                case "total_user":
                    const totalUserPacket = TotalUserPacket.fromData(data);
                    this.chatAreaUI.getHeaderUI().setStatus(`${totalUserPacket.getOnlineUsers()} Online`);
                    break;

                case "update_status":
                    // const statusPacket = UpdateStatusPacket.fromData(data);
                    // if (this.getUser()) {
                    //     this.sidebarUI
                    //         .getBodyUI()
                    //         .updateContactStatus(this.getUser().getContact(statusPacket.getUsername()));
                    // }
                    break;

                case "message":
                    const message = Message.fromData(data);
                    console.log(message);
                    if (message.getSender() !== this.getUser().getUsername()) {
                        this.chatAreaUI.getBodyUI().addReceivedMessage(message);
                    }
                    const room = this.getUser().getCurrentRoom();
                    const contact = this.getUser().getContact(message.getSender()) ?? new Contact(message.getSender());
                    if (room) {
                        room.addMessage(message);
                        this.chatListUI.getBodyUI().setSpecificContact(contact, room);
                    }else{                        
                        this.getUser().addContact(contact);
                        this.chatListUI.getBodyUI().addContact(contact);
                        const room = new Room(message.getSender());
                        RoomManager.create(room);
                    }
                    break;

                case "join_message":
                    this.chatAreaUI.getBodyUI().addJoinMessage(JoinMessagePacket.fromData(data));
                    break;

                case "user_enter_room":
                    const userEnterRoomPacket = UserEnterRoomPacket.fromData(data);
                    // console.log("USER ENTER ROOM: ", RoomManager.getAll());
                    // console.log("USER ENTER ROOM: ", userEnterRoomPacket.getUsername());
                    const room_2 = RoomManager.get(userEnterRoomPacket.getUsername());
                    // console.log("OWOWKDOWKOD: ", userEnterRoomPacket.getUsername());
                    // console.log("USER ENTER ROOM: ", room_2.getIdentifier());
                    // console.log("USER ENTER ROOM: ", room_2.getMessages());
                    // console.log("USER ENTER ROOM: ", "LATEST MESSAGE:", room_2.getLatestMessage());
                    // console.log("USER ENTER ROOM: ", "UNREAD MESSAGES:", room_2.getUnreadMessages());
                    break;
                case "leave_room":
                    this.getUser().setCurrentRoom(null);
                    // console.log("LEWAT");
                    // console.log(this.getUser().getCurrentRoom());
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
            this.newChatUI.getBodyUI().clear();
            this.newChatUI.getHeaderUI().hideLabel();
            this.newChatUI.getHeaderUI().hideUser();
        });

        this.newChatUI.onSearch(async (packet) => {
            if(packet.getUsername() === "") return;
            const response = await ChatService.searchUser(packet.toData());
            if(response.ok()){
                this.newChatUI.getHeaderUI().setUser(packet);
                this.newChatUI.getHeaderUI().showUser();
            }else{
                this.newChatUI.getHeaderUI().setLabel("User not found.");
                this.newChatUI.getHeaderUI().getLabel().classList.add("error");
                this.newChatUI.getHeaderUI().showLabel();
            }           
        });

        this.newChatUI.getHeaderUI().onClickAddButton(
            async (packet) => {
                const response = await UserService.newContact(packet.toData());
                if(response.ok()){
                    // this.newChatUI.reset();
                    // this.sidebarUI.hide();

                    this.newChatUI.getHeaderUI().setLabel("User added.");
                    this.newChatUI.getHeaderUI().getLabel().classList.add("success");
                    this.newChatUI.getHeaderUI().showLabel();
                }else{
                    console.log("NO");
                }  
            }  
        );

        this.settingsUI.getBodyUI().onClickVerifyEmailBtn(
            async () => {
                const response = await fetch("/user/verify");

                if (response.redirected) {
                    window.location.href = response.url;
                }
            }
        );

        // Chat Room Navigation Events (Body)
        // this.sidebarUI.getBodyUI().onClickRoom(async (packet) => {
        //     const chatData = await ChatService.openChatRoom(packet.toData());
        //     if (chatData.success) {
        //         this.chatUI.getBodyUI().clearMessages();
        //         this.chatUI.getBodyUI().show();
        //         this.chatUI.getHeaderUI().setTitle(packet.getUsername());

        //         this.socket.sendData(new JoinMessagePacket().toData());

        //         const room = RoomManager.get(packet.getUsername());
        //         this.getUser().setCurrentRoom(room);

        //         if(this.isMobile()){
        //             this.sidebarUI.show();
        //         }

        //         Object.entries(room.getMessages()).forEach(([, message]) => {
        //             if (message.getSender() === this.getUser().getUsername()) {
        //                 this.chatUI.getBodyUI().addSentMessage(message);
        //             } else {
        //                 this.chatUI.getBodyUI().addReceivedMessage(message);
        //             }
        //         });
        //     }
        // });


        this.chatListUI.getHeaderUI().onExit(
            () => {
                this.chatListUI.hide();
                this.sidebarUI.show();
            }
        );


        this.chatAreaUI.getHeaderUI().onExit(
            () => {
                this.chatAreaUI.hide();
                this.chatListUI.show();
                this.socket.sendData((new LeaveRoomPacket(this.getUser().getUsername())).toData());
            }
        );

        // Send Message Events
        this.chatAreaUI.onSendMessage(async (message) => {            
            this.socket.sendData(message.toData());
            if(message.getFile()){
                ChatService.uploadFile(message.getFile());
            }
            this.chatAreaUI.getBodyUI().addSentMessage(message);
        });

        // File Attachment Events
        this.chatAreaUI.getFooterUI().onAttachFile((file) => {
            if (file) {
                this.chatAreaUI.getFooterUI().attachFile(file);
            }
        });

        this.chatAreaUI.getFooterUI().onAttachCancel(() => {
            this.chatAreaUI.getFooterUI().removeAttachedFile();
        });

        this.chatAreaUI.onClickFileAttachment(
            (packet) => {
                ChatService.downloadFile(packet);
            }
        );


        // SIDEBAR
        this.sidebarUI.getBodyUI().onClickChatsEl(
            async () => {
                const response = await UserService.fetchContact();
                const data = response.getData();
                if(response.ok()){
                    if(this.isMobile()){
                        this.sidebarUI.hide();
                    }
                    this.chatListUI.show();
                    data.forEach(async contactName =>{
                        const contact = new Contact(contactName);
                        this.getUser().addContact(contact);
                        const room = new Room(contactName);
                        RoomManager.create(room);                        


                        const responseMsg = await RoomService.fetchMessage(room);
                        const dataMsg = await responseMsg.getData();

                        dataMsg.forEach(element => {
                            const message = new Message(
                                element["content"],
                                element["created_at"],
                                null,
                                element["sender"],
                                element["is_read"]
                            );
                            room.addMessage(message);
                        });

                        this.chatListUI.getBodyUI().addContact(contact, room);
                    });
                }
            }
        );

        // CHATLIST
        this.chatListUI.getBodyUI().onClickContactEl(
            async (contactName) => {
                const contact = this.getUser().getContact(contactName);
                if(contact){
                    if(this.isMobile()){
                        this.chatListUI.hide();
                    }

                    console.log(contactName);

                    const room = RoomManager.get(contactName);          

                    this.chatAreaUI.show();
                    this.chatAreaUI.getHeaderUI().setTitle(contactName);
                    this.chatAreaUI.getBodyUI().clearMessages();                    

                    this.getUser().setCurrentRoom(room);

                    const messages = room.getMessages();
                    Object.entries(messages).forEach(([key, element]) => {
                        if(element.getSender() === this.getUser().getUsername()){
                            this.chatAreaUI.getBodyUI().addSentMessage(element);
                        } else this.chatAreaUI.getBodyUI().addReceivedMessage(element);
                    });

                    const enterRoomPacket = new EnterRoomPacket(contactName);

                    this.socket.sendData(
                        enterRoomPacket.toData()
                    );  
                }
            }
        );
    }
}
