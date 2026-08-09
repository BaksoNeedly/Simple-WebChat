export default class UserService {

    static async fetchProfile(){
        const response = await fetch("/user/profile");
        return await response.json();
    }
}