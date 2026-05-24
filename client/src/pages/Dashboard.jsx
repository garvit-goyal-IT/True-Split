import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUserGroups, createGroup } from "../api/group.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"



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
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">My Groups</h1>
            <p className="text-gray-400 text-sm mb-8">Manage your shared expenses</p>

            {/* Groups Grid */}
            {groups?.length === 0 && (
                <p className="text-gray-500 text-center mt-20">No groups yet. Create one!</p>
            )}

            <div className="grid grid-cols-1 gap-4 mb-8">
                {groups?.map((group) => (
                    <div
                        key={group._id}
                        onClick={() => navigate(`/groups/${group._id}`)}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-blue-500 hover:bg-gray-750 transition"
                    >
                        <h3 className="text-lg font-semibold">{group.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{group.description}</p>
                        <p className="text-gray-500 text-xs mt-3">{group.members.length} members</p>
                    </div>
                ))}
            </div>

            {/* Create Group Form */}
            {showForm && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">New Group</h3>
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => createMutation.mutate({ name: groupName })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    + Create Group
                </button>
                <button
                    className="bg-gray-700 text-gray-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                >
                    Join Group
                </button>
            </div>
        </div>
    </div>
    </>
)
}
export default Dashboard