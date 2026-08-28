import ChatListBodyUI from "./ChatListBodyUI.js";
import ChatListHeaderUI from "./ChatListHeaderUI.js";

export default class ChatListUI {

    constructor(){
        this.headerUI = new ChatListHeaderUI();
        this.bodyUI = new ChatListBodyUI();
        this.headerUI = new ChatListHeaderUI();

        this.chatListEl = document.querySelector(".chat-list");
    }

    hide(){
        this.chatListEl.classList.add("hidden");
    }

    show(){
        this.chatListEl.classList.remove("hidden");
    }

    getHeaderUI(){
        return this.headerUI;
    }

    getBodyUI(){
        return this.bodyUI;
    }

    getHeaderUI() {
        return this.headerUI;
    }

}
