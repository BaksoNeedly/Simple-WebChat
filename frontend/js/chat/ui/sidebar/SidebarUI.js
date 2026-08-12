import SidebarHeaderUI from "./SidebarHeaderUI.js";
import SidebarBodyUI from "./SidebarBodyUI.js";
import SidebarFooterUI from "./SidebarFooterUI.js";

export default class SidebarUI {
    #headerUI;
    #bodyUI;
    #footerUI;

    constructor() {
        this.#headerUI = new SidebarHeaderUI();
        this.#bodyUI = new SidebarBodyUI();
        this.#footerUI = new SidebarFooterUI();
    }

    hide(){
        document.querySelector(".sidebar").classList.add("hidden");
    }

    show(){
        document.querySelector(".sidebar").classList.remove("hidden");
    }

    getHeaderUI() {
        return this.#headerUI;
    }

    getBodyUI() {
        return this.#bodyUI;
    }

    getFooterUI() {
        return this.#footerUI;
    }
}