export default class SettingsBodyUI {
    constructor() {
        this.verifyEmailBtn = document.querySelector('.verify-email-btn');
        this.logoutBtn = document.querySelector('.logout-btn');
        this.resetAccountBtn = document.querySelector('.reset-account-btn');
        this.deleteAccountBtn = document.querySelector('.delete-account-btn');
    }

    onClickVerifyEmailBtn(callback) { this.verifyEmailBtn?.addEventListener('click', callback); }
    onClickLogoutBtn(callback) { this.logoutBtn?.addEventListener('click', callback); }
    onClickResetAccountBtn(callback) { this.resetAccountBtn?.addEventListener('click', callback); }
    onClickDeleteAccountBtn(callback) { this.deleteAccountBtn?.addEventListener('click', callback); }
}
