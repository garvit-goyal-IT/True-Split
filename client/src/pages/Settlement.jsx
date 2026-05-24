import {useQuery} from "@tanstack/react-query"
import {getSettlements} from "../api/settlement.api"
import {useParams} from "react-router-dom"
import api from "../api/axiosInstance"
import Navbar from "../components/Navbar"
function Settlement() {
    const {id}= useParams();
        
    const {data: settlements, isLoading}= useQuery({    
        queryKey: ["settlement", id],
        queryFn: async ()=> getSettlements(id),
        retry: false
    })

    const {data: group} = useQuery({
    queryKey: ["group", id],
    queryFn: () => api.get(`/groups/${id}`).then(res => res.data.group),
    retry: false
    })

    const getMemberName = (userId) => {
    console.log("userId:", userId)
    if(!group?.members) return userId
    const member = group?.members.find(m => {
        console.log("m._id:", m._id)
        return m._id?.toString() === userId?.toString()
    })
    return member?.name || "Unknown"
} 

    if (isLoading) {
        return <p>Loading...</p>
    }   
    
    console.log("transactions:", settlements)
    return (
        <>
        <Navbar />
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Settlements</h1>
            <p className="text-gray-400 text-sm mb-8">Who pays whom</p>

            {isLoading && <p className="text-gray-400">Calculating...</p>}

            {settlements?.length === 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                    <p className="text-green-400 font-medium">All settled up!</p>
                    <p className="text-gray-500 text-sm mt-1">No transactions needed</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {settlements?.map((transaction, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-red-900 text-red-300 text-sm px-3 py-1 rounded-full">
                                    {getMemberName(transaction.from)}
                                </span>
                                <span className="text-gray-500 text-sm">pays</span>
                                <span className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                                    {getMemberName(transaction.to)}
                                </span>
                            </div>
                            <p className="text-white font-semibold">₹{transaction.amount.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    </>
)
}

export default Settlement