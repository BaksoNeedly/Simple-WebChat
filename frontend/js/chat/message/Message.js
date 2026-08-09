export default class Message {

    #content;
    #timestamp;
    #sender;

    constructor(
        content,
        timestamp,
        sender = ""
    ){
        this.#content = content;
        this.#timestamp = timestamp;
        this.#sender = sender;
    }

    static fromData(data){
        return new Message(
            data["content"],
            data["timestamp"],
            data["sender"]
        );
    }

    toData(){
        return {
            content: this.#content,
            timestamp: this.#timestamp,
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

    getSender(){
        return this.#sender;
    }
}