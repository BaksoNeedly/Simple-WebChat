export default class GlobalJoinPacket {

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
        return new GlobalJoinPacket(data["username"]);
    }

    getUsername(){
        return this.username;
    }
}