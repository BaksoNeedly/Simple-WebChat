export default class VerificationFooterUI {
    constructor() {
        this.resend = document.querySelector('#resend-button');
        this.timer = document.querySelector('#timer');
        this.returnButton = document.querySelector('#return-button');
        this.seconds = 60;

        this.startCountdown();
    }

    onClickReturn(callback) {
        this.returnButton?.addEventListener('click', callback);
    }

    onClickResend(callback) {
        this.resend?.addEventListener('click', callback);
    }

    startCountdown() {
        const countdown = setInterval(() => {
            this.seconds -= 1;
            if (this.timer) this.timer.textContent = this.seconds;

            if (this.seconds <= 0) {
                clearInterval(countdown);
                if (this.resend) {
                    this.resend.disabled = false;
                    this.resend.textContent = 'Resend code';
                }
            }
        }, 1000);
    }
}
