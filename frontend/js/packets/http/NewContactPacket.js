import TimeUtils from "../../utils/TimeUtils.js";

export default class NewContactPacket {

    #username;
    #createdAt;

    constructor(
        username
    ){
        this.#username = username;
        this.#createdAt = TimeUtils.getCurrentTimeStamp();
    }

    toData(){
        return {
            username: this.#username,
            created_at: this.#createdAt,
            type: "new_contact"
        }
    }

    static fromData(data){
        return new NewContactPacket(
            data["username"]
        );
    }

    getUsername(){
        return this.#username;
    }

    getCreatedAt(){
        return this.#createdAt;
    }
}