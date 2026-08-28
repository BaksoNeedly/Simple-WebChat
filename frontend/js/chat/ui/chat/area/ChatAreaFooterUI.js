export default class ChatAreaFooterUI {
    #attachedFile = null;
    #onAttachCallback = null;

    #attachInputEl;
    #chatInputEl;
    #sendButtonEl;
    #attachedContainerEl;

    constructor() {
        this.#attachInputEl = document.getElementById("attach-input");
        this.#chatInputEl = document.querySelector(".msg-input");
        this.#sendButtonEl = document.querySelector(".send-btn");
        this.#attachedContainerEl = document.querySelector(".attached-file-container");
        this.footerEl = document.querySelector(".chat-area-footer");

        this.initAttachButton();
    }

    getAttachedFile() {
        return this.#attachedFile;
    }

    getChatInput() {
        return this.#chatInputEl;
    }

    getSendButton() {
        return this.#sendButtonEl;
    }

    clearInput() {
        if (this.#chatInputEl) this.#chatInputEl.value = "";
    }

    attachFile(file) {
        if (this.#attachedContainerEl) {
            this.#attachedContainerEl.classList.remove("hidden");
            const fileNameEl = this.#attachedContainerEl.querySelector(".file-name");
            if (fileNameEl) fileNameEl.textContent = file.name;
        }
    }

    removeAttachedFile() {
        if (this.#attachedContainerEl) this.#attachedContainerEl.classList.add("hidden");
        this.#attachedFile = null;
        if (this.#attachInputEl) this.#attachInputEl.value = "";
    }

    initAttachButton() {
        if (!this.#attachInputEl) return;

        document.querySelector(".attach-btn")?.addEventListener("click", () => this.#attachInputEl.click());
        this.#attachInputEl.addEventListener("change", (event) => {
            const file = event.target.files[0];
            this.#attachedFile = file || null;
            if (file) this.attachFile(file);
            if (this.#onAttachCallback) this.#onAttachCallback(this.#attachedFile);
        });
    }

    onAttachFile(callback) {
        this.#onAttachCallback = callback;
    }

    onAttachCancel(callback) {
        if (!this.#attachedContainerEl) return;
        const cancelContainerEl = this.#attachedContainerEl.querySelector(".cancel-container");
        if (cancelContainerEl) {
            cancelContainerEl.addEventListener("click", () => {
                this.removeAttachedFile();
                callback();
            });
        }
    }

    getElement() {
        return this.footerEl;
    }
}
