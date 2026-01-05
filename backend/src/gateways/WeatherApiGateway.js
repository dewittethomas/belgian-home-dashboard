import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const WeatherApiGateway = {
    async getCoordinatesForCity(city) {
        const cacheKey = `Coordinates: ${city}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData;
        } else {
            const params = {
                'name': city,
                'count': 1,
                'format': 'json'
            };

            const response = await RequestBuilder.get('https://geocoding-api.open-meteo.com/v1/search')
                .setParams(params)
                .send();

            cacheManager.setData(cacheKey, response.data.results[0]);

            return response.data.results[0];
        }
    },
    
    async getWeatherData(city, datetime) {
        const cacheKey = `Weather: ${city}`;
        const cachedData = await cacheManager.getData(cacheKey);
        const CACHE_TTL = 3600;

        if (cachedData) {
            return cachedData;
        } else {
            const { latitude, longitude } = await this.getCoordinatesForCity(city);

            const params = {
                latitude,
                longitude,
                start_date: datetime,
                end_date: datetime,
                'daily': 'uv_index_max',
                'current': 'apparent_temperature,temperature_2m,wind_speed_10m'
            };

            const response = await RequestBuilder.get('https://api.open-meteo.com/v1/forecast')
                .setParams(params)
                .send();

            cacheManager.setData(cacheKey, response.data, CACHE_TTL);

            return response.data;
        }
    }
};

export default WeatherApiGateway;