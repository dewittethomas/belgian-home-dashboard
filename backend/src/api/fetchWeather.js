import { executeWithDetailedHandling, NotFoundError } from "../utils/executionHandler.js";
import RequestBuilder from "../utils/requestBuilder.js";

class WeatherFetcher {
    constructor(city) {
        this.city = city;
    }

    async fetchWeatherData(city) {
        return executeWithDetailedHandling(async () => {
            const params = {
                'format': 'j1'  
            }

            const response = await RequestBuilder.get(`https://wttr.in/${city}`)
                            .setParams(params)
                            .send();
        
            if (!response.success) throw new NotFoundError("Error fetching weather.");

            return response.data;
        });
    }

    extractWeatherData(data) {
        const condition = data.current_condition[0]

        return {
            'place': data.nearest_area[0].areaName[0].value,
            'temperature': condition.temp_C,
            'feelsLike': condition.FeelsLikeC,
            'uvIndex': condition.uvIndex,
            'windSpeed': condition.windspeedKmph,
            'humidity': condition.humidity,
            'pressure': condition.pressure 
        };
    }

    async handleWeather(city) {
        return executeWithDetailedHandling(async () => {
            const data = (await this.fetchWeatherData(city)).data;
            return this.extractWeatherData(data);
        });
    }

    async getCurrent() {
        return executeWithDetailedHandling(async () => {
            const weather = (await this.handleWeather(this.city)).data;
            if (!weather) throw new NotFoundError("Failed fetching Current Weather.");
            return weather;
        });
    }
}

export default WeatherFetcher;