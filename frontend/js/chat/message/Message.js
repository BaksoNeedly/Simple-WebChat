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
            data["file"],
            data["sender"]
        );
    }

    toData(){
        return {
            content: this.#content,
            timestamp: this.#timestamp,
            file: this.#file,
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