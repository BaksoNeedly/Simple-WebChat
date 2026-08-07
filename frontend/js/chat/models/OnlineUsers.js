export default class OnlineUsers {

    constructor(count, type="online_users"){
        this.count = count;
        this.type = type;
    }

    static fromData(data){
        return new OnlineUsers(data.count, data.type);
    }
    
    toData(){
        return {
            count: this.count,
            type: this.type
        }
    }

    getOnlineUsers(){
        return this.count;
    }

    getType(){
        return this.type;
    }  
}