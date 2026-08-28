export default class SearchUserPacket {

    #username;

    constructor(
        username
    ){
        this.#username = username;
    }

    toData(){
        return {
            username: this.#username,
            type: "search_user"
        }
    }

    static fromData(data){
        return new SearchUserPacket(
            data["username"]
        );
    }

    getUsername(){
        return this.#username;
    }
}