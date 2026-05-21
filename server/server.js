import express from 'express'
import { configDotenv } from 'dotenv'
import connectToDB from './db.js'
import cookieParser from 'cookie-parser'
import userRoutes from "./src/routes/user.route.js"
import groupRoutes from "./src/routes/group.route.js"
import expenseRoutes from "./src/routes/expense.route.js"
import settlementRoute from "./src/routes/settlement.route.js"
import activityRoute from "./src/routes/activity.routes.js"
 
configDotenv()

const app= express()

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', userRoutes)
app.use('/api/group',groupRoutes)
app.use('/api/expense/',expenseRoutes)
app.use('/api/settlement',settlementRoute)
app.use('/api/activity',activityRoute)

const startServer= ()=>{
    try {
        connectToDB()
        app.listen(process.env.PORT , ()=>{
            console.log('server started on PORT',process.env.PORT)
        })
    } catch (error) {
        console.log('error in starting the server ', error)
    }
}

startServer()


