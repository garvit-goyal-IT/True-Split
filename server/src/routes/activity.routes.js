import { getActivity } from "../controllers/activity.controller.js";
import {protect} from "../middlewares/auth.middleware.js"
import express from "express"
const router= express.Router()


router.get('/:groupId', protect, getActivity)

export default router