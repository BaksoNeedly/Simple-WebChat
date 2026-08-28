export default class ChatListHeaderUI {
    #headerEl;
    #titleEl;
    #returnButton;

    constructor() {
        this.#headerEl = document.querySelector(".chat-list header");
        this.#titleEl = this.#headerEl?.querySelector(".title");
        this.#returnButton = this.#headerEl?.querySelector(".chat-list-return");
    }

    getTitle() {
        return this.#titleEl?.textContent ?? "";
    }

    setTitle(title) {
        if (this.#titleEl) {
            this.#titleEl.textContent = title;
        }
    }

    onExit(callback) {
        this.#returnButton?.addEventListener("click", callback);
    }
}
