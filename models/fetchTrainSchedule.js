import { executeWithDetailedHandling, NotFoundError } from "../helpers/execute_helper.js";
import DateFormatter from "../utils/date_formatter.js";
import RequestBuilder from "../utils/request_builder.js";
import languageSelector from '../utils/language_selector.js';
import getResults from "../utils/results_selector.js";

class TrainScheduleFetcher {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    async fetchConnectionsData(from, to, time, date, results, lang) {
        return await executeWithDetailedHandling(async () => {
            const params = {
                'from': from,
                'to': to,
                'time': time,
                'date': date,
                'fast': true,
                'results': results,
                'lang': lang,
                'format': 'json'
            };

            languageSelector(lang);

            const response = await RequestBuilder.get('https://api.irail.be/connections/')
                            .setParams(params)
                            .send();

            if (!response.success) {
                throw new NotFoundError("Error fetching train connections.")
            }

            return { data: response.data.connection };
        });
    }

    async extractConnectionData(connection) {
        return await executeWithDetailedHandling(async () => {
            const delay = (delay) => DateFormatter.convertSecondsToMinutes(delay);

            const departure = connection.departure;
            const arrival = connection.arrival;
            const departureDelay = departure.delay <= 0 ? 0 : departure.delay;
            const arrivalDelay = arrival.delay <= 0 ? 0 : arrival.delay;
            const departureDateTime = DateFormatter.getDateTime(true, (parseInt(departure.time) * 1000));
            const arrivalDateTime = DateFormatter.getDateTime(true, (parseInt(arrival.time) * 1000));
            const vias = connection.vias !== undefined ? parseInt(connection.vias.number) : 0;
            const canceled = departure.canceled !== '0';

            const duration = (DateFormatter.calculateTimeBetween(departureDateTime, arrivalDateTime));

            const extraction = {
                'canceled': canceled,
                'from': departure.station,
                'to': arrival.station,
                'departure': DateFormatter.format(departureDateTime, 'HH:mm'),
                'arrival': DateFormatter.format(arrivalDateTime, 'HH:mm'),
                'departureDelay': departureDelay !== 0 ? delay(departureDelay) : 0,
                'arrivalDelay': arrivalDelay !== 0 ? delay(arrivalDelay) : 0,
                'duration': DateFormatter.convertTimeToObject(duration),
                'platform': departure.platform,
                'vias': vias
            }

            return { data: extraction }
        });
    }

    async handleConnections(from, to, time, date, maxVias, results, lang) {
        return await executeWithDetailedHandling(async () => {
            const items = (await this.fetchConnectionsData(from, to, time, date, results, lang)).data;

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

    async getSchedule(results=5, maxVias=1, lang='nl') {
        return await executeWithDetailedHandling(async () => {
            const dateTime = DateFormatter.getDateTime();
            
            const schedule = (await this.handleConnections(this.from, this.to, DateFormatter.format(dateTime, 'HHmm'), DateFormatter.format(dateTime, 'DDMMYY'), maxVias, results, lang)).data;

            if (!schedule) {
                throw new NotFoundError("Failed fetching Train Schedule.");
            }

            return { data: getResults(schedule, results) };
        });
    }
}

export default TrainScheduleFetcher;