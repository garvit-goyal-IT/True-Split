import Activity from "../models/activity.model.js"
import {AppError, asyncHandler} from "../errorHandler.js"

const addActivity= async(activity)=>{
    await Activity.create(activity)
    
}

const getActivity= asyncHandler(async(req,res)=>{
    const {groupId}= req.params
    if(!groupId) throw new AppError("group id is missing",402)

    const user= req.user
    if(!user) throw new AppError("user is missing",402)

    const activites= await Activity.find({group: groupId}).populate("actionBy","name avatar").sort({createdAt: -1})

    if(activites.length==0) throw new AppError("No activity found",402)

    return res.status(200).json({
        success: true,
        message: 'Activity fetched successfully',
        activites
    })

})

export {
    addActivity,
    getActivity
}