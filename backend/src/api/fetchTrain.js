import { executeWithDetailedHandling, NotFoundError } from "../utils/executionHandler.js";
import DateFormatter from "../utils/dateFormatter.js";
import RequestBuilder from "../utils/requestBuilder.js";
import languageSelector from "../utils/languageSelector.js";
import getResults from "../utils/resultsHandler.js";

class TrainFetcher {
    constructor(from, to, maxVias=1, results=5, lang='nl') {
        this.from = from;
        this.to = to;
        this.maxVias = maxVias;
        this.results = results;
        this.lang = lang;
    }

    async fetchConnectionsData(from, to, time, date, results, lang) {
        return executeWithDetailedHandling(async () => {
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

            if (!response.success) throw new NotFoundError("Error fetching train connections.");

            return response.data.connection;
        });
    }

    extractConnectionData(connection) {
        const convertDelay = (delay) => DateFormatter.convertSecondsToMinutes(delay);
        const formatDelay = (delay) => delay <= 0 ? 0 : delay;

        const departure = connection.departure;
        const arrival = connection.arrival;
        const departureDelay = formatDelay(departure.delay);
        const arrivalDelay = formatDelay(arrival.delay);
        const departureDateTime = DateFormatter.getDateTime(true, (parseInt(departure.time) * 1000));
        const arrivalDateTime = DateFormatter.getDateTime(true, (parseInt(arrival.time) * 1000));
        const vias = connection.vias !== undefined ? parseInt(connection.vias.number) : 0;
        const canceled = departure.canceled !== '0';
        const duration = DateFormatter.calculateTimeBetween(departureDateTime, arrivalDateTime);

        const extraction = {
            'canceled': canceled,
            'from': departure.station,
            'to': arrival.station,
            'departure': DateFormatter.format(departureDateTime, 'HH:mm'),
            'arrival': DateFormatter.format(arrivalDateTime, 'HH:mm'),
            'departureDelay': departureDelay !== 0 ? convertDelay(departureDelay) : 0,
            'arrivalDelay': arrivalDelay !== 0 ? convertDelay(arrivalDelay) : 0,
            'duration': DateFormatter.convertTimeToObject(duration),
            'platform': departure.platform,
            'vias': vias
        }

        return extraction;
    }

    async handleConnections(from, to, time, date, maxVias, results, lang) {
        return executeWithDetailedHandling(async () => {
            const items = (await this.fetchConnectionsData(from, to, time, date, results, lang)).data;

            const connections = items.map((item) => {
                const processedConnection = this.extractConnectionData(item);

                if (processedConnection.vias <= maxVias) {
                    return processedConnection;
                }
                return null;
            });
            

            const filteredConnections = connections.filter((connection) => connection !== null);

            return filteredConnections;
        });
    }

    async getSchedule() {
        return executeWithDetailedHandling(async () => {
            const dateTime = DateFormatter.getDateTime();
            
            const schedule = (await this.handleConnections(this.from, this.to, DateFormatter.format(dateTime, 'HHmm'), DateFormatter.format(dateTime, 'DDMMYY'), this.maxVias, this.results, this.lang)).data;

            if (!schedule) throw new NotFoundError("Failed fetching Train Schedule.");

            return getResults(schedule, this.results);
        });
    }
}

export default TrainFetcher;