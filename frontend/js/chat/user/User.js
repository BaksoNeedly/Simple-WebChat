import Contact from "./Contact.js";

export default class User {

    #username;
    #contacts;
    #currentRoom = null;

    constructor(
        username = "",
        contacts = []
    ){
        this.#username = username;
        this.#contacts = contacts;
    }

    toData(){
        return {
            username: this.#username,
            contacts: this.#contacts
        }
    }

    static fromData(data){
        return new User(
            data["username"]
        )
    }

    getUsername(){
        return this.#username;
    }

    getContacts(){
        return this.#contacts;
    }

    getContact(username){
        return this.#contacts[username] ?? null;
    }

    addContact(contact){
        if(contact.getUsername() in this.#contacts){
            return;
        }
        this.#contacts[contact.getUsername()] = contact;
    }

    getCurrentRoom(){
        return this.#currentRoom;
    }

    setCurrentRoom(room){
        this.#currentRoom = room;
    }
}