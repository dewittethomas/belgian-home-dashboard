import TramApiUseCase from "../usecases/TramApiUseCase.js";

const TramApiController = {
    async handle(req, res) {
        try {
            const routes = req.body.routes;
            
            if (!routes) {
                return res.status(400).json({ error: "Missing body: routes" });
            }

            const data = await TramApiUseCase.getConnectionsByStopNames(routes);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default TramApiController;