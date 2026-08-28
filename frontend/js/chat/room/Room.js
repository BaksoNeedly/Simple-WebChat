export default class Room {

    #messages = []
    #identifier;

    constructor(
        identifier = ""
    ){
        this.#identifier = identifier;
    }
    
    toData(){
        return {
            identifier: this.#identifier,
            type: "room"
        }
    }

    getIdentifier(){
        return this.#identifier;
    }

    getMessages(){
        return this.#messages;
    }

    getMessage(timestamp){
        return this.#messages[timestamp] ?? null;
    }

    addMessage(message){
        if(message.getTimestamp() in this.#messages) return;
        this.#messages[message.getTimestamp()] = message;
    }

    markAllAsRead(){
        Object.entries(this.#messages).forEach(([, message]) => {
            message.markAsRead();
        })
    }

    getUnreadMessages(){
        let messages = [];
        Object.values(this.getMessages()).forEach((message) => {
            if(!message.isRead()){
                messages.push(message);
            }
        });

        return messages;
    }

    getLatestMessage(){
        const messages = Object.values(this.getMessages());

        if(messages.length == 0){
            return null;
        }

        return messages[messages.length - 1];
    }
}