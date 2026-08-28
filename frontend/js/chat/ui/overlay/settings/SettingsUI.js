import SettingsHeaderUI from './SettingsHeaderUI.js';
import SettingsBodyUI from './SettingsBodyUI.js';
import SettingsFooterUI from './SettingsFooterUI.js';

export default class SettingsUI {
    constructor() {
        this.overlay = document.querySelector('.settings-overlay');
        this.settings = document.querySelector('.settings-panel');
        this.header = new SettingsHeaderUI();
        this.body = new SettingsBodyUI();
        this.footer = new SettingsFooterUI();

        document.querySelector('.settings-btn')?.addEventListener('click', () => this.show());
        this.footer.onClickCloseBtn(() => this.hide());
        this.overlay?.addEventListener('click', event => {
            if (event.target === this.overlay) this.hide();
        });
    }

    getHeaderUI() { return this.header; }
    getBodyUI() { return this.body; }
    getFooterUI() { return this.footer; }

    show() {
        this.overlay?.classList.remove('hidden');
        this.settings?.classList.remove('hidden');
    }

    hide() {
        this.settings?.classList.add('hidden');
        this.overlay?.classList.add('hidden');
    }
}
