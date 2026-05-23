import api from "./axiosInstance"

export const addExpense = async (expenseData) => {
        const response = await api.post("/expenses/add", expenseData)
        return response.data.expense
            

}

export const getGroupExpenses = async (groupId) => {
    
        const response = await api.get(`/expenses/groupExpenses/${groupId}`)
        return response.data.expenses          

}
