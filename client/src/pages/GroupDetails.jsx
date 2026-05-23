import React,{useState} from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {addExpense, getGroupExpenses } from "../api/expense.api";
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {useNavigate} from "react-router-dom"

function GroupDetails() {

    const {id}= useParams();
    const navigate= useNavigate()

    const {data: group, isLoading}= useQuery({
        queryKey: ["group", id],
        queryFn: async ()=> api.get(`/groups/${id}`).then(res=> res.data.group),
        retry: false
    })

    const {data: expenses} = useQuery({ 
        queryKey: ["Expenses", id],
        queryFn: async ()=> getGroupExpenses(id),
        retry: false
    })

    const queryClient= useQueryClient()

    const [showForm, setShowForm] = useState(false)
    const [expenseTitle, setExpenseTitle] = useState("")
    const [expenseAmount, setExpenseAmount] = useState("")
    const [category, setCategory] = useState("")

    const createMutation = useMutation({
        mutationFn: addExpense,
        onSuccess: () => {
            console.log("expense created")
            queryClient.invalidateQueries({ queryKey: ["Expenses", id] })
            setShowForm(false)
            setExpenseTitle("")
            setExpenseAmount("")
            setCategory("")
        },
         onError: (error) => {
        console.log("error", error.response?.data)
    }
    })
  return (
    <div>
        {isLoading ? <p>Loading...</p> : null}
      <h1>Group Details</h1>
      {group ? (
        <div>
          <h2>{group.name}</h2>
          <p>{group.description}</p>
          <h3>Members:</h3>
          <ul>
            {group.members.map((member) => (
              <li key={member._id}>{member.name}</li>
            ))}
          </ul> 
            <h3>Expenses:</h3>
            <ul>
                {expenses?.map((expense) => (
                    <li key={expense._id}>
                        {expense.title} - ${expense.totalAmount} - Paid by {expense.paidBy?.name}- {expense.category}
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate(`/groups/${id}/settlement`)}>
                View Settlements
            </button>
        </div>
      ) : (
        <p>Loading group details...</p>
      )}
      {showForm ? (
        <div>
          <input
            type="text"
            placeholder="Expense Title"
            value={expenseTitle}
            onChange={(e) => setExpenseTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Expense Amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={() =>{ 
             const splits = group.members.map(member => ({
                user: member._id,
                amount: Number(expenseAmount) / group.members.length
             }))

             createMutation.mutate({ title: expenseTitle, totalAmount: Number(expenseAmount), category, groupId: id, splits })
          }}>
            Add Expense
          </button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}>Add Expense</button>
      )}    
    </div>
  );
}

export default GroupDetails;    
