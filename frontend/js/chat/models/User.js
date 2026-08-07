export default class User {

    constructor(
        username,
        id
    ){
        this.username = username;
        this.id = id;
    }

    toData(){
        return {
            username: this.username,
            id: this.id
        }
    }

    static fromData(data){
        return new User(data["username"], data["id"]);
    }

    getUsername(){
        return this.username;
    }

    getId(){
        return this.id;
    }

    static async request() {
        const response = await fetch("/user_data");

        const data = await response.json();

        return new User(data.username, data.serial_id);
    }
}