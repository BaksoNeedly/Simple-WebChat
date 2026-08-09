export default class Room {

    #messages = []
    #identifier;

    constructor(
        identifier = ""
    ){
        this.#identifier = identifier;
    }

    getIdentifier(){
        return this.#identifier;
    }

    getMessages(){
        return this.#messages;
    }

    addMessage(message){
        this.#messages.push(message);
    }
}