import Group from "./models/Group.js";

export default class ChatUI {

    constructor(){
        this.messageInput = document.getElementById("message-input");
        this.sendButton = document.getElementById("send-button");

        this.messageArea = document.getElementById("message-area");

        // this.onlineUsers = document.getElementById("online-users");
        // this.onlineUsers.textContent = "1 Online";

        this.groupChat = document.getElementById("group-chat");

        this.chatArea = document.getElementById("chat-area");

        this.newChat = document.getElementById("new-chat");

        this.newChat.addEventListener(
            "click",
            () => {
                this.addGroupChatArea(new Group("Hello"));
            }
        )
    }

    getMessageInput(){
        return this.messageInput;
    }

    clearMessageInput(){
        this.messageInput.value = ""
    }

    getSendButton(){
        return this.sendButton;
    }

    getMessageArea(){
        return this.messageArea;
    }

    getOnlineUsers(){
        return this.onlineUsers;
    }

    setOnlineUsers(count){
        this.onlineUsers.textContent = String(count) + " Online";
    }

    getGroupChat(){
        return this.groupChat;
    }

    onSendMessage(callback){
        this.getSendButton().addEventListener(
            "click",
            () => {
                callback(this.getMessageInput().value);
            }
        );

        this.getMessageInput().addEventListener(
            "keydown",
            (event) => {
                if(event.key === "Enter" && !event.shiftKey){
                    event.preventDefault();
                    callback(this.getMessageInput().value);
                }
            }
        );
    }

    onClickGroupChat(callback){
        this.getGroupChat().addEventListener(
            "click",
            () => {
                callback();
            }
        )
    }        

    createUsersIcon() {
        const div = document.createElement("div");
        div.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M18 21a8 8 0 0 0-16 0"/>
            <circle cx="10" cy="8" r="5"/>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
        </svg>`;
        return div.firstElementChild;
    }
}