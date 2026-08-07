export default class CreateRoom {

    constructor(targetUser){
        this.targetUser = targetUser;
    }

    toData(){
        return {
            type: "create_room",
            target_user: this.targetUser
        }
    }
}