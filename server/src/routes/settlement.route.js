import {getSettlements} from "../controllers/settlement.controller.js"
import {protect} from "../middlewares/auth.middleware.js"
import express, { Router } from "express"
const router= express.Router()

router.get('/:groupId', protect, getSettlements)


export default router