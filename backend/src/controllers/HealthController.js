const HealthController = {
    async handle(req, res) {
        try {
            const data = { status: "OK" };
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

export default HealthController;