import User from "../models/user.model.js";
import { AppError, asyncHandler} from "../errorHandler.js";
import { generateAccessToken,
         generateRefreshToken, 
         setRefreshCookie , 
         hashToken, 
         verifyRefreshToken,
         compareToken} from "../utils/jwt.utils.js";

const saveUser= (user)=>({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    currency: user.currency
})

// Register

const Register= asyncHandler(async (req,res)=>{
    const {name, email ,password} = req.body

    const UserAlreadyExist= await User.findOne({email})
    if(UserAlreadyExist){
        throw new AppError("email already registered" ,409)
    }

    const user= await User.create({ name, email, password})

    const accessToken=await generateAccessToken(user._id)
    const refreshToken=await generateRefreshToken(user._id) 


    user.refreshTokenHash = await hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken)
    

    return res.status(200).json({
        message: "user registered succesfully",
        success: true,
        accessToken,
        user: saveUser(user)
    })
})

//login
const login= asyncHandler(async (req,res)=>{
    const {email, password}= req.body
    
    if(!email || !password) {
        throw new AppError("both field are required", 401)
    }

    const user = await User.findOne({email})
            .select("+password +refreshTokenHash" )
    if(!user) throw new AppError("Invalid Email or password", 401)

    const isMatch= await user.comparePassword(password)
    if(!isMatch) throw new AppError("Invalid Email or password", 401)

    const accessToken= generateAccessToken(user._id)
    const refreshToken= generateRefreshToken(user._id)


    user.refreshTokenHash= await hashToken(refreshToken)
    await user.save({validateBeforeSave: false})

    setRefreshCookie(res, refreshToken)

    return res.status(201).json({
        message: "user logged in successfully",
        success : true,
        accessToken,
        user: saveUser(user)
    })

})
//logout

const logout= asyncHandler(async(req,res)=>{
    const token= req.cookies.refreshToken

    if(token){
        try {
            const decoded = verifyRefreshToken(token)

            await User.findByIdAndUpdate(decoded.id, {refreshTokenHash: null})
            
        } catch (error) {
            
        }
    }

    res.clearCookie("refreshToken")
    res.status(200).json({
        success: true,
        message: "logged out successfullt"
    })
})

// refresh access token

const refresh = asyncHandler(async (req,res)=>{
    const token= req.cookies.refreshToken
    if(!token) throw new AppError("no refresh token",401)


    const decoded= verifyRefreshToken(token)

    const user= await User.findById(decoded.id)
            .select("+refreshTokenHash")
    if(!user?.refreshTokenHash) throw new AppError("Invalid Session",401)


    const isValid= await compareToken(token, user.refreshTokenHash)
    if(!isValid) throw new AppError("Invalid token", 401)
    
    const newRefreshToken= generateRefreshToken(user.id)
    const newAccessToken= generateAccessToken(user.id)

    user.refreshTokenHash = await hashToken(newRefreshToken)
    await user.save({validateBeforeSave: false})

    setRefreshCookie(res, newRefreshToken)

    res.json({success: true, accessToken: newAccessToken})
})


// get current user  
const getMe= asyncHandler(async(req,res)=>{
    res.json({success: true, user : saveUser(req.user)})
})

export {
    getMe,
    login,
    logout,
    Register,
    refresh
}