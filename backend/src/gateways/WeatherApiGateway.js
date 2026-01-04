import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const WeatherApiGateway = {
    async getWeatherData(city) {
        const cacheKey = `Weather: ${city}`;
        const cachedData = await cacheManager.getData(cacheKey);
        const CACHE_TTL = 3600;

        if (cachedData) {
            return cachedData;
        } else {
            const params = {
                'format': 'j1'
            };

            const response = await RequestBuilder.get(`https://wttr.in/${city}`)
                .setParams(params)
                .send();

            cacheManager.setData(cacheKey, response.data, CACHE_TTL);

            return response.data;
        }
    }
};

export default WeatherApiGateway;