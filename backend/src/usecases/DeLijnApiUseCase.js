import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";

const DeLijnApiUseCase = {
    async getStop(query) {
        const data = await DeLijnApiGateway.fetchStop(query);

        return {
            name: data.title,
            position: {
                lt: data.position.lt,
                ln: data.position.ln
            }
        };
    },
}

export default DeLijnApiUseCase;