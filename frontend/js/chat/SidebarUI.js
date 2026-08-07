import UserPacket from "../packets/http/UserPacket.js";

export default class SidebarUI {

    constructor(){
        this.groupName = document.getElementById("group-name");
        this.newChat = document.getElementById("new-chat");
        this.usersList = document.querySelector(".users-list");

        this.username = document.querySelector(".username");
    }

    onClickGroupChat(callback){
        this.groupName.addEventListener(
            "click",
            () => {
                callback(this.groupName.textContent)
            }
        )
    }

    onClickNewChat(callback){
        this.newChat.addEventListener(
            "click",
            () => {
                callback();
            }
        );
    }

    onClickUser(callback){
        this.usersList.addEventListener(
            "click",
            (event) => {
                const targetCard = event.target.closest(".user-2-chat");
                if(targetCard){
                    callback(new UserPacket(targetCard.querySelector(".user-2-name").textContent));
                }
            }
        );
    }

    addUser(username){
        const usersList = this.usersList;
        
        // user-2-chat
        const userChat = document.createElement("a");
        userChat.classList.add("user-2-chat");
        usersList.appendChild(userChat);

        // user-2-profile-icon
        const userProfileIcon = document.createElement("img");
        userProfileIcon.classList.add("user-profile-icon");
        userProfileIcon.setAttribute("src", "../img/user_icon.jpg");
        userChat.appendChild(userProfileIcon);

        // user-2-details
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
    }

    getUsername(){
        return this.username;
    }

    setUsername(name){
        this.username.textContent = name;
    }
}