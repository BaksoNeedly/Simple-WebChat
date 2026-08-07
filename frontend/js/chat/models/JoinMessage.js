export default class JoinMessage {

    constructor(username, type="join_message"){
        this.username = username;
        this.type = type;
    }

    static fromData(data){
        return new JoinMessage(
            data.username,
            data.type
        )
    }

    toData(){
        return {
            username: this.username,
            type: this.type
        }
    }

    getUsername(){
        return this.username;
    }

    getType(){
        return this.type;
    }
}