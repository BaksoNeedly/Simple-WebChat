import SearchUserPacket from "../../../../packets/http/SearchUserPacket.js";
import NewChatPacket from "../../../../packets/http/NewChatPacket.js";

export default class NewChatFooterUI {
    constructor() {
        this.search = document.querySelector(".new-chat footer .search-btn");
        this.input = document.querySelector(".new-chat .input-box .input");
        this.cancelButtons = document.querySelectorAll(".new-chat footer .cancel-btn");
    }

    onSearch(callback, bodyUI) {
        const search = () => {
            const username = bodyUI.getUsername();
            callback(new SearchUserPacket(username));
        };

        this.search?.addEventListener("click", search);
        this.input?.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                search();
            }
        });
    }

    onCancel(callback) {
        this.cancelButtons.forEach(button => {
            button.addEventListener("click", callback);
        });
    }
}
