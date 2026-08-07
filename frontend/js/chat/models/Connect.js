export default class Connect {

    constructor(status){
        this.status = status;
    }

    static fromData(data){
        return new Connect(
            data.status
        )
    }

    toData(){
        return {
            status: this.status
        }
    }

    static async sendRequest(){
        const response = await fetch("user_connect");
        const data = await response.json();
        return new Connect(data.status);
    }
}