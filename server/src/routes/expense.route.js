import express from "express"
import { addExpense, deleteExpense, getExpenseByID, getGroupExpense } from "../controllers/expense.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
const router= express.Router()

router.post('/add',protect, addExpense)

router.get('/groupExpenses/:groupId',protect, getGroupExpense)

router.get('/getExpense/:expenseId',protect, getExpenseByID)

router.delete('/:expenseId',protect, deleteExpense)

export default router