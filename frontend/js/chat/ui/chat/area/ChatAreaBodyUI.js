import TimeUtils from "../../../../utils/TimeUtils.js";

export default class ChatAreaBodyUI {
    #messageAreaEl;

    constructor() {
        this.#messageAreaEl = document.querySelector(
            ".chat-area .messages"
        );
    }

    getMessageAreaEl() {
        return this.#messageAreaEl;
    }

    clearMessages() {
        if (this.#messageAreaEl) {
            this.#messageAreaEl.innerHTML = "";
        }
    }

    scrollToBottom() {
        if (this.#messageAreaEl) {
            this.#messageAreaEl.scrollTop =
                this.#messageAreaEl.scrollHeight;
        }
    }

    createStatusElement(message) {
        const isRead = message.isRead();

        const statusEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        statusEl.setAttribute(
            "class",
            isRead ? "status read" : "status unread"
        );

        statusEl.setAttribute(
            "xmlns",
            "http://www.w3.org/2000/svg"
        );

        statusEl.setAttribute("width", "24");
        statusEl.setAttribute("height", "24");
        statusEl.setAttribute("viewBox", "0 0 24 24");
        statusEl.setAttribute("fill", "none");
        statusEl.setAttribute("stroke", "currentColor");
        statusEl.setAttribute("stroke-width", "2");
        statusEl.setAttribute("stroke-linecap", "round");
        statusEl.setAttribute("stroke-linejoin", "round");

        const firstCheck = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        firstCheck.setAttribute("d", "M18 6 7 17l-5-5");

        const secondCheck = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        secondCheck.setAttribute(
            "d",
            "m22 10-7.5 7.5L13 16"
        );

        statusEl.append(firstCheck, secondCheck);

        return statusEl;
    }

    addSentMessage(message) {
        if (!this.#messageAreaEl) {
            return false;
        }

        const messageEl = document.createElement("div");
        messageEl.className = "message-1";

        // Digunakan untuk mencari pesan saat modify
        messageEl.dataset.timestamp = String(
            message.getTimestamp()
        );

        const contentEl = document.createElement("p");
        contentEl.className = "content";
        contentEl.textContent = message.getContent();

        const rightEl = document.createElement("div");
        rightEl.className = "right";

        const metaEl = document.createElement("div");
        metaEl.className = "meta";

        const timeEl = document.createElement("p");
        timeEl.className = "time";
        timeEl.textContent = TimeUtils.readableTime(
            message.getTimestamp()
        );

        const statusEl = this.createStatusElement(message);

        metaEl.appendChild(timeEl);
        rightEl.append(metaEl, statusEl);
        messageEl.append(contentEl, rightEl);

        this.#messageAreaEl.appendChild(messageEl);
        this.scrollToBottom();

        return true;
    }

    addReceivedMessage(message) {
        if (!this.#messageAreaEl) {
            return false;
        }

        const messageEl = document.createElement("div");
        messageEl.className = "message-2";

        // Digunakan untuk mencari pesan saat modify
        messageEl.dataset.timestamp = String(
            message.getTimestamp()
        );

        const contentEl = document.createElement("p");
        contentEl.className = "content";
        contentEl.textContent = message.getContent();

        const rightEl = document.createElement("div");
        rightEl.className = "right";

        const metaEl = document.createElement("div");
        metaEl.className = "meta";

        const timeEl = document.createElement("p");
        timeEl.className = "time";
        timeEl.textContent = TimeUtils.readableTime(
            message.getTimestamp()
        );

        metaEl.appendChild(timeEl);
        rightEl.appendChild(metaEl);

        messageEl.append(contentEl, rightEl);

        this.#messageAreaEl.appendChild(messageEl);
        this.scrollToBottom();

        return true;
    }

    modifySpecificMessage(message) {
        if (!this.#messageAreaEl) {
            return false;
        }

        const timestamp = String(message.getTimestamp());

        const messageEl = [
            ...this.#messageAreaEl.querySelectorAll(
                "[data-timestamp]"
            )
        ].find(
            (element) =>
                element.dataset.timestamp === timestamp
        );

        if (!messageEl) {
            return false;
        }

        const contentEl = messageEl.querySelector(".content");
        const timeEl = messageEl.querySelector(".time");
        const statusEl = messageEl.querySelector(".status");

        if (contentEl) {
            contentEl.textContent = message.getContent();
        }

        if (timeEl) {
            timeEl.textContent = TimeUtils.readableTime(
                message.getTimestamp()
            );
        }

        if (statusEl) {
            const isRead = message.isRead();

            statusEl.classList.toggle("read", isRead);
            statusEl.classList.toggle("unread", !isRead);
        }

        return true;
    }

    updateSentMessage(message) {
        return this.modifySpecificMessage(message);
    }

    addJoinMessage(joinMessage) {
        if (!this.#messageAreaEl) {
            return false;
        }

        const joinEl = document.createElement("div");
        joinEl.className = "join-message";

        const topLine = document.createElement("hr");
        const textEl = document.createElement("p");
        const bottomLine = document.createElement("hr");

        textEl.textContent =
            `${joinMessage.getUsername()} joined`;

        joinEl.append(topLine, textEl, bottomLine);
        this.#messageAreaEl.appendChild(joinEl);

        this.scrollToBottom();

        return true;
    }
} 