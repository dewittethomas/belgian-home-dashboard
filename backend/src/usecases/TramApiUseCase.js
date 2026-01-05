import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";
import DeLijnApiUseCase from "./DeLijnApiUseCase.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const TramApiUseCase = {
    extractConnectionData(connection) {
        const sections = connection.sections;
        const transits = sections.filter(section => section.travelType === 'transit');
        const departure = transits[0].departure;
        const arrival = sections[sections.length - 1].arrival;

        const delay = transits[0].departure.delay || 0;

        return {
            departure: dayjs.unix((departure.time  / 1000) - delay).tz("Europe/Brussels").format('HH:mm'),
            arrival: dayjs.unix((arrival.time / 1000)).tz("Europe/Brussels").format('HH:mm'),
            delay: Math.floor(delay / 60),
            transport: {
                shortName: transits[0].transport.shortName,
                headsign: transits[0].transport.headsign,
                color: transits[0].transport.color || '#000000'
            },
            transfers: transits.length - 1,
            walking: 0
        }
    },

    async getConnectionsByStopNames(routes) {
        const promises = routes.map(async ({from, to}) => {
            const [ fromStop, toStop ] = await Promise.all([
                DeLijnApiUseCase.getStop(from),
                DeLijnApiUseCase.getStop(to)
            ]);

            return {
                from: fromStop,
                to: toStop,
                key: `${from}->${to}`
            };
        });

        const results = await Promise.all(promises);

        return this.getConnections(results)
    },

    async getConnections(routes) {
        const departureTime = dayjs().toISOString();
        const modes = ['lightRail'];
        const resultsLimit = 3;
        const lang = 'nl';

        const promises = routes.map(async ({from, to, key}) => {
            const data = await DeLijnApiGateway.fetchConnections(from, to, departureTime, modes, lang);

            const connections = data
                .map(connection => this.extractConnectionData(connection))
                .slice(0, resultsLimit);

            return {
                [key]: connections
            };
        });

        const results = await Promise.all(promises);

        return Object.assign({}, ...results);
    }
}

export default TramApiUseCase;