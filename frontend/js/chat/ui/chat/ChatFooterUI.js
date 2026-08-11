export default class ChatFooterUI {
    #attachedFile = null;
    #onAttachCallback = null;
    
    #attachInputEl;
    #chatInputEl;
    #sendButtonEl;
    #attachedContainerEl;

    constructor() {
        this.#attachInputEl = document.getElementById("attach-input");
        this.#chatInputEl = document.querySelector(".chat-input");
        this.#sendButtonEl = document.getElementById("send-button");
        this.#attachedContainerEl = document.querySelector(".attached-file-container");

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
        if (this.#chatInputEl) {
            this.#chatInputEl.value = "";
        }
    }

    attachFile(file) {
        if (this.#attachedContainerEl) {
            this.#attachedContainerEl.classList.remove("hidden");
            const fileNameEl = this.#attachedContainerEl.querySelector(".file-name");
            if (fileNameEl) fileNameEl.textContent = file.name;
        }
    }

    removeAttachedFile() {
        if (this.#attachedContainerEl) {
            this.#attachedContainerEl.classList.add("hidden");
        }
        this.#attachedFile = null;
        if (this.#attachInputEl) this.#attachInputEl.value = "";
    }

    initAttachButton() {
        if (!this.#attachInputEl) return;

        this.#attachInputEl.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                this.#attachedFile = file;
                this.attachFile(file);
            } else {
                this.#attachedFile = null;
            }

            if (this.#onAttachCallback) {
                this.#onAttachCallback(this.#attachedFile);
            }
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
}