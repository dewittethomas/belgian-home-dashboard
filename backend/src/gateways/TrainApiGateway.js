import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const TrainApiGateway = {
    async fetchConnectionsData(from, to, time, date, results, lang) {
        const cacheKey = `Train (connections): ${from} ${to}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData;
        } else {
            const params = {
                'from': from,
                'to': to,
                'results': results,
                'time': time,
                'date': date,
                'format': 'json',
                'lang': lang,
                'fast': true,
            };

            const response = await RequestBuilder.get('https://api.irail.be/connections/')
                            .setParams(params)
                            .send();

            cacheManager.setData(cacheKey, response.data.connection, 10);

            return response.data.connection;
        }
    }
};

export default TrainApiGateway;