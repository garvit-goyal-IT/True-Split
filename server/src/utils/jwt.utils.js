import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const generateRefreshToken = (userId)=>{
    return jwt.sign( {_id :  userId},
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRESIN || "7d"}
    )
}

const generateAccessToken=  (userId)=>{
    return jwt.sign( {_id :  userId},
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRESIN || "15m"}
    )
}

const verifyAccessToken = (token)=> jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) 
const verifyRefreshToken = (token)=> jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY) 

const hashToken= async (token)=>{

    if(!token) throw new Error("token is missing",401)
    return await bcrypt.hash(token, 10)
} 
const compareToken =async (token,hash)=>await bcrypt.compare(token, hash)

const setRefreshCookie = (res, token)=>{
    res.cookie("refreshToken", token , {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    } )
}

export {
    generateRefreshToken,
    generateAccessToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashToken,
    compareToken,
    setRefreshCookie
}