import ChatAreaHeaderUI from "./ChatAreaHeaderUI.js";
import ChatAreaFooterUI from "./ChatAreaFooterUI.js";
import ChatAreaBodyUI from "./ChatAreaBodyUI.js";
import Message from "../../../message/Message.js";
import TimeUtils from "../../../../utils/TimeUtils.js";
import FilePacket from "../../../../packets/websocket/FilePacket.js";

export default class ChatAreaUI {
    #headerUI;
    #footerUI;
    #bodyUI;

    constructor(){
        this.chatAreaEl = document.querySelector(".chat-area");
        this.#headerUI = new ChatAreaHeaderUI();
        this.#footerUI = new ChatAreaFooterUI();
        this.#bodyUI = new ChatAreaBodyUI();
    }

    getHeaderUI() {
        return this.#headerUI; 
    }
    getFooterUI() {
        return this.#footerUI; 
    }
    getBodyUI() {
        return this.#bodyUI;
    }
    getElement() {
        return this.chatAreaEl; 
    }

    onSendMessage(callback) {
        const input = this.#footerUI.getChatInput();
        const sendButton = this.#footerUI.getSendButton();
        const send = () => {
            if (!input) return;
            const text = input.value.trim();
            const file = this.#footerUI.getAttachedFile();
            if (text || file) {
                callback(new Message(text, TimeUtils.getCurrentTimeStamp(), file));
                this.#footerUI.clearInput();
                this.#footerUI.removeAttachedFile();
            }
        };
        input?.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
            }
        });
        sendButton?.addEventListener("click", send);
    }

    onClickFileAttachment(callback) {
        this.#bodyUI.getMessageAreaEl()?.addEventListener("click", (event) => {
            const fileBox = event.target.closest(".file-box");
            if (fileBox) callback(new FilePacket(fileBox.querySelector(".file-name").dataset.fileName));
        });
    }

    hide(){
        this.chatAreaEl.classList.add("hidden");
    }

    show(){
        this.chatAreaEl.classList.remove("hidden");
    }
}
