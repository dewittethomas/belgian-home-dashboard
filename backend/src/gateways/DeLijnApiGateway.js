import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const DeLijnApiGateway = {
    async fetchStop(query, lang) {
        const cacheKey = `De Lijn (stop): ${query}`;
        const cachedData = await cacheManager.getData(cacheKey);
        const CACHE_TTL = 3600;

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

            cacheManager.setData(cacheKey, stop, CACHE_TTL);
            
            return stop;
        }
    },

    async fetchConnections(from, to, departureTime, modes, lang) {
        const cacheKey = `De Lijn (connection): from(${from.position.lt} ${from.position.ln}) to(${to.position.lt} ${to.position.ln}) departureTime(${departureTime}) ${modes}`;
        const cachedData = await cacheManager.getData(cacheKey);
        const CACHE_TTL = 10;

        if (cachedData) {
            return cachedData;
        } else {
            const body = {
                'alternatives': 5,
                'departureTime': departureTime,
                'destination': {
                    'type': 'Coordinate',
                    'lt': to.position.lt,
                    'ln': to.position.ln
                },
                'destinationName': to.name,
                'lang': lang,
                'modes': modes,
                'origin': {
                    'type': 'Coordinate',
                    'lt': from.position.lt, 
                    'ln': from.position.ln
                },
                'originName': from.name,
                'rentedEnable': [],
                'taxiEnable': []
            }

            const response = await RequestBuilder.post('https://www.delijn.be/api/here/routes/')
                .setData(body)
                .send();

            cacheManager.setData(cacheKey, response.data.routes, CACHE_TTL);

            return response.data.routes;
        }
    }
};

export default DeLijnApiGateway;