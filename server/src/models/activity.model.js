import mongoose from "mongoose"

const activitySchema= new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true,
    },
    actionBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    action: {
        type: String,
        enum: ["expense_added", "expense_deleted", "member_joined"],
        default: "expense_added"
    },
    message: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})

const activityModel= mongoose.model("activity", activitySchema)

export default activityModel