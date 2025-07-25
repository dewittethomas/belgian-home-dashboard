import TrainApiUseCase from "../usecases/TrainApiUseCase.js";

const TrainApiController = {
    async handle(req, res) {
        try {
            const from = req.query.from;
            const to = req.query.to;

            if (!from || !to) {
                return res.status(400).json({ error: "Missing one or more required query parameters: from, to" });
            }

            const data = await TrainApiUseCase.getConnections(from, to);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default TrainApiController;