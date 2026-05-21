import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema=  new mongoose.Schema({
    name: {
        type: String,
        required :[true,"name is required"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false
    },
    avatar: {
        type:String,
        default: ""
    },
    currency: {
        type: String,
        default: "INR"
    },
    isVerified: {
        type:Boolean,
        default : false
    },
    refreshTokenHash: {
        type: String,
        select: false,
      }
},{
    timestamps: true
})

userSchema.index({email :1},{unique: true})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword=async function(pass){
    return await bcrypt.compare(pass, this.password)
}


const userModel= mongoose.model('user',userSchema)
export default userModel