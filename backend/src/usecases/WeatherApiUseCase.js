import WeatherApiGateway from "../gateways/WeatherApiGateway.js";

const WeatherApiUseCase = {
    async getWeatherData(cities) {
        const promises = cities.map(async city => {
            const data = await WeatherApiGateway.getWeatherData(city);

            const condition = data.current_condition[0];

            return {
                [city]: {
                    temperature: Number(condition.temp_C),
                    feelsLike: Number(condition.FeelsLikeC),
                    uvIndex: Number(condition.uvIndex),
                    windSpeed: Number(condition.windspeedKmph)
                }
            }
        });

        const results = await Promise.all(promises);

        return Object.assign({}, ...results);
    }
}

export default WeatherApiUseCase;