import ChatUI from "./ChatUI.js";

export default class GroupUI {

    constructor(){
        this.chatArea = document.getElementById("chat-area");
        this.chatUI = null;
    }

    getChatUI(){
        return this.chatUI;
    }

    addGroupChatArea(group){
        const chatArea = this.chatArea;
        chatArea.innerHTML = "";

        // chat-header
        const chatHeader = document.createElement("div");
        chatHeader.classList.add("chat-header");

        // chat-title
        const chatTitle = document.createElement("h2");
        chatTitle.classList.add("chat-title");
        chatTitle.textContent = group.getName();

        // chat-header-right
        const chatHeaderRight = document.createElement("div");
        chatHeaderRight.classList.add("chat-header-right");
        chatHeaderRight.innerHTML = `
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
        </svg>
        `

        // online-users
        const onlineUsers = document.createElement("p");
        onlineUsers.setAttribute("id", "online-users");
        onlineUsers.textContent = "1 Online";

        // append chat-header-right
        chatHeaderRight.appendChild(onlineUsers);

        // append chat-header
        chatHeader.appendChild(chatTitle);
        chatHeader.appendChild(chatHeaderRight);


        // message-area
        const messageArea = document.createElement("div");
        messageArea.classList.add("message-area");
        messageArea.setAttribute("id", "message-area");

        // chat-footer
        const chatFooter = document.createElement("div");
        chatFooter.classList.add("chat-footer");

        // message-input
        const messageInput = document.createElement("textarea");
        messageInput.classList.add("textarea-1");
        messageInput.setAttribute("id", "message-input");
        messageInput.setAttribute("placeholder", "Type a message...");

        // send-button
        const sendButton = document.createElement("button");
        sendButton.classList.add("button-3");
        sendButton.setAttribute("id", "send-button");
        sendButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
            </svg>
        `
        
        // append chat-footer
        chatFooter.appendChild(messageInput);
        chatFooter.appendChild(sendButton);
        
        // append chat-area
        chatArea.appendChild(chatHeader);
        chatArea.appendChild(messageArea);
        chatArea.appendChild(chatFooter);

        this.chatUI = new ChatUI();
        console.log("WORK")
    }
}