import TramApiUseCase from "../usecases/TramApiUseCase.js";
import DeLijnApiUseCase from "../usecases/DeLijnApiUseCase.js";

const TramApiController = {
    async handle(req, res) {
        try {
            const [ from, to ] = await Promise.all([
                DeLijnApiUseCase.getStop(req.query.from),
                DeLijnApiUseCase.getStop(req.query.to)
            ]);

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