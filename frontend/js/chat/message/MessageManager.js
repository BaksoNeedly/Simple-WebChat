export class MessageManager {

    static #messages = [];

    constructor(){
    }

    static getMessages(){
        return this.#messages;
    }

    static addMessage(message){
        this.#messages.push(message);
    }
}