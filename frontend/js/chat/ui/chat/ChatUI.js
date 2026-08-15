import ChatHeaderUI from "./ChatHeaderUI.js";
import ChatBodyUI from "./ChatBodyUI.js";
import ChatFooterUI from "./ChatFooterUI.js";
import TimeUtils from "../../../utils/TimeUtils.js";
import Message from "../../message/Message.js";
import FilePacket from "../../../packets/websocket/FilePacket.js";

export default class ChatUI {
    #headerUI;
    #bodyUI;
    #footerUI;

    constructor() {
        this.#headerUI = new ChatHeaderUI();
        this.#bodyUI = new ChatBodyUI();
        this.#footerUI = new ChatFooterUI();
    }

    hide(){
        document.querySelector(".chat-area").classList.add("hidden");
    }

    show(){
        document.querySelector(".chat-area").classList.remove("hidden");
    }

    getHeaderUI() {
        return this.#headerUI;
    }

    getBodyUI() {
        return this.#bodyUI;
    }

    getFooterUI() {
        return this.#footerUI;
    }

    onClickFileAttachment(callback){
        const messageAreaEl = this.getBodyUI().getMessageAreaEl();
        messageAreaEl.addEventListener(
            "click",
            (event) => {
                const fileBox = event.target.closest(".file-box");
                callback(new FilePacket(fileBox.querySelector(".file-name").dataset.fileName));
            }
        );
    }

    onSendMessage(callback) {
        const chatInputEl = this.#footerUI.getChatInput();
        const sendButtonEl = this.#footerUI.getSendButton();

        const handleSend = () => {
            if (!chatInputEl) return;
            const text = chatInputEl.value.trim();
            const attachedFile = this.#footerUI.getAttachedFile();

            if (text !== "" || attachedFile) {
                callback(new Message(text, TimeUtils.getTimeStamp(), attachedFile));
                this.#footerUI.clearInput();
                this.#footerUI.removeAttachedFile();
            }
        };

        if (chatInputEl) {
            chatInputEl.addEventListener("keydown", (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                }
            });
        }

        if (sendButtonEl) {
            sendButtonEl.addEventListener("click", () => {
                handleSend();
            });
        }
    }
}