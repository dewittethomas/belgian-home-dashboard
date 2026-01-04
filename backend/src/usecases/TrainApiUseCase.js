import TrainApiGateway from "../gateways/TrainApiGateway.js";

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const TrainApiUseCase = {
    async getConnections(routes) {
        const datetime = dayjs().tz('Europe/Brussels');
        const time = datetime.format('HHmm');
        const date = datetime.format('DDMMYY');
        const resultsLimit = 3;
        const lang = 'nl';

        const promises = routes.map(async ({ from, to }) => {
            const data = await TrainApiGateway.fetchConnectionsData(from, to, time, date, lang);

            const connections = data
                .filter(item => item.departure.platform !== '?' && item.departure.canceled !== '1' && item.arrival.canceled !== '1')
                .map(connection => ({
                    departure: dayjs.unix(connection.departure.time).utc().tz("Europe/Brussels").format('HH:mm'),
                    arrival: dayjs.unix(connection.arrival.time).utc().tz("Europe/Brussels").format('HH:mm'),
                    delay: Math.floor(connection.departure.delay / 60),
                    platform: connection.departure.platform,
                    transfers: connection.vias ? Number.parseInt(connection.vias.number) : 0,
                }))
                .slice(0, resultsLimit);

            const key = `${from}->${to}`;

            return {
                [key]: connections
            };
        });

        const results = await Promise.all(promises);

        return Object.assign({}, ...results);
    }
}

export default TrainApiUseCase;