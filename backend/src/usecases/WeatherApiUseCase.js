import WeatherApiGateway from "../gateways/WeatherApiGateway.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const WeatherApiUseCase = {
    async getWeatherData(cities) {
        const datetime = dayjs().format('YYYY-MM-DD');

        const promises = cities.map(async city => {
            const data = await WeatherApiGateway.getWeatherData(city, datetime);

            const daily = data.daily;
            const current = data.current;

            return {
                [city]: {
                    temperature: current.temperature_2m,
                    feelsLike: current.apparent_temperature,
                    uvIndex: daily.uv_index_max[0],
                    windSpeed: current.wind_speed_10m
                }
            };
        });

        const results = await Promise.all(promises);

        return Object.assign({}, ...results);
    }
}

export default WeatherApiUseCase;