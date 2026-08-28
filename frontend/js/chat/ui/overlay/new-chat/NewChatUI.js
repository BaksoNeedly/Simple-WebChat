import NewChatHeaderUI from "./NewChatHeaderUI.js";
import NewChatBodyUI from "./NewChatBodyUI.js";
import NewChatFooterUI from "./NewChatFooterUI.js";

export default class NewChatUI {
    constructor() {
        this.overlay = document.querySelector(".new-chat-overlay");

        this.header = new NewChatHeaderUI();
        this.body = new NewChatBodyUI();
        this.footer = new NewChatFooterUI();
    }

    reset(){
        this.header.reset();
        this.body.reset();
        this.hide();
    }

    getHeaderUI(){
        return this.header;
    }

    getBodyUI(){
        return this.body;
    }

    getFooterUI(){
        return this.footer;
    }

    show() {
        this.overlay?.classList.remove("hidden");
    }

    hide() {
        this.overlay?.classList.add("hidden");
    }

    getOverlay() {
        return this.overlay;
    }

    onSearch(callback) {
        this.footer.onSearch(callback, this.body);
    }

    onCancel(callback) {
        this.footer.onCancel(callback);
    }
}
