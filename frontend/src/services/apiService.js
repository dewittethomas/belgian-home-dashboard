import axios from 'axios';

const HOST_IP = import.meta.env.VITE_HOST_IP;
const API_BASE_URL = `http://${HOST_IP}:3000/api`

const apiService = {
    async getWeatherData(cities) {
        const res = await axios.post(`${API_BASE_URL}/weather`, {
            cities
        });
        return res.data;
    },
    async getWasteCollections(zipCode, street, houseNumber) {
        const res = await axios.get(`${API_BASE_URL}/waste-collection`, {
            params: {
                zipCode,
                street,
                houseNumber
            }
        });
        return res.data;
    },
    async getTrainConnections(routes) {
        const res = await axios.post(`${API_BASE_URL}/train`, {
            routes
        });
        return res.data;
    },
    async getBusConnections(routes) {
        const res = await axios.post(`${API_BASE_URL}/bus`, {
            routes
        });
        return res.data;
    },
    async getTramConnections(routes) {
        const res = await axios.post(`${API_BASE_URL}/tram`, {
            routes
        });
        console.log(res.data)
        return res.data;
    }
}

export default apiService;