export default class SidebarHeaderUI {
    constructor() {
        this.newChat = document.getElementById("new-chat");
    }

    onClickNewChat(callback) {
        this.newChat?.addEventListener("click", () => {
            callback();
        });
    }
}