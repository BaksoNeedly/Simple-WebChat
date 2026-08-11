import Contact from "./Contact.js";

export default class User {

    static #username;
    static #contacts;
    static #currentRoom = null;

    constructor(
        username = "",
        contacts = []
    ){
        User.#username = username;
        User.#contacts = contacts;
    }

    static toData(){
        return {
            username: User.#username,
            contacts: User.#contacts
        }
    }

    static fromData(data){
        const contacts = [];
        const raw_contacts = JSON.parse(data["contacts"]);
        raw_contacts.forEach(contact_ => {
            contacts[contact_] = new Contact(contact_);
        });
        return new User(
            data["username"],
            contacts
        )
    }

    static getUsername(){
        return User.#username;
    }

    static getContacts(){
        return User.#contacts;
    }

    static getContact(username){
        return User.#contacts[username];
    }

    static getCurrentRoom(){
        return User.#currentRoom;
    }

    static setCurrentRoom(room){
        User.#currentRoom = room;
    }
}