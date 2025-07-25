import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";
import dayjs from "dayjs";

const DeLijnApiUseCase = {
    async getStop(query) {
        const stop = await DeLijnApiGateway.fetchStop(query);
        if (!stop) {
            throw new Error("Stop not found");
        }
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