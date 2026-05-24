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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
            <p className="text-gray-400 text-sm mb-6">Join TrueSplit for free</p>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Your name"
                        className="mt-1 w-full border border-gray-700 text-white placeholder:text-gray-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
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
                    Create Account
                </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 font-medium hover:underline">
                    Sign in
                </a>
            </p>
        </div>
    </div>
)
}

export default Register