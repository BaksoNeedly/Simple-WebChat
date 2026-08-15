export default class FilePacket {

    #filename;

    constructor(
        filename
    ){
        this.#filename = filename;
    }

    static fromData(data){
        if (!data) return null;
        return new FilePacket(
            data["filename"]
        );
    }

    toData(){
        return {
            file_name: this.#filename,
            type: "file"
        }
    }

    getName(){
        return this.#filename;
    }
}