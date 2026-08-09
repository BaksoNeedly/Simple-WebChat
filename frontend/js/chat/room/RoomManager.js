export default class RoomManager {

    static #rooms = []

    static getAll(){
        return this.#rooms;
    }

    static get(identifier){
        return this.#rooms[identifier];
    }

    static create(room){
        return this.#rooms[room.getIdentifier()] = room;
    }

    static remove(identifier){
        delete this.#rooms[identifier];
    }
}