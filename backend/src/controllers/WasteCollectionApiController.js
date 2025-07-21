import WasteCollectionApiUseCase from "../usecases/WasteCollectionApiUseCase.js";

const WasteCollectionApiController = {
    async handle(req, res) {
        try {
            const zipCode = req.query.zipCode;
            const street = req.query.street;
            const houseNumber = req.query.houseNumber;

            if (!zipCode || !street || !houseNumber ) {
                return res.status(400).json({ error: "Missing one or more required query parameters: zipCode, street, houseNumber" });
            }

            const data = await WasteCollectionApiUseCase.getNextWasteCollection(zipCode, street, houseNumber);
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong"});
        }
    }
}

export default WasteCollectionApiController;