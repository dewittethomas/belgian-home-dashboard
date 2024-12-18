import { executeWithDetailedHandling, NotFoundError } from "../helpers/execute_helper.js";
import RequestBuilder from "../utils/request_builder.js";

class WeatherFetcher {
    constructor(city) {
        this.city = city;
    }

    async fetchWeatherData(city) {
        return await executeWithDetailedHandling(async () => {
            const params = {
                'format': 'j1'
            }

            const response = await RequestBuilder.get(`https://wttr.in/${city}`)
                            .setParams(params)
                            .send();
        
            if (!response.success) {
                throw new NotFoundError("Error fetching weather.");
            }

            return { data: response.data };
        });
    }

    extractWeatherData(data) {
        const condition = data.current_condition[0]

        const extraction = {
            'place': data.nearest_area[0].areaName[0].value,
            'temperature': condition.temp_C,
            'feelsLike': condition.FeelsLikeC,
            'uvIndex': condition.uvIndex,
            'windSpeed': condition.windspeedKmph,
            'humidity': condition.humidity,
            'pressure': condition.pressure 
        }

        return extraction;
    }

    async handleWeather() {
        return await executeWithDetailedHandling(async () => {
            const data = (await this.fetchWeatherData(this.city)).data;
            const weather = this.extractWeatherData(data);
            
            return { data: weather };
        });
    }

    async getWeather() {
        return await executeWithDetailedHandling(async () => {
            const weather = (await this.handleWeather()).data;

            if (!weather) {
                throw new NotFoundError("Failed fetching Weather.")
            }

            return { data: weather };
        });
    }
}

export default WeatherFetcher;