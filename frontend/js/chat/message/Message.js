import FilePacket from "../../packets/websocket/FilePacket.js";

export default class Message {

    #content;
    #timestamp;
    #sender;
    #file = null;
    #isRead = false;

    constructor(
        content,
        timestamp,
        file = null,
        sender = "",
        is_read = false
    ){
        this.#content = content;
        this.#timestamp = timestamp;
        this.#file = file;
        this.#sender = sender;
        this.#isRead = is_read
    }

    static fromData(data){
        return new Message(
            data["content"],
            data["timestamp"],
            FilePacket.fromData(data["file"]),
            data["sender"],
            data["is_read"]
        );
    }

    toData(){
        const file = this.#file;
        let filePacket = null;
        if(file){
            filePacket = new FilePacket(file.name);
        }
        return {
            content: this.#content,
            timestamp: this.#timestamp,
            file: file ? filePacket.toData() : null,
            sender: this.#sender,
            is_read: this.#isRead,
            type: "message"
        }
    }

    getContent(){
        return this.#content;
    }

    getTimestamp(){
        return this.#timestamp;
    }

    getFile(){
        return this.#file;
    }

    getSender(){
        return this.#sender;
    }

    isRead(){
        return this.#isRead;
    }

    markAsRead(){
        this.#isRead = true;
    }
}