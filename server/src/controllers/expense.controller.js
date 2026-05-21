import Expense from "../models/expense.model.js";
import Group from "../models/group.model.js"
import {asyncHandler, AppError} from "../errorHandler.js"
import { addActivity } from "./activity.controller.js";
import {sendExpenseNotification} from "../utils/email.utils.js"

const addExpense= asyncHandler(async(req,res)=>{
    const {totalAmount,category,splits,title,groupId}= req.body

    if(!totalAmount || !title) throw new AppError("Amount or title is missing", 409)

    if(!groupId) throw new AppError('group id is missing',402)

    const user= req.user
    if(!user) throw new AppError("user not fount",402)

    const group= await Group.findById(groupId)
    if(!group) throw new AppError("group not found", 402)

    const isMember= group.members.some(
        memberId=> memberId.equals(user._id)
    )
    if(!isMember) throw new AppError("Unauthorized access", 401)

    if(!splits) throw new AppError("splits are required", 402)
    
    const amount= splits.reduce((total,currSplit)=>{
        return total+ currSplit.amount
    },0)

    if(amount!=totalAmount) throw new AppError("Invalid amount", 401)
    
    const expense= await Expense.create({
        title: title,
        totalAmount: totalAmount,
        category: category,
        splits: splits,
        group: groupId,
        paidBy: user._id
    })

    await addActivity({
        group: groupId,
        actionBy: user._id,
        action: "expense_added",
        message: `${user.name} added ${title} Rs.${totalAmount}`
    })  

    const populatedGroup = await Group.findById(groupId).populate("members", "name email")
    
    await sendExpenseNotification(
    populatedGroup.members,
    user.name,
    title,
    totalAmount,
    populatedGroup.name
)

    return res.status(201).json({
        success: true,
        message: "Expense created successfully",
        expense
    })
})

const getGroupExpense= asyncHandler(async(req,res)=>{

    const {groupId}= req.params
    if(!groupId) throw new AppError("groupId is missing",402)

    const group= await Group.findById(groupId)
    if(!group) throw new AppError("group not exist",401)

    const user= req.user
    if(!user) throw new AppError("user not exist", 401)

    const isMember= group.members.some(
        memberId=> memberId.equals(user._id)
    )
    if(!isMember) throw new AppError("unauthorized access", 403)
    
    const expenses=await  Expense.find({group: groupId})

    return res.status(200).json({
        success: true,
        message: "expenses fetched",
        expenses
    })
        
})

const getExpenseByID= asyncHandler(async(req,res)=>{
    const {expenseId}= req.params
    if(!expenseId) throw new AppError("Expense Id is missing ",402)

    const expense= await Expense.findById(expenseId)
    if(!expense) throw new AppError("Expense not found",401)

    const groupId = expense.group

    const user= req.user
    if(!user) throw new AppError("user not loggedin", 403)

    const group= await Group.findById(groupId)

    const isMember= group.members.some(
        memberId=> memberId.equals(user._id)
    )

    if(!isMember) throw new AppError("UnAuthroized user",402)

    const result= await expense.populate("splits.user","name email avatar")

    return res.status(200).json({
            success: true,
            message:"expense fetched..",
            result
        })
})

const deleteExpense= asyncHandler(async(req,res)=>{
    const {expenseId} = req.params
    if(!expenseId) throw new AppError("expense id is missing", 401)

    const user= req.user
    if(!user) throw new AppError("user is not loggedin ",403)

    const expense= await Expense.findById(expenseId)
    if(!expense) throw new AppError("expense not found",401)

    const isAdmin= expense.paidBy.equals(user._id)

    if(!isAdmin) throw new AppError("Unauthorized access", 403)
    
    await expense.deleteOne()

    await addActivity({
         group: expense.group,
         actionBy: user._id,
         action: "expense_deleted",
         message: `${user.name} deleted ${expense.title}`
    })

    return res.status(200).json(
        {success: true,
        message: "expense deleted",
    }
    )

})

export  {
    addExpense,
    getGroupExpense,
    getExpenseByID,
    deleteExpense

}