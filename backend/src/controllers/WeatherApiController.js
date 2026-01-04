import WeatherApiUseCase from "../usecases/WeatherApiUseCase.js";

const WeatherApiController = {
    async handle(req, res) {
        try {
            const cities = req.body.cities;

            if (!cities) {
                return res.status(400).json({ error: "Missing body: cities" });
            }

            const data = await WeatherApiUseCase.getWeatherData(cities);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default WeatherApiController;