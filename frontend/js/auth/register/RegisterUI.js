import RegisterPacket from "../../packets/RegisterPacket.js";

export default class RegisterUI {

    constructor(){
        this.registerForm = document.querySelector(".register-form");
        this.label = document.querySelector(".label");

        this.usernameInput = document.querySelector(".username");
        this.emailInput = document.querySelector(".email");
        this.passwordInput = document.querySelector(".password");
        this.confirmPasswordInput = document.querySelector(".confirm-password");

        this.loginButton = document.querySelector(".login-btn");
    }

    getLabel(){
        return this.label;
    }

    setLabel(text, color){
        this.label.textContent = text;
        this.label.style.color = color;
    }

    getUsername(){
        return this.usernameInput ? this.usernameInput.value : "";
    }

    getEmail(){
        return this.emailInput ? this.emailInput.value : "";
    }

    getPassword(){
        return this.passwordInput ? this.passwordInput.value : "";
    }

    getConfirmPassword(){
        return this.confirmPasswordInput ? this.confirmPasswordInput.value : "";
    }

    onSubmit(callback){
        if (!this.registerForm) return;

        this.registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const packet = new RegisterPacket(
                this.getUsername(),
                this.getEmail(),
                this.getPassword(),
                this.getConfirmPassword()
            );
            
            callback(packet);
        });
    }

    onClickLoginButton(callback){
        this.loginButton.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                callback();
            }
        );
    }
}