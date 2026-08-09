import Contact from "./Contact.js";

export default class User {

    #username;
    #contacts;

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

    getUsername(){
        return this.#username;
    }

    getContacts(){
        return this.#contacts;
    }

    getContact(username){
        return this.#contacts[username];
    }
}