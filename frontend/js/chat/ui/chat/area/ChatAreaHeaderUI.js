export default class ChatAreaHeaderUI {
    #headerEl;
    #titleEl;
    #statusEl;

    constructor() {
        this.#headerEl = document.querySelector(".chat-area header");
        this.#titleEl = this.#headerEl?.querySelector(".user .content .name");
        this.#statusEl = this.#headerEl?.querySelector(".user .content .status");
    }

    getElement() { return this.#headerEl; }
    getTitle() { return this.#titleEl?.textContent ?? ""; }
    setTitle(title) { if (this.#titleEl) this.#titleEl.textContent = title; }
    setStatus(status) { if (this.#statusEl) this.#statusEl.textContent = status; }
    onExit(callback) { this.#headerEl?.querySelector(".return")?.addEventListener("click", callback); }
}
