import React, { useState } from "react";
import {registerUser} from "../api/auth.api";

function Register() {
        const [email,setEmail]= useState("")
        const [password, setPassword]= useState("")
        const [name, setName]= useState("")

        const handleSubmit=async (e)=>{
            e.preventDefault()
            try {
            const user = await registerUser({ name, email, password })
            console.log("registered", user)
            } catch(err) {
            console.log("error", err.response?.data)
            }
        }
    return (
       <div className="h-120 w-100 bg-blue-300 px-10 py-20 rounded-xs ">
            <form className="flex flex-wrap">
                <input value={name} onChange={(e)=> setName(e.target.value)} className="bg-white m-2" type="text" placeholder="name"/>
                <input value={email} onChange={(e)=> setEmail(e.target.value)} className="bg-white m-2" type="email" placeholder="abc@gmail.com"/>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} className="bg-white m-2" type="password" placeholder="password" />
                <button className="bg-green-200 h-8 w-20 rounded-xs" 
                    onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Register