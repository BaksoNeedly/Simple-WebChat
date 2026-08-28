export default class VerificationHeaderUI {
    constructor() {
        this.title = document.querySelector('.header .title');
        this.email = document.querySelector('#email-label');
    }

    setEmail(email) {
        if (this.email) this.email.textContent = email;
    }
}
