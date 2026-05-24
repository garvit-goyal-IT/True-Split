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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400 text-sm mb-6">Sign in to TrueSplit</p>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="abc@gmail.com"
                        className="mt-1 w-full border border-gray-700 text-white placeholder:text-gray-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="mt-1 w-full border border-gray-700 text-white placeholder:text-gray-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 font-medium hover:underline">
                    Register
                </a>
            </p>
        </div>
    </div>
)
}

export default Login