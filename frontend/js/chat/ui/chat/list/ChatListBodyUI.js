import TimeUtils from "../../../../utils/TimeUtils.js";

export default class ChatListBodyUI {

    #contactNames = new Set();

    constructor(){
        this.usersEl = document.querySelector(".chat-list .users");
    }

    onClickContactEl(callback){
        this.usersEl.addEventListener(
            "click",
            (event) => {
                let contact = event.target.closest(".user");
                if(!contact) return;
                const name = contact.querySelector(".content .name").textContent;
                callback(name);
            }
        );
    }

    exists(contact){
        return this.#contactNames.has(contact.getUsername());
    }

    getContactsEl(){
        return this.usersEl.querySelectorAll(".user");
    }

    addContact(contact, room) {

        if(this.exists(contact)){
            return false;
        }

        const userEl = document.createElement("div");
        userEl.classList.add("user");

        const avatarEl = document.createElement("img");
        avatarEl.classList.add("avatar");
        avatarEl.src = "../../../../../img/user_icon.jpg";
        // Nanti ambil dari object user, misalnya: user.avatar
        userEl.appendChild(avatarEl);

        const contentEl = document.createElement("div");
        contentEl.classList.add("content");

        const nameEl = document.createElement("p");
        nameEl.classList.add("name");
        nameEl.textContent = contact.getUsername();
        // Nanti ambil dari object user, misalnya: user.username
        contentEl.appendChild(nameEl);

        const messageEl = document.createElement("p");
        messageEl.classList.add("message");
        messageEl.textContent = room.getLatestMessage()?.getContent() ?? "";
        // Nanti ganti dengan preview pesan terakhir dari object chat.
        contentEl.appendChild(messageEl);

        userEl.appendChild(contentEl);

        const rightEl = document.createElement("div");
        rightEl.classList.add("right");

        const metaEl = document.createElement("div");
        metaEl.classList.add("meta");

        const timeEl = document.createElement("p");
        timeEl.classList.add("time");
        timeEl.textContent = TimeUtils.readableTime(room.getLatestMessage()?.getTimestamp() ?? null);
        // Nanti isi dengan waktu pesan terakhir dari object chat.
        metaEl.appendChild(timeEl);
        rightEl.appendChild(metaEl);

        // Demo unread count. Nanti angka ini bisa diganti dengan room.getUnreadCount().
        const unreadCount = room.getUnreadMessages().length;
        const unreadEl = document.createElement("span");
        unreadEl.classList.add("unread-count");
        unreadEl.setAttribute("aria-label", `${unreadCount} unread messages`);
        unreadEl.textContent = unreadCount > 99 ? "99+" : unreadCount;
        rightEl.appendChild(unreadEl);
        userEl.appendChild(rightEl);

        this.usersEl?.appendChild(userEl);
        this.#contactNames.add(contact.getUsername());
        return true;
    }

    modifyContact(contact, room){
        const username = contact.getUsername();
        const contacts = this.usersEl.querySelectorAll(".user");

        contacts.forEach((contact_v) => {
            const name = contact_v.querySelector(".content .name");
            if(name?.textContent === username){
                if (name?.textContent === username) {
                    const latestMessage = room.getLatestMessage();

                    userEl.querySelector(".message").textContent =
                        latestMessage?.getContent() ?? "";

                    userEl.querySelector(".time").textContent =
                        TimeUtils.readableTime(
                            latestMessage?.getTimestamp() ?? null
                        );

                    return true;
                }
            }
        });
    }

    setSpecificContact(contact, room) {
        const username = contact.getUsername();

        const userEl = [...this.usersEl.querySelectorAll(".user")]
            .find((el) =>
                el.querySelector(".content .name")?.textContent === username
            );

        if (!userEl) {
            return false;
        }

        const latestMessage = room.getLatestMessage();
        const unreadCount = room.getUnreadMessages().length;

        userEl.querySelector(".message").textContent =
            latestMessage?.getContent() ?? "";

        userEl.querySelector(".time").textContent =
            TimeUtils.readableTime(latestMessage?.getTimestamp() ?? null);

        const unreadEl = userEl.querySelector(".unread-count");

        if (unreadEl) {
            unreadEl.setAttribute(
                "aria-label",
                `${unreadCount} unread messages`
            );

            unreadEl.textContent =
                unreadCount > 99 ? "99+" : unreadCount;
        }

        return true;
    }

    modifyContact(contact, room) {
        return this.setSpecificContact(contact, room);
    }
}
