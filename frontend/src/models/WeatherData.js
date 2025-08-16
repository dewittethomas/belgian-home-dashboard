export default class WeatherData {
    constructor(data) {
        this.city = data.city;
        this.temperature = data.temperature;
        this.feelsLike = data.feelsLike;
        this.uvIndex = data.uvIndex;
        this.windSpeed = data.windSpeed;
        this.humidity = data.humidity;
        this.pressure = data.pressure;
        this.description = data.description;
    }

    get isCold() {
        return this.temperature < 10;
    }

    get isHot() {
        return this.temperature > 25;
    }
}