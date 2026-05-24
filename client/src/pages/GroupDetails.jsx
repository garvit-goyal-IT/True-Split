import React,{useState} from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {addExpense, getGroupExpenses } from "../api/expense.api";
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {useNavigate} from "react-router-dom"
import Navbar from "../components/Navbar"

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
    <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
            
            {isLoading && <p className="text-gray-400">Loading...</p>}

            {group && (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        <p className="text-gray-400 text-sm mt-1">{group.description}</p>
                    </div>

                    {/* Members */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Members</h3>
                        <div className="flex flex-wrap gap-2">
                            {group.members.map((member) => (
                                <span key={member._id} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">
                                    {member.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Expenses</h3>
                        {expenses?.length === 0 && (
                            <p className="text-gray-500 text-sm">No expenses yet.</p>
                        )}
                        <div className="flex flex-col gap-3">
                            {expenses?.map((expense) => (
                                <div key={expense._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{expense.title}</p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                Paid by {expense.paidBy?.name} · {expense.category}
                                            </p>
                                        </div>
                                        <p className="text-green-400 font-semibold">₹{expense.totalAmount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Expense Form */}
                    {showForm ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-3">New Expense</h3>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Expense title"
                                    value={expenseTitle}
                                    onChange={(e) => setExpenseTitle(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="others">Others</option>
                                    <option value="food">Food</option>
                                    <option value="travel">Travel</option>
                                    <option value="rent">Rent</option>
                                </select>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const splits = group.members.map(member => ({
                                                user: member._id,
                                                amount: Number(expenseAmount) / group.members.length
                                            }))
                                            createMutation.mutate({ title: expenseTitle, totalAmount: Number(expenseAmount), category, groupId: id, splits })
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                + Add Expense
                            </button>
                            <button
                                onClick={() => navigate(`/groups/${id}/settlement`)}
                                className="bg-gray-700 text-gray-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                            >
                                View Settlements
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
    </>
)
}

export default GroupDetails;    
