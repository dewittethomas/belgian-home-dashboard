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
            const stop = suggestions.find((stop) => stop.resultType === 'place');

            cacheManager.setData(cacheKey, stop, 3600);
            
            return stop;
        }
    },

    async fetchConnections(from, to, datetime, modes, lang) {
        const cacheKey = `De Lijn (connection): from(${from.position.lt} ${from.position.ln}) to(${to.position.lt} ${to.position.ln}) ${modes}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData;
        } else {
            const body = {
                'alternatives': 5,
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