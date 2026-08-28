import UserPacket from "../../../packets/http/UserPacket.js";

export default class SidebarBodyUI {
    constructor() {
        this.groupName = null;
        this.usersList = document.querySelector(".chat-list .users");

        this.chatsEl = document.querySelector(".sidebar nav .chats-btn");
        this.groupsEl = document.querySelector(".sidebar nav .groups-btn");
        this.usersEl = document.querySelector(".sidebar nav .users-btn");
        this.notificationsEl = document.querySelector(".sidebar nav .notifications-btn");
        this.settingsEl = document.querySelector(".sidebar nav .settings-btn");
    }

    #getUserNameFromCard(cardElement) {
        return cardElement.querySelector(".content .name")?.textContent.trim() || "";
    }

    onClickChatsEl(callback){
        this.chatsEl.addEventListener(
            "click",
            () => {
                callback();
            }
        );
    }

    onClickGroupChat(callback) {
        this.groupName?.addEventListener("click", () => {
            const groupNameText = this.groupName.textContent.trim();
            callback(groupNameText);
        });
    }

    onClickRoom(callback) {
        this.usersList?.addEventListener("click", (event) => {
            const targetCard = event.target.closest(".user");
            if (targetCard) {
                const targetUsername = this.#getUserNameFromCard(targetCard);
                if (targetUsername) {
                    callback(new UserPacket(targetUsername));
                }
            }
        });
    }

    addUser(username) {
        const userChat = document.createElement("div");
        userChat.classList.add("user");

        const userProfileIcon = document.createElement("img");
        userProfileIcon.classList.add("avatar");
        userProfileIcon.setAttribute("src", "download.jpg");
        userChat.appendChild(userProfileIcon);

        const userDetails = document.createElement("div");
        userDetails.classList.add("content");
        userChat.appendChild(userDetails);

        const userName = document.createElement("p");
        userName.classList.add("name");
        userName.textContent = username;
        userDetails.appendChild(userName);

        const userStatus = document.createElement("p");
        userStatus.classList.add("message");
        userStatus.textContent = "Offline";
        userStatus.style.color = "red";
        userDetails.appendChild(userStatus);

        this.usersList.appendChild(userChat);
    }

    updateContactStatus(contact) {
        const contactUsername = typeof contact.getUsername === "function" ? contact.getUsername() : contact;

        document.querySelectorAll(".chat-list .user").forEach((element) => {
            if (this.#getUserNameFromCard(element) === contactUsername) {
                const status = element.querySelector(".content .message");
                if (status) {
                    status.textContent = "ONLINE";
                    status.style.color = "lightgreen";
                }
            }
        });
    }
}
