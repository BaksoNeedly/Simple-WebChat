import VerificationHeaderUI from './VerificationHeaderUI.js';
import VerificationBodyUI from './VerificationBodyUI.js';
import VerificationFooterUI from './VerificationFooterUI.js';

export default class VerificationUI {
    constructor() {
        this.header = new VerificationHeaderUI();
        this.body = new VerificationBodyUI();
        this.footer = new VerificationFooterUI();

        this.setupEvents();
    }

    getHeaderUI() { return this.header; }
    getBodyUI() { return this.body; }
    getFooterUI() { return this.footer; }

    setupEvents() {
        this.body.onClickVerifyEmail((code) => {
            this.body.showMessage(
                code.length === 6 ? 'Verification code submitted.' : 'Please enter all 6 digits.',
                code.length === 6 ? '#039855' : '#d92d20'
            );
        });

        this.footer.onClickReturn(() => {
            window.location.href = '/page/login';
        });
    }
}

new VerificationUI();
