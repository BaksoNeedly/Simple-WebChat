export default class ApiResponse {
    #status;
    #ok;
    #data;

    constructor(response, data) {
        this.#status = response.status;
        this.#ok = response.ok;
        this.#data = data;
    }

    status() {
        return this.#status;
    }

    ok() {
        return this.#ok;
    }

    getData() {
        return this.#data;
    }
}