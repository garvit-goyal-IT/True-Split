import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUserGroups, createGroup } from "../api/group.api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate()

    const { data: groups, isLoading } = useQuery({
        queryKey: ["groups"],
        queryFn: getUserGroups
    })

    const [showForm, setShowForm] = useState(false)
    const [groupName, setGroupName] = useState("")

    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            console.log("group created")
            queryClient.invalidateQueries({ queryKey: ["groups"] })
            setShowForm(false)
            setGroupName("")
        },
         onError: (error) => {
        console.log("error", error.response?.data)
    }
    })


    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <h2>My Groups</h2>
            {groups?.length === 0 && <p>No groups yet. Create one!</p>}
            {groups?.map((group) => (
                <div className="border p-4 m-2" 
                         key={group._id}
                         onClick={() => navigate(`/groups/${group._id}`)}
                         style={{ cursor: "pointer" }}
                >
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <p>Members: {group.members.length}</p>
                </div>
            ))}

            <button onClick={() => setShowForm(true)}>Create Group</button>

            {showForm && (
                <div>
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                    />
                    <button onClick={() => {
                        console.log("groupName value:", groupName)
                        createMutation.mutate({ name: groupName }) 
                }}>
                        Create
                    </button>
                    <button onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            )}
            <button className="bg-green-200 h-8 w-20 rounded-xs"
                onClick={(e) => console.log("join group", e)}>Join Group</button>
        </div>
    )
}
export default Dashboard