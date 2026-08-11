import MessagePacket from "../packets/websocket/MessagePacket.js";
import TimeUtils from "../utils/TimeUtils.js";
import Message from "./message/Message.js";

export default class ChatUI {

    #selectedFile = null;
    #onAttachCallback = null;
    #onAttachCancelCallback = null;

    constructor() {
        this.chatArea = document.querySelector("#chat-area");
        this.chatTitle = document.querySelector(".chat-title");

        this.chatInput = document.querySelector(".chat-input");
        this.sendButton = document.querySelector(".chat-send-button");

        // FIX 1: Point directly to #message-area (or .message-area)
        this.messageArea = document.querySelector(".message-area");

        this.totalUser = document.querySelector(".total-user");

        this.attachButton = document.querySelector(".attach-input");

        this.attachContainer = document.querySelector(".attach-container");
        this.initAttachButton();
    }
}