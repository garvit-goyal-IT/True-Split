import React, { useState } from "react";
import {loginUser} from "../api/auth.api";
import {useNavigate} from "react-router-dom"

function Login(){

    const navigate = useNavigate()


    const [email,setEmail]= useState("")
    const [password, setPassword]= useState("")

    const handleSubmit=async (e)=>{
        e.preventDefault()
        try {
        const user = await loginUser({ email, password })
        console.log("logged in", user)
        navigate("/dashboard")
        } catch(err) {
        console.log("error", err.response?.data)
        }
    }
    return (
        <div className="h-120 w-100 bg-blue-300 px-10 py-20 rounded-xs ">
            <form className="flex flex-wrap">
                <input value={email} onChange={(e)=> setEmail(e.target.value)} className="bg-white m-2" type="email" placeholder="abc@gmail.com"/>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} className="bg-white m-2" type="password" placeholder="password" />
                <button className="bg-green-200 h-8 w-20 rounded-xs" 
                    onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Login