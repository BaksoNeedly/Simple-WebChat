export default class TotalUserPacket {

    constructor(online_users){
        this.online_users = online_users;
    }
    
    toData(){
        return {
            type: "total_user",
            online_users: this.online_users
        }
    }

    static fromData(data){
        return new TotalUserPacket(
            data["online_users"]
        );
    }

    getOnlineUsers(){
        return this.online_users;
    }
}