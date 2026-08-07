import RegisterUI from "../register/RegisterUI.js";

const registerUI = new RegisterUI();

registerUI.onSubmit(
    async (packet) => {
        if(registerUI.getUsername() === ""){
            registerUI.setLabel("Username cannot empty.", "red");
            return;
        }
        if(registerUI.getEmail() === ""){
            registerUI.setLabel("Email cannot empty.", "red");
            return;
        }
        if(registerUI.getPassword() === ""){
            registerUI.setLabel("Password cannot empty.", "red");
            return;
        }
        if(registerUI.getPassword() !== registerUI.getConfirmPassword()){
            return;
        }
        
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packet.toData())
        });
        const data = await response.json();
        if(data.redirect){
            window.location.href = data.redirect;
        }
        if(data.message){
            registerUI.setLabel(data.message, data.success === true ? "black" : "red");
        }
    }
);

registerUI.onClickLoginButton(
    () => {
        window.location.href = "/page/login"
    }
);