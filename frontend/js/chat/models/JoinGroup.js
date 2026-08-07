import Group from "./Group.js";

export default class JoinGroup {

    constructor(group){
        this.group = group;
    }

    toData(){
        return {
            group_name: this.group.getName(),
            type: "join_group"
        }
    }

    static fromData(data){
        return new JoinGroup(new Group(data.group_name));
    }
}