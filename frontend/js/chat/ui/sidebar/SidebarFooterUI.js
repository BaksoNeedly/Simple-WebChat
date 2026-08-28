export default class SidebarFooterUI {
    constructor() {
        this.usernameElement = document.querySelector(".sidebar footer .details p:first-child");
        this.statusEl = document.querySelector(".sidebar footer .profile .details .status");
    }

    getUsername() {
        return this.usernameElement?.textContent.trim() || "";
    }

    setUsername(name) {
        if (this.usernameElement) {
            this.usernameElement.textContent = name;
        }
    }

    online(){
        this.statusEl.classList.remove("offline");
        this.statusEl.classList.add("online");
        this.statusEl.textContent = "ONLINE";
    }

    offline(){
        this.statusEl.classList.remove("online");
        this.statusEl.classList.add("offline");
        this.statusEl.textContent = "OFFLINE";
    }
}