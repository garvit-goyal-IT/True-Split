import express from "express"
import rateLimit from "express-rate-limit"
import { Register, getMe, login, logout, refresh } from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"


const router= express.Router()


const authLimiter= rateLimit({
    windowMs: 15*60*1000,
    max: 10,
    standardHeaders: true,
    message: {
        success: false,
        message: "Too many attempts , please try again later"
    }
})

router.post('/register', authLimiter, Register)

router.post('/login', authLimiter, login)

router.post('/logout', logout)

router.post('/refresh', refresh)

router.get('/me',protect, getMe)


export default router