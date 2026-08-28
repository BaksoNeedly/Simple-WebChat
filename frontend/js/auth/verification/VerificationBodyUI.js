export default class VerificationBodyUI {
    constructor() {
        this.fields = [...document.querySelectorAll('.code-input')];
        this.form = document.querySelector('#verification-form');
        this.message = document.querySelector('#verification-message');

        this.setupCodeInputs();
    }

    getCode() {
        return this.fields.map(field => field.value).join('');
    }

    onClickVerifyEmail(callback) {
        this.form?.addEventListener('submit', event => {
            event.preventDefault();
            callback(this.getCode());
        });
    }

    showMessage(text, color) {
        if (!this.message) return;
        this.message.textContent = text;
        this.message.style.color = color;
    }

    setupCodeInputs() {
        this.fields.forEach((field, index) => {
            field.addEventListener('input', () => {
                field.value = field.value.replace(/\D/g, '').slice(-1);
                if (field.value && this.fields[index + 1]) this.fields[index + 1].focus();
            });

            field.addEventListener('keydown', event => {
                if (event.key === 'Backspace' && !field.value && this.fields[index - 1]) {
                    this.fields[index - 1].focus();
                }
            });

            field.addEventListener('paste', event => {
                event.preventDefault();
                const code = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                code.split('').forEach((digit, i) => this.fields[i].value = digit);
                this.fields[Math.max(0, Math.min(code.length, 6) - 1)]?.focus();
            });
        });
    }
}
