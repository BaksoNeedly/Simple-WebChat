export default class Contact {

    #username;

    constructor(
        username
    ){
        this.#username = username;
    }

    getUsername(){
        return this.#username;
    }
}