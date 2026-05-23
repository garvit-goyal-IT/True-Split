import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let accessToken = null
export const setAccessToken = (token) => { accessToken = token }
export const clearAccessToken = () => { accessToken = null }


api.interceptors.request.use((config) => {
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
    const original = error.config
    if(error.response?.status === 401 && !original._retry){
         if(window.location.pathname === "/login"){
        return Promise.reject(error)
        }
        original._retry = true
        try {
            const { data } = await api.post("/auth/refresh")
            setAccessToken(data.accessToken)
            original.headers.Authorization = `Bearer ${data.accessToken}`
            return api(original)
        } catch {
            clearAccessToken()
            window.location.href = "/login"
        }
    }
    return Promise.reject(error)
}
)

export default api