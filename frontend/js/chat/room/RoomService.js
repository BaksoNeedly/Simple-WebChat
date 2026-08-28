import ApiResponse from "../../core/ApiResponse.js";

export default class RoomService {

    static async fetchMessage(room){
        const response = await fetch(
            "/room/message",
            {
                method: "POST",
                body: JSON.stringify(room.toData())
            }
        );
        const data = await response.json();
        return new ApiResponse(response, data);
    }
}