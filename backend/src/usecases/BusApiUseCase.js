import DeLijnApiGateway from "../gateways/DeLijnApiGateway.js";
import getResults from "../utils/resultHandler.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const BusApiUseCase = {
    extractConnectionData(connection) {
        const sections = connection.sections;
        const transits = sections.filter(section => section.travelType === 'transit');
        const pedestrians = sections.filter(section => section.travelType === 'pedestrian');
        const departure = transits[0].departure;
        const arrival = sections[sections.length - 1].arrival;

        const delay = transits[0].departure.delay || 0;
        const walking = pedestrians.reduce((sum, pedestrian) => {
            return sum + pedestrian.travelSummary.duration;
        }, 0);

        return {
            departure: dayjs.unix((departure.time / 1000) - delay).tz("Europe/Brussels").format('HH:mm'),
            arrival: dayjs.unix((arrival.time / 1000)).tz("Europe/Brussels").format('HH:mm'),
            delay: Math.floor(delay / 60),
            transport: {
                shortName: transits[0].transport.shortName,
                headsign: transits[0].transport.headsign,
                color: transits[0].transport.color || '#000000'
            },
            transfers: transits.length - 1,
            walking: Math.floor(walking / 60)
        }
    },

    getLastDepartureTime(data) {
        const last = data[data.length - 1];
        if (!last) return null;
        
        const firstTransit = last.sections.find(
            section => section.travelType === "transit"
        );

        return firstTransit?.departure?.time ?? null;
    },

    async getConnections(from, to) {
        const modes = ['bus'];
        const maxVias = 0;
        const walkingThreshold = 360;
        const resultsLimit = 3;
        const lang = 'nl';
        const MAX_ATTEMPTS = 2;

        let collected = [];
        let departureTime = dayjs().toISOString();
        let attempts = 0;

        while (collected.length < resultsLimit && attempts < MAX_ATTEMPTS) {
            const data = await DeLijnApiGateway.fetchConnections(from, to, departureTime, modes, lang);

            const filtered = data
                .filter(item => {
                    let vehicleCount = 0;
                    let walkingTime = 0;

                    for (const section of item.sections) {
                        if (section.travelType === 'transit') vehicleCount++;
                        if (section.travelType === 'pedestrian') walkingTime += section.travelSummary.duration;
                    };

                    return (vehicleCount - 1 <= maxVias && walkingTime <= walkingThreshold);
                })
                .map(connection => this.extractConnectionData(connection));

            collected.push(...filtered);

            const lastDeparture = this.getLastDepartureTime(data);
            if (!lastDeparture) break;

            departureTime = dayjs(lastDeparture).toISOString();
            attempts++;
        }

        return collected.slice(0, resultsLimit);
    }
}

export default BusApiUseCase;