export default class ChatBodyUI {
    #chatAreaEl;
    #messageAreaEl;

    constructor() {
        this.#chatAreaEl = document.getElementById("chat-area");
        this.#messageAreaEl = document.getElementById("message-area");
    }

    show() {
        if (this.#chatAreaEl) this.#chatAreaEl.classList.remove("hidden");
    }

    hide() {
        if (this.#chatAreaEl) this.#chatAreaEl.classList.add("hidden");
    }

    clearMessages() {
        if (this.#messageAreaEl) {
            this.#messageAreaEl.innerHTML = "";
        }
    }

    scrollToBottom() {
        if (this.#messageAreaEl) {
            this.#messageAreaEl.scrollTop = this.#messageAreaEl.scrollHeight;
        }
    }

    addSentMessage(message) {
        if (!this.#messageAreaEl) return;

        const messageEl = document.createElement("div");
        messageEl.classList.add("message-1");

        const messageMetaEl = document.createElement("div");
        messageMetaEl.classList.add("message-meta");

        const messageTimeEl = document.createElement("div");
        messageTimeEl.classList.add("message-time");
        messageTimeEl.textContent = message.getTimestamp();

        messageMetaEl.appendChild(messageTimeEl);

        if (message.getFile()) {
            const fileBoxEl = document.createElement("div");
            fileBoxEl.classList.add("file-box");

            const fileContentEl = document.createElement("div");
            fileContentEl.classList.add("file-content");

            const fileNameEl = document.createElement("p");
            fileNameEl.textContent = message.getFile().name;

            const fileSizeEl = document.createElement("p");
            fileSizeEl.textContent = `${message.getFile().size} B`;

            fileContentEl.appendChild(fileNameEl);
            fileContentEl.appendChild(fileSizeEl);

            const svgIconEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIconEl.setAttribute("class", "file-icon lucide lucide-file-icon lucide-file");
            svgIconEl.setAttribute("width", "24");
            svgIconEl.setAttribute("height", "24");
            svgIconEl.setAttribute("viewBox", "0 0 24 24");
            svgIconEl.setAttribute("fill", "none");
            svgIconEl.setAttribute("stroke", "currentColor");
            svgIconEl.setAttribute("stroke-width", "2");

            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z");

            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "M14 2v5a1 1 0 0 0 1 1h5");

            svgIconEl.appendChild(path1);
            svgIconEl.appendChild(path2);

            fileBoxEl.appendChild(fileContentEl);
            fileBoxEl.appendChild(svgIconEl);
            messageMetaEl.appendChild(fileBoxEl);
        }

        const messageContentEl = document.createElement("div");
        messageContentEl.classList.add("message-content");
        const pEl = document.createElement("p");
        pEl.textContent = message.getContent();
        messageContentEl.appendChild(pEl);

        messageMetaEl.appendChild(messageContentEl);
        messageEl.appendChild(messageMetaEl);

        this.#messageAreaEl.appendChild(messageEl);
        this.scrollToBottom();
    }

    addReceivedMessage(message) {
        if (!this.#messageAreaEl) return;

        const messageEl = document.createElement("div");
        messageEl.classList.add("message-2");

        const messageLeftSideEl = document.createElement("div");
        messageLeftSideEl.classList.add("message-left-side");

        const avatarEl = document.createElement("div");
        avatarEl.classList.add("message-user-profile-icon");
        avatarEl.textContent = message.getSender().substring(0, 3).toUpperCase();

        messageLeftSideEl.appendChild(avatarEl);

        const messageMetaEl = document.createElement("div");
        messageMetaEl.classList.add("message-meta");

        const messageHeaderEl = document.createElement("div");
        messageHeaderEl.classList.add("message-header");

        const usernameEl = document.createElement("div");
        usernameEl.classList.add("message-username");
        usernameEl.textContent = message.getSender();

        const timeEl = document.createElement("div");
        timeEl.classList.add("message-time");
        timeEl.textContent = message.getTimestamp();

        messageHeaderEl.appendChild(usernameEl);
        messageHeaderEl.appendChild(timeEl);

        const messageContentEl = document.createElement("div");
        messageContentEl.classList.add("message-content");
        const pEl = document.createElement("p");
        pEl.textContent = message.getContent();
        messageContentEl.appendChild(pEl);

        messageMetaEl.appendChild(messageHeaderEl);
        messageMetaEl.appendChild(messageContentEl);

        messageEl.appendChild(messageLeftSideEl);
        messageEl.appendChild(messageMetaEl);

        this.#messageAreaEl.appendChild(messageEl);
        this.scrollToBottom();
    }

    addJoinMessage(joinMessage) {
        if (!this.#messageAreaEl) return;

        const joinEl = document.createElement("div");
        joinEl.classList.add("join-message");

        const hr1 = document.createElement("hr");
        const pEl = document.createElement("p");
        pEl.textContent = `${joinMessage.getUsername()} joined`;
        const hr2 = document.createElement("hr");

        joinEl.appendChild(hr1);
        joinEl.appendChild(pEl);
        joinEl.appendChild(hr2);

        this.#messageAreaEl.appendChild(joinEl);
        this.scrollToBottom();
    }

    addDisconnectMessage(disconnectMessage) {
        if (!this.#messageAreaEl) return;

        const disconnectEl = document.createElement("div");
        disconnectEl.classList.add("disconnect-message");

        const hr1 = document.createElement("hr");
        const pEl = document.createElement("p");
        pEl.textContent = `${disconnectMessage.getUsername()} disconnected`;
        const hr2 = document.createElement("hr");

        disconnectEl.appendChild(hr1);
        disconnectEl.appendChild(pEl);
        disconnectEl.appendChild(hr2);

        this.#messageAreaEl.appendChild(disconnectEl);
        this.scrollToBottom();
    }
}