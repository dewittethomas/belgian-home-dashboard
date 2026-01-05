import BusApiUseCase from "../usecases/BusApiUseCase.js";

const BusApiController = {
    async handle(req, res) {
        try {
            const routes = req.body.routes;
            
            if (!routes) {
                return res.status(400).json({ error: "Missing body: routes" });
            }

            const data = await BusApiUseCase.getConnectionsByStopNames(routes);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default BusApiController;