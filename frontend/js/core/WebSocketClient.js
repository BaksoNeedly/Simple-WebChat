export default class WebSocketClient {

    constructor(){
        this.socket = new WebSocket(`ws://${location.host}/`);

        this.onOpen = null;
        this.onMessage = null;
        this.onClose = null;

        this.socket.onopen = () => {
            if(this.onOpen){
                this.onOpen();
            }
        }
        this.socket.onmessage = (event) => {
            if(this.onMessage){
                this.onMessage(event);
            }
        }
        this.socket.onclose = () => {
            if(this.onClose){
                this.onClose();
            }
        }
    }

    getSocket(){
        return this.socket;
    }

    sendData(data){
        this.socket.send(JSON.stringify(data))
    }
}