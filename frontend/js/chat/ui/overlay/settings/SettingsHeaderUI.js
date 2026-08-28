export default class SettingsHeaderUI {
    constructor() {
        this.title = document.querySelector('.settings-panel header .title');
        this.profile = document.querySelector('.settings-panel .settings-profile');
        this.usernameElement = this.profile?.querySelector('.name');
        this.statusElement = this.profile?.querySelector('.status');
    }

    getUsername() {
        return this.usernameElement?.textContent.trim() || '';
    }

    setUsername(name) {
        if (this.usernameElement) {
            this.usernameElement.textContent = name;
        }
    }

    online() {
        this.statusElement?.classList.remove('offline');
        this.statusElement?.classList.add('online');
        if (this.statusElement) this.statusElement.textContent = 'ONLINE';
    }

    offline() {
        this.statusElement?.classList.remove('online');
        this.statusElement?.classList.add('offline');
        if (this.statusElement) this.statusElement.textContent = 'OFFLINE';
    }
}
