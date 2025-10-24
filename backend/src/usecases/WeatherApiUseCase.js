import WeatherApiGateway from "../gateways/WeatherApiGateway.js";

const WeatherApiUseCase = {
    async getWeatherData(city) {
        const data = await WeatherApiGateway.getWeatherData(city);

        const condition = data.current_condition[0];

        return {
            city: data.nearest_area[0].areaName[0].value,
            temperature: condition.temp_C,
            feelsLike: condition.FeelsLikeC,
            uvIndex: condition.uvIndex,
            windSpeed: condition.windspeedKmph
        }
    }
}

export default WeatherApiUseCase;