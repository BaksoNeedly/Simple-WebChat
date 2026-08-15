import FilePacket from "../../packets/websocket/FilePacket.js";

export default class Message {

    #content;
    #timestamp;
    #sender;
    #file = null;

    constructor(
        content,
        timestamp,
        file = null,
        sender = ""
    ){
        this.#content = content;
        this.#timestamp = timestamp;
        this.#file = file;
        this.#sender = sender;
    }

    static fromData(data){
        return new Message(
            data["content"],
            data["timestamp"],
            FilePacket.fromData(data["file"]),
            data["sender"]
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
}