import { executeWithDetailedHandling, NotFoundError } from "../helpers/execute_helper.js";
import DateFormatter from "../utils/date_formatter.js";
import RequestBuilder from "../utils/request_builder.js";
import languageSelector from "../utils/language_selector.js";
import getResults from "../utils/results_selector.js";

const modes = [
    "bus",
    "lightRail",
    "subway"
];

class DeLijnFetcher {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.modes = modes;
    }

    async fetchStop(query, lang) {
        return await executeWithDetailedHandling(async () => {
            const params = {
                'query': query,
                'lang': lang
            }

            languageSelector(lang);

            const response = await RequestBuilder.get('https://www.delijn.be/api/here/autosuggest/')
                            .setParams(params)
                            .send();

            if (!response.success) {
                throw new NotFoundError("Failed fetching stop.");
            }

            const suggestions = response.data.suggestionsByQuery;
            const stops = suggestions.filter((stop) => stop.resultType === 'place');
            
            return { data: stops[0] };
        });
    }

    async fetchConnections(from, to, datetime, results, lang) {
        return await executeWithDetailedHandling(async () => {
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
                'modes': this.modes,
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

            return { data: response.data.routes };
        });
    }

    async extractConnectionData(connection) {
        return await executeWithDetailedHandling(async () => {
            const sections = connection.sections;
            const transits = sections.filter(section => section.travelType === 'transit');
            
            if (!transits) {
                throw new NotFoundError("Failed extracting connection data.")
            }

            const delay = (delay) => delay === 0 ? 0 : DateFormatter.convertSecondsToMinutes(delay);
            
            const departure = sections[0].departure;
            const arrival = sections[sections.length - 1].arrival;
            const departureDelay = departure.delay !== undefined ? delay(departure.delay) : 0;
            const arrivalDelay = arrival.delay !== undefined ? delay(arrival.delay) : 0;
            const departureDateTime = DateFormatter.subtractMinutes(DateFormatter.getDateTime(true, departure.time), departureDelay);
            const arrivalDateTime = DateFormatter.subtractMinutes(DateFormatter.getDateTime(true, arrival.time), arrivalDelay);
            const duration = DateFormatter.calculateTimeBetween(departureDateTime, arrivalDateTime);
            const walking = sections.length !== transits.length;

            const transport = transits.map((transit) => {
                return {
                    'line': transit.transport.longName,
                    'lineNumber': transit.transport.shortName,
                    'direction': transit.transport.headsign,
                    'color': transit.transport.color
                }
            });

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
                'vias': transits.length - 1,
                'walking': walking
            }

            return { data: extraction };
        });
    }

    async handleConnections(fromQuery, toQuery, datetime, maxVias, results, lang) {
        return await executeWithDetailedHandling(async () => {
            const [from, to] = await Promise.all([this.fetchStop(fromQuery, lang), this.fetchStop(toQuery, lang)]);

            const items = (await this.fetchConnections(from.data, to.data, datetime, results, lang)).data;
            
            const connections = await Promise.all(
                items.map(async (item) => {
                    const processedConnection = (await this.extractConnectionData(item)).data;

                    if (processedConnection.vias <= maxVias) {
                        return processedConnection;
                    }
                    return null;
                })
            );

            const filteredConnections = connections.filter((connection) => connection !== null);
            
            return { data: filteredConnections };
        });
    }

    async getSchedule(results=5, maxVias=0, lang='nl') {
        return await executeWithDetailedHandling(async () => {
            const schedule = (await this.handleConnections(this.from, this.to, DateFormatter.getDateTime(false), maxVias, results, lang)).data;

            if (!schedule) {
                throw new NotFoundError("Failed fetching De Lijn Schedule.");
            }

            return { data: getResults(schedule, results) };
        });
    }
}

export default DeLijnFetcher;