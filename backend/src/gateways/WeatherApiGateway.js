import RequestBuilder from "../utils/requestBuilder.js";

const WeatherApiGateway = {
    async getWeatherData(city) {

        const response = await RequestBuilder.get(`https://wttr.in/${city}?format=j1`)
                        .send();

        return response.data;
    }
};

export default WeatherApiGateway;