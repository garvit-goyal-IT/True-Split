import {useQuery} from "@tanstack/react-query"
import {getSettlements} from "../api/settlement.api"
import {useParams} from "react-router-dom"
import api from "../api/axiosInstance"

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
        <div>
            <h1>Transactions</h1>
            {settlements?.length === 0 && <p>No settlements needed. All even!</p>}
            {settlements?.map((transaction, index) => (
                <li key={index}>
                    {getMemberName(transaction.from)} pays {getMemberName(transaction.to)} ${transaction.amount.toFixed(2)}
                </li>
            ))}
        </div>
    )
}

export default Settlement