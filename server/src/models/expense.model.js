import mongoose from 'mongoose'

const expenseSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    group : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    totalAmount:{
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: String,
        enum: ["food", "rent", "travel", "others"],
        default: "food"
    },
    splits: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }, 
        amount: { 
            type: Number
        }
    }],
    receipt: {
        type:String,
        default: ""
    }
}, {
    timestamps:true
})

const expenseModel=  mongoose.model('expense', expenseSchema)

export default expenseModel;