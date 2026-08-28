import NewContactPacket from "../../../../packets/http/NewContactPacket.js";

export default class NewChatHeaderUI {
    constructor() {
        this.label = document.querySelector(".new-chat header .label");
        this.user = document.querySelector(".new-chat header .user");
    }

    reset(){
        this.hideLabel()
        this.hideUser()
    }

    hideLabel(){
        this.label.classList.add("hidden");
    }

    showLabel(){
        this.label.classList.remove("hidden");
    }

    getLabel() {
        return this.label;
    }

    setLabel(text) {
        this.label.textContent = text;
    }

    hideUser(){
        this.user.classList.add("hidden");
    }

    showUser(){
        this.user.classList.remove("hidden");
    }

    setUser(packet){
        const nameEl = this.user.querySelector(".content .name");
        nameEl.textContent = packet.getUsername();
    }

    onClickAddButton(callback){
        this.user.querySelector(".add-btn").addEventListener("click", () => {
            callback(new NewContactPacket(this.user.querySelector(".content .name").textContent))
        });
    }
}