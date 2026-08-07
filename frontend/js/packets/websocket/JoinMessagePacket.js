export default class JoinMessagePacket {

    constructor(sender=""){
        this.sender = sender;
    }

    toData(){
        return {
            type: "join_message",
            sender: this.sender
        }
    }

    static fromData(data){
        return new JoinMessagePacket(data["sender"]);
    }

    getUsername(){
        return this.sender;
    }
}