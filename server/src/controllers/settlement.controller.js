import { AppError, asyncHandler } from "../errorHandler.js";
import Expense from "../models/expense.model.js";
import Group from "../models/group.model.js";

const calculateSettlements= (expenses)=>{
    
    const balances={}

    expenses.forEach(expense => {
        const payerId= expense.paidBy.toString()

        balances[payerId]= (balances[payerId] || 0) + expense.totalAmount

        expense.splits.forEach(split=> {
            const userId= split.user.toString()
            balances[userId]= (balances[userId] || 0) - split.amount
        })
    });

    const creditors= []
    const debtors=[]

  

    for(const [userId,amount] of Object.entries(balances) ){
        if(amount < 0){
            debtors.push({user: userId, amount:-1*amount})
        }else if(amount > 0){
            creditors.push({user: userId, amount: amount})
        }
    }

    const transactions= []
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    while (creditors.length > 0 && debtors.length> 0) {
       let creditor = creditors[0]
       let debtor = debtors[0]

       let settlement=  Math.min(creditor.amount,debtor.amount)

       transactions.push({from : debtor.user, to: creditor.user,amount: settlement})

       creditor.amount-=settlement
       debtor.amount-= settlement

       if(creditor.amount===0) creditors.shift()
       if(debtor.amount===0) debtors.shift()
    }

    console.log(transactions)
    return transactions
}

const getSettlements = asyncHandler(async(req,res)=>{
    const {groupId}= req.params
    if(!groupId) throw new AppError("group id is missing", 402)

    const user= req.user
    if(!user) throw new AppError("user is missing", 402)

    const group= await Group.findById(groupId)
    if(!group) throw new AppError("group not found", 401)

    const isMember= group.members.some(
        memberId=> memberId.equals(user._id)
    )

    if(!isMember) throw new AppError("UnAuthorized access",409)

    const expenses= await Expense.find({group: groupId})
    if(!expenses) throw new AppError("expenses not found", 401)

    const transactions= calculateSettlements(expenses)

    return res.status(200).json({
        success:  true,
        message: "Transactions settled succesfully",
        transactions
    })
})

export {
    getSettlements
}