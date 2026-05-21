import mongoose from "mongoose";

const connectToDB= ()=>{
   try {
     mongoose.connect(process.env.MONGO_URI)
     console.log('database connected succesfully')
   } catch (error) {
        console.log('error in connecting to Database' ,error)
   }
}

export default connectToDB