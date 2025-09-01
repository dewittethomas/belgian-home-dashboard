import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiService = {
    async getWeatherData(city) {
        const res = await axios.get(`${API_BASE_URL}/weather`, {
            params: { city }
        })
        return res.data;
    },
    async getWasteCollections(zipCode, street, houseNumber) {
        const res = await axios.get(`${API_BASE_URL}/waste-collection`, {
            params: {
                zipCode,
                street,
                houseNumber
            }
        })
        return res.data;
    },
    async getTrainConnections(from, to) {
        const res = await axios.get(`${API_BASE_URL}/train`, {
            params: {
                from,
                to
            }
        })
        return res.data;
    },
    async getBusConnections(from, to) {
        const res = await axios.get(`${API_BASE_URL}/bus`, {
            params: {
                from,
                to
            }
        })
        return res.data;
    },
    async getTramConnections(from, to) {
        const res = await axios.get(`${API_BASE_URL}/tram`, {
            params: {
                from,
                to
            }
        })
        return res.data;
    }
}

export default apiService;