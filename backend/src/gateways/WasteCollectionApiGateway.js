import axios from 'axios';

const WeatherApiGateway = {
    async getWeatherData(city) {
        const url = `https://wttr.in/${city}?format=j1`;
        const response = await axios.get(url);

        return response.data;
    }
};

export default WeatherApiGateway;