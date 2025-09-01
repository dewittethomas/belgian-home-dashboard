import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";
import getResults from "../utils/resultHandler.js";

import dayjs from "dayjs";

const TramApiUseCase = {
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

    extractConnectionData(connection) {
        const sections = connection.sections;
        const transits = sections.filter(section => section.travelType === 'transit');
        const departure = transits[0].departure;
        const arrival = sections[sections.length - 1].arrival;

        const delay = transits[0].departure.delay || 0;

        return {
            departure: dayjs.unix((departure.time  / 1000) - delay).tz("Europe/Brussels").format('HH:mm'),
            arrival: dayjs.unix((arrival.time / 1000)).tz("Europe/Brussels").format('HH:mm'),
            delay: Math.floor(delay / 60).toString(),
            transport: {
                shortName: transits[0].transport.shortName,
                headsign: transits[0].transport.headsign,
                color: transits[0].transport.color || '#000000'
            },
            transfers: transits.length - 1,
            walking: '0'
        }
    },

    async getConnections(from, to) {
        const datetime = dayjs().toISOString();
        const modes = ['lightRail'];
        const results = 3;
        const lang = 'nl';

        const data = await DeLijnApiGateway.fetchConnections(from, to, datetime, modes, lang);

        const connections = data.map(connection => this.extractConnectionData(connection));

        return getResults(connections, results);
    }
}

export default TramApiUseCase;