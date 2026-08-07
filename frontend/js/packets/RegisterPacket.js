export default class RegisterPacket {

    constructor(username, email, password, confirm_password){
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirm_password;
    }

    toData(){
        return {
            type: "register",
            username: this.username,
            email: this.email,
            password: this.password,
            confirm_password: this.confirmPassword
        }
    }

    fromData(data){
        return new RegisterPacket(
            data.username,
            data.email,
            data.password,
            data.confirm_password
        )
    }
}