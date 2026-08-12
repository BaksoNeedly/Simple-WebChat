import UserPacket from "../../../packets/http/UserPacket.js";

export default class SidebarBodyUI {
    constructor() {
        this.groupName = document.getElementById("group-name");
        this.usersList = document.querySelector(".users-list");
    }

    #getUserNameFromCard(cardElement) {
        return cardElement.querySelector(".user-2-name")?.textContent.trim() || "";
    }

    onClickGroupChat(callback) {
        this.groupName?.addEventListener("click", () => {
            const groupNameText = this.groupName.textContent.trim();
            callback(groupNameText);
        });
    }

    onClickRoom(callback) {
        this.usersList?.addEventListener("click", (event) => {
            const targetCard = event.target.closest(".user-2-room");
            if (targetCard) {
                const targetUsername = this.#getUserNameFromCard(targetCard);
                if (targetUsername) {
                    callback(new UserPacket(targetUsername));
                }
            }
        });
    }

    addUser(username) {
        const userChat = document.createElement("a");
        userChat.classList.add("user-2-room");

        const userProfileIcon = document.createElement("img");
        userProfileIcon.classList.add("user-profile-icon");
        userProfileIcon.setAttribute("src", "../img/user_icon.jpg");
        userChat.appendChild(userProfileIcon);

        const userDetails = document.createElement("div");
        userDetails.classList.add("user-2-details");
        userChat.appendChild(userDetails);

        const userName = document.createElement("p");
        userName.classList.add("user-2-name");
        userName.textContent = username;
        userDetails.appendChild(userName);

        const userStatus = document.createElement("p");
        userStatus.classList.add("user-2-status");
        userStatus.textContent = "Offline";
        userStatus.style.color = "red";
        userDetails.appendChild(userStatus);

        this.usersList.appendChild(userChat);
    }

    updateContactStatus(contact) {
        const contactUsername = typeof contact.getUsername === "function" ? contact.getUsername() : contact;

        document.querySelectorAll(".user-2-room").forEach((element) => {
            if (this.#getUserNameFromCard(element) === contactUsername) {
                const status = element.querySelector(".user-2-status");
                if (status) {
                    status.textContent = "ONLINE";
                    status.style.color = "lightgreen";
                }
            }
        });
    }
}