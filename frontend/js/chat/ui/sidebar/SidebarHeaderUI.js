export default class SidebarHeaderUI {
    constructor() {
        this.newChat = document.querySelector(".sidebar header .new-chat-btn");
    }

    onClickNewChat(callback) {
        this.newChat?.addEventListener("click", () => {
            callback();
        });
    }
}
