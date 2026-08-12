export default class SidebarFooterUI {
    constructor() {
        this.usernameElement = document.querySelector(".username");
    }

    getUsername() {
        return this.usernameElement?.textContent.trim() || "";
    }

    setUsername(name) {
        if (this.usernameElement) {
            this.usernameElement.textContent = name;
        }
    }
}