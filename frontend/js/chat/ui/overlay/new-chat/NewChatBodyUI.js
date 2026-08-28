export default class NewChatBodyUI {
    constructor() {
        this.input = document.querySelector(".new-chat .input-box .input");
    }

    reset(){
        this.clear();
    }

    getUsername() {
        return this.input?.value.trim() || "";
    }

    clear() {
        if (this.input) this.input.value = "";
    }
}
