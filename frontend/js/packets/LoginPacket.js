export default class LoginPacket {

    constructor(username="", password=""){
        this.username = username;
        this.password = password;
    }

    toData(){
        return {
            type: "login",
            username: this.username,
            password: this.password
        }
    }

    static fromData(data){
        return new LoginPacket(
            data.username,
            data.password
        );
    }
}