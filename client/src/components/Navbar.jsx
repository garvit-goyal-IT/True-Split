import { useNavigate } from "react-router-dom"
import { logoutUser } from "../api/auth.api"

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logoutUser()
        navigate("/login")
    }

    return (
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <h1 
                    onClick={() => navigate("/dashboard")}
                    className="text-white font-bold text-xl cursor-pointer"
                >
                    TrueSplit
                </h1>
                <button
                    onClick={handleLogout}
                    className="text-gray-400 text-sm hover:text-white transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar