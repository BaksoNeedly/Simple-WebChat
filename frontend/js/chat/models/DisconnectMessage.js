export default class DisconnectMessage {

    constructor(username, type="disconnect_message"){
        this.username = username;
        this.type = type;
    }

    static fromData(data){
        return new DisconnectMessage(
            data.username,
            data.type
        )
    }

    toData(){
        return {
            username: this.username,
            type: this.type
        }
    }

    getUsername(){
        return this.username;
    }

    getType(){
        return this.type;
    }
}