export default class LeaveRoomPacket {

    #username;

    constructor(
        username
    ){
        this.#username = username;
    }

    toData(){
        return {
            username: this.#username,
            type: "leave_room"
        }
    }
}