export default class ChatHeaderUI {
    #titleEl;
    #onlineCountEl;

    constructor() {
        this.#titleEl = document.querySelector(".chat-title");
        this.#onlineCountEl = document.querySelector("#online-user-count") || document.querySelector(".online-count");
    }

    getTitle() {
        return this.#titleEl ? this.#titleEl.textContent : "";
    }

    setTitle(title) {
        if (this.#titleEl) {
            this.#titleEl.textContent = title;
        }
    }

    getOnlineCountElement() {
        return this.#onlineCountEl;
    }

    setOnlineCount(count) {
        if (this.#onlineCountEl) {
            this.#onlineCountEl.textContent = String(count);
        }
    }
}