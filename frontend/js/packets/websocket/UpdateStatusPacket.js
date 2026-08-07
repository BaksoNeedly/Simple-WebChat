export default class UpdateStatusPacket {

    constructor(username = ""){
        this.username = username;
    }

    toData(){
        return {
            username: this.username,
            type: "global_join"
        }
    }

    static fromData(data){
        return new UpdateStatusPacket(data["username"]);
    }

    getUsername(){
        return this.username;
    }
}