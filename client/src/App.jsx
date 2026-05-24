import Login from "./pages/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import {useEffect} from "react"
import api, {setAccessToken} from "./api/axiosInstance"
import GroupDetails from "./pages/GroupDetails"
import Settlement from "./pages/Settlement"


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/groups/:id/settlement" element={<Settlement />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
