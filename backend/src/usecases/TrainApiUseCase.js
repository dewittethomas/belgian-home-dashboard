import TrainApiGateway from "../gateways/TrainApiGateway.js";
import getResults from "../utils/resultHandler.js";

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const TrainApiUseCase = {
    async getConnections(from, to) {
        const datetime = dayjs().tz('Europe/Brussels');
        const time = datetime.format('HHmm');
        const date = datetime.format('DDMMYY');
        const results = 3;
        const lang = 'nl';

        const data = await TrainApiGateway.fetchConnectionsData(from, to, time, date, lang);

        const connections = data
            .filter(item => item.departure.platform !== '?')
            .map(connection => ({
                departure: dayjs.unix(connection.departure.time).utc().tz("Europe/Brussels").format('HH:mm'),
                arrival: dayjs.unix(connection.arrival.time).utc().tz("Europe/Brussels").format('HH:mm'),
                delay: Math.floor(connection.departure.delay / 60).toString(),
                platform: connection.departure.platform,
                transfers: connection.vias ? parseInt(connection.vias.number) : 0,
                canceled: connection.departure.canceled !== '0'
            }));

        return getResults(connections, results);
    }
}

export default TrainApiUseCase;