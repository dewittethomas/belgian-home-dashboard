import { executeWithDetailedHandling, NotFoundError } from "../utils/executionHandler.js";
import DateFormatter from "../utils/dateFormatter.js";
import RequestBuilder from "../utils/requestBuilder.js";
import languageSelector from "../utils/languageSelector.js";
import getResults from "../utils/resultsHandler.js";

const modes = [
    "bus",
    "lightRail",
    "subway"
];

class DeLijnFetcher {
    constructor(from, to, maxVias=1, results=5, lang='nl') {
        this.from = from;
        this.to = to;
        this.maxVias = maxVias;
        this.results = results;
        this.lang = lang;
        this.modes = modes;
    }

    async fetchStop(query, lang) {
        return executeWithDetailedHandling(async () => {
            const params = {
                'query': query,
                'lang': lang
            }

            languageSelector(lang);

            const response = await RequestBuilder.get('https://www.delijn.be/api/here/autosuggest/')
                            .setParams(params)
                            .send();

            if (!response.success) throw new NotFoundError("Failed fetching stop.");

            const suggestions = response.data.suggestionsByQuery;
            const stops = suggestions.filter((stop) => stop.resultType === 'place');
            
            return stops[0];
        });
    }

    async fetchConnections(from, to, datetime, modes, results, lang) {
        return executeWithDetailedHandling(async () => {
            const body = {
                'alternatives': (results - 1),
                'departureTime': DateFormatter.convertDateTimeToString(datetime),
                'destination': {
                    'type': 'Coordinate',
                    'lt': to.position.lt,
                    'ln': to.position.ln
                },
                'destinationName': to.title,
                'lang': lang,
                'modes': modes,
                'origin': {
                    'type': 'Coordinate',
                    'lt': from.position.lt, 
                    'ln': from.position.ln
                },
                'originName': from.title,
                'rentedEnable': [],
                'taxiEnable': []
            }

            const response = await RequestBuilder.post('https://www.delijn.be/api/here/intermodal/')
                            .setData(body)
                            .send();

            return response.data.routes;
        });
    }

    extractConnectionData(connection) {
        const convertDelay = (delay) => DateFormatter.convertSecondsToMinutes(delay);

        const sections = connection.sections;
        const transits = sections.filter(section => section.travelType === 'transit');
        const pedestrians = sections.filter(section => section.travelType === 'pedestrian');
        const departure = sections[0].departure;
        const arrival = sections[sections.length - 1].arrival;
        const departureDelay = departure.delay !== undefined ? convertDelay(departure.delay) : 0;
        const arrivalDelay = arrival.delay !== undefined ? convertDelay(arrival.delay) : 0;
        const departureDateTime = DateFormatter.subtractMinutes(DateFormatter.getDateTime(true, departure.time), departureDelay);
        const arrivalDateTime = DateFormatter.subtractMinutes(DateFormatter.getDateTime(true, arrival.time), arrivalDelay);
        const duration = DateFormatter.calculateTimeBetween(departureDateTime, arrivalDateTime);

        const transport = transits.map((transit) => {
            return {
                'line': transit.transport.longName,
                'lineNumber': transit.transport.shortName,
                'direction': transit.transport.headsign,
                'color': transit.transport.color || '#212650'
            }
        });

        const walkingDuration = pedestrians.reduce((sum, pedestrian) => {
            return sum + pedestrian.travelSummary.duration;
        }, 0);

        const extraction = {
            'canceled': false,
            'from': transits[0].departure.place.name,
            'to': transits[transits.length - 1].arrival.place.name,
            'departure': DateFormatter.format(departureDateTime, 'HH:mm'),
            'arrival': DateFormatter.format(arrivalDateTime, 'HH:mm'),
            'departureDelay': departureDelay,
            'arrivalDelay': arrivalDelay,
            'duration': DateFormatter.convertTimeToObject(duration),
            'transport': transport,
            'walking': DateFormatter.convertTimeToObject(walkingDuration)
        }

        return extraction;
    }

    async handleConnections(fromQuery, toQuery, datetime, modes, maxVias, results, lang) {
        return executeWithDetailedHandling(async () => {
            const [from, to] = await Promise.all([
                this.fetchStop(fromQuery, lang), 
                this.fetchStop(toQuery, lang)
            ]);

            const items = (await this.fetchConnections(from.data, to.data, datetime, modes, results, lang)).data;
            
            const connections = await Promise.all(
                items.map((item) => {
                    const processedConnection = this.extractConnectionData(item);

                    if (processedConnection.transport.length - 1 <= maxVias) {
                        return processedConnection;
                    }
                    return null;
                })
            );

            const filteredConnections = connections.filter((connection) => connection !== null);
            
            return filteredConnections;
        });
    }

    async getSchedule() {
        return executeWithDetailedHandling(async () => {
            const schedule = (await this.handleConnections(this.from, this.to, DateFormatter.getDateTime(false), this.modes, this.maxVias, this.results, this.lang)).data;

            if (!schedule) throw new NotFoundError("Failed fetching De Lijn Schedule.");

            return getResults(schedule, this.results);
        });
    }
}

export default DeLijnFetcher;