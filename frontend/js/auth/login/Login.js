import LoginUI from "./LoginUI.js";

const loginUI = new LoginUI();

loginUI.onSubmit(
    async (packet) => {
        if(loginUI.getUsername() === ""){
            loginUI.setLabel("Username cannot empty.", "red");
            return;
        }
        if(loginUI.getPassword() == ""){
            loginUI.setLabel("Password cannot empty.", "red");
            return;
        }

        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(packet.toData())
        });
        const data = await response.json();
        console.log(data);
        if(data.success){
            window.location.href = data.redirect;
        }

        if(data.message){
            loginUI.setLabel(data.message, data.success === true ? "black" : "red");
        }
    }
);

loginUI.onClickSignUp(
    () => {
        window.location.href = "/page/register";
    }
);