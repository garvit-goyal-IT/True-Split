import api from "./axiosInstance"


async function getUserGroups(){
    const {data}= await api.get("/groups") 
    return data.groups
}

async function createGroup(){
    const {data}= await api.post("/groups", groupData)        
    return data.group
}

async function joinGroup(inviteCode){
    const {data}= await api.post("/groups/join", {inviteCode})        
    return data.group      
}


export {getUserGroups, createGroup, joinGroup}