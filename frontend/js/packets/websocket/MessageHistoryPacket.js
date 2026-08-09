export default class MessageHistoryPacket {

    #content;
    #sender;
    #receiver;

    constructor(
        content,
        sender,
        receiver
    ){
        this.#content = content;
        this.#sender = sender;
        this.#receiver = receiver;
    }

    getContent(){
        return this.#content;
    }

    getSender(){
        return this.#sender;
    }

    getReceiver(){
        return this.#receiver;
    }

    static fromData(data){
        return new MessageHistoryPacket(
            data["content"],
            data["sender"],
            data["receiver"]
        );
    }
}