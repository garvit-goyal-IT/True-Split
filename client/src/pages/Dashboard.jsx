import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "../api/group.api";

function Dashboard(){

    const groups= useQuery("groups", getUserGroups)



    return ( 
        <div>
                <h2>My Groups</h2>
                {groups.data?.map((group) => (
                    <div key={group.id}>
                        <h3>{group.name}</h3>
                    </div>
                ))}

                <button className="bg-green-200 h-8 w-20 rounded-xs"
                    onClick={() => console.log("create group")}>Create Group</button>
                <button className="bg-green-200 h-8 w-20 rounded-xs"
                    onClick={(inviteCode) => console.log("join group", inviteCode)}>Join Group</button>
        </div>
    )
}
export default Dashboard