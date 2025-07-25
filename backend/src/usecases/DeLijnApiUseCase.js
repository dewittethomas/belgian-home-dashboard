import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";

const DeLijnApiUseCase = {
    async getStop(query) {
        const stop = await DeLijnApiGateway.fetchStop(query);

        return {
            id: stop.id,
            title: stop.title,
            position: {
                lt: stop.position.lt,
                ln: stop.position.ln
            }
        };
    },
}