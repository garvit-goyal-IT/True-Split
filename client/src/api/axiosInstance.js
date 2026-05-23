import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let accessToken = null
export const setAccessToken = (token) => { accessToken = token }
export const clearAccessToken = () => { accessToken = null }


api.interceptors.request.use((config) => {
    console.log("token:", accessToken)
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
    return Promise.reject(error)
}
)

export default api