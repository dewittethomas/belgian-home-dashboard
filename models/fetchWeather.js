import { executeWithDetailedHandling } from "../helpers/execute_helper.js";
import RequestBuilder from "../utils/request_builder.js";

import { NotFoundError } from "../helpers/execute_helper.js";

class WeatherFetcher {
    constructor(city) {
        this.city = city;
    }

    async getWeatherData(city) {
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

            return { data: response.data.current_condition[0] };
        });
    }

    async extractWeatherData(data) {
        return await executeWithDetailedHandling(async () => {
            if (!data) {
                throw new NotFoundError("Error fetching data.");
            }

            const extraction = {
                'temperature': data.temp_C,
                'uvIndex': data.uvIndex,
                'windSpeed': data.windspeedKmph,
                'humidity': data.humidity,
                'pressure': data.pressure 
            }

            return { data: extraction }
        });
    }

    async handleWeather() {
        return await executeWithDetailedHandling(async () => {
            const data = (await this.getWeatherData(this.city)).data;
            const weather = (await this.extractWeatherData(data)).data;
            
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