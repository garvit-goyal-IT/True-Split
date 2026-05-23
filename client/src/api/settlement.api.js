import api from "./axiosInstance"

export const getSettlements = async (groupId) => {
    const response = await api.get(`/settlement/${groupId}`)
    return response.data.transactions
};