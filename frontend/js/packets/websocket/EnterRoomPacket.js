export default class EnterRoomPacket {

    #targetUsername;

    constructor(
        targetUsername
    ){
        this.#targetUsername = targetUsername;
    }

    toData(){
        return {
            target_username: this.#targetUsername,
            type: "enter_room"
        }
    }
}