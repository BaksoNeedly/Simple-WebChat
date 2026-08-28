export default class Contact {

    #username;

    constructor(
        username
    ){
        this.#username = username;
    }

    toData(){
        return  {
            username: this.#username,
            type: "contact"
        }
    }

    getUsername(){
        return this.#username;
    }
}