export default class TimeUtils {

    static getTimeStamp(){
        const date = new Date();
        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        )
    }

    static getTimestamp(){
        return Date.now();
    }
}