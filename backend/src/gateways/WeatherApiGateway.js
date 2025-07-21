import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const WeatherApiGateway = {
    async getWeatherData(city) {
        const params = {
            'format': 'j1'
        };
        
        const cachedData = await cacheManager.getData(`Weather: ${city}`);

        if (cachedData) {
            return cachedData;
        } else {
            const response = await RequestBuilder.get(`https://wttr.in/${city}`)
                .setParams(params)
                .send();

            cacheManager.setData(`Weather: ${city}`, response.data, 1800);

            return response.data;
        }
    }
};

export default WeatherApiGateway;