import {AppError, asyncHandler } from "../errorHandler.js";
import Group from "../models/group.model.js";
import {addActivity} from "../controllers/activity.controller.js"

import crypto from 'node:crypto';


const createGroup = asyncHandler(async(req,res)=>{
    const {name, desc} = req.body
    if(!name || !desc) throw new AppError("name and description are required to create group", 401)

    const inviteCode= crypto.randomBytes(6).toString('hex')
    const admin= req.user?._id

    if(!admin) throw new AppError("login first to create group", 401)

    const group = await Group.create({
        name: name,
        description: desc,
        inviteCode: inviteCode,
        admin: admin,
        members: [admin]
    })

    return res.status(200).json({
        success: true,
        message: "group created succesfully",
        group
    })
})

const getUserGroups= asyncHandler(async(req,res)=>{
    const user= req.user
    if(!user) throw new AppError("login to get all groups", 401)

    const groups= await Group.find({members: user._id}).populate("members", "name email avatar")

    return res.status(200).json({
        success: true,
        message: "groups fetched successfully",
        groups
    })
})

const getGroupById= asyncHandler(async (req,res)=>{
    const {id}= req.params

    if(!id) throw new AppError("id is missing", 401)

    const group= await Group.findById(id).populate("members", "name email avatar ")
    if(!group) throw new AppError("no group found", 401)

    const isMember= group.members.some(
        memberId=> memberId.equals(req.user._id)  
    )
    if(!isMember) throw new AppError("Unauthorized access", 403)
    return res.status(200).json({
        success: true,
        message: "group fetched", 
        group
    })
})

const joinGroup= asyncHandler(async(req,res)=>{
    const {inviteCode} = req.body
    if(!inviteCode) throw new AppError("invite code is missing", 401)

    const user= req.user
    if(!user) throw new AppError("login first", 400)

    const group = await Group.findOne({inviteCode: inviteCode})

    if(!group) throw new AppError("Invalid Invite Code", 401)

    const isAlreadyMember= group.members.some(
         memberId=> memberId.equals(user._id)  
    )
    if(isAlreadyMember) throw new AppError("user already present", 400)
    else group.members.push(user._id)

    await group.save({validateBeforeSave: false})

    await addActivity({
        group: group._id,
        actionBy: user._id,
        action: "member_joined",
        message: `${user.name} joined the group`
    })      

    return res.status(200).json({success: true, message: "user added succesfully", group})
    
})

export {createGroup,getUserGroups,getGroupById,joinGroup}
