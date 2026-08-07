import NewChatPacket from "../packets/NewChatPacket.js";

export default class NewChatUI {

    constructor(){
        this.container = document.querySelector(".new-chat-container");
        this.cancelButtons = document.querySelectorAll(".new-chat-cancel");

        this.label = document.querySelector(".new-chat-label");

        this.input = document.querySelector(".new-chat-input");
        this.startChat = document.querySelector(".start-new-chat");
    }

    getContainer(){
        return this.container;
    }

    getLabel(){
        return this.label;
    }

    setLabel(text, color = "black"){
        this.label.textContent = text;
        this.label.style.color = color;
    }

    show(){
        this.container.classList.remove("hidden");
    }

    hide(){
        this.container.classList.add("hidden");
    }

    handle(data){
        const valid = data.valid;
        const label = this.getLabel();
        if(!valid){
            label.textContent = "User not found.";
            label.style.color = "red";
            return;
        }

        createRoom = new CreateRoom(data.username);
    }

    onStartNewChat(callback){
        this.startChat.addEventListener(
            "click",
            () => {
                callback(new NewChatPacket(this.input.value));
            }
        );
    }

    onCancel(callback){
        this.cancelButtons.forEach(button => {
            button.addEventListener("click", () => {
                callback();
            });
        });
    }
}