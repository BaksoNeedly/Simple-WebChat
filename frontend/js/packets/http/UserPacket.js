export default class UserPacket {

    constructor(username){
        this.username = username;
    }

    toData(){
        return {
            type: "user",
            username: this.username
        }
    }

    getUsername(){
        return this.username;
    }
}