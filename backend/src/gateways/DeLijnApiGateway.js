import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const DeLijnApiGateway = {
    async fetchStop(query, lang) {
        const cacheKey = `De Lijn (stop): ${query}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData;
        } else {
            const params = {
                'query': query,
                'lang': lang
            }

            const response = await RequestBuilder.get('https://www.delijn.be/api/here/autosuggest/')
                            .setParams(params)
                            .send();

            const suggestions = response.data.suggestionsByQuery;
            const stops = suggestions.filter((stop) => stop.resultType === 'place');

            cacheManager.setData(cacheKey, stops[0], 3600);
            
            return stops[0];
        }
    },

    async fetchConnections(from, to, datetime, modes, results, lang) {
        const cacheKey = `De Lijn (connection): ${from.position} ${to.position}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData;
        } else {
            const body = {
                'alternatives': (results - 1),
                'departureTime': datetime,
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
                const response = await RequestBuilder.post('https://www.delijn.be/api/here/routes/')
                    .setData(body)
                    .send();

                cacheManager.setData(cacheKey, response.data.routes, 10);

                return response.data.routes;
        }
    }
};

export default DeLijnApiGateway;