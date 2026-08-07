import ChatGUI from "./ChatUI.js";
import WebSocketClient from "./WebSocketClient.js";
import TimeUtils from "../utils/TimeUtils.js";
import ChatMessage from "./models/ChatMessage.js";
import DisconnectMessage from "./models/DisconnectMessage.js";
import JoinMessage from "./models/JoinMessage.js";
import OnlineUsers from "./models/OnlineUsers.js";
import SidebarUI from "./SidebarUI.js";
import GroupUI from "./GroupUI.js";
import Group from "./models/Group.js";
import JoinGroup from "./models/JoinGroup.js";

export default class ChatApp {

    constructor(){
        this.currentUI = null;
        this.sidebarUI = new SidebarUI();
        this.groupUI = new GroupUI();

        this.socket = new WebSocketClient();
        this.setupEvents();

    }

    getWebSocket(){
        return this.socket;
    }
    
    getSidebarUI(){
        return this.sidebarUI;
    }

    getGroupUI(){
        return this.groupUI;
    }

    setupEvents(){
        this.getSidebarUI().onClickGroupChat(
            (groupName) => {
                const group = new Group(groupName);
                this.getGroupUI().addGroupChatArea(group);

                const joinGroup = new JoinGroup(group);
                this.getWebSocket().sendData(
                    JSON.stringify(joinGroup.toData())
                );

                const chatUI = this.getGroupUI().getChatUI();
                this.currentUI = chatUI;
                chatUI.onSendMessage(
                    (content) => {
                        if(content === ""){
                            return;
                        }
                        const chatMessage = new ChatMessage(
                            content,
                            "user",
                            TimeUtils.getTimeStamp()
                        );
                        chatUI.addSentMessage(chatMessage);
                        chatUI.clearMessageInput();
                        chatUI.getMessageArea().scrollTop = chatUI.getMessageArea().scrollHeight;
                        this.getWebSocket().sendData(JSON.stringify(chatMessage));
                    }
                );
            }
        );

                this.getWebSocket().onOpen = () => {            
                    const joinMessage = new JoinMessage("user");
                    this.getWebSocket().sendData(
                        JSON.stringify(
                            joinMessage.toData()
                        )
                    );
                    const onlineUsers = new OnlineUsers(0);
                    this.getWebSocket().sendData(
                        JSON.stringify(
                            onlineUsers.toData()
                        )
                    );
                }

                this.getWebSocket().onMessage = (event) => {
                    const data = JSON.parse(event.data);
                    const type = data.type;
                    console.log(data);
                    if(this.currentUI === null) return;
                    switch(type){
                        case "chat_message":
                            const chatMessage = ChatMessage.fromData(data);
                            this.currentUI.addReceivedMessage(chatMessage);
                            break;
                        case "join_message":
                            const joinMessage = JoinMessage.fromData(data)
                            this.currentUI.addJoinMessage(joinMessage);
                            break;
                        case "online_users":
                            const onlineUsers = OnlineUsers.fromData(data);
                            this.currentUI.setOnlineUsers(onlineUsers.getOnlineUsers());
                            break;
                        case "disconnect_message":
                            const disconnectMessage = DisconnectMessage.fromData(data)
                            this.currentUI.addDisconnectMessage(disconnectMessage);
                            break;
                    }            
                }
    }
}