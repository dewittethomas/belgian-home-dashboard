import BusApiUseCase from "../usecases/BusApiUseCase.js";

const BusApiController = {
    async handle(req, res) {
        try {
            const [ from, to ] = await Promise.all([
                BusApiUseCase.getStop(req.query.from),
                BusApiUseCase.getStop(req.query.to)
            ]); 

            if (!from || !to) {
                return res.status(400).json({ error: "Missing required query parameter: from, to" });
            }

            const data = await BusApiUseCase.getConnections(from, to);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default BusApiController;