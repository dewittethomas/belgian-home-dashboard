import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiService = {
    async getWeatherData(city) {
        const res = await axios.get(`${API_BASE_URL}/weather`, {
            params: { city }
        })
        return res.data;
    },
    // getWasteCollection: (zipCode, street, number) => {
    //     axios.get(`${API_BASE_URL}/waste`, {
    //         params: {
    //             zipCode,
    //             street,
    //             number
    //         }
    //     }).then(res => res.data);
    // },
    // getTrainConnections: (from, to) => {
    //     axios.get(`${API_BASE_URL}/train`, {
    //         params: {
    //             from,
    //             to
    //         }
    //     })
    //     .then(res => res.data);
    // },
    // getBusConnections: (from, to) => {
    //     axios.get(`${API_BASE_URL}/bus`, {
    //         params: {
    //             from,
    //             to
    //         }
    //     })
    //     .then(res => res.data);
    // },
    // getTramConnections: (from, to) => {
    //     axios.get(`${API_BASE_URL}/tram`, {
    //         params: {
    //             from,
    //             to
    //         }
    //     })
    //     .then(res => res.data);
    // }
}

export default apiService;