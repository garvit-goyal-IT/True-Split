import mongoose from "mongoose"


const groupSchema= new mongoose.Schema({
    name:{
        type:String,
        required: [true, "group name is required"]
    },
    description: {
        type:String,
    },
    avatar:{
        type: String,
        default: ""
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    inviteCode: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
})


const groupModel= mongoose.model('group', groupSchema)

export default groupModel