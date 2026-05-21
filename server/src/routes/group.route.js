import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { createGroup, getGroupById, getUserGroups, joinGroup } from "../controllers/group.Controller.js"

const router= express.Router()


router.post('/', protect, createGroup)

router.get('/', protect, getUserGroups)

router.get('/:id',protect, getGroupById)

router.post('/join', protect, joinGroup)


export default router