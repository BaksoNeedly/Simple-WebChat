import ApiResponse from "../../core/ApiResponse.js";

export default class UserService {
    static async fetchProfile() {
        const response = await fetch("/user/profile");
        const data = await response.json();

        return new ApiResponse(response, data);
    }

    static async fetchContact() {
        const response = await fetch("/user/contact"); 
        const data = await response.json();

        return new ApiResponse(response, data);
    }

    static async fetchMessages(){
        const response = await fetch("/user/message");
        const data = await response.json();
        return new ApiResponse(response, data);
    }

    static async newContact(packetData){
        console.log(packetData);
        const response = await fetch("/user/contact/new", {
            method: "POST",
            body: JSON.stringify(packetData)
        })
        return new ApiResponse(response);
    }
}