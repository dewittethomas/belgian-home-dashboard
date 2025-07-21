import WeatherApiUseCase from "../usecases/WeatherApiUseCase.js";

const WeatherApiController = {
    async handle(req, res) {
        try {
            const city = req.query.city;

            if (!city) {
                return res.status(400).json({ error: "Missing one or more required query parameters: city" });
            }

            const data = await WeatherApiUseCase.getWeatherData(city);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong"});
        }
    }
}

export default WeatherApiController;