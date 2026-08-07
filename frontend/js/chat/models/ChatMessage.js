export default class ChatMessage {

    constructor(content, username, timestamp, type = "chat_message"){
        this.content = content;
        this.username = username;
        this.timestamp = timestamp;
        this.type = type;
    }

    static fromData(data){
        return new ChatMessage(
            data.content,
            data.username,
            data.timestamp,
            data.type
        )
    }

    toData(){
        return {
            content: this.content,
            username: this.username,
            timestamp: this.timestamp,
            type: this.type
        }
    }    

    getContent(){
        return this.content;
    }

    getUsername(){
        return this.username;
    }

    getTimeStamp(){
        return this.timestamp;
    }

    getType(){
        return this.type;
    }
}