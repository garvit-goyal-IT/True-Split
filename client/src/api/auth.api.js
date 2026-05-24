import api, {setAccessToken} from './axiosInstance'

export const  loginUser= async({email,password})=>{
    const {data}= await api.post("/auth/login", {email,password})
    setAccessToken(data.accessToken)

    return data.user
}

export const registerUser= async({name,email,password})=>{
    const {data}= await api.post("/auth/register", {name,email,password})
    return data.user
}

export const getCurrentUser= async()=>{
    const {data}= await api.get("/auth/me")
    return data.user
}

export const logoutUser= async()=>{
    await api.post("/auth/logout")
    setAccessToken(null)
}
