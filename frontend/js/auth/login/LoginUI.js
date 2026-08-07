import LoginPacket from "../../packets/LoginPacket.js";

export default class LoginUI {

    constructor(){
        this.label = document.querySelector(".label");
        this.loginForm = document.querySelector(".card-form");
        this.signUpButton = document.querySelector(".sign-up-btn");
    }

    getLabel(){
        return this.label;
    }

    setLabel(text, color){
        this.label.textContent = text;
        this.label.style.color = color;
    }

    getUsername(){
        return document.querySelector(".username").value;
    }

    getPassword(){
        return document.querySelector(".password").value;
    }

    onSubmit(callback){
        this.loginForm.addEventListener(
            "submit",
            (event) => {
                const packet = new LoginPacket(this.getUsername(), this.getPassword());
                event.preventDefault();
                callback(packet);
            }
        );
    }

    onClickSignUp(callback){
        this.signUpButton.addEventListener(
            "click",
            () => {
                callback();
            }
        );
    }
}