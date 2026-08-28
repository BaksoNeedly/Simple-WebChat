export default class TimeUtils {

    // static getTimeStamp(){
    //     const date = new Date();
    //     return date.toLocaleTimeString(
    //         "en-US",
    //         {
    //             hour: "numeric",
    //             minute: "2-digit"
    //         }
    //     )
    // }

    static getCurrentTimeStamp(){
        return Date.now();
    }

    static readableTime(timestamp){
        const date = new Date(Number(timestamp));

        if (Number.isNaN(date.getTime())) {
            return "Invalid Date";
        }

        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
    }
}
