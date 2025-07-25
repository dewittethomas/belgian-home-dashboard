import TramApiUseCase from "../usecases/TramApiUseCase.js";

const TramApiController = {
    async handle(req, res) {
        try {
            const from = await TramApiUseCase.getStop(req.query.from);
            const to = await TramApiUseCase.getStop(req.query.to);

            if (!from || !to) {
                return res.status(400).json({ error: "Missing required query parameter: from, to" });
            }

            const data = await TramApiUseCase.getConnections(from, to);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default TramApiController;