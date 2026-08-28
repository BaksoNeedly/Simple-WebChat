export default class UserEnterRoomPacket {

    #username;

    constructor(
        username
    ){
        this.#username = username;
    }

    toData(){
        return {
            target_username: this.#username,
            type: "user_enter_room"
        }
    }

    static fromData(data){
        return new UserEnterRoomPacket(data["username"])
    }

    getUsername(){
        return this.#username;
    }
}