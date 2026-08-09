import MessagePacket from "../packets/websocket/MessagePacket.js";
import TimeUtils from "../utils/TimeUtils.js";
import Message from "./message/Message.js";

export default class ChatUI {

    constructor() {
        this.chatArea = document.querySelector("#chat-area");
        this.chatTitle = document.querySelector(".chat-title");

        this.chatInput = document.querySelector(".chat-input");
        this.sendButton = document.querySelector(".chat-send-button");

        // FIX 1: Point directly to #message-area (or .message-area)
        this.messageArea = document.querySelector(".message-area");

        this.totalUser = document.querySelector(".total-user");
    }

    show() {
        this.chatArea.classList.remove("hidden");
    }

    hide() {
        this.chatArea.classList.add("hidden");
    }

    getTitle() {
        return this.chatTitle.textContent;
    }

    setTitle(text) {
        this.chatTitle.textContent = text;
    }

    clearMessages(){
        this.messageArea.innerHTML = "";
    }

    onSendMessage(callback) {
        this.chatInput.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const text = this.chatInput.value.trim();
                    if (text !== "") {
                        callback(new Message(text, TimeUtils.getTimeStamp()));
                    }
                }
            }
        );
        this.sendButton.addEventListener(
            "click",
            () => {
                const text = this.chatInput.value.trim();
                if (text !== "") {
                    callback(new Message(text, TimeUtils.getTimeStamp()));
                }
            }
        );
    }

    clearInput() {
        this.chatInput.value = "";
    }

    scrollToBottom() {
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }

    addSentMessage(message) {
        const messageArea = this.messageArea;

        // message-1
        const messageElement = document.createElement("div");
        messageElement.classList.add("message-1");

        // message-meta
        const messageMeta = document.createElement("div");
        messageMeta.classList.add("message-meta");

        // message-time
        const messageTime = document.createElement("div");
        messageTime.classList.add("message-time");
        messageTime.textContent = message.getTimestamp();

        // message-content with <p> tag
        const messageContent = document.createElement("div");
        messageContent.classList.add("message-content");
        const p = document.createElement("p");
        p.textContent = message.getContent();
        messageContent.appendChild(p);

        // append message-meta
        messageMeta.appendChild(messageTime);
        messageMeta.appendChild(messageContent);

        // append message-1
        messageElement.appendChild(messageMeta);

        // append message-area & scroll down
        messageArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    addReceivedMessage(message) {
        const messageArea = this.messageArea;

        // message-2
        const messageElement = document.createElement("div");
        messageElement.classList.add("message-2");

        // message-left-side & user avatar
        const messageLeftSide = document.createElement("div");
        messageLeftSide.classList.add("message-left-side");

        const messageUserProfileIcon = document.createElement("div");
        messageUserProfileIcon.classList.add("message-user-profile-icon");
        messageUserProfileIcon.textContent = message.getSender().substring(0, 3).toUpperCase();

        messageLeftSide.appendChild(messageUserProfileIcon);

        // message-meta
        const messageMeta = document.createElement("div");
        messageMeta.classList.add("message-meta");

        // message-header
        const messageHeader = document.createElement("div");
        messageHeader.classList.add("message-header");

        const messageUsername = document.createElement("div");
        messageUsername.classList.add("message-username");
        messageUsername.textContent = message.getSender();

        const messageTime = document.createElement("div");
        messageTime.classList.add("message-time");
        messageTime.textContent = message.getTimestamp();

        messageHeader.appendChild(messageUsername);
        messageHeader.appendChild(messageTime);

        // message-content with <p> tag
        const messageContent = document.createElement("div");
        messageContent.classList.add("message-content");
        const p = document.createElement("p");
        p.textContent = message.getContent();
        messageContent.appendChild(p);

        // append message-meta
        messageMeta.appendChild(messageHeader);
        messageMeta.appendChild(messageContent);

        // append message-2
        messageElement.appendChild(messageLeftSide);
        messageElement.appendChild(messageMeta);

        // append message-area & scroll down
        messageArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    addJoinMessage(joinMessage) {
        const messageArea = this.messageArea;

        const joinMessageElement = document.createElement("div");
        joinMessageElement.classList.add("join-message");

        const hr1 = document.createElement("hr");
        const p = document.createElement("p");
        p.textContent = joinMessage.getUsername() + " joined";
        const hr2 = document.createElement("hr");

        joinMessageElement.appendChild(hr1);
        joinMessageElement.appendChild(p);
        joinMessageElement.appendChild(hr2);

        messageArea.appendChild(joinMessageElement);
        this.scrollToBottom();
    }

    addDisconnectMessage(disconnectMessage) {
        const messageArea = this.messageArea;

        const disconnectMessageElement = document.createElement("div");
        disconnectMessageElement.classList.add("disconnect-message");

        const hr1 = document.createElement("hr");
        const p = document.createElement("p");
        p.textContent = disconnectMessage.getUsername() + " disconnected";
        const hr2 = document.createElement("hr");

        disconnectMessageElement.appendChild(hr1);
        disconnectMessageElement.appendChild(p);
        disconnectMessageElement.appendChild(hr2);

        messageArea.appendChild(disconnectMessageElement);
        this.scrollToBottom();
    }

    setTotalUser(totalUserPacket){
        this.totalUser.textContent = String(totalUserPacket.getOnlineUsers()) + " Online";
    }
}