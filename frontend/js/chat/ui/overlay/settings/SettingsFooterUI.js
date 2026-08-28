export default class SettingsFooterUI {
    constructor() {
        this.closeBtns = document.querySelectorAll('.settings-close');
    }

    onClickCloseBtn(callback) {
        this.closeBtns.forEach(button => button.addEventListener('click', callback));
    }
}
