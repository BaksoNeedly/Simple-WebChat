export default class MessagePacket {

    constructor(content, timestamp, sender = ""){
        this.content = content;
        this.timestamp = timestamp;
        this.sender = sender;
    }

    static fromData(data){
        return new MessagePacket(
            data.content,
            data.timestamp,
            data.sender
        )
    }

    toData(){
        return {
            content: this.content,
            timestamp: this.timestamp,
            sender: this.sender,
            type: "message"
        }
    }    

    getContent(){
        return this.content;
    }

    getTimeStamp(){
        return this.timestamp;
    }

    getSender(){
        return this.sender;
    }
}