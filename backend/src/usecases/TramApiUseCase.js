import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";
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
        const pedestrians = sections.filter(section => section.travelType === 'pedestrian');
        const departure = transits[0].departure;
        const arrival = sections[sections.length - 1].arrival;

        const delay = transits[0].departure.delay || 0;

        return {
            departure: dayjs.unix((departure.time  / 1000) - delay).format('HH:mm'),
            arrival: dayjs.unix((arrival.time / 1000)).format('HH:mm'),
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
        const results = 2;
        const lang = 'nl';

        const data = await DeLijnApiGateway.fetchConnections(from, to, datetime, modes, results, lang);

        const connections = data.map(connection => this.extractConnectionData(connection));

        return connections;
    }
}

export default TramApiUseCase;