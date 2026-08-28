export default class NewChatPacket {

    constructor(username){
        this.username = username;
    }

    toData(){
        return {
            type: "new_chat",
            username: this.username
        }
    }

    static fromData(data){
        return new NewChatPacket(
            data.username
        );
    }

    getUsername(){
        return this.username;
    }
}